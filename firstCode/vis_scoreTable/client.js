
(async () => {

    let token = "pk.eyJ1IjoiZmVzb2oyMiIsImEiOiJjbGZwN203bXcwbDVoM3NwaHU0b2U1Ym1lIn0.Bkw73NEebSZar5w2HtQuAw";

    const datapath = "../data/IPL Matches 2008-2020_win_loss_small1.csv"
    const csvData = await d3.csv(datapath)
    //console.table(csvData);

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
            lat: d.Latitude,
            long: d.Longitude,

        } 
    }

    /*
    mapboxgl.accessToken = token;

    const mapBox = new mapboxgl.Map({
        container: "div3",
        style: "mapbox://styles/mapbox/streets-v9",
        center: [ 73, -3],
        zoom: 2.2
    });

    const container = mapBox.getCanvasContainer();

    */


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
            newData = myData.filter(function (d) { return d.year == filter});
            rolleData(newData);
        } else {
            rolleData(myData)
        }
    }


    

    //console.log(csvData[0])
    //console.log(myData[0])
    //console.log(myData[0].long, myData[0].lat)
    

    function rolleData(data) {
        console.log("Cleaned data", data)


        let rolledData = d3.rollup(data, 
            v => ({count: v.length, lat: v[0].lat, long: v[0].long}), 
            d => d.City);

        
        let check = Array.from(rolledData);
        console.log("rolled data", check);
        //console.log(check[1][1].lat);

        let rolledWin = d3.rollup(data, 
            v => (v.length), 
            d => d.Winner);

        let winArray = Array.from(rolledWin);
        console.log("win", winArray);

        let rolledLos = d3.rollup(data, 
            v => (v.length), 
            d => d.Looser);

        let losArray = Array.from(rolledLos);
        console.log("los", losArray);
        
        let winLosArray = [];

        for (let parts of winArray) {
            //console.log(parts);
            for (let elements of losArray) {
                //console.log(elements)
                if (parts[0] == elements[0]) {
                    //console.log("its a mathch");
                    let winLos = {
                        team: parts[0],
                        winC: parts[1],
                        losC: elements[1],
                        matcC: parts[1] + elements[1],
                        winR: parts[1] / ( parts[1] + elements[1]),
                        losR: elements[1] / ( parts[1] + elements[1]),
                    }

                    winLosArray.push(winLos);
                }
            }
        }

        console.log(winLosArray);


        
        let winExtent = d3.extent(winLosArray, function(d) {
            return parseFloat(d.winC)
        });
        console.log("win", winExtent)

        let losExtent = d3.extent(winLosArray, function(d) {
            return parseFloat(d.losC)
        });
        console.log("los", losExtent)

        var bigExtent = null;
        if (winExtent[1] >= losExtent[1]) {
            bigExtent = winExtent[1]
        } else {
            bigExtent = losExtent[1] 
        }
        bigExtent += 1;
        console.log("big", bigExtent)

        let matchExtent = d3.extent(winLosArray, function(d) {
            return parseFloat(d.matcC)
        });
        console.log(matchExtent)


        const width = 500;
        const height = 500;
        const margin = 50;

        // scaling height
        let y_scale = d3.scaleLinear()
            .range([height - margin, margin])
            .domain([0, bigExtent]);

        let x_scale = d3.scaleLinear()
            .range([margin, width - margin])
            .domain([0, bigExtent]);
        
        console.log(x_scale(winLosArray[1].matcC))

        let r_scale = d3.scaleLinear()
            .range([5, 10])
            .domain(matchExtent);

        console.log(winLosArray[1])
        console.log(r_scale(winLosArray[1].matcC))

        d3.select('#svg2').remove()


        let y_axis = d3.axisLeft(y_scale);
        let x_axis = d3.axisBottom(x_scale);

        const svg = d3.select('#div3')
            .append("svg")
            .attr("id", "svg2")
            .attr("width", width)
            .attr("height", height)
            .style("position", "absolute")
            .style("z-index", 2);

        // set X axis
        svg
        .append("g")
            .attr("class", "x_axis")
            .attr("transform", `translate(0, ${height - margin})`) 
            .call(x_axis)
        
        // set title of x axis
        d3.select(".x_axis")
            .append("text")
            .text("Lost matches")
            .style("fill", "black")
            .attr("x", (width + margin) / 2)
            .attr("y", margin - 15)
            .attr("class", "axis-title")

         // set Y axis
         svg
         .append("g")
             .attr("class", "y_axis")
             .attr("transform", `translate(${margin}, 0)`) //translate(0, ${height - margin}
             .call(y_axis);

         // set title of y axis
         d3.select(".y_axis")
         .append("text")
         .text("Won matches")
         .style("fill", "black")
         .attr("transform", `rotate(-90, 0, ${margin - 20}) translate(${-margin - 100 }, 0)`)
         .attr("class", "axis-title")

        
        let tooltipDisplayed = false;
        let tooltipX = null;
        let tooltipY = null;

        const dots = svg.selectAll("circle")
            .data(winLosArray)
            .enter()
            .append("circle")
            .attr("r", d => {
                //console.log(r_scale(d.matcC))
                return r_scale(d.matcC)})
            .attr("cx", d => {
                //console.log(x_scale(d.losC))
                return x_scale(d.losC)})
            .attr("cy", d => y_scale(d.winC))
            .style("fill", '#ff0000')
            .on("mouseenter", function(event, d) {
                console.log(event);
                if (!tooltipDisplayed) {
                    tooltipX = event.pageX;
                    tooltipY = event.pageY;

                    d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .html(d.team + "<br> Matches: " + d.matcC + "<br> Wins: " + d.winC + "<br> Losses :" + d.losC)
                    .style("position", "absolute")
                    .style("left", (tooltipX) + "px")
                    .style("top", (tooltipY) + "px")

                    tooltipDisplayed = true;
                }
            })
        
            .on("mouseout", function(event, d) {
                //console.log("OUT");
                if (tooltipDisplayed) {
                    d3.selectAll(".tooltip")
                    .remove();

                    tooltipDisplayed = false;
                }
            });

        
    }

})();