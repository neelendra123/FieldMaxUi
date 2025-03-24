interface PopupOptions {
  isOpen: boolean;
  onClose(): any;
  children: any;
  hideButton: boolean;
  leftItemViewOnlyClass?: String;
  leftItemViewOnly?: String;
  leftItem?: string;
  leftFunction?(): any;
  onSave?(): any;
  ModalName?: string;
  title?: string;
  addClassToWrapper?: string;
  footerSaveChanges?(): any;
  disableButtons?: boolean;
}
export default function Popup({
  isOpen = false,
  title,
  onClose,
  children,
  hideButton,
  leftItemViewOnlyClass,
  leftItem,
  addClassToWrapper,
  leftFunction,
  leftItemViewOnly,
  onSave,
  ModalName,
  footerSaveChanges,
  disableButtons = false,
}: PopupOptions) {
  return (
    <>
      {isOpen ? (
        <div
          className={
            addClassToWrapper ? 'popup-wrap ' + addClassToWrapper : 'popup-wrap'
          }
        >
          <div
            className={
              addClassToWrapper ? 'popup-box ' + addClassToWrapper : 'popup-box'
            }
          >
            <div className="box">
              {!disableButtons && (
                <span className="close-icon" onClick={onClose}>
                  x
                </span>
              )}

              <div className="popup-heading-title">
                <div className="flex-space-between">
                  <h5 className="sec-title">{title}</h5>
                </div>
              </div>
              <div className="popup-table-wrap">
                {children}
                {hideButton ? null : (
                  <div
                    className={
                      leftItemViewOnlyClass
                        ? 'btn-grp ' + leftItemViewOnlyClass
                        : 'btn-grp '
                    }
                  >
                    {leftItem && leftFunction && (
                      <button
                        onClick={leftFunction}
                        className="btn btn-warning"
                        disabled={disableButtons}
                      >
                        {leftItem}
                      </button>
                    )}
                    {leftItemViewOnly && (
                      <div className="left-item">{leftItemViewOnly}</div>
                    )}

                    <button
                      onClick={onSave}
                      className="btn btn-primary"
                      disabled={disableButtons}
                    >
                      {ModalName ? ModalName : 'Save'}
                    </button>
                  </div>
                )}
              </div>
              {footerSaveChanges && (
                <div className="popup-heading-footer">
                  <button
                    className="btn btn-primary"
                    onClick={footerSaveChanges}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
