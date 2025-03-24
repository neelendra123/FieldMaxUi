import { Fragment, FunctionComponent } from 'react';

type TextInputCompProps = {
  type?: 'text' | 'email' | 'number' | 'password' | 'color';
  id?: string;
  name: string;
  value?: string | number;

  placeholder?: string;

  className?: string;

  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  tabIndex?: number | undefined;

  label?: string;
  labelClassName?: string;

  onChange?: (
    val: any,
    key: string
    // event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  errorMsg?: string;
  // infoMsg?: string;
  // successMsg?: string;

  min?: number;
  max?: number;
  // steps?: string | number | undefined;

  defaultValue?: string | number;
};

const TextInputComp: FunctionComponent<TextInputCompProps> = ({
  id,
  name,

  type = 'text',
  placeholder,
  onChange = () => {},

  value,
  className = 'form-control form-control-sm',
  disabled = false,
  required = false,
  autoFocus = false,
  tabIndex = undefined,
  errorMsg,

  label,
  labelClassName,
  // successMsg,
  // infoMsg,

  min,
  max,
  // steps = undefined,

  defaultValue,
}) => {
  return (
    <Fragment>
      {!!label && (
        <label htmlFor={name} className={'font-weight-bold ' + labelClassName}>
          {label}
        </label>
      )}
      <input
        id={id ?? name}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={(event) => {
          if (onChange) {
            onChange(event.target.value, name);
          }
        }}
        value={value}
        className={className}
        disabled={disabled}
        autoFocus={autoFocus}
        required={required}
        tabIndex={tabIndex}
        min={min}
        max={max}
        // step={steps}

        defaultValue={defaultValue}
      />
      {!!errorMsg && (
        <p className="text-danger">
          <small>{errorMsg}</small>
        </p>
      )}
      {/* {infoMsg && <p className="text-info">{infoMsg}</p>}
      {successMsg && <p className="text-success">{successMsg}</p>} */}
    </Fragment>
  );
};

export default TextInputComp;
