
(async () => {

    const datapath = "data/IPL Matches 2008-2020_win_loss_small.csv"
    const myData = await d3.csv(datapath)
    console.log(myData);


    let nestedData = d3.group(myData, d => d.City);
    console.log("nested", nestedData);
    console.log(nestedData.get("Bangalore"));
    
    let rolledData = d3.rollup(myData, v => v.length, d => d.City);
    console.log("Rolled Data", rolledData);
    //console.log(rolledData.get("Bangalore"));
    console.log(rolledData.keys())
    console.log(typeof rolledData)

    /*
    var cityArray = Array.from(rolledData.keys());
    console.log(cityArray);
    */
   
    let rolleExtent = d3.extent(rolledData, function(d) {
        return parseFloat(d[1])
    });

    console.log("Rolle Extent", rolleExtent);

    
    let rolleExtentW = [0, rolledData.size -1]

    console.log("Width Extent", rolleExtentW);

   

    const margin = 100;	
    const width = 700;	
    const height = 400;	
    const barWidth = 20;


    // scaling y axis (heigth) for bars and axis
    let y_scale = d3.scaleLinear()
        .range([height, margin])
        .domain([0, rolleExtent[1]]);

    // scaling y axis (width) for bars 
    let x_scale = d3.scaleLinear()
        .range([margin, width])
        .domain(rolleExtentW);
    
    // scaling X axis (width) for axis
    let x_a_scale = d3.scalePoint()
        .range([margin + (barWidth / 2), width + (barWidth / 2)]) // half of width of bars 
        .domain(rolledData.keys());

    let y_axis = d3.axisLeft(y_scale)

    let x_axis = d3.axisBottom(x_a_scale);

    // create svg as child of DOM div selected by id (#)
    const bar_svg = d3.select("#div1")
        .append("svg")
            .attr("width", width + margin)
            .attr("height", height + margin)

    // set X axis
    bar_svg
    .append("g")
        .attr("class", "x_axis")
        .attr("transform", `translate(0, ${height})`) 
        .call(x_axis)
        .selectAll("text") // set text of ticks
            .attr("transform", "rotate(-90)")
            .attr("dx", "-.8em")
            .attr("dy", "-.6em")
            .attr("text-anchor", "end");

    // set Y axis
    bar_svg
    .append("g")
        .attr("class", "y_axis")
        .attr("transform", `translate(${margin}, 0)`) //translate(0, ${height - margin}
        .call(y_axis);
    
    // set title of x axis
    d3.select(".x_axis")
        .append("text")
        .text("Cities")
        .style("fill", "black")
        .attr("x", (width + margin) / 2)
        .attr("y", margin - 15)
        .attr("class", "axis-title")

    // set title of y axis
    d3.select(".y_axis")
        .append("text")
        .text("Matches played")
        .style("fill", "black")
        .attr("transform", `rotate(-90, 0, ${margin - 20}) translate(${-margin - 30 }, 0)`)
        .attr("class", "axis-title")

    // create bars 
    bar_svg
        .selectAll("rect")
        .data(rolledData)
        .enter()
        .append("rect")
        .attr("class", "bars")
        .attr("width", barWidth) // horizontal
        .attr("height", function(d) { // vertical
            console.log(y_scale(d[1]), d[1])
            return (height - y_scale(d[1]))
        })
        .attr("x", function(d, i) { // horizontal
            //console.log(x_scale(i), i)
            return x_scale(i)
        })
        .attr("y", function(d) { // vertical
            return y_scale(d[1])
        })
        .on("mouseenter", function(event, d) {

            d3.select(this)
                .attr("class", "bar-mouse-in");

            var tooltip = bar_svg
                .append("g")
                .attr("class", "tooltip")
                .style("pointer-events", "none");

            var textN = tooltip
                .append("text")
                .attr("class", "tooltip-text")
                .attr("x", event.x)
                .attr("y", event.y)
                .text("Matches played in " + d[0] + ": " + d[1])
                .attr("fill", "black")
                .attr("font-size", "14px");

            var boundBox = textN.node().getBBox();
            tooltip
                .insert("rect", "text")
                .attr("class", "rect-tooltip")
                .attr("x", boundBox.x - 5)
                .attr("y", boundBox.y - 5)
                .attr("width", boundBox.width + 10)
                .attr("height", boundBox.height + 10)
                .attr("rx", 5)
                .attr("ry", 5);
            /*
            var svgRect = bar_svg.node().getBoundingClientRect();
            var tooltipRect = tooltip.node().getBoundingClientRect();
            var toolTX = event.clientX - svgRect.x + 10;
            var toolTY = event.clientY - svgRect.y + 10;

            if (toolTX + tooltipRect.width > svgRect.width) {
                toolTX = event.clientX - svgRect.x -tooltipRect.width -20;
            }

            
            if (toolTY + tooltipRect.height > svgRect.height) {
                toolTY = event.clientY - svgRect.y -tooltipRect.height -20;
            }

            tooltip
                .attr("transform", `translate(${toolTX}, ${toolTY})`);

            */
        })
        
        .on("mouseout", function(event, d) {
            d3.select(this)
                .attr("class", "bars");
            d3.selectAll(".tooltip")
                .remove();
        });
        
            

/* 
    bar_svg
        .selectAll("rect")
        .data(rolledData) // Array.from(rolledData)
        .enter()
        .append("rect")
            .attr("width", 20) 
            .attr("height", function(d) { // set the length/height of the bar
                console.log(d[1])
                return y_scale(d[1]);
            })
            .attr("x", function(d, i) { // set the x position of the bar
                console.log(d, i, i * 50 + 50);
                return x_scale(i); //(i * 40 + 50)
            })
            .attr("y", function(d) { // set the y position of the bar
                return height - margin - y_scale(d[1]);
            })
            .on("mouseenter", function(event, d) {
                d3.select(this)
                    .style("fill", "green");
                d3.select("svg")
                    .append("text")
                        .attr("class", "tooltip")
                        .attr("x", event.x)
                        .attr("y", event.y - 20)
                        .text("Matches played in " + d[0] + ": " + d[1]);
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .style("fill", "gold")
                d3.selectAll(".tooltip")
                    .remove();
            });

    bar_svg
        .selectAll("text")
        .data(rolledData)
        .enter()
        .append("text")
            .attr("x", function(d, i) {
                return x_scale(i);
            })
            .attr("y", function(d) {
                return height - 45 - y_scale(d[1]);
            })
            .text(function(d) {
                return d[0];
            })
            */

			
			

})();