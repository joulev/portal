import React from "react";
import { LineChart, Line, XAxis, YAxis } from "recharts";

export interface AnalyticGraphDataPoint {
  frame: number;
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
  const labels = Object.keys(dataPoints[0].data);
  const rechartData = dataPoints.map(({ frame, data }) => ({ frame, ...data }));
  return (
    <LineChart width={820} height={120} data={rechartData}>
      <XAxis dataKey="frame" />
      <YAxis />
      {labels.map((label, i) => (
        <Line type="monotone" dataKey={label} stroke={colours[i]} key={label} />
      ))}
    </LineChart>
  );
}
