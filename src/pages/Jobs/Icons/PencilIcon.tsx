const PencilIcon = (props: any) => {
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
      <g clipPath="url(#clip0_6014_15842)">
        <path
          d="M11.0024 23.1999H8.8V20.9974L17.8369 11.9605L20.0393 14.1629L11.0024 23.1999Z"
          stroke="#4FD34E"
          strokeWidth="1.6"
        />
        <path
          d="M19.9107 9.88693L20.9719 8.82572C21.0062 8.79143 21.0642 8.79143 21.0985 8.82572L21.0985 8.82573L23.1743 10.9015C23.1743 10.9016 23.1743 10.9016 23.1743 10.9016C23.2086 10.9358 23.2086 10.9938 23.1743 11.0281L23.1743 11.0281L22.1131 12.0893L19.9107 9.88693Z"
          stroke="var(--primary)"
          strokeWidth="1.6"
        />
      </g>
      <defs>
        <clipPath id="clip0_6014_15842">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(8 8)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PencilIcon;
