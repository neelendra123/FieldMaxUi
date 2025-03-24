import { useState, useEffect } from 'react';
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

const EditDefaultErrors = {
  name: '',
  description: '',
};

export default function IntegrationCommonsUpdate({
  selectedTab = IIntegrationCommonSubModuleTypes.serviceManagerCategories,

  editIndex = -1,
  setEditIndex,

  integrationCommon,

  updateEffect,
}: {
  selectedTab: IIntegrationCommonSubModuleTypes;

  editIndex: number;
  setEditIndex: (editIndex: number) => void;

  integrationCommon?: interfaces.IIntegrationCommonTypes;

  updateEffect: () => void;
}) {
  const isMounted = useMountedState();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fontStyles, setFontStyles] = useState<IOption[]>([]);
  const [color, setColor] = useState('#000000');

  const [errors, setErrors] = useState({
    ...EditDefaultErrors,
  });

  useEffect(() => {
    if (editIndex === -1 || !integrationCommon) {
      return;
    }

    // const integrationCommon = list[editIndex];

    setName(integrationCommon.name);
    setDescription(integrationCommon.description);

    setColor(integrationCommon.color);

    const fOptions: IOption[] = [];
    if (integrationCommon.bold) {
      fOptions.push(constants.fontStyleOptions[0]);
    }
    if (integrationCommon.italic) {
      fOptions.push(constants.fontStyleOptions[1]);
    }
    if (integrationCommon.underline) {
      fOptions.push(constants.fontStyleOptions[2]);
    }
    setFontStyles(fOptions);
  }, [integrationCommon]);

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
      setErrors({ ...EditDefaultErrors });
      setIsEditing(true);

      const result = await services.integrationCommonEditService(
        selectedTab,
        integrationCommon?.id as string,
        formData
      );

      successToast(result.message);

      if (!isMounted()) {
        return;
      }

      setEditIndex(-1);
      setIsEditing(false);

      updateEffect();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Popup
      isOpen={editIndex !== -1}
      title="Edit"
      hideButton={true}
      onClose={() => setEditIndex(-1)}
      ModalName="Edit"
      addClassToWrapper="card-media-box"
      leftItemViewOnlyClass="flex-space-center"
      disableButtons={isEditing}
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
            <label htmlFor="font-styles">Font Styles</label>
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
        <div className="d-flex justify-content-end ">
          <button
            className="btn btn-primary "
            onClick={onSave}
            disabled={isEditing}
          >
            Save Changes
          </button>
        </div>
      </div>
    </Popup>
  );
}
