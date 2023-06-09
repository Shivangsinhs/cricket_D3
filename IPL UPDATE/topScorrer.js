
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
let year = '2020';

var x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

var x2 = d3.scaleLinear()
      .range([0, width])

var y = d3.scaleLinear()
      .range([height, 0]);

function scalex(sl){ 
    return x(sl)+35;
}

function scaley(score){ 
    return y(score)+15;
}
var yearScale = d3.scaleLinear()
    .domain([2008,2020]).range([50,width]);

          
var topScorrer = d3.select("#topScorrer").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

var tip = d3.select("#topScorrer")
  .append("div")
  .attr("class", "tip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden");
  
var topWickets = d3.select("#topWickets").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")");
      

d3.csv("top10Batsman.csv").then(function(data) {

  function init(data, type= 'most_runs') {

      x.domain(data.map(function(d) { return d.players_name; }));
      x2.domain([1, 10])
      y.domain([0, d3.max(data, function(d) { return d[type]; })]);

      topScorrer.selectAll('*').remove();
      let bars = topScorrer.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.players_name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d[type]); })
        .attr("height", function(d) { return height - y(d[type]); })
        .style('fill', 'steelblue')
        .on("mouseover", function(event, d) {
          d3.select(this).style("fill", 'Purple');
          return tip.html(`${d.players_name} <br/>
            Score: ${d.most_runs} <br/>
            Team Name: ${d.team}
          `).style("visibility", "visible")
          .style("top", event.pageY - 100 + 'px' )
          .style("left", event.pageX - 50  + 'px')
        })
  	    .on("mouseleave", function(){
          d3.select(this)
            .style("fill", 'steelblue');
          return tip.style("visibility", "hidden");
        });

      topScorrer.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      topScorrer.append("g")
          .call(d3.axisLeft(y));
    }




    let dataByYear = data.filter((e)=> e.year == year); 
    console.log(dataByYear);
    init(dataByYear, 'most_runs');

         

    d3.csv("top10Wickets.csv").then(function(dataWicket) {
      function initWicket(data) {
          x.domain(data.map(function(d) { return d.players_name; }));
          y.domain([0, d3.max(data, function(d) { return d.most_wickets; })]);
          topWickets.selectAll('*').remove();
          topWickets.selectAll(".bar")
          .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.players_name); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.most_wickets); })
            .attr("height", function(d) { return height - y(d.most_wickets); })
            .style('fill', 'steelblue')
            .on("mouseover", function(event, d) {
              console.log(event);
              d3.select(this).style("fill", ' Orange');
              return tip.html(`${d.players_name} <br/>
                Wickets: ${d.most_wickets}<br/>
                Team Name: ${d.Team}
              `).style("visibility", "visible")
              .style("top", event.pageY - 100 + 'px' )
              .style("left", event.pageX - 50  + 'px')
            })
            .on("mouseleave", function(){
              d3.select(this)
                .style("fill", 'steelblue');
              return tip.style("visibility", "hidden");
            });

            topWickets.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

              topWickets.append("g")
              .call(d3.axisLeft(y));
        }

        initWicket(dataWicket.filter((e)=> e.year == year, 'most_wickets'));


        svg.selectAll('.title').on("click", function(d) {
          console.log("CLICKING", this.id)
          d3.selectAll('line').remove()
                
          d3.select(this)
                .append('line')
                .attr('x1', 0)
                .attr('y1', 160)
                .attr('x2', 50)
                .attr('y2', 160)
                .attr("stroke-width","5")
                .attr("stroke","#4682b4")

          init(data.filter((e)=> e.year == this.id));
          initWicket(dataWicket.filter((e)=> e.year == this.id));
        })

    });


   

});



     
