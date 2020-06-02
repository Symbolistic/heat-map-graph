import React, { useRef, useEffect } from 'react';
import './App.css';
import * as d3 from 'd3'

function App() {
  const svgRef = useRef();
  const legendRef = useRef();

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
      .then(response => response.json())
      .then(
        (result) => {
          renderD3(result["monthlyVariance"], svgRef, legendRef)
        }
      )

  }, [])
  return (
    <div className="container">
      <h1 id="title">Monthly Global Land-Surface Temperature</h1>
      <h3 id="description">1753 - 2015: base temperature 8.66℃</h3>
      <svg ref={svgRef}></svg>
      <svg id="legend" ref={legendRef}></svg>
    </div>
  );
}


const renderD3 = (data, svg, legend) => {
  if (data.length > 1) {

    // Set main SVG area values
    let margin = {top: 20, right: 20, bottom: 50, left: 60};
    let height = 500 - margin.top - margin.bottom;
    let width = 1200;

    // Min Max Year
    let minYear = d3.min(data, d => d["year"]);
    let maxYear = d3.max(data, d => d["year"]);

    // Min Max Month
    let minMonth = d3.min(data, d => d["month"])
    let maxMonth = d3.max(data, d => d["month"])

    // Set xScale and X-Axis
    let xScale = d3.scaleLinear()
                   .domain([minYear, maxYear])
                   .range([0, width]);

    let xAxis = d3.axisBottom(xScale).ticks(25).tickFormat(d3.format('d'));
              
    // Set yScale and Y-Axis
     const ticks = ["January", "February", "March", "April", "May", "June", 
     "July", "August", "September", "October", "November", "December"];

    let yScale = d3.scaleBand()
                   .domain([0,1,2,3,4,5,6,7,8,9,10,11])
                   .range([0, height]);

    // const ticks = {1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 
    //               7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December"};

  

    let yAxis = d3.axisLeft(yScale).tickFormat((value, index) => { return ticks[value] });



    let div = d3.select(".container").append("div")
                .attr("class", "tooltip")
                .attr("id", "tooltip")
                .style("opacity", 0)

    // Full SVG Area
    let chart = d3.select(svg.current)
                  .attr("width", width + margin.right + margin.left)
                  .attr("height", height + margin.top + margin.bottom);

            
    // Main SVG Area that will contain our information
    let main = chart.append('g')
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class", "main");


    // Render X Axis
    main.append('g')
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    // Render Y Axis
    main.append('g')
        .attr("id", "y-axis")
        .call(yAxis);


    
    main
      .selectAll('.cell')
      .data(data)
      .join("rect")
      .attr("class", "cell")
      .attr("data-month", value => value["month"]-1)
      .attr("data-year", value => value["year"])
      .attr("data-temp", value => value["variance"])
      .attr("width", width/(maxYear - minYear))
      .attr("height", height/12)
      .attr("x", value => xScale(value["year"])+1)
      .attr("y", value => yScale(value["month"]-1))
      .attr("fill", value => {
        let temperature = (value["variance"] + 8.66)
        if (temperature < 2.8) {
          return "rgb(49, 54, 149)";
        } else if (temperature < 3.9 && temperature >= 2.8) {
          return "rgb(69, 117, 180)";
        } else if (temperature < 5.0 && temperature >= 3.9) {
          return "rgb(116, 173, 209)";
        } else if (temperature < 6.1 && temperature >= 5.0) {
          return "rgb(171, 217, 233)";
        } else if (temperature < 7.2 && temperature >= 6.1) {
          return "rgb(224, 243, 248)";
        } else if (temperature < 8.3 && temperature >= 7.2) {
          return "rgb(255, 255, 191)";
        } else if (temperature < 9.5 && temperature >= 8.3) {
          return "rgb(254, 224, 144)";
        } else if (temperature < 10.6 && temperature >= 9.5) {
          return "rgb(253, 174, 97)";
        } else if (temperature < 11.7 && temperature >= 10.6) {
          return "rgb(244, 109, 67)";
        } else if (temperature < 12.8 && temperature >= 11.7) {
          return "rgb(215, 48, 39)";
        } else {
          return "rgb(165, 0, 38)";
        }
      })
      .on("mouseover", value => {
        div.style("opacity", 0.7)
        div.html(value["year"] + " - " + ticks[value["month"]-1] + "<br/>"
        + (value["variance"] + 8.66).toFixed(1) + "<br/>" + value["variance"].toFixed(1))
        .style("left", (d3.event.pageX) - 30 + "px")
        .style("top", (d3.event.pageY - 120) + "px")
        .style("display", "inline")
        .attr("data-year", value["year"])
        console.log(value)
      })
      .on("mouseleave", () => { div.style("opacity", 0).style("top", 0).style("display", "none") })


    
    // Legend

    // Set main SVG area values
    let legendMargin = {top: 20, right: 20, bottom: 50, left: 15};
    let legendHeight = 100 - legendMargin.top - legendMargin.bottom;
    let legendWidth = 300;
    let temps = ["<2.8", 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8, '12.8+'];
    let tempColors = ["rgb(49, 54, 149)", "rgb(69, 117, 180)", "rgb(116, 173, 209)", "rgb(171, 217, 233)", 
    "rgb(224, 243, 248)", "rgb(255, 255, 191)", "rgb(254, 224, 144)", "rgb(253, 174, 97)",
    "rgb(244, 109, 67)", "rgb(215, 48, 39)", "rgb(165, 0, 38)"];

    let xLegendScale = d3.scaleBand()
                   .domain(["<2.8", 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8, '12.8+'])
                   .range([0, legendWidth]);

    let xLegendAxis = d3.axisBottom(xLegendScale).ticks(9)

    // Full SVG Area
    let legendChart = d3.select(legend.current)
                  .attr("width", legendWidth + legendMargin.right + legendMargin.left)
                  .attr("height", legendHeight + legendMargin.top + legendMargin.bottom);

            
    // Main SVG Area that will contain our information
    let legendMain = legendChart.append('g')
                    .attr("transform", `translate(${legendMargin.left}, ${legendMargin.top})`)
                    .attr("width", legendWidth)
                    .attr("height", legendHeight)
                    .attr("class", "main");

    // Render X Axis
    legendMain.append('g')
        .attr("id", "x-Legendaxis")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(xLegendAxis);


        legendMain
        .selectAll('.temps')
        .data(temps)
        .join("rect")
        .attr("class", "temps")
        .attr("width", 20 )
        .attr("height", 10)
        .attr("x", value => xLegendScale(value) + 5)
        .attr("y", legendHeight - 10)
        .attr("fill", (value, index) => tempColors[index])
  }
}


export default App;