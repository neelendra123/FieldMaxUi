import { useState } from 'react';
import { useMountedState } from 'react-use';
import Select from 'react-select';

import { IOption } from '../../../interfaces';

import { validateData } from '../../../utils/joi';
import { successToast } from '../../../utils/toast';

import { Popup } from '../../../components/Common';
import { TextAreaComp, TextInputComp } from '../../../components/Forms';

import { IIntegrationCommonSubModuleTypes } from '../../Orgs/interfaces';

import * as interfaces from '../interfaces';
import * as constants from '../constants';
import * as services from '../services';

const AddDefaultErrors = {
  name: '',
  description: '',
};

export default function IntegrationCommonsAdd({
  selectedTab = IIntegrationCommonSubModuleTypes.serviceManagerCategories,

  addPopup = false,
  setAddPopup,

  addEffect,
}: {
  selectedTab: IIntegrationCommonSubModuleTypes;

  addPopup: boolean;
  setAddPopup: (addPopup: boolean) => void;

  addEffect: () => void;
}) {
  const isMounted = useMountedState();

  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fontStyles, setFontStyles] = useState<IOption[]>([]);
  const [color, setColor] = useState('#000000');

  const [errors, setErrors] = useState({
    ...AddDefaultErrors,
  });

  const onSave = async () => {
    try {
      const formData: interfaces.IntegrationCommonCreateEditReqData = {
        name,
        description,
        color,
        bold: false,
        italic: false,
        underline: false,
      };
      fontStyles.forEach((fontStyle) => {
        //@ts-ignore
        formData[fontStyle.value] = true;
      });

      const validate = validateData(formData, constants.AddEditJoiScheme);
      if (validate.errors) {
        return setErrors(validate.errors);
      }
      setErrors({ ...AddDefaultErrors });
      setIsCreating(true);

      const result = await services.integrationCommonAddService(
        selectedTab,
        formData
      );

      successToast(result.message);

      if (!isMounted()) {
        return;
      }

      setAddPopup(false);

      addEffect();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Popup
      isOpen={addPopup}
      title={'Add'}
      hideButton={true}
      onClose={() => setAddPopup(false)}
      ModalName={'Add'}
      addClassToWrapper="card-media-box"
      leftItemViewOnlyClass="flex-space-center"
      disableButtons={isCreating}
      onSave={onSave}
    >
      <div className="text-left">
        <TextInputComp
          name={'name'}
          label={'Name'}
          onChange={setName}
          value={name}
          autoFocus
          errorMsg={errors.name}
        />

        <div className="my-3">
          <TextAreaComp
            name="description"
            onChange={setDescription}
            label="Description"
            placeholder="Description *"
            value={description}
            errorMsg={errors.description}
          />
        </div>

        <div>
          <div className="form-group">
            <label htmlFor="fontStyle">Font Styles</label>
            <Select
              isMulti
              name="fontStyle"
              styles={{
                valueContainer: (provided, state) => {
                  return {
                    ...provided,
                    paddingLeft: 16,
                  };
                },
              }}
              options={constants.fontStyleOptions}
              value={fontStyles}
              onChange={(values: any) => {
                setFontStyles(values);
              }}
            />
          </div>
        </div>

        <div>
          <TextInputComp
            name="color"
            type="color"
            label="Color"
            onChange={setColor}
            value={color}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary"
            onClick={onSave}
            disabled={isCreating}
          >
            Save Changes
          </button>
        </div>
      </div>
    </Popup>
  );
}
