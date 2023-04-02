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
			
    
    

    // initalising the filter
    //rolledYear = initaliseTimeline(myData);

    // set-up filter, on change process starts
    d3.select("#dropDownMenu")
        .on("change", function(e, d) {
            let selectItem = d3.select(this)
                .select("select")
                .property("value");
            filterTest(selectItem);
        })
    

    
    const dataPathWin = "../data/ipl_data.csv";

    const winData = await d3.csv(dataPathWin);
    
    const dataPahtBats = "../data/top10Batsman.csv";
    const dataPahtWick = "../data/top10Wickets.csv";
    const batsData = await d3.csv(dataPahtBats);
    const wickData = await d3.csv(dataPahtWick);
    console.log("client", wickData);


    function initaliseLogos(data) {
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 1200 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

        //var yearScale = d3.scaleLinear()
         //   .domain([2008,2020]).range([20,1150]);

        var svg = d3.select('#titleWinner').append('svg').attr('width', 1250).attr('height', 250);

        var button = document.createElement("button");
        button.id = "allBut"
        button.textContent = "2008-2020"

        document.getElementById("titleWinner").append(button);

        
        svg.append('text')
            .attr('class', 'title')
            .attr('transform','translate(550,30)')
            .style('font-weight', 'bold')
            .text('IPL Title Winners');


        var yearScale = d3.scaleLinear()
            .domain([2008,2020]).range([50,width]);

            let g = svg.append("g").selectAll('g')
            .data(data)
            .enter()
            .append('g').attr('class', (d)=>`x axis y${d.year}`)
            .attr('id', (d)=>d.year)
            .attr('class', `titleW`)
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

    }
    
    filterTest(0);
    initaliseLogos(winData);

    function showPlayers(bats, wicks) {

        var margin = {top: 50, right: 0, bottom: 75, left: 70},
        width = 600 - margin.left - margin.right,
        height = 380 - margin.top - margin.bottom;
            
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

                
        var topScorrer = d3.select("#vis2").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
                "translate(" + (margin.left -20)  + "," + margin.top + ")");
            
        d3.select("#vis2").select("svg").append('text')
            .attr('class', 'visTitle')
            .attr('transform', `translate(${(width + margin.left + margin.right) /2},${30})`)
            .style('font-weight', 'bold')
            .text('Best batsmen');

        var tip = d3.select("body")
            .append("div")
            .attr("class", "tip")
            .style("position", "absolute")
            //.style("visibility", "hidden");
        
        var topWickets = d3.select("#vis3").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

        d3.select("#vis3").select("svg").append('text')
            .attr('class', 'visTitle')
            .attr('transform', `translate(${(width + margin.left + margin.right) /2},${30})`)
            .style('font-weight', 'bold')
            .text('Best bowlers');
        

        // variables for tooltip display - not necessary, but it was buggy before....
        let tooltipDisplayed = false;
        let tooltipX = null;
        let tooltipY = null;


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
                .attr("width", function() {
                    console.log(x.bandwidth())
                    return x.bandwidth()})
                .attr("y", function(d) { return y(d[type]); })
                .attr("height", function(d) { return height - y(d[type]); })
                .style('fill', 'steelblue')
                .on("mouseover", function(event, d) {

                    if (!tooltipDisplayed) {
                        tooltipDisplayed = true;
                        tooltipX = event.pageX + 20;
                        tooltipY = event.pageY;

                        //console.log(event)
                        
                        d3.select(this)
                            .style("fill", 'Orange');
                            return tip.html(`${d.players_name} <br/>
                                Score: ${d.most_runs} <br/>
                                Team Name: ${d.team}
                            `)
                            .style("visibility", "visible")
                            .style("top", tooltipY + 'px' )
                            .style("left", tooltipX  + 'px')
                    }
                })
                .on("mouseleave", function(){

                    if (tooltipDisplayed) {
                        tooltipDisplayed = false;

                        //console.log(event)
                        
                        d3.select(this)
                            .style("fill", 'steelblue');
                        return tip.style("visibility", "hidden");
                    
                    }
                 });
        
            topScorrer.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .attr("class", "x_axisSc")
                .selectAll("text") // set text of ticks
                    .attr("transform", "rotate(-28)")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.6em")
                    .attr("text-anchor", "end");

            
                // set title of x axis
                d3.select(".x_axisSc")
                    .append("text")
                    .text("Top 10 Batsmen")
                    .style("fill", "black")
                    .attr("x", (width) / 2)
                    .attr("y", margin.bottom - 3)
                    .attr("class", "axis-title")
                    .attr("id", "axis-title-wick")

        
            topScorrer.append("g")
                .call(d3.axisLeft(y))
                .attr("class", "y_axisSc");

            d3.select(".y_axisSc")
                .append("text")
                .text("Runs scored")
                .style("fill", "black")
                .attr("transform", `rotate(-90, 0, ${50}) translate(${- 50}, 0)`)
                .attr("class", "axis-title")
        }

        
        function testRollbat(data) {

            let rolledData = d3.rollup(data, 
                v => ({seasons: v.length, 
                    players_name: v[0].players_name ,
                    most_runs: d3.sum(v, d => d.most_runs), 
                    matches: d3.sum(v, d => d.matches),
                    team: v[0].team,
                    year: "2008 - 2020"}), 
                d => d.players_name);

            let rollArray = Array.from(rolledData);
            rollArray = rollArray.sort((a, b) => d3.descending(a[1].most_runs, b[1].most_runs))
            //console.log("bats", rollArray)
            let overallBest = [];
            for (let x = 0; x < 10; x++) {
                overallBest.push(rollArray[x][1])
            }
            //console.log(overallBest);
            //overallBest = overallBest.sort((a, b) => d3.descending(a.most_runs, b.most_runs)) 
            //console.log("second", overallBest)
            return overallBest;
        }

        
        

        // variables for tooltip display - not necessary, but it was buggy before....
        let tooltipDisplayedW = false;
        let tooltipXW = null;
        let tooltipYW = null;

        function initWicket(data) {
            x.domain(data.map(function(d) { return d.players_name; }));
            y.domain([0, d3.max(data, function(d) { return d.most_wickets; })]);
            topWickets.selectAll('*').remove();
            topWickets.select("axis-title-wick").remove()
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

                if (!tooltipDisplayedW) {
                    
                    //console.log(event)

                    tooltipDisplayedW = true;
                    tooltipXW = event.pageX + 20;
                    tooltipYW = event.pageY;

                    d3.select(this)
                        .style("fill", 'Purple');
                        return tip.html(`${d.players_name} <br/>
                            Wickets: ${d.most_wickets}<br/>
                            Team Name: ${d.Team}
                        `)
                        .style("visibility", "visible")
                        .style("top", tooltipYW + 'px' )
                        .style("left", tooltipXW  + 'px')
                }
              })
              .on("mouseleave", function(){
                
                if (tooltipDisplayedW) {
                    
                    tooltipDisplayedW = false;

                    //console.log(event)
                    d3.select(this)
                    .style("fill", 'steelblue');
                    return tip.style("visibility", "hidden");
                }
              });
  
                // set x axis
                topWickets.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                    .attr("class", "x_axisW")
                    .selectAll("text") // set text of ticks
                        .attr("transform", "rotate(-28)")
                        .attr("dx", "-.8em")
                        .attr("dy", "-.6em")
                        .attr("text-anchor", "end");

              
                // set title of x axis
                d3.select(".x_axisW")
                    .append("text")
                    .text("Top 10 Bowlers")
                    .style("fill", "black")
                    .attr("x", (width) / 2)
                    .attr("y", margin.bottom - 3)
                    .attr("class", "axis-title")
                    .attr("id", "axis-title-wick")

  
                topWickets.append("g")
                    .call(d3.axisLeft(y))
                    .attr("class", "y_axisW");

                         // set title of y axis
                d3.select(".y_axisW")
                    .append("text")
                    .text("Wickets taken")
                    .style("fill", "black")
                    .attr("transform", `rotate(-90, 0, ${40}) translate(${- 50}, 0)`)
                    .attr("class", "axis-title")
        }

        
        function testRollbatW(data) {

            let rolledData = d3.rollup(data, 
                v => ({seasons: v.length, 
                    players_name: v[0].players_name ,
                    most_wickets: d3.sum(v, d => d.most_wickets), 
                    matches: d3.sum(v, d => d.matches),
                    Team: v[0].Team,
                    year: "2008 - 2020"}), 
                d => d.players_name);

            let rollArray = Array.from(rolledData);
            rollArray = rollArray.sort((a, b) => d3.descending(a[1].most_wickets, b[1].most_wickets))
            console.log("bats", rollArray)
            let overallBest = [];
            for (let x = 0; x < 10; x++) {
                overallBest.push(rollArray[x][1])
            }
            console.log(overallBest);
            overallBest = overallBest.sort((a, b) => d3.descending(a.most_wickets, b.most_wickets)) 
            console.log("second", overallBest)
            return overallBest;
        }
        
        let initalDisp = testRollbat(batsData);
        let initalDispW = testRollbatW(wicks);
        init(initalDisp, 'most_runs');
        initWicket(initalDispW);
        d3.selectAll('line').remove()
        
        var resetBut = document.getElementById("allBut");
        
        function reset() {
            let initalDisp = testRollbat(batsData);
            let initalDispW = testRollbatW(wicks);
            init(initalDisp, 'most_runs');
            initWicket(initalDispW);
            d3.selectAll('line').remove()
            filterTest(0);
        }
        
        resetBut.onclick = reset;


        d3.selectAll('.titleW')
            .on("click", function(d) {

                d3.selectAll('line').remove()
                    
                d3.select(this)
                    .append('line')
                    .attr('x1', 0)
                    .attr('y1', 160)
                    .attr('x2', 50)
                    .attr('y2', 160)
                    .attr("stroke-width","5")
                    .attr("stroke","#4682b4")
    
                init(bats.filter((e)=> e.year == this.id));
                initWicket(wicks.filter((e)=> e.year == this.id));
                
                console.log(this.id)
                console.log(typeof this.id)
                filterTest(this.id)
            })
        

    }

    showPlayers(batsData, wickData);

    // return filtered cleaned data
    function filterTest(filter) {
        console.log(filter)
        console.log(typeof filter)
        if (filter != 0) {
            var newData = myData.filter(function (d) { return d.year == filter});
            newData.sort((a, b) => d3.descending(a.Date, b.Date))
            var imgSrc = newData[0].Winner + ".png"
            var winner = newData[0];
            winner.url = imgSrc;
            scoreTable(newData);
            cityMap(newData);
        } else {
            scoreTable(myData);
            cityMap(myData);
            //console.log(myData)
        }
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
        const height = 380;
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
        
        svgSP.append('text')
            .attr('class', 'visTitle')
            .attr('transform', `translate(${(width /2)},${30})`)
            .style('font-weight', 'bold')
            .text('Score Table');

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
            .attr("x", (width) / 2)
            .attr("y", margin - 10)
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
            .attr("transform", `rotate(-90, 0, ${margin - 15}) translate(${-margin - 60 }, 0)`)
            .attr("class", "axis-title")

        const legend = svgSP
            .append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width } , ${margin + 10} )`);

        legend
        .append("text")
            .text("Teams")
            .style("fill", "black")
            .attr("x", 0)
            .attr("y", (- margin + 25))
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
            padding: 25
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
            .attr("width", "600")
            .attr("height", "340")
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