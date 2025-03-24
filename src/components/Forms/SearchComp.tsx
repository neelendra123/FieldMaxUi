import { IoIosSearch } from 'react-icons/io';

interface SearchCompProps {
  search: string;
  setSearch: (search: string) => void;

  className?: string;
  placeholder?: string;

  disabled?: boolean;

  onClick?: () => {};
}

export default function SearchComp({
  search,
  setSearch,

  className = '',
  placeholder = 'Search',

  disabled = false,

  onClick,
}: SearchCompProps) {
  return (
    <div className={'input-group mb-3 ' + className}>
      <div className="input-group-prepend">
        <span className="input-group-text border-0" id="basic-addon1">
          <IoIosSearch
            fontSize={24}
            onClick={() => {
              if (onClick) {
                onClick();
              }
            }}
          />
        </span>
      </div>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        aria-label={placeholder}
        aria-describedby="basic-addon1"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        disabled={disabled}
      />
    </div>
  );
}
