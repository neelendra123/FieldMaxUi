const ShieldIcon = ({ title = '', ...others }: { title?: string  } | any) => {
  return (
    <svg
      {...others}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!!title && <title id="unique-id">{title}</title>}

      <rect
        width="24"
        height="24"
        rx="2"
        fill="var(--primary)"
        fillOpacity="0.1"
      />
      <path
        d="M17.5691 7.26696L12.2097 5.04181C12.0754 4.98608 11.9245 4.98605 11.7903 5.04181L6.43093 7.26696C6.2268 7.35172 6.09375 7.551 6.09375 7.77202V10.477C6.09375 14.2016 8.34493 17.5519 11.7933 18.9594C11.9258 19.0135 12.0742 19.0135 12.2067 18.9594C15.655 17.552 17.9062 14.2016 17.9062 10.477V7.77202C17.9062 7.551 17.7732 7.35172 17.5691 7.26696ZM16.8125 10.477C16.8125 13.6433 14.9531 16.558 12 17.8591C9.12579 16.5928 7.1875 13.7291 7.1875 10.477V8.13712L12 6.139L16.8125 8.13712V10.477ZM11.3955 12.3204L13.7461 9.96981C13.9597 9.75625 14.3059 9.75622 14.5195 9.96981C14.7331 10.1834 14.7331 10.5296 14.5195 10.7432L11.7822 13.4804C11.5686 13.6941 11.2224 13.694 11.0088 13.4804L9.48049 11.9521C9.26691 11.7385 9.26691 11.3923 9.48049 11.1787C9.69407 10.9651 10.0403 10.9651 10.2539 11.1787L11.3955 12.3204Z"
        fill="var(--primary)"
      />
    </svg>
  );
};

export default ShieldIcon;
