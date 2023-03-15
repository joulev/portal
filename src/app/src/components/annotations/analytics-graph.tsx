import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export interface AnalyticGraphDataPoint {
  ms: number;
  data: {
    [tag: string]: number;
  };
}

const colours = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
  "grey",
];

export default function AnalyticsGraph({
  dataPoints,
}: {
  dataPoints: AnalyticGraphDataPoint[];
}): JSX.Element | null {
  if (dataPoints.length === 0) return <div>No datya points</div>;
  const length = dataPoints[dataPoints.length - 1].ms / 1000;
  const intervalInSeconds = 1;
  const ticks = new Array(Math.ceil(length / intervalInSeconds))
    .fill(null)
    .map((_, i) => i * intervalInSeconds * 1000);
  const tickFormatter = (ms: number) => `${Math.round(ms / 1000)}s`;
  const labels = Object.keys(dataPoints[0].data);
  const rechartData = dataPoints.map(({ ms, data }) => ({ ms, ...data }));
  const getDataDescription = (ms: number) => {
    const data = dataPoints.find(d => d.ms === ms)?.data;
    if (!data) return null;
    return Object.entries(data)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };
  return (
    <LineChart width={820} height={120} data={rechartData}>
      <XAxis
        dataKey="ms"
        type="number"
        ticks={ticks}
        tickFormatter={tickFormatter}
      />
      <YAxis />
      <Tooltip
        content={({ label: ms }) => <div>{getDataDescription(ms)}</div>}
      />
      {labels.map((label, i) => (
        <Line type="monotone" dataKey={label} stroke={colours[i]} key={label} />
      ))}
    </LineChart>
  );
}
