
(async () => {

    const datapath = "data/IPL Matches 2008-2020_win_loss_small.csv"
    const myData = await d3.csv(datapath)
    console.log(myData);


    let nestedData = d3.group(myData, d => d.City);
    console.log(nestedData);
    console.log(nestedData.get("Bangalore"));
    
    let rolledData = d3.rollup(myData, v => v.length, d => d.City);
    console.log("Rolled Data", rolledData);
    //console.log(rolledData.get("Bangalore"));
    console.log(rolledData.size)

    let rolleExtent = d3.extent(rolledData, function(d) {
        return parseFloat(d[1])
    });

    console.log("Rolle Extent", rolleExtent);

    
    let rolleExtentW = [0, rolledData.size -1]

    console.log("Width Extent", rolleExtentW);


    

    const margin = 70;	
    const width = 700;	
    const height = 400;	

    //let minHeight = 30;
    //let maxHeight = 400;

    let y_scale = d3.scaleLinear()
        .range([height, margin])
        .domain([0, rolleExtent[1]]);

    let x_scale = d3.scaleLinear()
        .range([margin, width - margin])
        .domain(rolleExtentW)

    let x_axis = d3.axisBottom(x_scale)
        .tickFormat(function(d) {
            return rolledData[1];
        });

    let y_axis = d3.axisLeft(y_scale)

    const bar_svg = d3.select("div")
        .append("svg")
            .attr("width", width + margin)
            .attr("height", height + margin)

    // set X axis
    bar_svg
    .append("g")
        .attr("class", "x_axis")
        .attr("transform", `translate(0, ${height})`) //translate(0, ${height - margin}
        .call(x_axis);

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
        .attr("y", margin - 10)
        .attr("class", "axis-title")

    // set title of y axis
    d3.select(".y_axis")
        .append("text")
        .text("Matches played")
        .style("fill", "black")
        .attr("transform", `rotate(-90, 0, ${margin - 20}) translate(${-margin - 30 }, 0)`)
        .attr("class", "axis-title")

    bar_svg
        .selectAll("rect")
        .data(rolledData)
        .enter()
        .append("rect")
        .attr("width", 20) // horizontal
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