import data from "./data";
import * as d3 from "d3";
import { AxisBottom } from "./AxisBottom";
import { AxisLeft } from "./AxisLeft";

// Chart dimensions
const width = 800;
const height = 600;
const margin = { top: 80, right: 20, bottom: 60, left: 80 };

export default function BubbleChart() {
  const boundsWidth = width - margin.left - margin.right;
  const boundsHeight = height - margin.top - margin.bottom;

  // Number & percentage of countries below 1095 GDP per capita
  const threshold = 1095;
  const totalCountries = data.length;
  const belowThreshold = data.filter((d) => d.gdpPercap < threshold).length;
  const percentage = ((belowThreshold / totalCountries) * 100).toFixed(1);

  const title = `${belowThreshold} countries (${percentage}%) have GDP per Capita below $${threshold}`;
  const subtitle = "Bubble area is proportional to population";

  // Sort data in descending order
  const sortedData = [...data].sort((a, b) => b.pop - a.pop);

  // Scales
  const xScale = d3
    .scaleSymlog()
    .constant(300)
    .domain([0, d3.max(data, (d) => d.gdpPercap) + 5000])
    .range([0, boundsWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.lifeExp) + 10])
    .range([boundsHeight, 0]);

  const min_size = 2;
  const max_size = 40;

  const sizeScale = d3
    .scaleSqrt()
    .domain([0, d3.max(data, (d) => d.pop)])
    .range([min_size, max_size]);

  const groups = Array.from(d3.group(data, (d) => d.continent).keys());
  const colorScale = d3
    .scaleOrdinal()
    .domain(groups)
    .range(["#d9381b", "#567dbc", "#7dab23", "#3da4c8", "#f2b000"]);

  // Chart
  return (
    <svg width={width} height={height}>
      {/* Chart title */}
      <text
        x={width / 2}
        y={margin.top - 60}
        fontSize={24}
        fontWeight="bold"
        textAnchor="middle"
        opacity={0.8}
      >
        {title}
      </text>
      {/* Subtitle */}
      <text
        x={width / 2}
        y={margin.top - 40}
        fontSize={18}
        fontWeight="bold"
        textAnchor="middle"
        opacity={0.8}
      >
        {subtitle}
      </text>
      {/* Continents */}
      <text
        x={width / 2}
        y={margin.top - 10}
        fontSize={18}
        fontWeight="bold"
        textAnchor="middle"
      >
        {groups.map((continent, i) => (
          <tspan key={continent} fill={colorScale(continent)}>
            {continent}
            {i < groups.length - 1 && (
              <tspan fill="#ccc"> • </tspan> // black dot separator
            )}
          </tspan>
        ))}
      </text>
      <rect width={width} height={height} fill="none" />
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <rect width={boundsWidth} height={boundsHeight} fill="#FEFAF1" />
        {/* Bubbles */}
        {sortedData.map((d, i) => (
          <circle
            key={i}
            cx={xScale(d.gdpPercap)}
            cy={yScale(d.lifeExp)}
            r={sizeScale(d.pop)}
            fill={colorScale(d.continent)}
            opacity={0.7}
            stroke="black"
          />
        ))}

        {/* X axis */}
        <g transform={`translate(0, ${boundsHeight})`}>
          <AxisBottom
            xScale={xScale}
            boundsHeight={boundsHeight}
            label="GDP per Capita"
          />
        </g>

        {/* Y axis */}
        <AxisLeft
          yScale={yScale}
          pixelsPerTick={40}
          boundsWidth={boundsWidth}
          label="Life Expectancy"
        />
      </g>
    </svg>
  );
}
