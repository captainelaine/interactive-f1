var countryById = d3.map();

function drawmapchart(map1,map2,map3) {

  var width = 800,
  height = 480;

  var svg = d3.select('#mapchart').append('svg')
    .attr('width', width)
    .attr('height', height);

  var dateFormat = d3.time.format("%Y");

  var projection = d3.geo.mercator()
    .scale(160) // mess with this if you want
    .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);

    var maptooltip = d3.select("#mapchart").append("div").attr("class", "maptooltip");

  var colorScale = d3.scale.ordinal().range(["red","rgb(22,199,252)"]);
  var data = [];
  var filterValue = "2015";

  // see examples in http://www.macwright.org/chroniton/example/

  var slider = chroniton()
      .domain([dateFormat.parse("2000"),dateFormat.parse("2015")])
      .labelFormat(d3.time.format('%Y'))
      .width(700)
      .height(50)
      .playButton(true) // can also be set to loop
      .on("change", function(d) {
          filterValue = dateFormat(d3.time.year(d));
          console.log("filterValue", filterValue);
          redraw();
      });

  d3.select("#mapslider")
  .call(slider);

  // we use queue because we have 2 data files to load.



  function getData(d) {
    var dataRow = countryById.get(d.id); // best match
    var dataVal = null;
    // must be a more elegant way to do this with all the checks, but i'm tired
    if (dataRow) {
        dataVal = data.get(dataRow.ShortName);
    }
    if (dataVal) {
        //console.log("dataVal shortname", dataVal[0].Country);
        dataVal = dataVal.filter(function (d) {
            return d.Year == filterValue;
        });
    }
    if (dataVal) {
        dataVal = dataVal[0];
    }
    return dataVal;
  }

  function getColor(d) {
    var dataVal = getData(d);
    if (dataVal) {
        return colorScale(dataVal.result);
    }
    // if we fall through, i.e., no match
    //console.log("no dataRow", d);
    return "lightgray";
  }

  function getText(d) {
    var dataVal = getData(d);
    if (dataVal) {
        return "Country:" + dataVal.country + "   "+"Winner: " + dataVal.Winner + "   " + "Team: " + dataVal.Team + "   " + "Seaon: " + dataVal.Year;
    } else {
        return d.properties.name + ": No Race This Year.";
    }
  }


    data = d3.nest()
        .key(function(d) {
            return d.Country;
        })
        .map(map1, d3.map);

    console.log("map result", data.get("Australia"));

    colorScale.domain(d3.extent(map1, function(d) { return d.result;}));

    var countriesworld = topojson.feature(map3, map3.objects.units).features;
    console.log(countriesworld);

    svg.selectAll("path.countries")
        .data(countriesworld)
        .enter()
        .append("path")
        .attr("class", "countries")
        .attr("d", path)
        .attr("fill", function(d,i) {
            return getColor(d);
        })
        .on("mouseover", mapmouseover)
        .on("mousemove", mapmousemove)
        .on("mouseout", mapmouseout);




    // The d3-legend component is called here:

    svg.append("g")
      .attr("class", "legendLinear")
      .attr("transform", "translate(20,400)");

    var legendLinear = d3.legend.color()
      .shapeWidth(30)
      .orient("vertical")
      .scale(colorScale);

    svg.select(".legendLinear")
      .call(legendLinear);


  function redraw(){

  // we might want to redo the color scale and legend here, not sure.

    svg.selectAll("path.countries")
        // .transition()
        .attr("fill", function(d,i) {
            return getColor(d); // the filtervalue is a global in the func.
        });
    //fix tooltips
    d3.selectAll("path.countries title")
      .text(function (d){
            return getText(d);
        });
  }

  function mapmouseover(d){
  console.log(d);
  console.log(map1);

  var tipdata = map1.filter(function(data){
    if(data.ISO == d.id && data.Year == filterValue){
      return true;
    }
  });

  console.log(tipdata);


  d3.select(this)
  .transition()
  .style("stroke", "gray")
  .style("stroke-width", "2");

  d3.select(this).moveToFront();

  maptooltip
    .style("display", null) // this removes the display none setting from it
    .html("<p>Country: " + d.properties.name + "</br>" + "Winner: " + tipdata[0].Winner + "Team: " + tipdata[0].Team + "</p>");


}

  function mapmousemove(d) {
   maptooltip
     .style("top", (d3.event.pageY - 10) + "px" )
     .style("left", (d3.event.pageX + 10) + "px");
   }


 function mapmouseout(d) {
   d3.select(this)
     .transition()
     .style("stroke", null)
     .style("stroke-width", null);

   maptooltip.style("display", "none");  // this sets it to invisible!
 }



d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

}
