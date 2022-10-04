import React, { useLayoutEffect } from 'react'
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const BarSeriesChart = ({ id_chart }) => {

  const chartID = id_chart;

  useLayoutEffect(()=> {

    //DATA
    let data = [{
      category: "Research",
      value1: 1000,
      value2: 588
    },
    {
      category: "Marketing",
      value1: 1200,
      value2: 1800
    },
    {
      category: "Sales",
      value1: 850,
      value2: 1230
    }];


    //Create chart
    let root = am5.Root.new(chartID);

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {})
    );

    //Add axes
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation:0.2,
        renderer: am5xy.AxisRendererX.new(root, {}),
        categoryField: "category"
      })
    );
    xAxis.data.setAll(data);

    //Add Series
    const series1 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series",
        xAxis,
        yAxis,
        valueYField: "value1",
        categoryXField: "category"
      })
    );
    series1.data.setAll(data);

    const series2 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 2",
        xAxis,
        yAxis,
        valueYField: "value2",
        categoryXField: "category"
      })
    );
    series2.data.setAll(data);

    // Add legend
    const legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}));

  });

  return (
    <>
    </>
  )
}

export default BarSeriesChart