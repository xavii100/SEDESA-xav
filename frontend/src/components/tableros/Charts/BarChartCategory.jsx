import React, { useLayoutEffect } from 'react'
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';



const BarChartCategory = ({id_chart, valueYField, categoryField, dataChart}) => {
  const chartID = id_chart;

  useLayoutEffect(() => {
    let root = am5.Root.new(chartID);

  root.setThemes([
    am5themes_Animated.new(root)
  ]);


  let chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: true,
    wheelX: "panX",
    wheelY: "zoomX",
    pinchZoomX:true
  }));

  // Add cursor
  let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineY.set("visible", false);


  // Create axes
  let xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
  xRenderer.labels.template.setAll({
    centerY: am5.p50,
    centerX: am5.p100,
    paddingRight: 15
  });

  let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
    maxDeviation: 0.3,
    categoryField,
    renderer: xRenderer,
    tooltip: am5.Tooltip.new(root, {})
  }));

  let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0.3,
    renderer: am5xy.AxisRendererY.new(root, {})
  }));


  // Create series
  let series = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "Series 1",
    xAxis: xAxis,
    yAxis: yAxis,
    valueYField,
    sequencedInterpolation: true,
    categoryXField: categoryField,
    tooltip: am5.Tooltip.new(root, {
      labelText:"{valueY}"
    })
  }));

  series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
  series.columns.template.adapters.add("fill", function(fill, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  series.columns.template.adapters.add("stroke", function(stroke, target) {
    return chart.get("colors").getIndex(series.columns.indexOf(target));
  });

  xAxis.data.setAll(dataChart);
  series.data.setAll(dataChart);

  series.appear(1000);
  chart.appear(1000, 100);

  });

  return (
    <div></div>
  )
}

export default BarChartCategory