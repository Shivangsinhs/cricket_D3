var yearScale = d3.scaleLinear()
    .domain([2008,2022]).range([50,1150]);

var svg = d3.select('#titleWinner').append('svg').attr('width', 1200).attr('height', 300);

svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,150)')
    .call(d3.axisBottom(yearScale).tickFormat(function(d){return d;}));

svg.append('text')
    .attr('class', 'title')
    .attr('transform','translate(550,30)')
    .style('font-weight', 'bold')
    .text('IPL Title Winners');

d3.csv("ipl_data.csv").then((data)=>{
    console.log(data)
    
    let labels = svg.selectAll('.lab')
                .data(data)
                .enter()
                .append("text")
                .attr('class','lab')
                .attr("x", function(d){ return yearScale(d.year);})
                .attr("y", function(d, i){ 
                    if(i==1 || i == 14){
                        return 120;
                    }
                    else{
                        return 110;
                    }
                })
                .style('fill', 'black')
                .style('font-size', '10px')
                .style('text-anchor', 'middle')
                .text(function(d){ return d.winner;}).call(wrap,30)


    let icons = svg.selectAll('image')
                .data(data)
                .enter()
                .append("image")
                .attr('href', function(d){ return d.image; })
                .attr("x", function(d){ return yearScale(d.year)-25;})
                .attr("y", function(d){ return 60;})
                .attr("width", "50px")
                .attr("height", "50px")
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