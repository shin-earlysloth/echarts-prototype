import React from "react";

export interface EchartOnClickParams {
  componentType: string;
  componentSubType: string;
  componentIndex: number;
  seriesType: string;
  seriesIndex: number;
  seriesId: string;
  seriesName: string;
  name: string;
  dataIndex: number;
  data: number;
  value: number;
  color: string;
  dimensionNames: string[];
  encode: { x: number[]; y: number[] };
  $vars: string[];
  type: string;
}
