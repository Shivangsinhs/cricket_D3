
(async () => {

    const datapath = "../data/IPL Matches 2008-2020_win_loss_small.csv"
    const csvData = await d3.csv(datapath)

    // cleaned data (date)
    const myData = await d3.csv(datapath, rowConverter);
    
    // convert dataObjects to necessary format, change date format
    function rowConverter(d) {

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
			
    // set-up filter as HTML select with options from data
    function initaliseTimeline(data) {

        let nestedByYear = d3.group(data, d => (d.Date).getFullYear())
            .entries(data);

        let dropDownM = d3.select("#dropDownMenu");

        dropDownM.append("select")
            .attr("id", "select1")
            .selectAll("option")
            .data(nestedByYear)
            .enter()
            .append("option")
                .attr("value", d => d[0])
                .text(d => d[0]);
        
        let select = document.getElementById("select1");
        let initalOpt = document.createElement("option");
        initalOpt.text = "All years";
        initalOpt.value = 0;
        select.insertBefore(initalOpt, select.firstChild);
        select.value = initalOpt.value;
        filterTest(select.value);

    }

    // initalising the filter
    rolledYear = initaliseTimeline(myData);


			
    // set-up filter, on change process starts
    d3.select("#dropDownMenu")
        .on("change", function(e, d) {
            let selectItem = d3.select(this)
                .select("select")
                .property("value");
            filterTest(selectItem);
        })
    
    // return filtered cleaned data
    function filterTest(filter) {
        if (filter != 0) {
            var newData = myData.filter(function (d) { return d.year == filter});
            
            console.log(newData)
            newData.sort((a, b) => d3.descending(a.Date, b.Date))
            console.log(newData[0].Winner)
            var imgSrc = newData[0].Winner + ".png"
            console.log(imgSrc)
            var winner = newData[0];
            winner.url = imgSrc;
            console.log(typeof winner)
            if (typeof winner == "object") {
                console.log("Yess!")
            } 
            changeLogo(winner);
        } else {
            imgSrc = "IPL.png"
            changeLogo(imgSrc);
            console.log(myData)
        }
    }


    function changeLogo(data) {
        console.log("we are in");

    
        // set-up svg
        const margin = 50;	
        const width = 250;	
        const height = 250;	

        d3.select('#svg1').remove()

        // create svg as child of DOM div selected by id (#)
        const bar_svg = d3.select("#div2")
            .append("svg")
                .attr("id", "svg1")
                .attr("width", width + margin)
                .attr("height", height + margin)

        const img = bar_svg.append("image");
        var text = null;
        var src = null;
        if (typeof data == "object") {
            text = "In "+ data.year + ", " + data.Winner + " won the IPL in " + data.City  + "<br> against " + data.Looser;
            src = data.url;
        } else {
            text = "Indian Premier League"
            src = data;
        }

        img
            .attr("xlink:href", `../Winners/${src}`)
            .attr("x", 50)
            .attr("y", 50)
            .attr("width", 200)
            .attr("height", 200)
            .on("mouseenter", function(event, d) {

                d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .html(text)
                    .style("left", event.pageX + "px")
                    .style("top", (event.pageY) + "px")
            })
            
            .on("mouseout", function(event, d) {
                
                d3.selectAll(".tooltip")
                    .remove();
            });

            
    }


})();