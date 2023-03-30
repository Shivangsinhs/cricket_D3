(async () => {

    // token for mapbox API
    let token = "pk.eyJ1IjoiZmVzb2oyMiIsImEiOiJjbGZwN203bXcwbDVoM3NwaHU0b2U1Ym1lIn0.Bkw73NEebSZar5w2HtQuAw";
   
    // current datapath to CSV file
    const datapath = "../data/IPL Matches 2008-2020_win_loss.csv"

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
            Looser: d.Looser,
            Team1: d.Team1,
            Team2: d.Team2,
            Winner: d.Winner,
            lat: d.Latitude,
            long: d.Longitude,
        } 
    }

    // access mapbox api, by using token
    mapboxgl.accessToken = token;

    // set up container, where map is loaded
    const mapBox = new mapboxgl.Map({
        container: "mapB",
        style: "mapbox://styles/mapbox/streets-v9",
    });

    const container = mapBox.getCanvasContainer();
			
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
            newData.sort((a, b) => d3.descending(a.Date, b.Date))
            var imgSrc = newData[0].Winner + ".png"
            var winner = newData[0];
            winner.url = imgSrc;
            changeLogo(winner);
            scoreTable(newData);
            cityMap(newData);
        } else {
            imgSrc = "IPL.png"
            changeLogo(imgSrc);
            scoreTable(myData);
            cityMap(myData);
            //console.log(myData)
        }
    }

    // on change of filter change the logo that is displayed
    function changeLogo(data) {

        // set-up svg
        const margin = 10;	
        const width = 150;	
        const height = 150;	

        // remove svg, to not load multiple ones
        d3.select('#svg1').remove()

        // create svg as child of DOM div selected by id (#)
        const bar_svg = d3.select("#vis1")
            .append("svg")
                .attr("id", "svg1")
                .attr("width", width + margin)
                .attr("height", height + margin)

        const img = bar_svg.append("image")
            .attr('alt', 'Logo of Winning Team');

        // condition to check whether an object or just the source of the placholder is shown
        var text = null;
        var src = null;
        if (typeof data == "object") {
            text = "In "+ data.year + ", " + data.Winner + " won the IPL in " + data.City  + "<br> against " + data.Looser;
            src = data.url;
            //console.log(src)
        } else {
            text = "Indian Premier League"
            src = data;
        }

        // display correct source and text for logo
        img
            .attr("xlink:href", `../Winners/${src}`)
            .attr("x", margin)
            .attr("y", margin)
            .attr("width", width - margin)
            .attr("height", height - margin)
            .on("mouseenter", function(event, d) {

                d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .html(text)
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY) + "px")
            })
            .on("mouseout", function(event, d) {
                
                d3.selectAll(".tooltip")
                    .remove();
            });
    
    }

    // on change of filter change the Score Table that is displayed
    function scoreTable(data) {

        // create array of rolled won mathces per teams
        let rolledWin = d3.rollup(data, 
            v => (v.length), 
            d => d.Winner);

        let winArray = Array.from(rolledWin);

        // create array of rolled lost mathces per teams
        let rolledLos = d3.rollup(data, 
            v => (v.length), 
            d => d.Looser);

        let losArray = Array.from(rolledLos);
        
        // create array of objects with info of lost/won matches 
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

        // get extent of wins and loses, compare, and choose the highest number for extent
        let winExtent = d3.extent(winLosArray, function(d) {
            return parseFloat(d.winC)
        });
        //console.log("win", winExtent)

        let losExtent = d3.extent(winLosArray, function(d) {
            return parseFloat(d.losC)
        });
        //console.log("los", losExtent)

        var bigExtent = null;
        if (winExtent[1] >= losExtent[1]) {
            bigExtent = winExtent[1]
        } else {
            bigExtent = losExtent[1] 
        }
        bigExtent += 1;

        // get extent of matches played
        let matchExtent = d3.extent(winLosArray, function(d) {
            return parseFloat(d.matcC)
        });

        // set size for plot
        const width = 450;
        const height = 450;
        const margin = 50;

        // scaling height
        let y_scale = d3.scaleLinear()
            .range([height - margin, margin])
            .domain([0, bigExtent]);

        // scaling width
        let x_scale = d3.scaleLinear()
            .range([margin, width - margin])
            .domain([0, bigExtent]);
        
        //console.log(x_scale(winLosArray[1].matcC))

        // scaling radius
        let r_scale = d3.scaleLinear()
            .range([5, 10])
            .domain(matchExtent);

        // scaling hue
        let h_scale = d3.scaleOrdinal()
            .range(d3.schemeCategory10)
            .domain(d3.range(winLosArray.length));

        // remove svg, to not load multiple ones
        d3.select('#svg4').remove()

        // create axis
        let y_axis = d3.axisLeft(y_scale);
        let x_axis = d3.axisBottom(x_scale);

        // create svg
        const svgSP = d3.select('#vis4')
            .append("svg")
            .attr("id", "svg4")
            .attr("width", width + (margin * 4))
            .attr("height", height)

        // set X axis
        svgSP
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
         svgSP
         .append("g")
             .attr("class", "y_axis")
             .attr("transform", `translate(${margin}, 0)`) 
             .call(y_axis);

         // set title of y axis
         d3.select(".y_axis")
         .append("text")
         .text("Won matches")
         .style("fill", "black")
         .attr("transform", `rotate(-90, 0, ${margin - 20}) translate(${-margin - 100 }, 0)`)
         .attr("class", "axis-title")

        const legend = svgSP
            .append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width } , ${margin *2} )`);

        legend
        .append("text")
            .text("Teams")
            .style("fill", "black")
            .attr("x", 0)
            .attr("y", (- margin + 10))
            .attr("class", "axis-title")

        const legendItems = legend.selectAll(".legend-item")
            .data(winLosArray)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legendItems.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", (d, i) => h_scale(i));

        legendItems.append("text")
            .attr("class", "legend-text")
            .attr("x", 15)
            .attr("y", 8)
            .text(d => d.team);


        // variables for tooltip display - not necessary, but it was buggy before....
        let tooltipDisplayed = false;
        let tooltipX = null;
        let tooltipY = null;

        // plot dots on area
        svgSP.selectAll("circle")
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
            .attr("fill", (d, i) => h_scale(i) )
            //.attr("class", "circleS")
            .on("mouseenter", function(event, d) {
                //console.log(event);
                if (!tooltipDisplayed) {
                    tooltipX = event.pageX + 20;
                    tooltipY = event.pageY;

                    d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .html(d.team + "<br> Matches: " + d.matcC + "<br> Wins: " + d.winC + " (" + (d.winR * 100).toFixed(1) + "%) <br> Losses: " + d.losC  + " (" + (d.losR * 100).toFixed(1) +"%)")
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

    
    // on change of filter change the Matches Played Map that is displayed
    function cityMap(data) {

        // rolle data to get number of matches, including geo data
        let rolledData = d3.rollup(data, 
            v => ({count: v.length, lat: +v[0].lat, long: +v[0].long}), 
            d => d.City);

        let rollArray = Array.from(rolledData);
        //console.log(rollArray);
        
        // calculate center of the map based on current filter
        const centroid = rollArray.reduce((acc, point) => {
            //console.log(point[1].long, point[1].lat)
            return[acc[0] + point[1].long, acc[1] + point[1].lat]
        }, [0, 0]).map(coord => coord / rollArray.length)
        //console.log(centroid)

        // calculate bounds of the map based on current filter 
        const bounds = rollArray.reduce((acc, point) => {
            return [
                Math.min(acc[0], point[1].long),
                Math.min(acc[1], point[1].lat),
                Math.max(acc[2], point[1].long),
                Math.max(acc[3], point[1].lat),
            ]
        }, [Infinity, Infinity, -Infinity, -Infinity]);
        //console.log(bounds)
         
        // set center and bounds
        mapBox.setCenter(centroid);
        mapBox.fitBounds(bounds, {
            padding: 10
        });// (bounds, {padding: 100});
        
        // check out extent
        let rolleExtent = d3.extent(rolledData, function(d) {
            return parseFloat(d[1].count)
        });

        // scaling radius
        let r_scale = d3.scaleLinear()
            .range([2, 25])
            .domain([0, rolleExtent[1]]);

        // remove svg, to not load multiple ones
        d3.select('#svg5').remove()

        // __________________________________________________________size as variable (same as container) stylesheet______________
        const svgMap = d3.select(container)
            .append("svg")
            .attr("id", "svg5")
            .attr("width", "700")
            .attr("height", "400")
            .style("position", "absolute")
            .style("z-index", 2);

        // "scale" lat/long to map 
        const project = (d) => { return mapBox.project(new mapboxgl.LngLat(d[1].long, d[1].lat)); }

        let tooltipDisplayed = false;
        let tooltipX = null;
        let tooltipY = null;

        // variables for tooltip display - not necessary, but it was buggy before....
        const dots = svgMap.selectAll("circle")
            .data(rolledData)
            .enter()
            .append("circle")
            .attr("r", function(d) {
                return(r_scale(d[1].count))
            })
            .attr("class", "circleM")
            .on("mouseover", function(event, d) {
                //console.log(event);
                if (!tooltipDisplayed) {
                    tooltipX = event.pageX +  20;
                    tooltipY = event.pageY;

                    d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .html(d[0] + " " + d[1].count + " matches played")
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

        // re-render dots, when map is scrolled/moved
        const render = () => {
            dots
                .attr("cx", d => project(d).x)
                .attr("cy", d => project(d).y)
        }

        mapBox.on("viewreset", render);
        mapBox.on("move", render);
        mapBox.on("moveend", render);
        render();
    }




})();