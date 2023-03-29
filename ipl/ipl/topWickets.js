
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function scalex(year){ 
    return xw(year)+35;
}

function scaley(score){ 
    return yw(score)+15;
}

var xw = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var yw = d3.scaleLinear()
          .range([height, 0]);
          
var topWickets = d3.select("#topWickets").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("ipl_data.csv").then(function(data) {

  data.forEach(function(d) {
    d.highest_individual_wickets = +d.highest_individual_wickets;
  });

  xw.domain(data.map(function(d) { return d.year; }));
  yw.domain([0, d3.max(data, function(d) { return d.highest_individual_wickets; })]);

  let bars = topWickets.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xw(d.year); })
      .attr("width", xw.bandwidth())
      .attr("y", function(d) { return yw(d.highest_individual_wickets); })
      .attr("height", function(d) { return height - yw(d.highest_individual_wickets); })
      .style('fill', 'steelblue');
      

     topWickets.selectAll(".l")
      .data(data)
        .enter().append("text")
        .attr("class", "l")
        .attr("transform", function(d){
            return "translate(" + scalex(d.year) + "," + 440 + ") rotate(-90)";
        })
        .style('text-anchor', 'start')
        .style('fill', 'white')
      .text(function(d){ return d.highest_wicket_taker;})

    topWickets.selectAll(".l1")
      .data(data)
        .enter().append("text")
      .attr("class", "l1")
      .attr("transform", function(d){
        return "translate(" + scalex(d.year) + "," + scaley(d.highest_individual_wickets) + ")";
      })
        .style('text-anchor', 'middle')
        .style('fill', 'white')
      .text(function(d){ return d.highest_individual_wickets;})

  topWickets.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xw));

  topWickets.append("g")
      .call(d3.axisLeft(yw));

});