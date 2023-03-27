
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
    console.log(csvData[0])
    console.log(myData[0])
    console.log(myData[0].long, myData[0].lat)
    mapboxgl.accessToken = token;

    const mapBox = new mapboxgl.Map({
        container: "div3",
        style: "mapbox://styles/mapbox/streets-v9",
        center: [ 73, -3],
        zoom: 2.2
    });

        

    const container = mapBox.getCanvasContainer();

    const svg = d3.select(container)
        .append("svg")
        .attr("width", "1000")
        .attr("height", "500")
        .style("position", "absolute")
        .style("z-index", 2);

    const project = (d) => { return mapBox.project(new mapboxgl.LngLat(d.long, d.lat)); }

    const dots = svg.selectAll("circle")
        .data(myData)
        .enter()
        .append("circle")
        .attr("r", 7)
        .style("fill", '#ff0000');

    const render = () => {
        dots
            .attr("cx", d => project(d).x)
            .attr("cy", d => project(d).y)
    }

    mapBox.on("viewreset", render);
    mapBox.on("move", render);
    mapBox.on("moveend", render);
    render();

})();