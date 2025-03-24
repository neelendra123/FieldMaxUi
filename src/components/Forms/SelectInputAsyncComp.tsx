import { Fragment, useState } from 'react';
import { MenuPlacement } from 'react-select';
import AsyncSelect from 'react-select/async';

import { ICommonResponse, IOption } from '../../interfaces';

import { makeGetRequest } from '../../utils/axios';

export interface ListResData extends ICommonResponse {
  data: {
    count: number;
    // list: { id: string; name: string }[];
    list: any[];
  };
}

function SelectInputAsyncComp({
  url,
  label,
  name,
  onChange,
  isMulti = false,
  errorMsg,
  placeholder,
  defaultValue,

  optionGenerator,

  menuPlacement = 'auto',
}: {
  url: string;
  label: string;
  name: string;
  onChange: any;
  isMulti?: boolean;
  errorMsg?: string;
  placeholder?: string;
  defaultValue?: any;

  optionGenerator: (data: any) => IOption;

  menuPlacement?: MenuPlacement;
}) {
  const [query, setQuery] = useState('');
  const [value, setValue] = useState(defaultValue);

  const loadOptions = () => {
    return makeGetRequest(url, { search: query }).then((res) => {
      const results: ListResData = res.data;

      let options: IOption[] = results.data.list.map((result) => {
        const option: IOption = optionGenerator(result);

        if (result.id === value?.value) {
          setValue(option);
        }
        return option;
      });
      // setValue(options);

      return options;
    });
  };

  return (
    <Fragment>
      {label && <label htmlFor={name}>{label}</label>}
      <AsyncSelect
        cacheOptions
        defaultOptions
        styles={{control: (provided) => (
          {...provided, backgroundColor: '#F8F8F8', border: 'none'}
        )}}
        loadOptions={loadOptions}
        onInputChange={(value) => setQuery(value)}
        onChange={(value) => {
          onChange(value);
          setValue(value);
        }}
        isMulti={isMulti}
        placeholder={placeholder}
        value={value}
        menuPlacement={menuPlacement}
      />
      {errorMsg && (
        <p className="text-danger">
          <small>{errorMsg}</small>
        </p>
      )}
    </Fragment>
  );
}

export default SelectInputAsyncComp;
