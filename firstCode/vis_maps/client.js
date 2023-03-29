
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

    mapboxgl.accessToken = token;

    const mapBox = new mapboxgl.Map({
        container: "div3",
        style: "mapbox://styles/mapbox/streets-v9",
        center: [ 73, -3],
        zoom: 2.2
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
        //console.log("Cleaned data", data)


        let rolledData = d3.rollup(data, 
            v => ({count: v.length, lat: v[0].lat, long: v[0].long}), 
            d => d.City);

        
        let check = Array.from(rolledData);
        //console.log("rolled data", check);
        //console.log(check[1][1].lat);

        
        let rolleExtent = d3.extent(rolledData, function(d) {
            return parseFloat(d[1].count)
        });
        //console.log(rolleExtent)

        // scaling radius
        let r_scale = d3.scaleLinear()
            .range([2, 25])
            .domain([0, rolleExtent[1]]);


        d3.select('#svg2').remove()

        const svg = d3.select(container)
            .append("svg")
            .attr("id", "svg2")
            .attr("width", "1000")
            .attr("height", "500")
            .style("position", "absolute")
            .style("z-index", 2);

        const project = (d) => { return mapBox.project(new mapboxgl.LngLat(d[1].long, d[1].lat)); }

        let tooltipDisplayed = false;
        let tooltipX = null;
        let tooltipY = null;

        const dots = svg.selectAll("circle")
            .data(rolledData)
            .enter()
            .append("circle")
            .attr("r", function(d) {
                return(r_scale(d[1].count))
            })
            .style("fill", '#ff0000')
            .on("mouseover", function(event, d) {
                //console.log(event);
                if (!tooltipDisplayed) {
                    tooltipX = event.pageX;
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