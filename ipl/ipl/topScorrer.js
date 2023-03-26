
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function scalex(year){ 
    return x(year)+35;
}

function scaley(score){ 
    return y(score)+15;
}

var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);
          
var topScorrer = d3.select("#topScorrer").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("ipl_data.csv").then(function(data) {

  data.forEach(function(d) {
    d.highest_individual_score = +d.highest_individual_score;
  });

  x.domain(data.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) { return d.highest_individual_score; })]);

  let bars = topScorrer.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.highest_individual_score); })
      .attr("height", function(d) { return height - y(d.highest_individual_score); })
      .style('fill', 'steelblue');

     topScorrer.selectAll(".l")
      .data(data)
    .enter().append("text")
      .attr("class", "l")
      .attr("transform", function(d){
        return "translate(" + scalex(d.year) + "," + 440 + ") rotate(-90)";
      })
    .style('text-anchor', 'start')
    .style('fill', 'white')
      .text(function(d){ return d.highest_scorer;})

    topScorrer.selectAll(".l1")
      .data(data)
    .enter().append("text")
      .attr("class", "l1")
      .attr("transform", function(d){
        return "translate(" + scalex(d.year) + "," + scaley(d.highest_individual_score) + ")";
      })
    .style('text-anchor', 'middle')
    .style('fill', 'white')
      .text(function(d){ return d.highest_individual_score;})

  topScorrer.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  topScorrer.append("g")
      .call(d3.axisLeft(y));

});