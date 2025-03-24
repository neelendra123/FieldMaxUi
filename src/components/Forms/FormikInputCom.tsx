import { Field, ErrorMessage } from 'formik';

type FormikInputComProps = {
  type?: 'text' | 'password' | 'email' | 'number' | 'color';
  name: string;
  className?: string;
  placeholder?: string;

  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  tabIndex?: number | undefined;

  label?: string;
  labelClassName?: string;

  autoComplete?: 'on' | 'off';
};

const FormikInputCom = ({
  type = 'text',
  name,
  className = 'form-control form-control-sm',
  placeholder,

  required = false,
  disabled = false,
  autoFocus = false,
  tabIndex = undefined,

  label,
  labelClassName,

  autoComplete = 'on',
}: FormikInputComProps) => {
  return (
    <>
      {!!label && (
        <label htmlFor={name} className={'font-weight-bold ' + labelClassName}>
          {label}
        </label>
      )}
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={className}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        autoComplete={autoComplete}
      />

      <ErrorMessage name={name} className="text-danger">
        {(error) => {
          return (
            <p className="text-danger">
              <small>{error}</small>
            </p>
          );
        }}
      </ErrorMessage>
    </>
  );
};

export default FormikInputCom;
