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
  fps,
  dataPoints,
}: {
  fps: number;
  dataPoints: AnalyticGraphDataPoint[];
}): JSX.Element | null {
  if (dataPoints.length === 0) return <div>No datya points</div>;
  const maxFrame = dataPoints[dataPoints.length - 1].frame;
  const intervalInSeconds = 60;
  const intervalInFrames = fps * intervalInSeconds;
  const ticks = new Array(Math.ceil(maxFrame / intervalInFrames))
    .fill(null)
    .map((_, i) => i * intervalInFrames);
  const tickFormatter = (value: number) => `${Math.round(value / fps)}s`;
  const labels = Object.keys(dataPoints[0].data);
  const rechartData = dataPoints.map(({ frame, data }) => ({ frame, ...data }));
  return (
    <LineChart width={820} height={120} data={rechartData}>
      <XAxis
        dataKey="frame"
        type="number"
        ticks={ticks}
        tickFormatter={tickFormatter}
      />
      <YAxis />
      {labels.map((label, i) => (
        <Line type="monotone" dataKey={label} stroke={colours[i]} key={label} />
      ))}
    </LineChart>
  );
}
