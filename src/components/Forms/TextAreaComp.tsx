import { Fragment, FunctionComponent } from 'react';

type TextAreaCompProps = {
  id?: string;
  name: string;
  value?: string | number;
  label?: string;
  placeholder?: string;

  className?: string;

  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  rows?: number;

  onChange?: (val: string, key: string) => void;

  errorMsg?: string;
  // infoMsg?: string;
  // successMsg?: string;

  labelClassName?: string;

  defaultValue?: string | number;
};

const TextAreaComp: FunctionComponent<TextAreaCompProps> = ({
  label,
  id,
  name,

  placeholder,
  onChange = () => {},

  value,
  className = 'form-control',

  disabled = false,
  required = false,
  autoFocus = false,
  errorMsg,
  rows = 3,
  // successMsg,
  // infoMsg,

  labelClassName,

  defaultValue,
}) => {
  return (
    <Fragment>
      {label && (
        <label htmlFor={name} className={'mb-2 ' + labelClassName}>
          {label}
        </label>
      )}
      <textarea
        id={id ?? name}
        name={name}
        placeholder={placeholder}
        onChange={(event) => {
          if (onChange) {
            onChange(event.target.value, name);
          }
        }}
        className={className}
        disabled={disabled}
        rows={rows}
        autoFocus={autoFocus}
        required={required}
        value={value}
        defaultValue={defaultValue}
      ></textarea>
      {errorMsg && (
        <p className="text-danger">
          <small>{errorMsg}</small>
        </p>
      )}
    </Fragment>
  );
};

export default TextAreaComp;
