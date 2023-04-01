var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var yearScale = d3.scaleLinear()
    .domain([2008,2020]).range([20,1150]);

var svg = d3.select('#titleWinner').append('svg').attr('width', 1200).attr('height', 300);


svg.append('text')
    .attr('class', 'title')
    .attr('transform','translate(550,30)')
    .style('font-weight', 'bold')
    .text('IPL Title Winners');


var yearScale = d3.scaleLinear()
    .domain([2008,2020]).range([50,width]);


d3.csv("../data/ipl_data.csv").then((data) => {
    console.log(data)
    let g = svg.append("g").selectAll('g')
        .data(data)
        .enter()
        .append('g').attr('class', (d)=>`x axis y${d.year}`)
        .attr('id', (d)=>d.year)
        .attr('class', `title`)
        .attr('transform', (d, i)=> `translate(${yearScale(d.year)},70)`)
        .on("mouseover", function(d,i) {
            d3.select(this)
                .transition()
                .duration(300)
                .attr("transform", (d)=> `translate(${yearScale(Number(d.year))}, 60) scale(1.2)`);
        })
        .on("mouseleave", function(d,i) {
            d3.select(this)
                .transition()
                .duration(300)
                .attr("transform", (d)=> `translate(${yearScale(Number(d.year))}, 70) scale(1)`);
        });

        g.append('text')
            .attr("x", 10)
            .attr("y", 140)
            .text((d)=>d.year);

        g.append('text')
            .style('fill', 'black')
            .style('font-size', '10px')
            .style('text-anchor', 'middle')
            .attr("x", 25)
            .attr("y", (d, i)=> [1, 14].includes(i) ? 70 : 60)
            .text((d)=>d.winner).call(wrap,30);

        g.append("image")
            .attr('href', function(d){ return d.image; })
            .attr('id', function(d){ return d.year; })            
            .attr("width", "50px")
            .attr("height", "50px");
        
        g.append('line')
            .attr('x1', 0)
            .attr('y1', 160)
            .attr('x2', 50)
            .attr('y2', 160)
            .attr("stroke-width","5")
            .attr("stroke",(d)=> d.year == 2020 ? "#4682b4" : '')

})

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}

