const TICK_LENGTH = 4;

export const AxisLeft = ({ yScale, pixelsPerTick, boundsWidth, label }) => {
  const range = yScale.range();
  const height = range[0] - range[1];
  const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

  return (
    <>
      <path
        d={["M", 0, range[0], "L", 0, range[1]].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {yScale.ticks(numberOfTicksTarget).map((value) => (
        <g key={value} transform={`translate(0, ${yScale(value)})`}>
          {/* Grid lines */}
          <line
            x1={0}
            x2={boundsWidth}
            stroke="currentColor"
            opacity={0.3}
            strokeDasharray="1 3" // dotted line
            strokeLinecap="round"
          />
          {/* Ticks */}
          <line x2={-TICK_LENGTH} stroke="currentColor" />
          <text
            style={{
              fontSize: "12px",
              textAnchor: "middle",
              transform: "translateX(-20px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
      {/* Axis title */}
      {label && (
        <text
          x={-height / 2}
          y={-45}
          fontSize={14}
          textAnchor="middle"
          transform="rotate(-90)"
        >
          {label}
        </text>
      )}
    </>
  );
};
