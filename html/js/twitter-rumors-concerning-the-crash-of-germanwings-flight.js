// URL: https://beta.observablehq.com/@stvkas/twitter-rumors-concerning-the-crash-of-germanwings-flight
// Title: Twitter Rumors Concerning the Crash of Germanwings Flight 9525 
// Author: Steve Kasica (@stvkas)
// Version: 262
// Runtime version: 1

const m0 = {
  id: "dedcc9ec0471ee09@262",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Twitter Rumors Concerning the Crash of Germanwings Flight 9525 

On March, 24, 2015, Germanwings Flight 9525 crash 100 km outside of Nice, France. Tweet data discussing the crash come comes from [PHEME Dataset for Rumour and Non-Rumours](https://figshare.com/articles/PHEME_dataset_of_rumours_and_non-rumours/4010619). 

The swarmplot below visualizes the distribution tweets overtime, classified as rumor or non-rumor. Hover to reveal tweet text. This notebook is essentially a fork of [Beeswarm](https://bl.ocks.org/mbostock/6526445e2b44303eebf21da3b6627320).
`
)})
    },
    {
      name: "plt",
      inputs: ["d3","DOM","data"],
      value: (function(d3,DOM,data)
{
    const margin = {top: 40, right: 60, bottom: 60, left: 50},
          width = 960,
          height = 600;
   
  const svg = d3.select(DOM.svg(width, height));
  
  function colors(isRumor) { 
    const pal = d3.schemeCategory10;
    return (!isRumor) ? pal[0] : pal[1] 
  };

  var formatValue = d3.format(",d");
  var formatTime = d3.timeFormat("%Y-%m-%d %H:%M");

  var x = d3.scaleTime()
      .domain(d3.extent(data, d => (d.date)))
      .range([0, width - margin.right]);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var simulation = d3.forceSimulation(data)
    .force("x", d3.forceX(d => (x(d.value))).strength(1))
    .force("y", d3.forceY(height / 2))
    .force("collide", d3.forceCollide(6))
    .stop();

  for (var i = 0; i < 120; ++i) simulation.tick();
   
  // Add x-axis
  let xAxis = d3.axisBottom(x).tickFormat(formatTime);
  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .call(xAxis);

  var cell = g.append("g")
    .attr("class", "cells")
      .selectAll("g").data(d3.voronoi()
    .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.top]])
      .x((d) => (d.x))
      .y((d) => (d.y))
      .polygons(data)).enter().append("g");

  cell.append("circle")
      .attr("r", 3)
      .attr("fill", d => colors(d.data.is_rumor))
      .attr("cx", d => d.data.x)
      .attr("cy", d => d.data.y);

  cell.append("path")
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

  function formatTitle(twt) {
    return "\"" + twt.data.id + "\"\n\n@" + twt.data.handle + " (" + formatTime(twt.data.date) + ")";
  }
  
  cell.append("title").text(formatTitle);

  // Add legend
  const legend = g.append("g")
    .attr("class", "legend")
    .selectAll("g")
      .data(["Rumor", "Non-Rumor"]).enter()
    .append("g")
      .attr("transform", (d,i) => "translate(" + (width - 150) + "," + i * 10 + ")")
  
  legend.append("circle")
    .attr("r", 3)
    .attr("cx", -10)
    .attr("cy", -4)
    .attr("fill", d => colors((d == "Rumor")));
  
  legend.append("text").text(d => d);
  
  return svg.node()
}
)
    },
    {
      name: "style",
      inputs: ["html"],
      value: (function(html){return(
html`<style>

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

text {
  font: 10px sans-serif;
}

.cells path {
  fill: none;
  pointer-events: all;
}

.cells :hover circle {
  stroke: red;
}

.cells .rumor {
  fill: yellow;
}
.cell c.non-rumor {
  fill: blue;
}
`
)})
    },
    {
      name: "data",
      inputs: ["d3"],
      value: (async function(d3){return(
(await d3.csv("https://raw.githubusercontent.com/swkasica/cpsc-534l-project/d3/data/beeswarm/germanwings-crash.csv?token=ACzDxmDWLpsJhm8lRvtgg7C9APiAEpTcks5cHP_xwA%3D%3D")).map(d => ({
  id: d.text, 
  value: +d.created,
  is_rumor: (d.is_rumor === "1") ? true : false,
  date: new Date(+d.created),
  handle: d["user.handle"],
})).filter(d => d.id !== "").sort((a,b) => b.value - a.value).slice(0, 2000)
)})
    },
    {
      name: "d3",
      inputs: ["require"],
      value: (function(require){return(
require("d3")
)})
    }
  ]
};

const notebook = {
  id: "dedcc9ec0471ee09@262",
  modules: [m0]
};

export default notebook;
