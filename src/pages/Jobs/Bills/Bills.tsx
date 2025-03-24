import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useMountedState } from 'react-use';

import { CommonPerms } from '../../../constants';

import { validateData } from '../../../utils/joi';
import { successToast } from '../../../utils/toast';
import { IJobSubModulePerms } from '../../Orgs/interfaces';
import { TextInputComp } from '../../../components/Forms';
import { DtRangeFilters } from '../../../components/Common';
import Main from '../../../components/Layouts/Main';
import { ReactComponent as MySVG } from '../Details/Vector.svg';
import { ReactComponent as MyFilter } from '../Details/Frame 758532088.svg';
import { Card, Col, Input, Row } from 'reactstrap';
import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';
import JobRoutes from '../routes';
export default function Bills({

  job,
  setJob,
  userJobPerm,
}: {
  job: interfaces.IJobPopulated;
  setJob: (job: interfaces.IJobPopulated) => void;

  userJobPerm: IJobSubModulePerms;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMounted = useMountedState();

  const history = useHistory();
  const [searchFilter, setSearchFilter] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({
    ...constants.AddEditDetailsDefaultErrors,
  });


  const fetchData = async () => {
    try {
      const result = await services.getBillsData({ issueId: 13444 });
      // console.log(result.vendorBills[0].WorkOrders)
      if (!isMounted()) {
        return;
      }
      setIsLoaded(true);


      setRows(result.vendorBills[0].WorkOrders);

      //   setMedias(result);

      //  Updating parent Job Bills Count
      // setJob({
      //   ...job,
      //   details: {
      //     ...job.details,
      //     billCount: result.vendorBills[0].WorkOrders.length,
      //   },
      // });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isMounted()) {
      return;
    }



    //  Only Loading the Docs if have permissions

    fetchData();



  }, []);




  return (
    <Main sideBarId={JobRoutes.routes.bills.sideBarId}>
      <div className="content">
        <div className="create-property-wrap">
          <div className="main-heading-wrap flex-space-between-wrap mb-4">
            <div className="dashboard-heading-title">
              <h6 className="title">Bills</h6>
              <div style={{marginTop : '30px'}}>
              <div style={{width: '16%', height: '100%', paddingLeft: 6, paddingRight: 6, background: '#4FD44C', borderRadius: 6, justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex'}}>
    <div style={{width: 16, height: 31, position: 'relative'}}>
    <Input type='checkbox' style={{marginLeft : '-9px',width: '35px',top:'3px'}}/>
    </div>
    <div style={{flex: '1 1 0', height: 17, justifyContent: 'center', alignItems: 'center', gap: 12, display: 'flex'}}>
        <div style={{textAlign: 'center', color: 'white', fontSize: 14, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word'}}>Select All</div>
    </div>
</div>
<div style={{width: '12%', height: '100%', paddingRight: 9, background: '#D9D9D9', borderRadius: 6, justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex',marginLeft:'11px'}}>
    <div style={{width: 16, height: 31, position: 'relative'}}>
            <div style={{fontSize : '17px',left: 9.50, top: 0.98, position: 'absolute', borderRadius: 5, color:'white'}} > x </div>
    </div>
    <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'flex'}}>
        <div style={{width: 58, textAlign: 'center', color: 'white', fontSize: 14, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word'}}>Clear</div>
    </div>
</div>
</div>
              <div style={{ width: '90%', height: '40%', justifyContent: 'flex-end', alignItems: 'flex-end', display: 'inline-flex', marginLeft: "400px" }}>
              
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

                        <div style={{ width: 24.93, height: 12, background: '4FD44C', color: 'white', fontSize: '19px', fontWeight: 38 }}>$</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {rows.map((item, index) => (
            <Row>
              <Col>

                <div style={{ width: index === 0 ? '113%' : '55%', height: '100%', background: 'white', borderRadius: 8 }} >
                  <div style={{ width: '100%', height: '100%', padding: 16, background: 'white', boxShadow: '0px 0px 23px rgba(0, 0, 0, 0.07)', borderRadius: 8, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 10, display: 'inline-flex' }}>
                    <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: 12, display: 'inline-flex' }}>
                      <div style={{ width: 20, height: 20, position: 'relative', background: '#EDFBED' }}>
                        <Input type='checkbox' style={{ width: 20, height: 20, left: 20, top: -3, position: 'absolute', border: '1px #4FD44C solid' }}></Input>
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
                                  <div style={{ alignSelf: 'stretch', color: '#222222', fontSize: 18, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>#{item["VendorBill"]["ID"]}</div>
                                  <div style={{ alignSelf: 'stretch', color: '#222222', fontSize: 18, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>{item["VendorBill"]["Comment"]}</div>
                                </div>
                                <div style={{ width: 154, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 6, display: 'inline-flex' }}>
                                  <div style={{ padding: 5, background: 'rgba(79, 212, 76, 0.10)', borderRadius: 4, border: '1px #4FD44C solid', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 8, display: 'inline-flex' }}>
                                    <div style={{ color: '#4FD44C', fontSize: 14, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>$1330.00</div>
                                  </div>
                                  <div style={{ width: 78, height: 34, position: 'relative', background: '#D5F9C4', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: 79.88, height: 34, left: 0, top: 0, position: 'absolute', background: 'rgba(150.39, 198.46, 94.60, 0.55)' }}></div>
                                    <div style={{ left: 22, top: 10, position: 'absolute', color: '#455D00', fontSize: 12, fontFamily: 'Lato', fontWeight: '400', wordWrap: 'break-word' }}>Partial</div>
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
                        <div style={{ flex: '1 1 0' }}><span style={{ color: '#999999', fontSize: 12, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>Bill Date : </span><span style={{ color: '#222222', fontSize: 12, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>05/06/23</span></div>
                        <div style={{ flex: '1 1 0', textAlign: 'right' }}><span style={{ color: '#999999', fontSize: 12, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>Due Date : </span><span style={{ color: '#222222', fontSize: 12, fontFamily: 'Lato', fontWeight: '300', wordWrap: 'break-word' }}>05/06/23</span></div>
                      </div>
                      <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 21, display: 'inline-flex' }}>
                        <div style={{ paddingLeft: 5, paddingRight: 5, background: 'rgba(79, 212, 76, 0.10)', borderRadius: 8, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'flex' }}>
                          <div style={{ width: 61, color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Items: 3</div>
                        </div>
                        <div style={{ flex: '1 1 0', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Total  : $1330</div>
                        <div style={{ textAlign: 'right', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Balance : $1330</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              {index === 0 &&
                <Col>
                  {/* <div style={{ width: '82%', height: '100%', paddingTop: 31, paddingBottom: 16, paddingLeft: 35, paddingRight: 16, background: 'white', boxShadow: '0px 0px 23px rgba(0, 0, 0, 0.07)', borderRadius: 8, overflow: 'hidden', marginLeft: '50px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex' }}>
                    <div style={{ color: 'black', fontSize: 20, fontFamily: 'Lato', fontWeight: '600', wordWrap: 'break-word' }}>No Bills Selected</div>
                    <div style={{ width: 335, height: 52, paddingLeft: 40, paddingRight: 40, paddingTop: 13, paddingBottom: 13, background: '#4DAD3E', borderRadius: 6, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
                      <div style={{ color: 'white', fontSize: 18, fontFamily: 'Lato', fontWeight: '900', lineHeight: 31.50, wordWrap: 'break-word' }}>Proceed to Pay</div>
                    </div>
                  </div> */}
                  <div style={{ width: '90%', height: '100%', marginLeft: 60, paddingTop: 31, paddingBottom: 16, paddingLeft: 35, paddingRight: 16, background: 'white', borderRadius: 8, overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 10, display: 'inline-flex' }}>
                    <div style={{ alignSelf: 'stretch', height: 186, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 26, display: 'flex' }}>
                      <div style={{ alignSelf: 'stretch', height: 108, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 5, display: 'flex' }}>
                        <div style={{ color: 'black', fontSize: 20, fontFamily: 'Lato', fontWeight: '600', wordWrap: 'break-word' }}>2 Bills Selected</div>
                        <div style={{ alignSelf: 'stretch', height: 71, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 7, display: 'flex' }}>
                          <div style={{ width: 367, borderRadius: 8, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 295, display: 'inline-flex' }}>
                            <div style={{ width: 61, color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Items : </div>
                            <div style={{ color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word', marginRight: 20 }}>3</div>
                          </div>
                          <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 295, display: 'inline-flex' }}>
                            <div style={{ color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Total :</div>
                            <div style={{ textAlign: 'right', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>$1334</div>
                          </div>
                          <div style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 279, display: 'inline-flex' }}>
                            <div style={{ textAlign: 'right', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Balance : </div>
                            <div style={{ textAlign: 'right', color: '#4FD44C', fontSize: 12, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>$1334</div>
                          </div>
                        </div>
                      </div>
                      <div style={{ width: 335, height: 52, paddingLeft: 40, paddingRight: 40, paddingTop: 13, paddingBottom: 13, background: '#4DAD3E', borderRadius: 6, justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex' }}>
                        <div style={{ color: 'white', fontSize: 18, fontFamily: 'Lato', fontWeight: '900', wordWrap: 'break-word' }}>Proceed to Pay</div>
                      </div>
                    </div>
                  </div>
                  </Col>}
            </Row>
          ))}
        </div>
      </div>
    </Main>
  );
}
