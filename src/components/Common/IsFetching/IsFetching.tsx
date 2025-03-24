import './IsFetching.css';

export default function IsFetching() {
  const backgroundColor = {
    background: 'rgba(0,0,0,0.3)',
  };
  const loaderColor = {
    background: 'var(--primary)', // '#3498db',
  };

  return (
    <div className="loading-background" style={backgroundColor}>
      <div className="loading-bar">
        <div className="loading-circle-1" style={loaderColor} />
        <div className="loading-circle-2" style={loaderColor} />
      </div>
    </div>
  );
}
