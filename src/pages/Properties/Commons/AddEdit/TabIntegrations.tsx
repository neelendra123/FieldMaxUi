import { Fragment } from 'react';
import { BiCheck } from 'react-icons/bi';

import * as interfaces from '../../interfaces';

interface TabIntegrationsProps {
  rm: interfaces.IPropertyRMIntegrations;
  setRM: (rmFields: interfaces.IPropertyRMIntegrations) => void;

  errors: Record<string, string>;
}

export default function TabIntegrations({
  errors,
  rm,
  setRM,
}: TabIntegrationsProps) {
  return (
    <Fragment>
      <div className="card shadow-equal rounded-sm my-3 p-2">
        <div
          className="max-checkbox ml-3 c-pointer"
          onClick={() => {
            setRM({
              ...rm,
              enabled: !rm.enabled,
            });
          }}
        >
          <div className="check">{rm.enabled && <BiCheck fontSize="16" />}</div>
          <h6 className="fz-14 mb-0">Sync With RM</h6>
        </div>
        {rm.enabled && (
          <div className="m-3">
            {errors.rm && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {errors.rm}
                <button
                  type="button"
                  className="close"
                  data-dismiss="alert"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Fragment>
  );
}

// return (
//   <Fragment>
//     {options.map((rm, index) => {
//       return (
//         <div className="card shadow-equal rounded-sm my-3 p-2">
//           <div className={`max-checkbox ml-3 pt-2 c-pointer`}>
//             <div className="check" onClick={() => handleToggle(index)}>
//               {rm.checked && <BiCheck fontSize="16" />}
//             </div>
//             <h6 className="fz-14 mb-0">Sync With RM</h6>
//           </div>
//           {rm.checked && (
//             <div className="mx-3">
//               <div className="row">
//                 <div className="col-md-6 mt-3">
//                   <TextInputComp
//                     name="displayName"
//                     label="Posting Day"
//                     className="form-control form-control-sm"
//                     //   value={rmFields.displayName}
//                     onChange={(value: string) => {}}
//                   />
//                 </div>

//                 <div className="col-md-6 mt-3">
//                   <SelectInputComp
//                     name="displayName"
//                     label="Default Bank"
//                     onChange={(value: string) => {}}
//                     value={undefined}
//                     options={[]}
//                   />
//                 </div>

//                 <div className="col-md-6 mt-3">
//                   <SelectInputComp
//                     name="displayName"
//                     label="Rent Charge Type *"
//                     onChange={(value: string) => {}}
//                     value={undefined}
//                     options={[]}
//                   />
//                 </div>

//                 <div className="col-md-6 mt-3">
//                   <SelectInputComp
//                     name="displayName"
//                     label="Charge Type Banks"
//                     onChange={(value: string) => {}}
//                     value={undefined}
//                     options={[]}
//                   />
//                 </div>
//               </div>

//               <div className='my-4'>
//                 <h6 className="fz-14">CONTACT INFORMATION</h6>

//                 <div className="row">
//                   <div className="col-md-6">
//                     <TextInputComp
//                       name="displayName"
//                       label="Manager"
//                       className="form-control form-control-sm"
//                       //   value={rmFields.displayName}
//                       onChange={(value: string) => {}}
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <TextInputComp
//                       name="displayName"
//                       label="Email"
//                       className="form-control form-control-sm"
//                       //   value={rmFields.displayName}
//                       onChange={(value: string) => {}}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       );
//     })}
//   </Fragment>
// );
