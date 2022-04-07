import create from "zustand";
import { combine } from "zustand/middleware";
import * as echarts from "echarts";
import throttle from "lodash/throttle";

interface BearState {
  echartRefs: echarts.ECharts[];
  setEchartRef: (ref: echarts.ECharts, index: number) => void;
  setEchartOptions: (payload: any) => void;
  addEventListener: (ref: echarts.ECharts) => (eventName: string) => void;
  lastDataIndex: number | null;
  setLastDataIndex: (payload: number | null) => void;

  lastDataZoom: {
    start: number | null;
    end: number | null;
  };
  setLastDataZoom: (payload: { start: number; end: number }) => void;
}

const useStore = create<BearState>((set, get) => ({
  echartRefs: [],
  lastDataIndex: null,
  lastDataZoom: {
    start: null,
    end: null,
  },
  setEchartRef: (ref: echarts.ECharts, index: number) => {
    set((state) => {
      state.echartRefs[index] = ref;
    });
  },
  setLastDataZoom: (payload) => {
    set((state) => {
      state.lastDataZoom = payload;
    });
  },
  setEchartOptions: (payload: any) => {
    const { echartRefs, addEventListener } = get();
    echartRefs[0].setOption(fakeOption1);
    addEventListener(echartRefs[0])("updateAxisPointer");
    addEventListener(echartRefs[0])("datazoom");

    echartRefs[1].setOption(fakeOption2);
    addEventListener(echartRefs[1])("updateAxisPointer");
    addEventListener(echartRefs[1])("datazoom");

    echartRefs[2].setOption(fakeOption3);
    addEventListener(echartRefs[2])("updateAxisPointer");
    addEventListener(echartRefs[2])("datazoom");
  },
  setLastDataIndex: (payload: number | null) => {
    set((state) => {
      state.lastDataIndex = payload;
    });
  },
  addEventListener: (ref: echarts.ECharts) => (eventName: string) => {
    if (eventName === "datazoom") {
      const callbackFn = throttle((event) => {
        const start = Math.floor(event.start);
        const end = Math.floor(event.end);

        console.log("event:", event);
        const { echartRefs, lastDataZoom, setLastDataZoom } = get();

        if (lastDataZoom.start === start && lastDataZoom.end === end) return;

        echartRefs.forEach((ecahrtRef) => {
          ecahrtRef.dispatchAction({
            type: "dataZoom",
            start,
            end,
          });
        });

        setLastDataZoom({ start, end });
      }, 50);

      ref.on("datazoom", (event) => {
        callbackFn(event);
      });
    }

    if (eventName === "updateAxisPointer") {
      const callbackFn = throttle((event) => {
        const index: number = event.dataIndex;
        const { echartRefs, lastDataIndex, setLastDataIndex } = get();

        if (lastDataIndex === event.dataIndex) return;
        if (event.dataIndex === undefined) {
          echartRefs.forEach((ecahrtRef) => {
            ecahrtRef.dispatchAction({
              type: "hideTip",
            });
          });
          setLastDataIndex(null);
          return;
        }

        echartRefs.forEach((ecahrtRef) => {
          ecahrtRef.dispatchAction({
            type: "showTip",
            seriesIndex: 0,
            dataIndex: index,
          });
        });
        setLastDataIndex(index);
      }, 25);

      ref.on("updateAxisPointer", (event) => {
        callbackFn(event);
      });
    }
  },
}));

export default useStore;

const legend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const fakeOption1 = {
  xAxis: {
    type: "category",
    data: legend,
  },
  tooltip: {
    trigger: "axis",
  },
  yAxis: {
    type: "value",
  },
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 10,
    },
    {
      start: 0,
      end: 10,
    },
  ],
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: "line",
      smooth: true,
    },
    {
      data: [720, 532, 1101, 834, 1190, 1730, 820],
      type: "line",
      smooth: true,
    },
  ],
};

const fakeOption2 = {
  xAxis: {
    type: "category",
    data: legend,
  },
  tooltip: {
    trigger: "axis",
  },
  yAxis: {
    type: "value",
  },
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 10,
    },
    {
      start: 0,
      end: 10,
    },
  ],
  series: [
    {
      data: Array.from({ length: 7 })
        .fill("")
        .map(() => rand(500, 1000)),
      type: "line",
      smooth: true,
    },
    {
      data: Array.from({ length: 7 })
        .fill("")
        .map(() => rand(500, 1000)),
      type: "line",
      smooth: true,
    },
  ],
};

const fakeOption3 = {
  xAxis: {
    type: "category",
    data: legend,
  },
  tooltip: {
    trigger: "axis",
  },
  yAxis: {
    type: "value",
  },
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 10,
    },
    {
      start: 0,
      end: 10,
    },
  ],
  series: [
    {
      data: Array.from({ length: 7 })
        .fill("")
        .map(() => rand(500, 1000)),
      type: "line",
      smooth: true,
    },
    {
      data: Array.from({ length: 7 })
        .fill("")
        .map(() => rand(500, 1000)),
      type: "line",
      smooth: true,
    },
  ],
};
