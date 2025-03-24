const DeleteIcon = (props: any) => {
  return (
    <svg
      {...props}
      className="cp"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="32"
        height="32"
        rx="4"
        fill="var(--primaryLight)"
        fillOpacity="0.1"
      />
      <path
        d="M20.76 11.0781L19.7399 22.7023H12.2614L11.2415 11.0781L9.94922 11.1914L10.9877 23.0264C11.0424 23.5719 11.5157 23.9996 12.0655 23.9996H19.9358C20.4854 23.9996 20.9589 23.5721 21.0145 23.0186L22.0523 11.1914L20.76 11.0781Z"
        fill="var(--primary)"
        stroke="var(--primary)"
        strokeWidth="0.4"
      />
      <path
        d="M18.3789 8H13.6221C13.026 8 12.541 8.48497 12.541 9.08109V11.1352H13.8383V9.29728H18.1626V11.1351H19.4599V9.08106C19.46 8.48497 18.975 8 18.3789 8Z"
        fill="var(--primary)"
        stroke="var(--primary)"
        strokeWidth="0.4"
      />
      <path
        d="M22.9191 10.4863H9.08127C8.72299 10.4863 8.43262 10.7767 8.43262 11.135C8.43262 11.4933 8.72299 11.7836 9.08127 11.7836H22.9191C23.2774 11.7836 23.5678 11.4933 23.5678 11.135C23.5678 10.7767 23.2774 10.4863 22.9191 10.4863Z"
        fill="var(--primary)"
        stroke="var(--primary)"
        strokeWidth="0.4"
      />
    </svg>
  );
};

export default DeleteIcon;
