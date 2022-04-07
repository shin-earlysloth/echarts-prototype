import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import useStore from "./store";

interface IMyChartProps {
  index: number;
}

const MyChart = ({ index }: IMyChartProps) => {
  const setEchartRef = useStore((state) => state.setEchartRef);

  const dom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (dom.current) {
      const chartRef: echarts.ECharts = echarts.init(dom.current);
      setEchartRef(chartRef, index);
    }

    return () => {
      // remove dom
    };
  }, [dom]);

  return (
    <div
      ref={dom}
      style={{
        width: 300,
        height: 300,
      }}
    ></div>
  );
};

export default MyChart;
