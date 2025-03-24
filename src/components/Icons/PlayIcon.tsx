interface PlayIconProps {
  width?: number;
  height?: number;
  title?: string;
}

export default function PlayIcon({
  width = 34,
  height = 35,
  title = '',
}: PlayIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!!title && <title id="unique-id">{title}</title>}

      <g clipPath="url(#clip0_7624_3920)">
        <path
          d="M11.6874 25.9796C11.5038 25.9796 11.3201 25.9319 11.1562 25.8375C10.8273 25.6477 10.625 25.2969 10.625 24.9171V10.23C10.625 9.8502 10.8273 9.50055 11.1552 9.31069C11.4841 9.12083 11.8888 9.1177 12.2177 9.30967L24.9677 16.6496C25.2966 16.8384 25.5 17.1902 25.5 17.57C25.5 17.9498 25.2977 18.3004 24.9677 18.4904L12.2177 25.8376C12.0537 25.932 11.87 25.9796 11.6874 25.9796ZM12.7499 12.0675V23.0785L22.3083 17.5699C22.3082 17.5699 12.7499 12.0675 12.7499 12.0675Z"
          fill="white"
        />
        <path
          d="M17 34.668C7.62635 34.668 0 27.0416 0 17.6679C0 8.29425 7.62635 0.667969 17 0.667969C26.3737 0.667969 34.0001 8.29432 34.0001 17.668C34.0001 27.0417 26.3736 34.668 17 34.668ZM17 2.79297C8.79786 2.79297 2.125 9.46576 2.125 17.668C2.125 25.8702 8.79779 32.543 17 32.543C25.2023 32.543 31.875 25.8702 31.875 17.668C31.875 9.46583 25.2022 2.79297 17 2.79297Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_7624_3920">
          <rect
            width="34"
            height="34"
            fill="white"
            transform="translate(0 0.667969)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
