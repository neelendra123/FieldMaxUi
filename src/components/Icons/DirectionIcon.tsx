const DirectionIcon = ({
  width = 32,
  height = 32,

  className = '',
}: {
  width?: number;
  height?: number;

  className?: string;
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M31.525 14.868L17.125 0.468C16.501 -0.156 15.4849 -0.156 14.869 0.468L0.468976 14.868C-0.155023 15.492 -0.155023 16.508 0.468976 17.132L14.869 31.524V31.532C15.493 32.156 16.509 32.156 17.133 31.532L31.533 17.132C32.1569 16.5 32.1569 15.492 31.525 14.868ZM19.1969 17.5344V15.1755H12.7969V20.796H11.2379V15.2165C11.2379 14.3285 11.9499 13.6166 12.8379 13.6166H19.1969V11.2575L22.3354 14.396L19.1969 17.5344Z"
        fill="#0F81C0"
      />
    </svg>
  );
};

export default DirectionIcon;
