
(async () => {

    const datapath = "data/IPL Matches 2008-2020_win_loss_small.csv"
    const myData = await d3.csv(datapath)
    console.log(myData);
    console.log(myData[1].Date)

    let rowConverter = (d) => {
        let dateString = d.Date
        let parseDate = d3.timeParse("%d/%m/%Y");
        let parseYear = d3.timeFormat("%Y");
        let date = parseDate(dateString);
        let year = parseYear(date);
        
        return {
            Date: date,
            year: year,
            City: d.City,
            Eliminator: d.Eliminator, 
            Id: d.Id, 
            Looser: d.Looser,
            Method: d.Method, 
            "Neutral Venue": d["Neutral Venue"],
            "Player Of Match": d["Player Of Match"],
            Result: d.Result,
            "Result Margin": d["Result Margin"],
            Team1: d.Team1,
            Team2: d.Team2,
            "Toss Decision": d["Toss Decision"],
            "Toss Winner": d["Toss Winner"],
            Umpire1: d.Umpire1, 
            Umpire2: d.Umpire2,
            Venue: d.Venue,
            Winner: d.Winner,
        } 
    }

    console.log(rowConverter(myData[1]));
    // cleaned data (date)
    const myDataD = await d3.csv(datapath, rowConverter);

    function initaliseTimeline(data) {

        let nestedByYear = d3.group(data, d => (d.Date).getFullYear())
            .entries(data);

        let dropDownM = d3.select("#dropDownMenu");
        dropDownM
            .append("select")
            .selectAll("option")
            .data(nestedByYear)
            .enter()
            .append("option")
                .attr("value", d => d[0])
                .text(d => d[0]);

        return nestedByYear;
    }

    rolledYear = initaliseTimeline(myDataD);
    console.log("ROLLED YEAR", Array.from(rolledYear));

    let dropDownM = d3.select("#dropDownMenu")
        .on("change", function(e, d) {
            let selectItem = d3.select(this)
                .select("select")
                .property("value");
            console.log(selectItem);
            filterTest(selectItem);
        })

    function filterTest(filter) {
        newData = myDataD.filter(function (d) { return d.year == filter});
        console.log("Filtered data", newData);
    }


    //console.log(rowConverter(myData[1]));

    let nestedData = d3.group(myData, d => d.City);
    console.log("nested", nestedData);
    console.log(nestedData.get("Bangalore"));
    
    let rolledData = d3.rollup(myDataD, v => v.length, d => d.City);
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
            //console.log(y_scale(d[1]), d[1])
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

            d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .html("Matches played in " + d[0] + ": " + d[1])
                .style("left", event.pageX + "px")
                .style("top", (event.pageY) + "px")
        })
        
        .on("mouseout", function(event, d) {
            d3.select(this)
                .attr("class", "bars");
            d3.selectAll(".tooltip")
                .remove();
        });		
			

})();