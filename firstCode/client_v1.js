
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

    
    let rolleExtentW = [0, rolledData.size - 1]

    console.log("Width Extent", rolleExtentW);

    

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };	
    const width = 800 - margin.left - margin.right;	
    const height = 400 - margin.top - margin.bottom;
    
    const bar_svg = d3.select("div")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    //let minHeight = 30;
    //let maxHeight = 400;

    let y_scale = d3.scaleLinear()
        .range([height, 0])
        .domain(rolleExtent);

    let x_scale = d3.scaleLinear()
        .range([0, width])
        .domain(rolleExtentW)

    let x_axis = d3.axisBottom(x_scale);

    let y_axis = d3.axisLeft(y_scale)

    
    bar_svg
        .append("g")
            .attr("class", "x_axis")
            .attr("transform", `translate(0, ${height})`) //translate(0, ${height - margin}
            .call(x_axis);
    
    d3.select(".x_axis")
        .append("text")
        .text("OH WAU this is it")
        .style("fill", "black")
        .attr("x", (width - margin) / 2)
        .attr("y", 20)

    bar_svg
        .append("g")
            .attr("class", "y_axis")
            //.attr("transform", `translate(${margin}, 0)`) //translate(0, ${height - margin}
            .call(y_axis);

    d3.select(".y_axis")
        .append("text")
        .text("NEY NEY NEY")
        .style("fill", "black")
        .attr("x", (width - margin) / 2)
        .attr("y", 20)

    let barWidth = width / rolledData.s

    bar_svg
        .selectAll("rect")
        .data(rolledData) // Array.from(rolledData)
        .enter()
        .append("rect")
            .attr("width", 20) 
            .attr("height", function(d) { // set the length/height of the bar
                console.log(d[1])
                return height - y_scale(d[1]);
            })
            .attr("x", function(d, i) { // set the x position of the bar
                console.log(d, i, i * 50 + 50);
                return x_scale(i); //(i * 40 + 50)
            })
            .attr("y", function(d) { // set the y position of the bar
                return height - y_scale(d[1]);
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

    
					
			

})();