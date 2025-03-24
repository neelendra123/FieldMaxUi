import { Fragment, FunctionComponent } from 'react';

type RadioCompProps = {
  name: string;
  id?: string;

  value?: string;
  value1: string;
  value2: string;

  label: string;
  label1: string;
  label2: string;

  onChange: (val: any) => void;

  errorMsg?: string;
};

const RadioComp: FunctionComponent<RadioCompProps> = ({
  name,
  id,

  value,
  value1,
  value2,

  label,
  label1,
  label2,

  onChange,
}) => {
  return (
    <Fragment>
      <label>{label}</label>
      <div className="radio">
        <label>
          <input
            type="radio"
            name={name}
            id={id || name}
            value={value1}
            checked={value === value1}
            onChange={() => {
              onChange(value1);
              return;
            }}
          />
          {label1}
        </label>
        {'   '}
        <label>
          <input
            type="radio"
            name={name}
            id={id || name}
            value={value2}
            checked={value === value2}
            onChange={() => {
              onChange(value2);
              return;
            }}
          />
          {label2}
        </label>
      </div>
    </Fragment>
  );
};

export default RadioComp;
