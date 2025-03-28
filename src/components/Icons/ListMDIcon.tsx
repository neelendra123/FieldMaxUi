const ListMDIcon = ({ onClick }: { onClick: (val: 'md') => void }) => {
  return (
    <svg
      width="32"
      height="32"
      onClick={() => {
        onClick('md');
      }}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29 0H3C1.34312 0 0 1.34312 0 3V29C0 30.6569 1.34312 32 3 32H29C30.6569 32 32 30.6569 32 29V3C32 1.34312 30.6569 0 29 0ZM30 29C30 29.5523 29.5523 30 29 30H3C2.44769 30 2 29.5523 2 29V3C2 2.44769 2.44769 2 3 2H29C29.5523 2 30 2.44769 30 3V29Z"
        fill="black"
        fillOpacity="0.2"
      />
      <path
        d="M20.6654 16.7758C20.3462 16.4739 19.8306 16.4739 19.5114 16.7758L17.6288 18.5665L14.1175 15.2264C13.7983 14.9245 13.2827 14.9245 12.9635 15.2264L7.23405 20.6764C6.9176 20.9835 6.92267 21.4764 7.24546 21.7774C7.3956 21.9175 7.59669 21.9972 7.80699 22H24.1767C24.6288 22.0025 24.9973 21.656 25 21.2259C25.0013 21.0167 24.914 20.8159 24.7579 20.6686L20.6654 16.7758Z"
        fill="black"
        fillOpacity="0.2"
      />
      <path
        d="M18.5 15C19.8807 15 21 13.8807 21 12.5C21 11.1193 19.8807 10 18.5 10C17.1193 10 16 11.1193 16 12.5C16 13.8807 17.1193 15 18.5 15Z"
        fill="black"
        fillOpacity="0.2"
      />
    </svg>
  );
};

export default ListMDIcon;
