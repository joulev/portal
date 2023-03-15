import React, { useCallback, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export interface AnalyticGraphDataPoint {
  ms: number;
  data: {
    [tag: string]: number;
  };
}

interface AnalyticsGraphProps {
  dataPoints: AnalyticGraphDataPoint[];
  onSelectTimeInSeconds: (timeInSeconds: number) => void;
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

function useRechart(dataPoints: AnalyticGraphDataPoint[]) {
  const length = dataPoints[dataPoints.length - 1].ms / 1000;
  const intervalInSeconds = 1;
  const ticks = new Array(Math.ceil(length / intervalInSeconds))
    .fill(null)
    .map((_, i) => i * intervalInSeconds * 1000);

  const tickFormatter = (ms: number) => `${Math.round(ms / 1000)}s`;

  const labels = Object.keys(dataPoints[0].data);

  const rechartData = useMemo(
    () => dataPoints.map(({ ms, data }) => ({ ms, ...data })),
    [dataPoints]
  );

  const getDataDescription = useCallback(
    (ms: number) => {
      const data = dataPoints.find(d => d.ms === ms)?.data;
      if (!data) return null;
      return Object.entries(data)
        .filter(([, value]) => value > 0)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    },
    [dataPoints]
  );
  return { ticks, tickFormatter, labels, rechartData, getDataDescription };
}

function Chart({ dataPoints, onSelectTimeInSeconds }: AnalyticsGraphProps) {
  const {
    ticks,
    tickFormatter,
    labels,
    rechartData,
    getDataDescription,
  } = useRechart(dataPoints);
  return (
    <LineChart
      width={820}
      height={120}
      data={rechartData}
      onClick={e => {
        if (typeof e.activeLabel !== "number") return;
        onSelectTimeInSeconds(e.activeLabel / 1000);
      }}
    >
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

export default function AnalyticsGraph(
  props: AnalyticsGraphProps
): JSX.Element | null {
  if (props.dataPoints.length === 0) return <div>Loading&hellip;</div>;
  return <Chart {...props} />;
}
