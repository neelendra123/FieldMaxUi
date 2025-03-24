import { Fragment, FunctionComponent } from 'react';

type FileInputCompProps = {
  type?: 'file';
  id?: string;
  name: string;
  value?: string;
  label?: string;
  placeholder?: string;
  accept?: string;

  className?: string;

  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  multiple?: boolean;

  onChange: (val: any, name: string) => void;

  errorMsg?: string;
  // infoMsg?: string;
  // successMsg?: string;
};

// export const Card: FunctionComponent<TextInputProps> = ({
const FileInputComp: FunctionComponent<FileInputCompProps> = ({
  label,
  id,
  name,

  type = 'file',
  placeholder,
  onChange,

  value,
  className = 'form-control',

  disabled = false,
  required = false,
  autoFocus = false,

  errorMsg,

  accept,
  multiple = false,
  // successMsg,
  // infoMsg,
}) => {
  return (
    <Fragment>
      {!!label && <label htmlFor={name}>{label}</label>}
      <input
        id={id ?? name}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={(event) => {
          if (multiple) {
            onChange(event.target.files, name);
            return;
          }

          onChange(
            event.target?.files?.length ? event.target.files[0] : '',
            name
          );
        }}
        value={value}
        className={className}
        disabled={disabled}
        autoFocus={autoFocus}
        required={required}
        accept={accept}
        multiple={multiple}
      />
      {errorMsg && (
        <p className="text-danger">
          <small>{errorMsg}</small>
        </p>
      )}
      {/* {infoMsg && <p className="text-info">{infoMsg}</p>}
      {successMsg && <p className="text-success">{successMsg}</p>} */}
    </Fragment>
  );
};

export default FileInputComp;
