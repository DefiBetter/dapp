import "./Detail.css";

const Detail = (props) => {
  let sampleBins = [
    { start: 5, end: 4.5 },
    { start: 4.5, end: 4 },
    { start: 4, end: 3.5 },
    { start: 3.5, end: 3 },
    { start: 3, end: 2.5 },
    { start: 2.5, end: 2 },
    { start: 2, end: 1.5 },
  ];
  return (
    <>
      <div className="bin-container">
        {sampleBins.map((bin) => {
          return (
            <div className="bin">
              <text className="bin-start">{bin.start}</text>
              <input type="number" placeholder="0" id="" />
            </div>
          );
        })}
      </div>
      <div className="tool-container">
        <div className="tool-button" id="student-t-distribution"></div>
        <div className="tool-button" id="copy"></div>
        <div className="statistic"></div>
      </div>
    </>
  );
};

export default Detail;
