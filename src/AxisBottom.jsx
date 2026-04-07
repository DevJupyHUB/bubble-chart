import * as d3 from "d3";

const TICK_LENGTH = 4;

export const AxisBottom = ({ xScale, boundsHeight, label }) => {
  const range = xScale.range();
  const width = range[1] - range[0];

  const ticks = [0, 300, 1095, 2500, 5000, 10000, 20000, 30000, 40000, 50000];

  const format = (value) => {
    if (value === 0) return "$0";
    if (value < 1000) return d3.format("$,.0f")(value);
    return d3.format("$.2s")(value).replace(".0", "");
  };

  return (
    <>
      {/* Main axis line */}
      <line x1={range[0]} y1={0} x2={range[1]} y2={0} stroke="currentColor" />

      {/* Ticks and gridlines */}
      {ticks.map((value) => {
        const x = value === 0 ? range[0] : xScale(value);
        const isSpecial = value === 1095;

        return (
          <g key={value} transform={`translate(${x}, 0)`}>
            {/* Gridline */}
            <line
              y1={0}
              y2={-boundsHeight}
              stroke={isSpecial ? "#D10C15" : "currentColor"}
              opacity={isSpecial ? 0.7 : 0.3}
              strokeWidth={isSpecial ? 1.5 : 1}
              strokeDasharray="1 3" // dashed lines
              strokeLinecap="round" // makes each dash a dot
            />

            {/* Ticks */}
            <line y2={TICK_LENGTH} stroke="currentColor" />

            {/* Tick labels */}
            <text
              style={{
                fontSize: "12px",
                textAnchor: "middle",
                transform: "translateY(20px)",
              }}
            >
              {format(value)}
            </text>
          </g>
        );
      })}

      {/* Annotation*/}
      <text
        x={xScale(1095) - 65}
        y={-400}
        fill="#D10C15"
        opacity={0.7}
        textAnchor="start"
        fontSize={12}
      >
        Poverty line
      </text>

      {/* Axis title */}
      {label && (
        <text x={width / 2} y={45} fontSize={14} textAnchor="middle">
          {label}
        </text>
      )}
    </>
  );
};
