import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import * as services from '../services';
import { errorToast, successToast } from '../../../utils/toast';
import { useHistory } from 'react-router-dom';
import * as utils from '../utils';

let currentJob: { id:string;serviceIssues: { ServiceManagerIssueID: number;ScheduledDate:string;DueDate:string }; startDt: string |number|Date|boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;endDt: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; };
let totalItemPrice2 = 0;
interface MyModalProps {
  isOpen: boolean;
  closeModal: () => void;
  serviceId: number;
  jobdetails: any;
}
interface UserData {
  UnitID: number;
  Description: string;
  Quantity: string;
  Price:number;
  WorkOrderID: number;
  InventoryItem:{Name:string};
}

interface SecondModalProps {
  isOpen: boolean;
  closeModal: () => void;
  closeAllModals: () => void;
}

const SecondModal: React.FC<SecondModalProps> = ({ isOpen, closeModal, closeAllModals }) => {
  // State to manage the text input value
  const [reason, setReason] = useState('');

  // Handler for submitting the second modal form
  const handleSubmit = async() => {
    try {
      let IssueID = currentJob?.serviceIssues?.ServiceManagerIssueID;
      const job = await services.updateIssueStatus(IssueID, "Rejected");
      console.log(job);
      if(job.statusCode === 200){
        successToast("Service Order Rejected!");
        closeAllModals();
      }else{
        errorToast("Service Order Rejecting Failed!");
        console.error('Error updating issue workorder status:');
        closeModal();
      }
      
    } catch (error) {
      errorToast("Error updating Service Order status")
      console.error('Error updating issue workorder status:', error);
      closeModal();
    }
  };
  const secondModalStyle: ReactModal.Styles = {
    overlay: {
      zIndex: 2002,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      zIndex: 2001,
      position: 'relative',
      top: 'auto',
      left: '30%', // Center the modal horizontally
      transform: 'translateX(-50%)', // Adjust for centering
      right: '0',
      bottom: 'auto',
      maxWidth: '800px',
      width: '100%',
      maxHeight: '100%', // Limit maximum height
      margin: 'auto',
      marginTop: '50px', // Increase space from the top
      marginBottom: '50px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff',
      overflow: 'auto',
    },
  };
  const declineButtonStyleR: React.CSSProperties = {
    backgroundColor: '#FE474F',
    color: '#FFFFFF',
    border: 'none',
    fontFamily: 'Lato',
    borderRadius: '4px',
    padding:10,
  };
  const buttonContainerStyle2: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px', // Add space between table and buttons
  };
  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={closeModal}
    contentLabel="Second Modal"
    ariaHideApp={false}
    style={secondModalStyle}
    >
      <h6 style={{textAlign:'center'}}>Decline Service Request</h6>
      <textarea
         placeholder={`Why are you declining the service request?\n Optional`}
         value={reason}
         onChange={(e) => setReason(e.target.value)}
         style={{whiteSpace: 'pre-line',alignItems: 'center', padding: 10, display: 'inline-flex', justifyContent: 'center',width: '100%', minHeight: '100px', color: '#4FD44C', backgroundColor:'rgba(79, 212, 76, 0.30)', borderRadius:10, border:'none'}} // Adjust the width and height as needed
       />
       <div style={buttonContainerStyle2}>
      <button style={declineButtonStyleR} onClick={handleSubmit}>Decline</button>
      </div>
    </Modal>
  );
};

interface ThirdModalProps {
  isOpen: boolean;
  closeModal: () => void;
  closeAllModals: () => void;
}

