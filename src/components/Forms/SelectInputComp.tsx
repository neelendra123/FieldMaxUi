import { Fragment } from 'react';
import Select, { MenuPlacement } from 'react-select';

import { IOption } from '../../interfaces';

function SelectInputComp({
  className = 'bg-light',
  name,
  options,
  isDisabled = false,
  isSearchable = false,
  onChange = () => {},
  label,
  labelClassName,
  value,
  isMulti = false, //TODO Multiple is not tested at the moment
  placeholder,
  errorMsg,
  styles,
  menuPlacement = 'auto',
  components,
  onInputChange
}: {
  className?: string;
  name: string;
  value: any;
  options: IOption[];
  isDisabled?: boolean;
  isSearchable?: boolean;
  onChange?: any;
  label?: string;
  labelClassName?: string;
  isMulti?: boolean;
  placeholder?: string;
  errorMsg?: string;
  components?: any;
  menuPlacement?: MenuPlacement;
  styles?: any;
  onInputChange?: (value: string) => void;
}) {
  return (
    <Fragment>
      {!!label && (
        <label htmlFor={name} className={'font-weight-bold ' + labelClassName}>
          {label}
        </label>
      )}
      <Select
        className={className}
        options={options}
        isDisabled={isDisabled}
        isSearchable={isSearchable}
        onChange={onChange}
        value={value}
        onInputChange={onInputChange}
        isMulti={isMulti}
        placeholder={placeholder}
        required
        components={components}
        // styles added for gray background
        styles={{
          control: (provided) => ({
            ...provided,
            backgroundColor: '#f8f8f8',
            border: 'none',
          }),
          ...styles
        }}
        menuPlacement={menuPlacement}
      />
      {!!errorMsg && (
        <p className="text-danger">
          <small>{errorMsg}</small>
        </p>
      )}
    </Fragment>
  );
}

export default SelectInputComp;
