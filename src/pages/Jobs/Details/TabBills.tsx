import { useState, useEffect, useRef, Fragment } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useMountedState } from 'react-use';

import { CommonPerms } from '../../../constants';

import { ListSMIcon, ListMDIcon, ListLGIcon } from '../../../components/Icons';
import { FaSortAmountUp, FaSortAmountDown, FaList, FaThLarge, FaRegListAlt } from 'react-icons/fa';
import { BiGridAlt } from "react-icons/bi";
import { IMediaKind, IMediaPopulatedTypes } from '../../Medias/interfaces';
import { TextInputComp, SelectInputComp } from '../../../components/Forms';
import { IJobSubModulePerms } from '../../Orgs/interfaces';
import { MediaSkeletonComponent } from '../skeletons';
import * as interfaces from '../interfaces';
import * as utils from '../utils';
import * as services from '../services';
import { ReactComponent as MySVG } from './Vector.svg';
import { ReactComponent as MyFilter } from './Frame 758532088.svg';
import { DtRangeFilters } from '../../../components/Common';
import { MediaListingComponent } from './Common';
import { UsersTableRowSkeletonComponent } from '../../Users/skeleton';
import { Card, CardBody, CardHeader, CardTitle, Modal, Button, Row, Col, CardFooter, Input, FormGroup, Label } from 'reactstrap';
import { Pagination, DefaultTablePageLimits } from '../../../components/Common/Pagination/Pagination';
import "./TabBills.css";
import CardCheckbox from './CardCheckbox';
import { DatePicker } from '../../../components/Common';
import { useSelector } from 'react-redux';
import { IAppReduxState } from '../../../redux/reducer';
import { Modal as PayModal } from 'react-bootstrap';
import { StatusWorkOrderFilterOptions } from '../../../constants';
import Stripe from '../../../components/Stripe'
export default function TabBills({
  job,
  setJob,

  userJobPerm,
  fulljob,
}: {
  job: interfaces.IJobPopulated;
  setJob: (job: interfaces.IJobPopulated) => void;

  userJobPerm: IJobSubModulePerms;
  fulljob: any
}) {
  const isMounted = useMountedState();

  const [isLoaded, setIsLoaded] = useState(false); // For Skeleton

  const [tabType, setTabType] = useState<'sm' | 'md' | 'lg'>('sm');
  const [modal, setModal] = useState(false);
  const [modal2, isStatusOpen] = useState(false);
  const refDropDownToggle = useRef<HTMLButtonElement>(null);
  const [dropdown2, setDropdown2] = useState(false);
  const [dropDownToggle, setDropDownToggle] = useState(false);
  const [statusOptions, setStatusOptions] = useState(StatusWorkOrderFilterOptions);
  const [sort, setSort] = useState({ issueNo: -1 })
  //  Dynamic Data
  const [groupBy, setGroupBy] = useState<'date' | 'contributor'>('date');
  //   const [medias, setMedias] = useState<IMediaPopulatedTypes[]>([]);

  const [parsedMedias, setParsedMedias] = useState<
    interfaces.IJobDetailsTabMediaList[]
  >([]);
  const [rows, setRows] = useState([]);
  const [rowsBillDetails, setBillDetailsRows] = useState([]);
  const [rowsBillDetailsData, setBillDetailsRowsData] = useState([]);
  const vendorBillCountsSample: { [key: number]: number } = {};
  const [IDCounts, setIDCounts] = useState(vendorBillCountsSample);
  const [totalRows, setTotalRows] = useState(1);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DefaultTablePageLimits[0]);

  const [view, setView] = useState('listView');
  const [selectAll, setSelectAll] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchFilter, setSearchFilter] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState('postDate');
  const [postDate, setPostDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());
  ///  This is for various options in the group like: sorting, selecting
  const [groupOptions, setGroupOptions] =
    useState<interfaces.IJobDetailsTabMediaGroupOptions>({});

  const checkOutside = (event: Event) => {
    if (!isMounted()) {
      return;
    }

    if (!refDropDownToggle?.current?.contains(event.target as Node)) {
      setDropDownToggle(false);
    }
  };

  const fetchData = async () => {
    try {
      console.log("ID is: ", fulljob?.serviceIssues?.ServiceManagerIssueID);
      const result = await services.getBillsData({ issueId: fulljob?.serviceIssues?.ServiceManagerIssueID });
      console.log(result.vendorBills[0].WorkOrders)
      if (!isMounted()) {
        return;
      }
      setIsLoaded(true);

      setPage(1);
      //
      // Create a Set to store unique VendorBilld values
      const uniqueVendorBillds = new Set();

      // Filter the array to keep only unique items
      const uniqueWorkOrders = result.vendorBills[0].WorkOrders.filter((order: { VendorBillID: unknown; }) => {
        const isUnique = !uniqueVendorBillds.has(order.VendorBillID);
        uniqueVendorBillds.add(order.VendorBillID);
        return isUnique;
      });

      console.log(uniqueWorkOrders);
      //
      // setRows(result.vendorBills[0].WorkOrders);
      // setTotalRows(result.vendorBills[0].WorkOrders.length);
      setRows(uniqueWorkOrders);
      setTotalRows(uniqueWorkOrders.length);
      //get the vendor bill details
      // Create an object to store the counts

      // Create an object to store the counts
      const vendorBillCounts: { [key: number]: number } = {};

      // Count the occurrences of each VendorBilld value
      result.vendorBills[0].WorkOrders.forEach((order: { VendorBillID: any; }) => {
        const vendorBillid = order.VendorBillID;
        vendorBillCounts[vendorBillid] = (vendorBillCounts[vendorBillid] || 0) + 1;
      });

      console.log(vendorBillCounts);
      setIDCounts(vendorBillCounts);
      //  Updating parent Job Bills Count
      setJob({
        ...job,
        details: {
          ...job.details,
          billCount: result.vendorBills[0].WorkOrders.length,
        },
      });
    } catch (error) {
      console.error(error);
    }


  };
  const handleChange = () => {
    setIsChecked(!isChecked);
  };
  const handleRadioChange = (event : any) => {
    setSelectedDateType(event.target.value);
    console.log(selectedDateType)
  };
  const handleDateChange = (date : any, dateType : any) => {
    if (dateType === 'postDate') {
      setPostDate(date);
    } else if (dateType === 'dueDate') {
      setDueDate(date);
    }
  };
  useEffect(() => {
    if (!isMounted()) {
      return;
    }

    document.querySelector('body')!.addEventListener('click', checkOutside);

    //  Only Loading the Docs if have permissions
    if (
      !!(
        userJobPerm.documents &
        (CommonPerms.all | CommonPerms.view | CommonPerms.edit)
      )
    ) {
      fetchData();
    }

    return () => {
      window.removeEventListener('resize', checkOutside);
    };
  }, [sort]);

  const getCount = (vendorBillid: number) => {
    return IDCounts?.[vendorBillid] || 0;
  };
  const handleRowClick = async (rowId: never) => {
    try {
      setView("billdetails");
      // Make the GET API request using the rowId
      const response = await services.getBillsDetailsData({ billid: rowId });

      console.log(response);
      if (response.statusCode !== 200) {
        // Handle error if the response is not successful (status code other than 2xx)
        console.error(`API request failed with status: ${response.status}`);
        return;
      }

      // Assuming the response is JSON, you can parse it
      const data = await response.data.result;

      // Handle the API response data as needed
      console.log('API response:', data);
      setBillDetailsRows(data);
      setBillDetailsRowsData(data.BillDetails);
      // Implement additional logic based on the API response
    } catch (error) {
      // Handle any errors that occur during the API request
      console.error('Error during API request:', error);
    }
  };


  const handleCheckboxChange = (id: number, price: any, isChecked: boolean) => {
    console.log(isChecked)
    console.log(id)
    console.log(selectedItems)
    if (isChecked) {
      setSelectedItems([...selectedItems,id]);
      setTotalAmount(totalAmount + price);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
      setTotalAmount(totalAmount - price);
    }
    console.log(totalAmount)
  };

  const handleSelectAll = () => {
    setIsSelectAll(!isSelectAll);
    console.log(isSelectAll)
    if (isSelectAll) {
      setSelectedItems([]);
      setTotalAmount(0);
    } else {
      setSelectedItems(rows.map((item) => item['ServiceManagerIssueWorkOrderID']));
      setTotalAmount(
        rows.reduce((acc: any, item: any) => acc + item.Price, 0)
      );
     
    }
    console.log(totalAmount)
  };

  const handleClearAll = () => {
    setSelectedItems([]);
    setIsSelectAll(false)
    setTotalAmount(0);
    rows.forEach((item) => {
      setIsChecked(false); // Update individual card checkboxes too
    });
    console.log(totalAmount)
  };

  const toggle = () => setModal(!modal);
  const statusFilter = () => isStatusOpen(!modal2)
  const RowsCompt = () => {
    return (
      <Fragment>
        {rows.map((row, index) => {
          const userId = row["VendorBill"]["ID"];
          const name = row["VendorBill"]["Comment"];
          const inputDate = new Date(row["VendorBill"]["PostDate"]);

          const day = inputDate.getDate().toString().padStart(2, '0');
          const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
          const year = inputDate.getFullYear();

          const formattedDate = `${month}/${day}/${year}`;
          const inputDate2 = new Date(row["VendorBill"]["DueDate"]);

          const day2 = inputDate2.getDate().toString().padStart(2, '0');
          const month2 = (inputDate2.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
          const year2 = inputDate2.getFullYear();

          const formattedDate2 = `${month2}/${day2}/${year2}`;
          //get the count based on the vendorbill id


          //{row["VendorBill"]["Reference"]}
          return (
            <Fragment key={userId}>
              <tr className="mobile-d-none" >
                <td>
                  <div className="d-flex align-items-center">
                    <div className=" pl-3">{row["VendorBill"]["Reference"]}</div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className=" pl-3">{row["Description"]}</div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className=" pl-3">{formattedDate}</div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className=" pl-3">{formattedDate2}</div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className=" pl-3">{row["VendorBill"]["stripestatus"]}</div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className=" pl-3">{getCount(row["VendorBillID"])}</div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className=" pl-3">${row["VendorBill"]["total"]}</div>
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className=" pl-3">${row["VendorBill"]["balanceamount"]}</div>
                  </div>
                </td>
              </tr>

            </Fragment>
          );
        })}
      </Fragment>
    );
  };

  const RowsBillDetailsComp = () => {
    interface RowsBillDetailsData {
      // Your properties here
      balanceamount: number;
      // ... other properties
      BillDetailID: number;
      BillID: number;
      PostDate: string;
      PropertyID: number;
      UnitID: number;
      Amount: number;
      AmountAllocated: number;
      GLAccountID: number;
      Comment: string;
      Markup: string;
      CreateDate: string;
      CreateUserID: number;
      UpdateDate: string;
      UpdateUserID: number;
      ConcurrencyID: number;
      paid: boolean;
      total: number;
      //balanceamount": 0,
      paidamount: number;
      stripestatus: string;
      pintent: string;
    }

    const [items, setItems] = useState<RowsBillDetailsData[]>(rowsBillDetailsData);
    const [checkedRowsBills, setCheckedRowsBills] = useState(rowsBillDetailsData.map(() => false));

    const handleCheckboxChangeBills = (index: number) => {
      const updatedCheckedRows = [...checkedRowsBills];
      updatedCheckedRows[index] = !updatedCheckedRows[index];
      setCheckedRowsBills(updatedCheckedRows);
    };

    const handleBalanceChange = (index: number, newValue: any) => {
      // Create a copy of the items array
      const newValueWithoutDollar = newValue.replace(/^\$/, '');
      const updatedItems = [...items];
      // Update the balance amount for the specific item
      updatedItems[index].balanceamount = parseFloat(newValueWithoutDollar);
      // Set the updated items array to state
      setItems(updatedItems);
    };
    return (
      <Fragment>


        {rowsBillDetailsData.map((item, index) => {

          return (
            <Row key={item["BillID"]} >
              <Col >

                <div style={{ width: index === 0 ? '113%' : '55%', height: '100%', background: 'white', borderRadius: 8 }} >
                  <div style={{ width: '100%', height: '100%', padding: 16, background: 'white', boxShadow: '0px 0px 23px rgba(0, 0, 0, 0.07)', borderRadius: 8, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 10, display: 'inline-flex' }}>
                    <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'inline-flex' }}>
                      <div style={{ width: 20, height: 20, position: 'relative', background: '#EDFBED' }}>
                        <Input
                          checked={isChecked}
                          // onChange={handleChange}
                          onChange={() => handleCheckboxChangeBills(index)}
                          type='checkbox' style={{ width: 20, height: 20, left: 20, top: -3, position: 'absolute', border: '1px #4FD44C solid' }}></Input>
                      </div>
                      <div style={{ flex: '1 1 0', height: 69, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, display: 'flex' }}>
                        <div style={{ flex: '1 1 0', height: 69, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 4, display: 'flex' }}>
                          <div style={{ flex: '1 1 0', height: 69, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'flex' }}>
                            <div style={{ width: 48, height: 48, position: 'relative' }}>
                              <div style={{ width: 48, height: 48, left: 0, top: 0, position: 'absolute', background: '#F9F9F9', borderRadius: 9999 }} />
                              <div style={{ paddingLeft: 2, paddingRight: 2, left: 12, top: 12, position: 'absolute', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex' }}>
                                <MySVG />
                              </div>
                            </div>
                            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'inline-flex' }}>
                              <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'inline-flex' }}>
                                <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'inline-flex' }}>
                                  <div style={{ alignSelf: 'stretch', color: '#222222', fontSize: 18, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>{item["BillID"]}</div>
                                  <div style={{ alignSelf: 'stretch', color: '#222222', fontSize: 18, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>{item["Comment"]}</div>
                                </div>
                                <div style={{ width: 154, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 6, display: 'inline-flex' }}>
                                  <div style={{ padding: 5, background: 'rgba(79, 212, 76, 0.10)', borderRadius: 4, border: '1px #4FD44C solid', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 8, display: 'inline-flex' }}>
                                    {/* Updated to use value without "$" and allow user input */}
                                    <input
                                      type="text"
                                      value={"$" + item["balanceamount"]}
                                      onChange={(e) => handleBalanceChange(index, e.target.value)}
                                      style={{ color: '#4FD44C', fontSize: 14, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word', border: 'none', outline: 'none', width: '100%' }}
                                      readOnly={!checkedRowsBills[index]} // Ensure it's not read-only
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ alignSelf: 'stretch', height: 1, background: '#EFEFEF' }} />
                    <div style={{ alignSelf: 'stretch', height: 48, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'flex' }}>

                      <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 21, display: 'inline-flex' }}>

                        <div style={{ flex: '1 1 0', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Total  : ${}</div>
                        <div style={{ textAlign: 'right', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Balance : ${item["balanceamount"]}</div>

                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              {index === 0 &&
                <Col>
                  <div style={{ width: '82%', height: '100%', paddingTop: 31, paddingBottom: 16, paddingLeft: 35, paddingRight: 16, background: 'white', boxShadow: '0px 0px 23px rgba(0, 0, 0, 0.07)', borderRadius: 8, overflow: 'hidden', marginLeft: '50px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex' }}>
                    <div style={{ color: 'black', fontSize: 20, fontFamily: 'Lato', fontWeight: '600', wordWrap: 'break-word' }}>No Bills Selected</div>
                    <div style={{ width: 335, height: 52, paddingLeft: 40, paddingRight: 40, paddingTop: 13, paddingBottom: 13, background: '#4DAD3E', borderRadius: 6, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
                      <div onClick={() => handleStripeButton()} style={{ color: 'white', fontSize: 18, fontFamily: 'Lato', fontWeight: '900', lineHeight: 31.50, wordWrap: 'break-word' }}>Update Amount</div>
                    </div>
                  </div></Col>}
            </Row>
          )
        })}
      </Fragment>
    );
  };

  const [showstripe, setShowStripe] = useState(false);
  const [showstripeintent, setShowStripeIntent] = useState('');
  const handleStripeButton = async () => {
    try {
      const accountID = rows[0]["VendorBill"]["AccountID"];
      //get the vendor connect account id
      const response = await services.getVendorConnectAccountID({ accountId: accountID });
      console.log("Accountid is: ", response);
      const job = await services.sendStripeRequest("acct_1OgkEe3RoztM006Q", "50", "usd", {}, {}, authUser.primaryUserId);
      console.log(job);
      setShowStripeIntent(job.paymentIntent);
      console.log('Before setShowStripe(true)');
      setShowStripe(true);
      console.log('After setShowStripe(true)');
    } catch (error) {
      console.error("Error sending stripe request:", error);
    }

  }
  const { authUser, accountIndex } = useSelector(
    (state: IAppReduxState) => state.auth
  );
  const secondModalStyle = {
    modalContent: {
      borderRadius: 0, // Set the desired border-radius
    },

  };


  const FinalSheetComp = () => {
    interface RowsBillDetailsDataMain {
      ServiceManagerIssueWorkOrderID: number;
      WorkOrderID: number;
      ServiceManagerIssueID: number;
      HasVendorBillLink: boolean;
      VendorBillID: number;
      PayeeAccountID: number;
      PropertyID: number;
      UnitID: number;
      Description: string;
      Quantity: number;
      Cost: number;
      Price: number;
      InventoryItemID: number;
      CreateDate: string;
      CreateUserID: number;
      UpdateDate: string;
      UpdateUserID: number;
      VendorBill: {
        ID: number;
        AccountID: number;
        Reference: string;
        Comment: string;
        Amount: number;
        TransactionDate: string;
        CreateDate: string;
        CreateUserID: number;
        UpdateDate: string;
        UpdateUserID: number;
        TransactionType: string;
        PostDate: string;
        DueDate: string;
        AmountAllocated: number;
        IsFullyAllocated: boolean;
        BankID: number;
        DefaultBankOption: string;
        PayMethod: string;
        AvidInvoiceURL: string;
        ConcurrencyID: number;
        AccountType: string;
        PayeeAddress: string;
        EcheckEmail: string;
        paid: boolean;
        total: number;
        balanceamount: number;
        paidamount: number;
        stripestatus: string;
        pintent: string;
      }
    }
    const [itemsBillsMain, setItemsMainBills] = useState<RowsBillDetailsDataMain[]>(rows);
    //
    const [checkedRows, setCheckedRows] = useState(rows.map(() => false));

    // const handleCheckboxChange = (index: number) => {
    //   const updatedCheckedRows = [...checkedRows];
    //   updatedCheckedRows[index] = !updatedCheckedRows[index];
    //   setCheckedRows(updatedCheckedRows);
    // };

    const handleBalanceChangeMain = (index: number, newValue: any) => {
      // Create a copy of the items array
      const newValueWithoutDollar = newValue.replace(/^\$/, '');
      const updatedItems = [...itemsBillsMain];
      // Update the balance amount for the specific item
      updatedItems[index].VendorBill.balanceamount = parseFloat(newValueWithoutDollar); // Convert to number
      // Set the updated items array to state
      setItemsMainBills(updatedItems);
    };

    return (
      <Fragment>

        {showstripe && (
          <PayModal show={showstripe} onHide={() => setShowStripe(false)} style={secondModalStyle.modalContent}>
            <PayModal.Header closeButton>
              <h5 style={{ textAlign: 'center' }}>Enter Stripe Account Details</h5>
            </PayModal.Header>
            <PayModal.Body style={secondModalStyle.modalContent}>
              <Stripe showstripeintent={showstripeintent} email={authUser.email} name={authUser.name} />
            </PayModal.Body>
          </PayModal>
        )}

        {rows.map((item, index) => {
          const userId = item["VendorBill"]["ID"];
          const name = item["VendorBill"]["Comment"];
          const inputDate = new Date(item["VendorBill"]["PostDate"]);

          const day = inputDate.getDate().toString().padStart(2, '0');
          const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
          const year = inputDate.getFullYear();

          const formattedDate = `${month}/${day}/${year}`;
          const inputDate2 = new Date(item["VendorBill"]["DueDate"]);

          const day2 = inputDate2.getDate().toString().padStart(2, '0');
          const month2 = (inputDate2.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
          const year2 = inputDate2.getFullYear();

          const formattedDate2 = `${month2}/${day2}/${year2}`;
          return (
            <Row key={item["VendorBill"]["ID"]} >
              <Col >

                <div style={{ width: index === 0 ? '113%' : '55%', height: '100%', background: 'white', borderRadius: 8 }} >
                  <div style={{ width: '100%', height: '100%', padding: 16, background: 'white', boxShadow: '0px 0px 23px rgba(0, 0, 0, 0.07)', borderRadius: 8, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 10, display: 'inline-flex' }}>
                    <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'inline-flex' }}>
                      <div style={{ width: 20, height: 20, position: 'relative', background: '#EDFBED' }}>
                        <Input
                          key={item["ServiceManagerIssueWorkOrderID"]}
                          checked={selectedItems.includes(item['ServiceManagerIssueWorkOrderID'])}
                          onChange={() => handleCheckboxChange(item['ServiceManagerIssueWorkOrderID'], item['Price'], !selectedItems.includes(item['ServiceManagerIssueWorkOrderID']))}

                          // checked={checkedRows[index]}
                          // onChange={() => handleCheckboxChange(index)}
                          type='checkbox' style={{ width: 20, height: 20, left: 20, top: -3, position: 'absolute', border: '1px #4FD44C solid' }}></Input>
                      </div>
                      <div style={{ flex: '1 1 0', height: 69, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, display: 'flex' }}>
                        <div style={{ flex: '1 1 0', height: 69, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 4, display: 'flex' }}>
                          <div style={{ flex: '1 1 0', height: 69, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'flex' }}>
                            <div style={{ width: 48, height: 48, position: 'relative' }}>
                              <div style={{ width: 48, height: 48, left: 0, top: 0, position: 'absolute', background: '#F9F9F9', borderRadius: 9999 }} />
                              <div style={{ paddingLeft: 2, paddingRight: 2, left: 12, top: 12, position: 'absolute', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex' }}>
                                <MySVG />
                              </div>
                            </div>
                            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'inline-flex' }}>
                              <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'inline-flex' }}>
                                <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'inline-flex' }} onClick={() => handleRowClick(item["VendorBill"]["ID"])}>
                                  <div style={{ alignSelf: 'stretch', color: '#222222', fontSize: 18, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>{item["VendorBill"]["Reference"]}</div>
                                  <div style={{ alignSelf: 'stretch', color: '#222222', fontSize: 18, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>{item["Description"]}</div>
                                </div>
                                <div style={{ width: 154, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 6, display: 'inline-flex' }}>
                                  <div style={{ padding: 5, background: 'rgba(79, 212, 76, 0.10)', borderRadius: 4, border: '1px #4FD44C solid', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 8, display: 'inline-flex' }}>
                                    {/* <div style={{ color: '#4FD44C', fontSize: 14, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>${item["VendorBill"]["balanceamount"]}</div> */}
                                    <input
                                      type="text"
                                      value={"$" + item["VendorBill"]["balanceamount"]}
                                      onChange={(e) => handleBalanceChangeMain(index, e.target.value)}
                                      style={{ color: '#4FD44C', fontSize: 14, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word', border: 'none', outline: 'none', width: '100%' }}
                                      readOnly={!checkedRows[index]} // Ensure it's not read-only
                                    />
                                  </div>
                                  <div style={{ width: 78, height: 34, position: 'relative', background: '#D5F9C4', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: 79.88, height: 34, left: 0, top: 0, position: 'absolute', background: 'rgba(150.39, 198.46, 94.60, 0.55)' }}></div>
                                    <div style={{ left: 22, top: 10, position: 'absolute', color: '#455D00', fontSize: 12, fontFamily: 'Lato', fontWeight: '400', wordWrap: 'break-word' }}>{item["VendorBill"]["stripestatus"]}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ alignSelf: 'stretch', height: 1, background: '#EFEFEF' }} />
                    <div style={{ alignSelf: 'stretch', height: 48, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'flex' }}>
                      <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'inline-flex' }}>
                        <div style={{ flex: '1 1 0' }}><span style={{ color: '#999999', fontSize: 12, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>Bill Date : </span><span style={{ color: '#222222', fontSize: 12, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>{formattedDate}</span></div>
                        <div style={{ flex: '1 1 0', textAlign: 'right' }}><span style={{ color: '#999999', fontSize: 12, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>Due Date : </span><span style={{ color: '#222222', fontSize: 12, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>{formattedDate2}</span></div>
                      </div>
                      <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 21, display: 'inline-flex' }}>
                        <div style={{ paddingLeft: 5, paddingRight: 5, background: 'rgba(79, 212, 76, 0.10)', borderRadius: 8, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'flex' }}>
                          <div style={{ width: 61, color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Items: {getCount(item["VendorBillID"])}</div>
                        </div>
                        <div style={{ flex: '1 1 0', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Total  : ${item["VendorBill"]["total"]}</div>
                        <div style={{ textAlign: 'right', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Balance : ${item["VendorBill"]["balanceamount"]}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              {index === 0 &&
                <Col>
                {selectedItems.length === 0 && 
                  <div style={{ width: '82%', height: '100%', paddingTop: 31, paddingBottom: 16, paddingLeft: 35, paddingRight: 16, background: 'white', boxShadow: '0px 0px 23px rgba(0, 0, 0, 0.07)', borderRadius: 8, overflow: 'hidden', marginLeft: '50px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex' }}>
                    <div style={{ color: 'black', fontSize: 20, fontFamily: 'Lato', fontWeight: '600', wordWrap: 'break-word' }}>No Bills Selected</div>
                    <div style={{ width: 335, height: 52, paddingLeft: 40, paddingRight: 40, paddingTop: 13, paddingBottom: 13, background: '#4DAD3E', borderRadius: 6, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
                      <div onClick={() => handleStripeButton()} style={{ color: 'white', fontSize: 18, fontFamily: 'Lato', fontWeight: '900', lineHeight: 31.50, wordWrap: 'break-word' }}>Proceed to Pay</div>
                    </div>
                  </div>
                  }
                  {selectedItems && selectedItems.length > 0 && 
                  <div style={{ width: '90%', height: '100%', marginLeft: 60, paddingTop: 31, paddingBottom: 16, paddingLeft: 35, paddingRight: 16, background: 'white', borderRadius: 8, overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex' }}>
                    <div style={{ alignSelf: 'stretch', height: 186, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 26, display: 'flex' }}>
                      <div style={{ alignSelf: 'stretch', height: 108, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 5, display: 'flex' }}>
                        <div style={{ color: 'black', fontSize: 20, fontFamily: 'Lato', fontWeight: '600', wordWrap: 'break-word' }}>{selectedItems.length ? selectedItems.length : 0} Bills Selected</div>
                        <div style={{ alignSelf: 'stretch', height: 71, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 7, display: 'flex' }}>
                          <div style={{ width: 367, borderRadius: 8, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 295, display: 'inline-flex' }}>
                            <div style={{ width: 61, color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Items : </div>
                            <div style={{ color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word', marginRight: 20 }}>3</div>
                          </div>
                          <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 295, display: 'inline-flex' }}>
                            <div style={{ color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Total :</div>
                            <div style={{ textAlign: 'right', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>${totalAmount}</div>
                          </div>
                          <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 279, display: 'inline-flex' }}>
                            <div style={{ textAlign: 'right', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Balance : </div>
                            <div style={{ textAlign: 'right', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>$1334</div>
                          </div>
                        </div>
                      </div>
                      <div style={{ width: 335, height: 52, paddingLeft: 40, paddingRight: 40, paddingTop: 13, paddingBottom: 13, background: '#4DAD3E', borderRadius: 6, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
                        <div onClick={() => handleStripeButton()} style={{ color: 'white', fontSize: 18, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Proceed to Pay</div>
                      </div>
                    </div>
                  </div>}
                </Col>}
            </Row>
          )
        })}
      </Fragment>
    );
  };

  const GridView = () => {
    return (
      <div className="grid-view">
        <Row>
          {rows.map((item) => {
            const userId = item["VendorBill"]["ID"];
            const name = item["VendorBill"]["Comment"];
            const inputDate = new Date(item["VendorBill"]["PostDate"]);

            const day = inputDate.getDate().toString().padStart(2, '0');
            const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
            const year = inputDate.getFullYear();

            const formattedDate = `${month}/${day}/${year}`;
            const inputDate2 = new Date(item["VendorBill"]["DueDate"]);

            const day2 = inputDate2.getDate().toString().padStart(2, '0');
            const month2 = (inputDate2.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
            const year2 = inputDate2.getFullYear();

            const formattedDate2 = `${month2}/${day2}/${year2}`;

            return (
              <Col sm="4" key={item["VendorBill"]["ID"]}>
                <Card className="custom-card">
                  <CardBody>
                    <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'inline-flex' }}>
                     
                      <div style={{ flex: '1 1 0', height: 75, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 14, display: 'flex' }}>
                        <div style={{ flex: '1 1 0', height: 75, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 4, display: 'flex' }}>
                          <div style={{ flex: '1 1 0', height: 75, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'flex' }}>
                            <div style={{ width: 48, height: 48, position: 'relative' }}>
                              <div style={{ width: 48, height: 48, left: 0, top: 0, position: 'absolute', background: '#F9F9F9', borderRadius: 9999 }} />
                              <div style={{ paddingLeft: 2, paddingRight: 2, left: 12, top: 12, position: 'absolute', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex' }}>

                                <img
                                  src={require('../../../assets/images/Vector.png').default}
                                  alt="Service Work Order List"
                                  title="Service Work Order List"
                                />

                              </div>
                            </div>
                            <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'inline-flex' }}>
                              <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 9, display: 'inline-flex' }}>
                                <div style={{ width: 170, flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 4, display: 'inline-flex' }}>
                                  <div style={{ alignSelf: 'stretch', color: '#222222', fontSize: 18, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>{item["VendorBill"]["Reference"]}</div>
                                  <div style={{ alignSelf: 'stretch', color: '#222222', fontSize: 18, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>{item["Description"]}</div>
                                </div>
                                <div style={{ width: 50, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 6, display: 'inline-flex' }}>
                                  <div style={{ color: '#4FD44C', fontSize: 14, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>${item["VendorBill"]["balanceamount"]}</div>
                                  <div style={{ width: 78, height: 34, paddingLeft: 11, paddingRight: 11, paddingTop: 2, paddingBottom: 2, background: '#8BC34A', borderRadius: 2, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex' }}>
                                    <div style={{ color: 'white', fontSize: 12, fontFamily: 'Lato', fontWeight: '400', wordWrap: 'break-word' }}>{item["VendorBill"]["stripestatus"]}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                  <CardBody>
                    {/* <div>
                  <p className="card-date">Bill Date: 05/06/23</p>
                  <p className="card-date" style={{marginLeft: "41px"}}>Due Date: 05/06/23</p>
                </div> */}
                    <div style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 21, display: 'flex' }}>
                      <div style={{ flex: '1 1 0' }}>
                        <span style={{ color: '#999999', fontSize: 12, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>
                          Bill Date :
                        </span>
                        <span style={{ color: '#222222', fontSize: 12, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>
                          {formattedDate}
                        </span>
                      </div>
                      <div style={{ flex: '1 1 0' }}>
                        <span style={{ color: '#999999', fontSize: 12, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>
                          Due Date :
                        </span>
                        <span style={{ color: '#222222', fontSize: 12, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>
                          {formattedDate2}
                        </span>
                      </div>
                    </div>
                    <div style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 21, display: 'inline-flex' }}>
                      <div style={{ paddingLeft: 5, paddingRight: 5, background: 'rgba(79, 212, 76, 0.10)', borderRadius: 8, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'flex' }}>
                        <div style={{ width: 61, color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Items: {getCount(item["VendorBillID"])}</div>
                      </div>
                      <div style={{ flex: '1 1 0', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Total : ${item["VendorBill"]["total"]}</div>
                      <div style={{ textAlign: 'right', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Balance : ${item["VendorBill"]["balanceamount"]}</div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
        {/* {isLoaded && (
          <Pagination
            totalRows={totalRows}
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
          />
        )} */}
      </div>
    );
  };



  return (
    <div>



      <div style={{ width: '90%', height: '40%', justifyContent: 'flex-end', alignItems: 'flex-end', gap: 24, display: 'inline-flex', marginLeft: "120px", marginBottom: "40px" }}>
        <div style={{ width: 205, height: 42, position: 'relative' }}>
          <form className="d-none d-md-inline ml-auto">
            <div className="form-group ipad-mr-0">
              <TextInputComp
                name="searchFilter"
                type="text"
                className="form-control"
                placeholder="Search Bills"
                onChange={setSearchFilter}
                value={searchFilter}
              />
              <i className="fas fa-search" />
            </div>
          </form>

        </div>
        <div style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
          <div style={{ width: 42, height: 42, position: 'relative' }}>
            <div style={{ width: 42, height: 42, left: 0, top: 5, position: 'absolute', background: '#4FD44C', borderRadius: 6 }} />
            <div style={{ width: 42, height: 42, left: 0, top: 0, position: 'absolute', background: '#4FD44C', borderRadius: 6 }} />
            <div style={{ width: 28.50, height: 28.50, paddingTop: 2.50, paddingBottom: 3, paddingLeft: 2.50, paddingRight: 3, left: 11.75, top: 4.75, position: 'absolute', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
              <div style={{ width: 21, height: 21, position: 'relative', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex' }}>
                {/* <Link
              className="dropdown-item flex-space-between"
              to={paths.membersEdit}
            >
            </Link> */}
                <div
                  onClick={() => {
                    if (view !== 'payview') {
                      setView('payview');
                    } else {
                      setView('listView');
                    }
                  }}
                  style={{ width: 24.93, height: 12, background: '4FD44C', color: 'white', fontSize: '19px', fontWeight: 38 }}>$</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: '2%' }}>
        <div className="flex-content ipad-w-100 pt-sm-3 pt-lg-0" style={{ float: "right" }}>
          <div className="grid-list-icon flex-content pr-3 d-none d-md-inline desktop-grid">
            <button
              className={`pr-2 list-content ${view === 'listView'
                ? 'grid-active border-0 bg-transparent'
                : 'border-0 bg-transparent'
                }`}
              onClick={() => {
                if (view === 'gridView') {
                  setView('listView');
                }
              }}
            >
              <FaRegListAlt className="fa-2x" style={{ color: '#4FD44C' }} />
            </button>
            <button
              className={`${view === 'gridView'
                ? 'grid-active border-0 bg-transparent'
                : 'border-0 bg-transparent'
                }`}
              onClick={() => {
                if (view === 'listView') {
                  setView('gridView');
                }
              }}
            >
              <FaThLarge className="fa-2x" style={{ color: '#4FD44C' }} />
            </button>

          </div>
        </div>
        <MyFilter onClick={toggle} />
        <button style={{ background: 'rgba(79, 212, 76, 0.10)', padding: 6, marginLeft: '1%', border: 'rgba(79, 212, 76, 0.10)', width: '8%' }} onClick={statusFilter}>Status</button>

        <Modal isOpen={modal2} toggle={statusFilter} style={{ marginTop: "30%", width: '62%', borderRadius: 0 }}>
          <div className="col-md-6 mb-3">
            <SelectInputComp
              name="statusFilter"
              label="Status *"
              labelClassName="mb-2 font-weight-bold"
              placeholder="Status"
              value={statusOptions}
              options={statusOptions}
              isDisabled
              isMulti
            />
          </div>
        </Modal>
        <Modal isOpen={modal} toggle={toggle} style={{ marginTop: "30%", width: '62%', borderRadius: 0 }}>
          <Card>
            <Row>
              <Col>
                <div style={{ width: '100%' }}>
                  <div className="col-12 col-md-6 col-lg-6" style={{ maxWidth: '90%' }}>
                    <div className="form-group" style={{ marginLeft: '10px' }}>
                      <Input style={{marginLeft : '-20px'}}
                        type="radio"
                        value="postDate"
                        checked={selectedDateType === 'postDate'}
                        onChange={handleRadioChange}
                      />Post Date
                      {selectedDateType === 'postDate' && 
                      <DtRangeFilters
                        label=''
                        timePicker
                        startDt={job.startDt}
                        endDt={job.endDt}
                        onChange={(startDt, endDt) => {
                          setJob({
                            ...job,
                            startDt,
                            endDt,
                          });
                        }}
                        format="YYYY-MM-DD"
                        showDropdowns={true}
                      />}
                    </div>
                  </div>
                </div>
              </Col>
              <Col>
                <div style={{ width: '100%' }}>
                  <div className="col-12 col-md-6 col-lg-6" style={{ maxWidth: '90%' }}>
                    <div className="form-group">
                    <Input 
                         type="radio"
                         value="dueDate"
                         checked={selectedDateType === 'dueDate'}
                         onChange={handleRadioChange}
                        
                      ></Input>
                      Due Date
                       {selectedDateType === 'dueDate' && 
                      <DtRangeFilters
                        label=''
                        timePicker
                        startDt={job.startDt}
                        endDt={job.endDt}
                        onChange={(startDt, endDt) => {
                          setJob({
                            ...job,
                            startDt,
                            endDt,
                          });
                        }}
                        format="YYYY-MM-DD"
                        showDropdowns={true}
                      />}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Modal>
        {view === 'payview' && 
        <div style={{ marginTop: '15px' }}>
          <div style={{ width: '12%', height: '100%', paddingLeft: 6, paddingRight: 6, background: '#4FD44C', borderRadius: 6, justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex' }}>
            <div style={{ width: 12, height: 27, position: 'relative' }}>
              <Input type='checkbox'
                checked={isSelectAll}
                onChange={handleSelectAll} style={{ marginLeft: '-9px', width: '35px', top: '3px' }} />
            </div>
            <div style={{ flex: '1 1 0', height: 17, justifyContent: 'center', alignItems: 'center', gap: 12, display: 'flex' }}>
              <div style={{ textAlign: 'center', color: 'white', fontSize: 14, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Select All</div>
            </div>
          </div>
          <div style={{ width: '8%', height: '8%', paddingRight: 9, background: '#D9D9D9', borderRadius: 6, justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex', marginLeft: '11px' }}>
            <div style={{ width: 16, height: 27, position: 'relative' }}>
              <div style={{ fontSize: '17px', left: 9.50, top: 0.98, position: 'absolute', borderRadius: 5, color: 'white' }} > x </div>
            </div>
            <div style={{ justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'flex' }}>
              <div onClick={handleClearAll} style={{ width: 58, textAlign: 'center', color: 'white', fontSize: 14, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Clear</div>
            </div>
          </div>
        </div>
        }
      </div>



      <div
        className="tab-pane fade show active"
        role="tabpanel"
        aria-labelledby="pills-bills-tab"
      >

        {view === 'listView' &&
          <div className="user-table-wrap jobs-grid-table mobile-table">
            <div className="table-wrap">
              <table className="table">
                <thead className="mobile-d-none">
                  <tr className="shadow-none">
                    <th
                      scope="col"
                      onClick={() => {
                        setSort({
                          issueNo: sort.issueNo === -1 ? 1 : -1,
                        });
                      }}
                    >
                      <div className="flex-content pl-3">
                        Issue No
                        {sort.issueNo === 1 ? (
                          <FaSortAmountUp className="ml-2" />
                        ) : (
                          <FaSortAmountDown />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"

                    >
                      <div className="flex-content pl-3">
                        Title{' '}

                      </div>
                    </th>
                    <th scope="col">
                      <div className="flex-content pl-3">Bill Date</div>
                    </th>
                    <th scope="col">
                      <div className="flex-content pl-3">Due Date</div>
                    </th>
                    <th
                      scope="col"

                    >
                      <div className="flex-content pl-3">
                        Status{' '}

                      </div>
                    </th>
                    <th scope="col">
                      <div className="flex-content">Items</div>
                    </th>
                    <th scope="col">
                      <div className="flex-content">Total</div>
                    </th>
                    <th scope="col">
                      <div className="flex-content">Balance</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="px-0 py-3">{isLoaded && <RowsCompt />}</tbody>
              </table>
              {/* {isLoaded && (
              <Pagination
                totalRows={totalRows}
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            )} */}
            </div>
          </div>}
        {view === 'gridView' && <div className="user-table-wrap jobs-grid-table mobile-table">
          <GridView /></div>}
        {view === 'payview' && <div className="user-table-wrap jobs-grid-table mobile-table">
          <FinalSheetComp /></div>}

        {view === 'billdetails' && <div className="user-table-wrap jobs-grid-table mobile-table">
          <RowsBillDetailsComp /></div>}

      </div>
    </div>
  );
}