const ThirdModal: React.FC<ThirdModalProps> = ({ isOpen, closeModal, closeAllModals }) => {
  const history = useHistory();
  const handleSave = async() => {
    // Handle save logic here
    // Inside your component  
    try {
      console.log(currentJob);
      let IssueID = currentJob?.serviceIssues?.ServiceManagerIssueID;
      const job = await services.updateIssueStatus(IssueID, "Accepted");
      console.log(job);
      if(job.statusCode === 200){
        history.go(0);
        successToast("Service Issue Order Status Updated Successfuly!")
        closeAllModals();
        console.log(currentJob);
      }else{
        errorToast("Service Issue Order Status Updated Failed!")
        console.error('Error updating issue workorder status:');
        closeModal();
      }
      
    } catch (error) {
      errorToast("Error in updatuing the Service Issue Order Status!")
      console.error('Error updating issue workorder status:', error);
      closeModal();
    }
  };

  const handleOpenPDF1 = () => {
    // Replace 'your-pdf-url.pdf' with the actual URL of your PDF file
    const pdfUrl = '../../../Service_Order.pdf';
  
    // Open the PDF in a new tab
    window.open(pdfUrl, '_blank');
  };
  const handleOpenPDF2 = () => {
    // Replace 'your-pdf-url.pdf' with the actual URL of your PDF file
    const pdfUrl = '../../../Safety_Handbook.pdf';
  
    // Open the PDF in a new tab
    window.open(pdfUrl, '_blank');
  };

  const thirdModalStyle: ReactModal.Styles = {
    overlay: {
      zIndex: 2002,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      zIndex: 2001,
      position: 'relative',
      top: 'auto',
      left: '30%', // Center the modal horizontally
      transform: 'translateX(-50%)', // Adjust for centering
      right: '0',
      bottom: 'auto',
      maxWidth: '800px',
      width: '100%',
      maxHeight: '100%', // Limit maximum height
      margin: 'auto',
      marginTop: '50px', // Increase space from the top
      marginBottom: '50px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff',
      overflow: 'auto',
    },
  };
  const acceptButtonStyleFinal: React.CSSProperties = {
    backgroundColor: '#4FD44C',
    color: '#FFFFFF',
    border: 'none',
    fontFamily: 'Lato',
    borderRadius: '4px',
    marginLeft: '10px', // Add space between buttons
    padding:10,
    width:200,
    };
  const scrollableTableStyleagreement: React.CSSProperties = {
    maxHeight: '200px', // Set a fixed height for the scrollable table
    overflowY: 'auto', // Enable vertical scrolling
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Third Modal"
      ariaHideApp={false}
      style={thirdModalStyle}
    >
      <h6 style={{color:'#4FD44C', fontFamily:'Lato'}}>Service Agreement</h6>
      <div style={scrollableTableStyleagreement}>
        <p>1.Corporation agrees that it shall from time to time offer a job to Contractor on a work/service order and further agrees that if Contractor accepts the offer, Corporation shall pay to Contractor the sum shown on the said work/service order for each job assigned upon completion of Contractor’s obligations under this agreement.</p>
        <p>2. Contractor agrees that it shall furnish the necessary labor, materials, supplies, place of work, equipment, instrumentalities and permits to satisfactorily complete each job offered by Corporation, and further agrees that it shall accept the sums shown on said work/service order for each such job accepted.</p>
        <p>3. Contractor agrees that it shall perform each accepted job I agree to provide labor and materials in a good and workmanlike manner in accordance with all local codes. Contractor shall ensure that all materials used on each accepted job shall be of good and workmanlike quality, meet all local codes and adequately meet the intent and specification of the work/service order.</p>
        <p>4. Contractor agrees that it shall make no changes, additions or deletions on any job without the prior written approval of Corporation.</p>
        <p>5. Contractor agrees to be solely responsible for the completion of the job according to specifications and for the work to be completed by the due date on the work/service order.</p>
        <p>6. Contractor guarantees its workmanship for one year from the date of the receipt of final payment from Corporation which guarantee shall survive termination of this Agreement. Contractor warranty does not cover normal wear and tear. Defective materials shall be covered by the manufacturer’s warranty unless installed improperly by Contractor causing such defect which in such case shall be covered by the Contractor.</p>
        <p>7. Contractor agrees that it shall correct any work which is not performed in a good and workmanlike manner to the satisfaction of the Corporation and that it shall correct any work which is not performed by it in a good and workmanlike manner within five (5) calendar days from the date that it is placed on notice of the problem. If the Contractor fails to correct such work within five (5) calendar days, the Corporation may take steps to ensure that the problem is corrected, and the cost of such correction will be charged against the future amounts due to Contractor.  In no way is the correction of the problem by Corporation and the charge against future amounts due to Contractor to be considered a waiver by Corporation of a breach of this Contractor Agreement by Contractor.</p>
        <p>8. In any event where, as a result of poor or incomplete work, the property is subject to additional damage, Corporation may, at its sole option, elect to correct such damages itself and all cost therefore shall be borne by Contractor.</p>
        <p>9. Contractor agrees that it shall be solely responsible for withholding and payment of all Income Taxes, FICA Taxes, and Unemployment Compensation Taxes on Contractor and its Employees and Contractor directs Corporation not to withhold such taxes and agrees that if any Federal or State Agency rules that Contractor is not a bona fide Contractor and levies any assessments, penalties, or back taxes, then Contractor shall be solely responsible for such assessments, penalties, or back taxes on itself and its employees.</p>
        <p>10. Contractor agrees that it shall provide Automobile Liability Insurance, General Liability Insurance, and Workers’ Compensation Insurance for itself, its employees, and any and all independent contractors it may employ on any job. The amount of coverage for General Liability must be $1,000,000.00 and Worker’s Compensation must be $500,000.00. Proof of General Liability and Worker’s Compensation coverage must be in the form of a valid Accord Certificate of Insurance, provided by Contractor’s insurer with General Home Management Corporation named as the Certificate Holder and Additional Insured.</p>
        <p>11. Contractor further agrees that, if the aforesaid insurances are not provided, Corporation may charge the Job Account of Contractor with all extra costs and expenses, including charges to Corporation’s own insurance coverage due to the lack of the Contractor provision of such insurance coverage.</p>
        <p>12. Corporation agrees that it shall pay to Contractor the agreed sum stated in paragraph one (1) and paragraph two (2) hereof by the following week’s Friday after receipt of the following required items:</p>
        <p>12.a.Contractor will submit identifiable before and after photos as described in this paragraph for each line item on the accepted service order prior to submitting a request for payment. Photos must be able to be identified as to the respective item and the respective property to be approved for payment.  Contractor will review before photos of each item prior to taking after photos and take after photos of each item from the same perspective as the before photo.</p>
        <p>12.b.Corporation will pay contractor, via direct deposit or check and send an advice of payment referencing the work/service order number that the payment has been applied to.</p>
        <p>13. For service on occupied properties, Contractor shall wear an identifiable General Home or other approved work garment, a General Home Customer Care Team photo ID badge and shoe covers (shoe covers required for interior work only) prior to performing service at an occupied property. Contractor shall be provided a 2-hour window in which to arrive at a scheduled service appointment.  If Contractor will not be able to arrive within the given time frame, contractor must notify Corporation no later than 30 minutes BEFORE the ending window time. If Contractor is late or misses the appointment window and has not notified Contractor as stated above, Contractor will be charged $25.  If Contractor arrives and no one is available at the property to let Contractor in or if service is denied, Contractor must contact Corporation immediately before leaving the property.  Corporation shall make one attempt to reach tenant and provide entry or approval for Contractor. If Corporation is unable to locate tenant to provide entry or approval, Corporation will advise Contractor to leave and Contractor shall be compensated a $25 trip charge by Corporation.
        3:38</p>
        <p>14. Contractor agrees that Contractor, it’s employees and it’s sub-contractors shall not discuss prices, cost, expenses, additional work, or the terms of this agreement with anyone other than an Associate of the Corporation, and further agrees to notify Corporation immediately of all leads or inquiries concerning additional work whenever said leads or inquiries arise from jobs assigned to Contractor by Corporation or customers introduced to Contractor by Corporation. Contractor agrees that it shall direct all persons with any such inquires above to contact Corporation directly at 855-8-MOVEUP (855-866-8387).</p>
        <p>15. Corporation and Contractor agree that the intent of the parties is that an independent contractual relationship shall exist between them. Contractor further acknowledges that it is in business for itself and Corporation further agrees that Contractor may accept jobs from other sources as well as from Corporation.</p>
        <p>16. Contractor shall be liable for any and all damages suffered by Corporation that may arise from Contractor’s work or Contractor unilaterally ceasing work on a job prior to completion of its responsibilities under an assigned and accepted work/service order for that job.</p>
        <p>17. Any controversy or claim arising out of or relating to this Agreement or breach thereof, which cannot be settled by the parties hereto, shall be settled by binding arbitration as the sole remedy. Each party shall select one arbitrator and the two of them shall select a third party and a majority of the three shall decide the issue and such decision shall be binding on each of the parties to the arbitration. The prevailing party shall be entitled to recover from other party all costs and expenses of arbitration.</p>
        <p>18. The Corporation desires that all of its Contractors be cognizant of and adhere to good safety procedures and practices. Contractor’s signature below constitutes acknowledgement of receipt and understanding of the Job Safety Handbook attached to this agreement. Contractor agrees to observe and adhere to the Job Safety Handbook guidelines in the performance of all work for Corporation.</p>
        <p>19. Contractor, it’s employees and it’s sub-contractors understand that General Home Management Corporation is a drug free workplace. “The use, sale, purchase, dispensing, or possession of illegal drugs and the use of alcohol are inconsistent with our Contractor’s commitment to provide a safe and productive work environment. The possession of alcohol and/or illegal drugs is strictly forbidden on a General Home Management Corporation job site. Violation of this policy, or reporting to a General Home Management Corporation job site for any reason under the influence of alcohol and/or illegal drugs, will result in immediate termination as an authorized Contractor.”</p>
        <p>20. Contractor agrees that all salvage is the property of Corporation to dispose of however it sees fit. Contractor shall not reclaim discarded items or belongings from any Corporation job or job dumpsters. The Contractor shall, however, with the knowledge and written approval of Corporation, reclaim salvage which it can then use in restoration of the job.</p>
        <p>21. Corporation’s obligation to pay Contractor under the terms of this agreement and Contractor’s obligation to warrant it’s work under the terms of this agreement shall survive the termination of this agreement.</p>
        <p>22. Should one particular provision of this Agreement, or any word, phrase, sentence, clause, or paragraph thereof be declared invalid or illegal by any federal, state, county, or municipal government, such invalidity or illegality shall not affect the other provisions hereof shall, nevertheless, remain in full force and effect and shall be construed in all respects as if such invalid or illegal provisions were omitted.</p>
        <p>23. Corporation and Contractor agree that this Agreement shall not be assigned without the written consent of both parties hereto, and further agree that this instrument contains the entire agreement between the parties, and no statement, promise or inducement made by either party hereto, or agent of either party hereto, which is not contained in this written instrument, shall be valid or binding.</p>
        <p>24. Contractor agrees that during, and for a period of three (3) years after termination of, his or her relationship with Corporation, Contractor shall not directly or indirectly, approach any customer or business partner of Corporation or its Affiliates for the purpose of providing services substantially similar to the services provided by the Corporation or its affiliates; for the purpose of terminating a relationship with the Corporation; or to cause any of the preceding to occur.</p>
        <p>25. Contractor agrees that during, and for a period of three (3) years after termination of, his or her relationship with Corporation, Contractor shall not directly or indirectly, approach, solicit, entice or attempt to approach, solicit or entice any of Corporation’s other Contractors or Suppliers of the Corporation or its Affiliates for the purpose of providing services substantially similar to the services provided to the Corporation or its affiliates by Supplier; for the purpose of terminating a relationship with the Corporation; or to cause any of the preceding to occur.</p>
        <p>26. Contractor agrees that during, and for a period of three (3) years after termination of, his or her relationship with Corporation, Contractor shall not directly or indirectly, approach, solicit, entice or attempt to approach, solicit or entice any of the other Contractors or Employees of the Corporation or its Affiliates to leave the employment of, or terminate a relationship with the Corporation, or to cause any of the preceding to occur.</p>
        <p>27. Corporation and Contractor agree that this Agreement shall be effective on the date designated above, and further agree that this Agreement shall be continuous in nature until termination which may be affected by either party upon giving a thirty (30) day written notice of termination to the other party.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start',marginBottom: '20px',marginTop: '20px' }}>
        <input
          type="checkbox"
          id="exampleCheckbox"
          style={{ marginRight: '5px', // Adjust spacing between checkbox and label
             color: '#4FD44C',     // Change checkbox color
             height: '20px',     // Change checkbox height
             width: '20px',
             backgroundColor:'#4FD44C'      // Change checkbox width
          }}
          // onChange={() => setChecked(!isChecked)}
        />
        <label htmlFor="exampleCheckbox" style={{ marginLeft: '10px' }}>
          I accept this Service Agreement and these terms for the Service Issue: {currentJob?.serviceIssues?.ServiceManagerIssueID}
          <li>Schedule Date: {currentJob?.serviceIssues?.ScheduledDate}</li>
          <li>Due Date: {currentJob?.serviceIssues?.DueDate}</li>
          <li>Price: ${totalItemPrice2}</li>
          <li>Service Guidlines</li>
          <li>OSHA Saftey Guidlines Handbook</li>
          I accept to complete all work in accordance with this Agreement and these terms
        </label>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <button style={{ padding:10,width: '150px', marginRight: '10px', borderRadius:4, border:'none', backgroundColor:'rgba(79, 212, 76, 0.30)' }} onClick={handleOpenPDF1}>Service Handling</button>
        <button style={{padding:10, width: '150px' ,borderRadius:4, border:'none', backgroundColor:'rgba(79, 212, 76, 0.30)'}} onClick={handleOpenPDF2}>Saftey Handbook</button>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <button style={acceptButtonStyleFinal} onClick={handleSave}>Accept</button>
       
      </div>
    </Modal>
  );

};

