import { Fragment, useState } from 'react';
import { useMountedState } from 'react-use';

import { IsFetching, Popup } from '../../../components/Common';
import { successToast } from '../../../utils/toast';

import * as services from '../services';

interface PropertyUnitDeletePopupProps {
  deleteId: string;
  setDeleteId: (deletePopUp: string) => void;

  callBackEffect: () => void;
}

export default function PropertyUnitDeletePopup({
  deleteId,
  setDeleteId,

  callBackEffect,
}: PropertyUnitDeletePopupProps) {
  const isMounted = useMountedState();

  const [isFetching, setIsFetching] = useState(false);

  const deleteRecord = async () => {
    setIsFetching(true);

    try {
      const result = await services.propertyUnitDeleteService(deleteId);
      if (!isMounted()) {
        return;
      }

      successToast(result.message);

      callBackEffect();
    } catch (error) {
      console.error(error);
    }

    if (!isMounted()) {
      return;
    }

    setIsFetching(false);
    setDeleteId('');
  };

  return (
    <Fragment>
      {isFetching && <IsFetching />}
      <Popup
        isOpen={deleteId !== ''}
        title="Delete Unit"
        hideButton={false}
        onClose={() => setDeleteId('')}
        leftItem="Cancel"
        leftFunction={() => setDeleteId('')}
        onSave={deleteRecord}
        ModalName="Delete Unit"
        addClassToWrapper="card-media-box"
        leftItemViewOnlyClass="flex-space-center"
        disableButtons={isFetching}
      >
        <div className="sec-content">
          <p>Are you sure you want to delete this unit?</p>
        </div>
      </Popup>
    </Fragment>
  );
}
