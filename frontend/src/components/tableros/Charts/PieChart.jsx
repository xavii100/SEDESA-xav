import React, { useLayoutEffect } from 'react'
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

const PieChart = ({ id_chart, textTitle, dataChart, categoryField, valueField }) => {
  const chartID = id_chart;

  useLayoutEffect(() => {

    //Create chart
    let root = am5.Root.new(chartID);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        radius: am5.percent(60)
      })
    );

    //Create title
    chart.children.unshift(am5.Label.new(root, {
      text: textTitle,
      fontSize: 20,
      textAlign: "center",
      x: am5.percent(50),
      y: am5.percent(5),
      centerX: am5.percent(50),
      paddingTop: 2,
      paddingBottom: 15
    }));

    //Add series
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        valueField,
        categoryField,
        alignLabels: false
      })
    );

    series.labels.template.setAll({
      text: "[bold]{valuePercentTotal.formatNumber('#.0')}%[/]",
      inside: true,
      radius: 40,
      centerX: am5.percent(100),
      fill: am5.color(0xf3f3f3)
    });

    series.ticks.template.set("visible", false);

    series.data.setAll(dataChart);

    //Add legend
    let legend = chart.children.push(am5.Legend.new(root,{
      x: am5.percent(65),
      y: am5.percent(50),
      centerY: am5.percent(50),
      layout: root.verticalLayout
    }));

    legend.data.setAll(series.dataItems);
    legend.valueLabels.template.set("forceHidden", true);
    series.appear(1000, 100);

  });

  return (
    <></>
  )
}

export default PieChart;