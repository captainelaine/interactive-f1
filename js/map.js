var countryById = d3.map();

function drawmapchart(map1,map2,map3,mapline) {

  console.log("data after load", mapline);
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

  var maptooltip = d3.select("body").append("div").attr("class", "maptooltip");

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
          //console.log("filterValue", filterValue);
          redraw();
      });

  d3.select("#mapslider")
  .call(slider);

  var teams = [];

  var multifullwidth = 170,
      multifullheight = 102;

  var multimargin = {top: 20, right: 15, bottom: 20, left: 25},
      multiwidth = multifullwidth - multimargin.left - multimargin.right,
      multiheight = multifullheight - multimargin.top - multimargin.bottom;


  var x = d3.time.scale()
      .range([0, multiwidth]);

  var y = d3.scale.linear()
      .range([multiheight, 0]);

  var yAxis = d3.svg.axis()
        .orient("left")
        .ticks(2)
        .outerTickSize(0)
        .innerTickSize(0)
        //.tickFormat(d3.format("s")); // thousands
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
          return "lightgray";
        }

        function getText(d) {
          var dataVal = getData(d);
          if (dataVal) {
              return "Country:" + dataVal.country + "</br> "+"Winner: " + dataVal.Winner + "</br>" + "Team: " + dataVal.Team + "</br>" + "Seaon: " + dataVal.Year;
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
              .attr("id1", function(d){
                return d.id;
              })
              .attr("id2", function(d){
                return d.properties.name;
              })
              .attr("d", path)
              .attr("fill", function(d,i) {
                  return getColor(d);
              })
              .on("mouseover", mapmouseover)
              .on("mousemove", mapmousemove)
              .on("mouseout", mapmouseout);

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

          svg.selectAll("path.countries")
              // .transition()
              .attr("fill", function(d,i) {
                  return getColor(d);
              });
        }

        function mapmouseover(d){
        console.log(d);
        console.log(map1);

        d3.select(this)
        .transition()
        .style("stroke", "gray")
        .style("stroke-width", "2");

        d3.select(this).moveToFront();

       maptooltip
       .style("display", null)
       .html("<p>" + getText(d) + "</p>");
      }
        function mapmousemove(d) {
         maptooltip
           .style("top", (d3.event.pageY + 10) + "px" )
           .style("left", (d3.event.pageX - 150) + "px");
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
//Now is the variables for the multiple chart
var explain = {
    "AUS": "The Australian Grand Prix Corporation coined the phrase 'a great place for the race' and Melbourne is just that. The climate in late summer is perfect, the people are friendly and, to top it all, the Grand Prix is one of the most well organised of the year.",

    "MYS":"Designed by Hermann Tilke, Sepang is one of the most technical circuits in Formula One. </br>The combination of long high-speed straights, and tight twisting complexes make the track very complicated, but also perfect for overtaking as the track itself is very wide.",

    "CHN" : "The Shanghai International Circuit was designed as the race circuit for the new millennium. And the modern track, with its stunning architecture, has achieved its goal of becoming China's gateway to the world of Formula One racing since it debuted on the calendar in 2004.",

    "ESP": "The Formula One teams are no strangers to the Circuit de Barcelona-Catalunya (formerly known as the Circuit de Catalunya);</br>Barcelona's mix of high- and low-speed corners, plus its abrasive and rather bumpy track surface, makes for a physically and mechanically taxing race.",

    "MCO": "The Monaco Grand Prix is the one race of the year that every driver dreams of winning. Like the Indy 500 or Le Mans, it stands alone, almost distinct from the sport from which it was born. </br>A combination of precision driving, technical excellence and sheer bravery is required to win in Monte Carlo, facets which highlight the differences between the great and the good in Formula One.",

    "CAN": "In the 1960s the rivalry between French and English speaking Canada meant that the country's Grand Prix had two homes: Mosport Park one year and Mont-Tremblant the next. </br>By 1970, however, Mont-Tremblant was deemed too dangerous and the race moved full time to Mosport Park.",

    "GBR": "Like so many of England's racing circuits, Silverstone started life as an aerodrome. The circuit was fast and challenging and in 1949 the shape was formed that remains the basis of the track to this day.",

    "HUN": "Hungary first hosted a Grand Prix in the 1930s, but following the Second World War and the building of the Iron Curtain it was not until the 1960s that motorsport began to find a place in the country.",

    "BEL": "Belgium's Spa-Francorchamps circuit is among the most historic on the Formula One calendar, having hosted a (non-championship) Grand Prix as long ago as 1924, and remains one of the most popular venues with drivers and fans alike.",

    "ITA": "Monza is regarded by many as the embodiment of Formula One racing.</br>Not only is it a fantastic example of a track that combines speed with skill, it also has a heart and soul all of its own. </br>It has seen some of the finest races of all time, but also some of the sport's worst accidents.",

    "SGP": "In 2008 Singapore had the honour of hosting the first night-time event in Formula One history. </br>The inaugural Singapore Grand Prix proved a huge hit, staged on a new street circuit, with the city's famous skyline providing a truly spectacular backdrop.",

    "JPN": "One of the greatest tracks used in Formula One racing today, Japan's Suzuka circuit is a massive test of car and driver ability.Built by Honda as a test facility in 1962, the track was designed by Dutchman John Hugenholz, the Hermann Tilke of his day.",

    "BRA": "In 1938 a huge plot of land was bought in Sao Paulo by two local property developers who intended to build a large housing development.</br> It soon became clear, however, that one part of the land was not suitable for housing and so they decided to build a racing circuit instead.",

    "ARE": "Abu Dhabi is a city on the move. Not content with enjoying one of the world's richest oil reserves, the region has recently thrown itself into a massive programme of development. And one of the jewels in Abu Dhabi's crown is the new 5.55-kilometre Yas Marina Circuit, which on November 1, 2009, hosted the country's inaugural Grand Prix.",

    "BHR": "Located at Sakhir, 30 km south-west of the island's capital, Manama, the Hermann Tilke designed circuit contains no less than five track layouts within one complex. Over 12,000 tonnes of stone were used in the build, a third of it Welsh granite, chosen for the track surface due to its excellent adhesive qualities.",

    "USA":"The 2012 season saw Formula One racing return to the United States for the first time since 2007 with an all-new venue in Austin, Texas. The Circuit of The Americas is the first purpose-built F1 facility in the US designed for any and all classes of racing and was officially opened on October 21, 2012.",

    "FRA": "It was one of the oldest motor races in the world.Unusually even for a race of such longevity, the location of the grand prix moved frequently with 16 different venues having been used over its life, a number only eclipsed by the Australian Grand Prix of the older races. ",

    "DEU": "The original Hockenheim circuit was built in 1939 as a high-speed test track for Mercedes-Benz, who needed a venue to test for the Tripoli Grand Prix. It was almost eight kilometres long and was formed of two long, curved straights with a long corner at either end.",

    "TUR": "The Turkish Grand Prix was a Formula One motor race that was first held on August 21, 2005 as part of the 2005 Formula One season and last held on 8 May 2011 as part of the 2011 Formula One season. It was held at Istanbul Park Circuit, designed by Hermann Tilke. The circuit is an anticlockwise circuit.",

    "SMR": "The San Marino Grand Prix was a Formula One championship race which was run at the Autodromo Enzo e Dino Ferrari in the town of Imola, near the Apennine mountains in Italy, between 1981 and 2006. It was named after nearby San Marino because there already was an Italian Grand Prix held at Monza.",

    "AUT": "The story of the Austrian Grand Prix begins, as with most Grands Prix, with a local group of motor racing enthusiasts in the 1950s. Over subsequent years, numerous improvement plans for the circuit stalled until it was eventually redeveloped and re-branded as the Red Bull Ring and reopened in 2011.",

    "KOR": "The Korean Grand Prix (Korean: 코리아 그랑프리) was a Formula One race held in the Republic of Korea, from 2010 until 2013, when it was dropped from the Formula One calendar.",

    "IND": "The Indian Grand Prix (इंडियन ग्रांड प्रिक्स) was a Formula One race in the calendar of the FIA Formula One World Championship, which was held at the Buddh International Circuit in Greater Noida near New Delhi.",

    "RUS": "The Sochi circuit, located in the Black Sea resort of the same name, is the first purpose-built Formula One facility in Russia and hosted the country's inaugural Grand Prix in October 2014, in the same year that the city also stages the Winter Olympics. ",

    "MEX": "The history of Autodromo Hermanos Rodriguez is interwoven with that of brothers Ricardo and Pedro Rodriguez. It was the former's emergence in 1961,prompting the decision to build a 5-kilometre circuit in the public Magdalena Mixhuca park.",

    "No Race": "Formula One has not developed this country for race."
};
  var current = "BRA";  //the first one shown is Australian Grand Prix

  var countrylist = d3.keys(explain);
  countrylist = countrylist.slice(0, countrylist.length-1);

  var area = d3.svg.area()
      .x(function(mapline) { return x(mapline.Year); })
      .y0(multiheight)
      .y1(function(mapline) { return y(mapline[current]); });

  var line = d3.svg.line()
      .x(function(mapline) { return x(mapline.Year); })
      .y(function(mapline) { return y(mapline[current]); });

  teams= d3.nest()
      .key(function(d) { return d.Team; })
      .sortValues(function(a,b) {
        return a.Year - b.Year;

    }) // date is already parsed years
      .entries(mapline);

  console.log(teams);

  x.domain([
    d3.min(teams, function(s) { return s.values[0].Year; }),
    d3.max(teams, function(s) { return s.values[s.values.length - 1].Year; })
  ]);

  y.domain([0, d3.max(teams, function(c) {
        return d3.max(c.values, function(v) { return +v[current];}); // current illness
      })
  ]);
  yAxis.scale(y);

  var multisvg = d3.select("#multichart").selectAll("svg")
      .data(teams)
      .enter().append("svg")
      .attr("width", multifullwidth)
      .attr("height", multifullheight)
      .append("g")
      .attr("transform", "translate(" + multimargin.left + "," + multimargin.top + ")")
      .each(multiple);

    d3.select("div#nodata").style("display", "none");

  function multiple(teams) {

    // set up each individual chart, with country as data

    var localsvg = d3.select(this);  //svg is a single chart, with country data.

    // Add the area path elements. Note: the y-domain is set per element.
    localsvg.append("path")
        .attr("class", "multiarea")
        .attr("d", function(d) { return area(d.values); });

    // Add the line path elements. Note: the y-domain is set per element.
    localsvg.append("path")
        .attr("class", "multiline")
        .attr("d", function(d) { return line(d.values); });

    localsvg.append("text")
      .attr("class", "multiaxislabel")
      .attr("x", 0)
      .attr("y", multiheight + multimargin.bottom/2)
      .style("text-anchor", "start")
      .text(function(d) { return d.values[0].Year; });

    // Add a small label for the symbol name.

    localsvg.append("text")
      .attr("class", "multilabel")
      .attr("x", multiwidth/2)
      .attr("y", -8)
      .style("text-anchor", "middle")
      .text(function(d) { return d.key; });

    localsvg.append("text")
      .attr("class", "multiaxislabel")
      .attr("x", multiwidth)
      .attr("y", multiheight + multimargin.bottom/2)
      .style("text-anchor", "end")
      .text(function(d) {
        return d.values[d.values.length - 1].Year;
        });

      // put a dot on last point
    localsvg.append("circle")
      .attr("class", "endpoint")
      .attr("cx", function(d) {return x(d.values[d.values.length - 1].Year);})
    .attr("cy", function(d) { return y(d.values[d.values.length - 1][current]);})
      .attr("r", 2);

      // label the value on the last point
    localsvg.append("text")
     .attr("class", "endpoint")
      .attr("x", multiwidth)
      .attr("y", function(d) {return y(d.values[d.values.length - 1][current]);})
      .attr("dy", -8)
      .style("text-anchor", "end")
      .text(function(d) { return d.values[d.values.length - 1][current]; });

    localsvg.append("g").attr("class", "y axis").call(yAxis);

  }

  d3.selectAll("path.countries").on("click", function() {
      d3.selectAll("path.countries").classed("current", false);
      d3.select(this).classed("current", true);

      var label = d3.select(this).attr("text");
      var selection = d3.select(this).attr("id1");
      var title= d3.select(this).attr("id2");
      current = selection;

     transition(current);
     d3.select("#multiexplain p").html(explain[current]);
     d3.select("#multiexplain h3").text(title);

     console.log(title);
  });

  function transition(current) {

    if (countrylist.indexOf(current) == -1) {
      console.log("show it", current);
      d3.select("div#nodata").style("display", null);
    } else { // is data, update charts...
      d3.select("div#nodata").style("display", "none");

      y.domain([0, d3.max(teams, function(c) {
          return d3.max(c.values, function(v) { return +v[current];});
        })
      ]);
      yAxis.scale(y);
     //console.log("in trans", y.domain());

      // existing svg that created each chart - now we transition each one

      multisvg.each(function(teams) {

        var chartTrans = d3.select(this).transition();

        chartTrans.select(".y.axis").call(yAxis);

        chartTrans.select("path.multiarea")
          .attr("d", function(d) { return area(d.values); });
        chartTrans.select("path.multiline")
        .attr("d", function(d) { return line(d.values); });

        chartTrans.select("circle.endpoint")
        .attr("cy", function(d) {return y(d.values[d.values.length - 1][current]);});

          // label the value on the last point
        chartTrans.select("text.endpoint")
          .attr("y", function(d) {return y(d.values[d.values.length - 1][current]);})
          .text(function(d) { return d.values[d.values.length - 1][current]; });
        }); // end each
      }
  }


}
