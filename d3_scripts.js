d3.select('h1')
  .style('color', 'black')
  .style("font-family", "lato");

// Changes all h2 level text
d3.selectAll('h2')
  .style('color', basegrey)
  .style("font-family", "lato");


// set the dimensions and margins of the graph
const margin = { top: 50, right: 50, bottom: 50, left: 50 },
  width = 550 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;


// ------Mynew Variables start here

//Color Palette

var jerryColor = '#005D90';
var elaineColor = '#F081BE';
var kramerColor = '#EB711F';
var georgeColor = "#F2F53D";
var otherColor = '#90F5DC';

var basegrey = "#505050";
var undecidedcolor = "E4E6E7";

//Scene selector harcoded now
var sceneChoice = "1";
const timeFormatter = "%M:%S";

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data ... All files have been uploaded to my github for easy access and downloading
// When reading the csv, I must format variables:
d3.csv("https://raw.githubusercontent.com/UlyssesLin/designfeld/master/seinfield_data.csv", function (d) {
  return {
    start: d3.timeParse(timeFormatter)(d.start), end: d3.timeParse(timeFormatter)(d.end),
    speaker: d.speaker, scene_marker: d.scene_marker, speech: d.speech,
    time_stamp: d3.timeParse(timeFormatter)(d.time_stamp), laughter: d.laughter,
    scene_index: d.scene_index, scene_desc: d.scene_desc
  }
}).then(function (data) {

  //Scene Description at bottm??    
  d3.selectAll("#my_scene")
    .style('color', basegrey)
    .style("font-family", "lato")
    .data(data)
    .enter()
    .append('text')
    .text(function (d) {
      if (d.scene_index === sceneChoice) {
        return "Scene " + sceneChoice + ": " + d.scene_desc;
      }
    })
    .style('color', basegrey)
    .style("font-family", "lato")
    .style("font-size", 15);



  //tme parser
  const parseTime = d3.timeParse("%M:%S");

  // X axis 
  const x = d3.scaleBand()
    .range([0, width])
    .domain(data.map(function (d) {

      if (d.speaker === "JERRY" || d.speaker === "ELAINE" || d.speaker === "GEORGE" || d.speaker === "KRAMER") {
        return d.speaker;
      }
      else {
        return "OTHER";
      }
    }
    ))
    .padding(1);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .style("color", basegrey) // change here for axis line and tick style
    .style("stroke-width", 0)
    .call(d3.axisBottom().scale(x))
    .selectAll("text")
    .attr("transform", "translate(0,10)rotate(0)")
    .style("text-anchor", "middle")
    .style("color", basegrey)
    .style("font-family", "lato")
    .style("font-size", 12); // change here for axis marking (year)


  // Add Y axis
  const y = d3.scaleTime()
    .domain(d3.extent(data, function (d) {
      if (d.scene_marker === sceneChoice) {
        return d.start, d.end;
      }
    }))
    .range([0, height]);

  svg.append("g")
    .style("color", "white")
    .style("font-family", "lato")
    .style("font-size", 12)
    .call(d3.axisLeft(y).tickFormat(d3.timeFormat(timeFormatter))) // added format for time
    .selectAll('text')
    .style("text-anchor", "end")
    .style("color", basegrey)
    .style("font-family", "lato")
    .style("font-size", 12); //Change here for y axis font change 

  //tooltip stuff
  var Tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (i, d) {
    if (typeof d === 'undefined') {
      return;
    }

    Tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function (i, d) {
    if (typeof d === 'undefined') {
      return;
    }
    Tooltip
      .html(d.speaker + ": " + d.speech)
      .style("left", "70px")
      .style("top", "100px")
  }
  var mouseleave = function (i, d) {
    if (typeof d === 'undefined') {
      return;
    }
    Tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", function (d) { //color changing for each character
        if (d.speaker === "JERRY") {
          return jerryColor;
        }
        else if (d.speaker === "ELAINE") {
          return elaineColor;
        }
        else if (d.speaker === "KRAMER") {
          return kramerColor;
        }
        else if (d.speaker === "GEORGE") {
          return georgeColor;
        }
        else {
          return otherColor;
        }
      })
      .style("opacity", 1)
  }

  // Render the dashed lines
  svg.selectAll()
    .data(data)
    .enter()
    .append("line")
    .attr("x1", function (d) {
      if (d.scene_marker === sceneChoice) {
        if (d.speaker === "JERRY" || d.speaker === "ELAINE" || d.speaker === "GEORGE" || d.speaker === "KRAMER") {
          return x(d.speaker);
        }
        else {
          return x("OTHER");
        }
      }
    })
    .attr("x2", function (d) {
      if (d.scene_marker === sceneChoice) {
        if (d.speaker === "JERRY" || d.speaker === "ELAINE" || d.speaker === "GEORGE" || d.speaker === "KRAMER") {
          return x(d.speaker);
        }
        else {
          return x("OTHER");
        }
      }
    })
    .attr("y1", function (d) {
      if (d.scene_marker === sceneChoice) {
        return y(d.start);
      }
    })
    .attr("y2", function (d) {
      if (d.scene_marker === sceneChoice) {
        return y(d.end);
      }
    })
    .attr("stroke-width", 10)
    .attr("stroke", function (d) { //color changing for each character
      if (d.speaker === "JERRY") {
        return jerryColor;
      }
      else if (d.speaker === "ELAINE") {
        return elaineColor;
      }
      else if (d.speaker === "KRAMER") {
        return kramerColor;
      }
      else if (d.speaker === "GEORGE") {
        return georgeColor;
      }
      else {
        return otherColor;
      }
    })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)


})