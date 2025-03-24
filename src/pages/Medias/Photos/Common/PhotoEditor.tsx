import { useState, useEffect, createRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import 'tui-image-editor/dist/tui-image-editor.min.css';
import ImageEditor from '@toast-ui/react-image-editor';

import { Popup } from '../../../../components/Common';

import * as utils from '../../utils';

export default function PhotoEditor({
  image,

  onLoadEffect = utils.noop,

  onSaveEffect,
}: {
  image: string;

  onLoadEffect: () => void;

  onSaveEffect: (image: string, mediaContentType: string) => void;
}) {
  const history = useHistory();
  const { pathname } = useLocation();

  const imageEditorRef = createRef<any>();

  const [save, setSave] = useState(false);

  const saveImageToDisk = async () => {
    const imageEditorInst = imageEditorRef.current.imageEditorInst;
    const mediaURL = imageEditorInst.toDataURL();

    onSaveEffect(mediaURL, 'image/png');
  };

  useEffect(() => {
    if (!image) {
      history.push(pathname);
    }

    onLoadEffect();
  }, []);

  return (
    <div>
      {save
        ? (document.body.className = 'fixed-position')
        : (document.body.className = '')}
      <Popup
        isOpen={save}
        title={'Save Photo'}
        hideButton={false}
        onClose={() => setSave(false)}
        leftItem={'Cancel'}
        leftFunction={() => setSave(false)}
        onSave={saveImageToDisk}
        ModalName={'Save Photo'}
        addClassToWrapper="card-media-box"
        leftItemViewOnlyClass="flex-space-center"
      >
        <div>
          <div className="text-center py-5 text-dark">
            Are you sure want to save changes ?
          </div>
        </div>
      </Popup>

      <div className="slider-bottom-info">
        <div className="d-flex justify-content-end">
          <div className="">
            <img
              onClick={(e) => setSave(true)}
              className="d-inline-block w-40 c-pointer"
              src={require('../../../../assets/images/check.png').default}
              alt="Save Changes"
              title="Save Changes"
            />

            <img
              onClick={() => {
                history.push(pathname);
              }}
              className="d-inline-block w-40 c-pointer"
              src={require('../../../../assets/images/cross.png').default}
              alt="Cancel"
              title="Cancel"
            />
          </div>
        </div>
      </div>

      <div className="single-image-container">
        {!!image && (
          <ImageEditor
            //@ts-ignore
            ref={imageEditorRef}
            includeUI={{
              loadImage: {
                path: image,
                name: 'image',
              },
              menuBarPosition: 'left',
              uiSize: {
                width: '100%',
                height: '600px',
              },
            }}
            usageStatistics={false}
          />
        )}
      </div>
    </div>
  );
}
