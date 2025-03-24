export default function PhotoGrid() {
  return (
    <table
      className="table table-bordered"
      style={{
        display: 'table',
        position: 'absolute',
        left: '0%',
        width: '100%',
        height: '100%',
        top: '0%',
      }}
    >
      <tbody>
        {[0, 1, 2].map((key) => {
          return (
            <tr key={key}>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