const MyModal: React.FC<MyModalProps> = ({ isOpen, closeModal, serviceId, jobdetails }) => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [showThirdModal, setShowThirdModal] = useState(false);
  currentJob = jobdetails;
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(jobdetails);
        const job = await services.jobWorkOrders(serviceId);
  
        // const response = await fetch('https://jsonplaceholder.typicode.com/users');
        // const data = await response.json();
        if(job.statusCode === 200){
          successToast("Service Order List Fetched Successfuly!")
          setUserData(job.data.workOrders);
        }
        
      } catch (error) {
        errorToast("Error in fetching the Service Order List!")
        console.error('Error fetching data:', error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);
  const USER_DEFINED_FIELD_ID = 521;
  const index = jobdetails?.serviceIssues?.UserDefinedValues.findIndex((item: { UserDefinedFieldID: any; }) => item.UserDefinedFieldID === USER_DEFINED_FIELD_ID);
  if (index !== -1) {
    console.log(`Index of "UserDefinedFieldID" ${USER_DEFINED_FIELD_ID} is ${index}`);
  } else {
    console.log(`"UserDefinedFieldID" ${USER_DEFINED_FIELD_ID} not found in the array`);
  }
  const Status = jobdetails?.serviceIssues?.UserDefinedValues[index];

  const handleDeclineClick = () => {
    // Show the second modal when Decline button is clicked
    setShowSecondModal(true);
  };
  const handleAcceptClick = () => {
    // Show the second modal when Decline button is clicked
    setShowThirdModal(true);
  };


  const modalStyle: ReactModal.Styles = {
    overlay: {
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      zIndex: 1001,
      position: 'relative',
      top: 'auto',
      left: '30%', // Center the modal horizontally
      transform: 'translateX(-50%)', // Adjust for centering
      right: '0',
      bottom: 'auto',
      maxWidth: '800px',
      width: '100%',
      maxHeight: '100%', // Limit maximum height
      margin: 'auto',
      marginTop: '50px', // Increase space from the top
      marginBottom: '50px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#fff',
      overflow: 'auto',
    },
  };
  const headingStyle: React.CSSProperties = {
    textAlign: 'right', // Align heading to the left
    marginBottom: '10px', // Add some space below the heading
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex', // Use flex layout for the container
    justifyContent: 'space-between', // Space between the child divs
    width: '100%', // Take the full width of the container
  };
  const tableDivStyle: React.CSSProperties = {
    flex: '1', // Take 2/3 of the container width
  };
  const imageDivStyle: React.CSSProperties = {
    flex: '1', // Take 1/3 of the container width
  };
  const sampleDivStyle: React.CSSProperties = {
    flex: '1', // Take 1/3 of the container width
  };
  const sampleDivStyle2: React.CSSProperties = {
    flex: '1', // Take 1/3 of the container width
    textAlign: 'right'
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
  };

  const scrollableTableStyle: React.CSSProperties = {
    maxHeight: '200px', // Set a fixed height for the scrollable table
    overflowY: 'auto', // Enable vertical scrolling
  };

  const tableRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ccc',
    borderTop: '1px solid #ccc',
    borderLeft: '1px solid #ccc',
    borderRight: '1px solid #ccc'
  };
  const tableCellStyle3: React.CSSProperties = {
    wordWrap: 'break-word', // Allow the text to wrap onto multiple lines
    maxWidth: '200px', // Set a fixed width for the cell
    textAlign: 'center',
    borderBottom: '1px solid #ccc',
    borderTop: '1px solid #ccc',
    borderLeft: '1px solid #ccc',
    borderRight: '1px solid #ccc'
  };
  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px', // Add space between table and buttons
  };

  const acceptButtonStyle: React.CSSProperties = {
    backgroundColor: '#4FD44C',
    color: '#FFFFFF',
    border: 'none',
    fontFamily: 'Lato',
    borderRadius: '4px',
    marginLeft: '10px', // Add space between buttons
    padding:10,
    display: Status?.Value === 'Hold' || Status?.Value === 'Sent' ? 'inline-block' : 'none',

  };

  const declineButtonStyle: React.CSSProperties = {
    backgroundColor: '#FE474F',
    color: '#FFFFFF',
    border: 'none',
    fontFamily: 'Lato',
    borderRadius: '4px',
    padding:10,
    display: Status?.Value === 'Hold' || Status?.Value === 'Sent' ? 'inline-block' : 'none',

  };
  const addressCellStyle: React.CSSProperties = {
    textAlign: 'center',
    backgroundColor: '#CACFD2', // Set background color to grey
    borderBottom: '1px solid #ccc',
    borderTop: '1px solid #ccc',
    borderLeft: '1px solid #ccc',
    borderRight: '1px solid #ccc'
  };
  const totalItemPrice = userData.reduce((total, user) => {
    const itemPrice = Number(user.Quantity) * Number(user.Price);
    return total + itemPrice;
  }, 0);
  totalItemPrice2 = totalItemPrice;
  const inputDateString = jobdetails?.serviceIssues?.CreateDate;
  const inputDate = new Date(inputDateString);

  const day = inputDate.getDate().toString().padStart(2, '0');
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
  const year = inputDate.getFullYear();

  const formattedDate = `${month}/${day}/${year}`;
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      ariaHideApp={false} // Disable accessibility warnings
      style={modalStyle}
      shouldCloseOnOverlayClick={false}
    >
       <button
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          fontSize: '1.5em',
          color: '#555', // Text color
          padding: '5px', // Padding around the close mark
          borderRadius: '50%', // Make it circular
          outline: 'none', // Remove focus outline
          transition: 'background 0.3s ease',
        }}
        onClick={closeModal}
      >
        &times; {/* Close symbol (X) */}
      </button>
      
      <h6 style={headingStyle}>Service Order</h6>
      <div style={containerStyle}>
        <div style={imageDivStyle}>
          <img src={require('../../../assets/images/ic_generalhomes.png').default} alt="Logo" />
          <p>44309 Macomb Industrial Drive
            Clinton Township, MI 48036
            1–855–8-MOVEUP</p>
        </div>
        <div style={sampleDivStyle}></div>
        <div style={tableDivStyle}>
          <table style={tableStyle}>
            <tbody>
              <tr style={tableRowStyle}>
                <td>Order Number:</td>
                <td style={{ textAlign: 'left' }}>{jobdetails?.serviceIssues?.ServiceManagerIssueID}</td>
              </tr>
              <tr style={tableRowStyle}>
                <td>Date Opened:</td>
                <td style={{ textAlign: 'right' }}>{formattedDate}</td>
              </tr>
              <tr style={tableRowStyle}>
                <td>Issue Status:</td>
                <td style={{ textAlign: 'right' }}>{jobdetails?.serviceIssues?.Status?.Name}</td>
              </tr>
              <tr>
                <td style={addressCellStyle}>Address:</td>
              </tr>
              <tr>
                <td style={tableCellStyle3}>
                  {jobdetails?.address?.formatted}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={addressCellStyle}>Issue:</td>
          </tr>
          <tr>
            <td>Description: {jobdetails.serviceIssues.Description}</td>
          </tr>
        </tbody>
      </table>

      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={addressCellStyle}>Resolution:</td>
          </tr>
          <tr>
            <td>Resolution: {jobdetails.serviceIssues.Resolution}</td>
          </tr>
        </tbody>
      </table>

      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={addressCellStyle}>Service Order Items</td>
          </tr>
        </tbody>
      </table>

      <div style={scrollableTableStyle}>
        <table style={tableStyle}>
          <colgroup>
            <col style={{ width: '5%' }} />
            <col style={{ width: '70%' }} />
            <col style={{ width: '5%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
          {userData.map((user) => (
            <tr key={user.WorkOrderID}>
              <td>{user.InventoryItem?.Name}</td>
              <td>{user.Description}</td>
              <td>{user.Quantity}</td>
              <td>${user.Price.toFixed(2)}</td>
              <td>${(Number(user.Quantity)*Number(user.Price)).toFixed(2)}</td>
              {/* Add more cells based on your userData structure */}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <div style={{ borderBottom: '1px dashed #ccc', margin: '20px 0' }} />

      <div style={containerStyle}>
        <div style={imageDivStyle}>
          <h6>Service Issue: {jobdetails?.serviceIssues?.ServiceManagerIssueID}</h6>
        </div>
        <div style={sampleDivStyle}></div>
        <div style={sampleDivStyle2}>
        <h6>Total: ${totalItemPrice.toFixed(2)}</h6>
        </div>
      </div>

      <div style={buttonContainerStyle}>
        <button style={declineButtonStyle} onClick={handleDeclineClick}>Decline</button>
        <button style={acceptButtonStyle} onClick={handleAcceptClick}>Accept</button>
      </div>
      <SecondModal isOpen={showSecondModal} closeModal={() => setShowSecondModal(false)} closeAllModals={closeModal} />
      <ThirdModal isOpen={showThirdModal} closeModal={() => setShowThirdModal(false)} closeAllModals={closeModal} />
    
    </Modal>
  );
};

export default MyModal;
