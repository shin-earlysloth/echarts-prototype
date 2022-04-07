import React, { useEffect } from "react";
import "./App.css";
import MyChart from "./chart";
import useStore from "./store";

function App() {
  const { setEchartOptions } = useStore((state) => ({
    setEchartOptions: state.setEchartOptions,
  }));

  return (
    <div className="App">
      <button onClick={() => setEchartOptions(null)}>
        어떤 트리거 (네트워크 요청)을 통해 값을 세팅한다.
      </button>
      {Array.from({ length: 3 })
        .fill("")
        .map((_, index) => (
          <MyChart index={index} />
        ))}
    </div>
  );
}

export default App;
