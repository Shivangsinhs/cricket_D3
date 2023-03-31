
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
var y = d3.scaleLinear()
      .range([height, 0]);

function scalex(sl){ 
    return x(sl)+35;
}

function scaley(score){ 
    return y(score)+15;
}


          
// var topWickets = d3.select("#topWickets").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", 
//           "translate(" + margin.left + "," + margin.top + ")");

// d3.csv("top10Wickets.csv").then(function(data) {

//   function init(data) {
//       x.domain(data.map(function(d) { return d.players_name; }));
//       y.domain([0, d3.max(data, function(d) { return d.most_wickets; })]);
//       topWickets.selectAll('*').remove();
//       let bars = topWickets.selectAll(".bar")
//       .data(data)
//       .enter().append("rect")
//         .attr("class", "bar")
//         .attr("x", function(d) { return x(d.players_name); })
//         .attr("width", x.bandwidth())
//         .attr("y", function(d) { return y(d.most_wickets); })
//         .attr("height", function(d) { return height - y(d.most_wickets); })
//         .style('fill', 'steelblue');

//         topWickets.append("g")
//           .attr("transform", "translate(0," + height + ")")
//           .call(d3.axisBottom(x));

//           topWickets.append("g")
//           .call(d3.axisLeft(y));
//     }

//     // svg.selectAll('image').on("mouseover", function(d) {
//     //   d3.select(this)
//     //     //.attr("transform" , "scale(1)");
//     //     .attr("transform", "translate(-30,-20) scale(1.2)")
//     // })
//     // svg.selectAll('image').on("mouseleave", function(d) {
//     //   d3.select(this)
//     //     .attr("transform" , "translate(0, 0) scale(1)")
//     // })


    
//     let year = '2022';
//     let dataByYear = data.filter((e)=> e.year == year); 

//     init(dataByYear);
//     // svg.selectAll('image').on("click", function(d) {
//     //   console.log('wicket', this.id);
//     //   init(data.filter((e)=> e.year == this.id));
//     //   // d3.select(this)
//     //   //   .attr("visibility" , "hidden")
//     // })

// });