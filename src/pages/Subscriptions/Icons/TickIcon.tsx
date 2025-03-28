export const TickIcon = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0.184615 6.6C0.0615385 6.48 0 6.3 0 6.18C0 6.06 0.0615385 5.88 0.184615 5.76L1.04615 4.92C1.29231 4.68 1.66154 4.68 1.90769 4.92L1.96923 4.98L5.35385 8.52C5.47692 8.64 5.66154 8.64 5.78462 8.52L14.0308 0.18H14.0923C14.3385 -0.06 14.7077 -0.06 14.9538 0.18L15.8154 1.02C16.0615 1.26 16.0615 1.62 15.8154 1.86L5.96923 11.82C5.84615 11.94 5.72308 12 5.53846 12C5.35385 12 5.23077 11.94 5.10769 11.82L0.307692 6.78L0.184615 6.6Z"
        fill="var(--primary)"
      />
    </svg>
  );
};

export default TickIcon;
