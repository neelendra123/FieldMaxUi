import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

import { IOption } from '../../../interfaces';

import { Popup } from '../../../components/Common';
import { TextInputComp } from '../../../components/Forms';

const SubMediaInfoEditPopup = ({
  tempName = '',
  tempTags = [],

  info,
  setInfo,

  selectedIndex,

  mediaInfoEditEffect,

  selectedSubMediaIndex,
}: {
  tempName: string;
  tempTags: string[];

  info: boolean;
  setInfo: (info: boolean) => void;

  selectedIndex: number;

  mediaInfoEditEffect: (
    name: string,
    tags: IOption[],
    selectedSubMediaIndex: number
  ) => void;

  selectedSubMediaIndex: number;
}) => {
  const [name, setName] = useState(tempName);
  const [tags, setTags] = useState<IOption[]>(
    tempTags.map((tag) => {
      return {
        label: tag,
        value: tag,
      };
    }) ?? []
  );

  const mediaInfoEdit = () => {
    mediaInfoEditEffect(name, tags, selectedSubMediaIndex);
  };

  if (!(selectedIndex !== -1 && info)) {
    return null;
  }

  return (
    <Popup
      isOpen={selectedIndex !== -1 && info}
      title="Info"
      hideButton={false}
      onClose={() => setInfo(false)}
      leftFunction={() => setInfo(false)}
      onSave={mediaInfoEdit}
      ModalName={'Update'}
      addClassToWrapper="big-media-box"
      leftItemViewOnlyClass="d-flex justify-content-end"
    >
      <div className="sec-content text-left">
        <form>
          <div className="form-group">
            <TextInputComp
              type="text"
              name="name"
              onChange={setName}
              label="Name"
              placeholder="Name"
              value={name}
              className="form-control form-control-sm"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Tags</label>
            <CreatableSelect
              isClearable
              isMulti
              formatCreateLabel={(userInput) => `Click to add '${userInput}'`}
              placeholder="Tags"
              value={tags}
              onChange={(value: any) => setTags(value)}
              className="form-control form-control-sm"
            />
          </div>
        </form>
      </div>
    </Popup>
  );
};

export default SubMediaInfoEditPopup;
