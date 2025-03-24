interface DocIconProps {
  width?: number;
  height?: number;
  title?: string;
}

export default function DocIcon({
  width = 88,
  height = 88,
  title = '',
}: DocIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {!!title && <title id="unique-id">{title}</title>}

      <rect width={width} height={height} rx="3.68722" fill="#F9F9F9" />
      <path
        d="M63.7968 31.5893L53.0268 28.5122L49.9496 17.7422H28.4097C25.8604 17.7422 23.7939 19.8087 23.7939 22.3579V65.643C23.7939 68.1922 25.8604 70.2587 28.4097 70.2587H59.181C61.7303 70.2587 63.7968 68.1922 63.7968 65.643V31.5893Z"
        fill="var(--primary)"
      />
      <path
        d="M63.7963 31.5893V65.643C63.7963 68.1922 61.7298 70.2587 59.1806 70.2587H43.7949V17.7422H49.9492L53.0263 28.5122L63.7963 31.5893Z"
        fill="var(--primary)"
      />
      <path
        d="M63.7973 31.5893H53.0273C51.3349 31.5893 49.9502 30.2046 49.9502 28.5122V17.7422C50.3502 17.7422 50.7503 17.896 51.0271 18.2039L63.3357 30.5124C63.6435 30.7893 63.7973 31.1893 63.7973 31.5893Z"
        fill="var(--primary)"
      />
      <path
        d="M53.0268 42.4619H34.564C33.7135 42.4619 33.0254 41.7738 33.0254 40.9233C33.0254 40.0729 33.7135 39.3848 34.564 39.3848H53.0268C53.8772 39.3848 54.5654 40.0729 54.5654 40.9233C54.5654 41.7738 53.8772 42.4619 53.0268 42.4619Z"
        fill="#FFF5F5"
      />
      <path
        d="M53.0268 48.6162H34.564C33.7135 48.6162 33.0254 47.928 33.0254 47.0776C33.0254 46.2272 33.7135 45.5391 34.564 45.5391H53.0268C53.8772 45.5391 54.5654 46.2272 54.5654 47.0776C54.5654 47.928 53.8772 48.6162 53.0268 48.6162Z"
        fill="#FFF5F5"
      />
      <path
        d="M53.0268 54.7705H34.564C33.7135 54.7705 33.0254 54.0823 33.0254 53.2319C33.0254 52.3815 33.7135 51.6934 34.564 51.6934H53.0268C53.8772 51.6934 54.5654 52.3815 54.5654 53.2319C54.5654 54.0823 53.8772 54.7705 53.0268 54.7705Z"
        fill="#FFF5F5"
      />
      <path
        d="M46.8725 60.9248H34.564C33.7135 60.9248 33.0254 60.2366 33.0254 59.3862C33.0254 58.5358 33.7135 57.8477 34.564 57.8477H46.8725C47.7229 57.8477 48.4111 58.5358 48.4111 59.3862C48.4111 60.2366 47.7229 60.9248 46.8725 60.9248Z"
        fill="#FFF5F5"
      />
      <path
        d="M43.7949 60.9248H46.8721C47.7225 60.9248 48.4106 60.2366 48.4106 59.3862C48.4106 58.5358 47.7225 57.8477 46.8721 57.8477H43.7949V60.9248Z"
        fill="#E3E7EA"
      />
      <path
        d="M43.7949 54.7705H53.0263C53.8768 54.7705 54.5649 54.0823 54.5649 53.2319C54.5649 52.3815 53.8768 51.6934 53.0263 51.6934H43.7949V54.7705Z"
        fill="#E3E7EA"
      />
      <path
        d="M43.7949 48.6162H53.0263C53.8768 48.6162 54.5649 47.928 54.5649 47.0776C54.5649 46.2272 53.8768 45.5391 53.0263 45.5391H43.7949V48.6162Z"
        fill="#E3E7EA"
      />
      <path
        d="M43.7949 42.4619H53.0263C53.8768 42.4619 54.5649 41.7738 54.5649 40.9233C54.5649 40.0729 53.8768 39.3848 53.0263 39.3848H43.7949V42.4619Z"
        fill="#E3E7EA"
      />
    </svg>
  );
}
