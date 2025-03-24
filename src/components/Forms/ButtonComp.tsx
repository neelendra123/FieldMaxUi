import { FunctionComponent } from 'react';
import { FaSpinner } from 'react-icons/fa';

type ButtonCompProps = {
  text: string;
  onClick?: (val: any) => void;
  type?: 'button' | 'submit';

  title?: string;
  className?: string;

  icon?: string;

  disabled?: boolean;
  loading?: boolean;
  tabIndex?: number | undefined;
};

const ButtonComp: FunctionComponent<ButtonCompProps> = ({
  type = 'button',
  onClick,
  className = 'btn btn-primary',
  disabled = false,
  loading = false,
  text,

  title,
  icon,

  tabIndex = undefined,
}) => {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
      title={title}
      tabIndex={tabIndex}
    >
      {loading && <FaSpinner className="spinner" />}{' '}
      {!!icon && <i className={icon} />} {text}
    </button>
  );
};

export default ButtonComp;
