function drawbarchart1(data){
  var barfullwidth = 800;
  var barfullheight = 500;
  var barmargin= {top:20, right: 50, bottom: 20, left:100};

  var barheight = barfullheight - barmargin.top - barmargin.bottom;
  var barwidth = barfullwidth - barmargin.left - barmargin.right;

  var drawbarchart = d3.select("#msbarchart")
   .append("svg")
   .attr("width", barfullwidth)
   .attr("height", barfullheight)
   .append("g")
   .attr("transform", "translate(" + barmargin.left + "," + barmargin.top + ")");

  drawbarchart.append("g")
     .attr("class","barxaxis");
  var barbuttons = d3.selectAll("button")
        .classed("barbutton", true);

  var barxScale = d3.scale.linear()
     .range([0,barwidth]);

  var baryScale = d3.scale.ordinal()
     .rangeRoundBands([0,barheight], .1);

  var barxAxis = d3.svg.axis()
    .scale(barxScale)
    .orient("top")
    .ticks(10)
    .innerTickSize([5])
    .outerTickSize([5]);

  var bartooltip = d3.select("#msbarchart")
    .append("div")
    .attr("class","bartooltip");

    var barvalue = d3.select("#barmenu select").property("value")
    var bardata = top10(data, barvalue);

    console.log(barvalue);

    d3.select("#barmenu select")
       .on("change", function(){
         barvalue = d3.select("#barmenu select").property("value");
         bardata = top10(data, barvalue);
       redraw(bardata, barvalue);
     });

    function top10(bardata, barvalue){
    bardata.sort(function(a,b){
     return d3.descending(+a[barvalue], +b[barvalue]);
    })
    slicedata = bardata.slice(0,15);

    redraw(slicedata, barvalue);
    }

    function redraw(bardata, barvalue) {
    var barmax = d3.max(bardata, function(d){
     return +d[barvalue];
    });

    barxScale.domain([0,barmax]);

    baryScale.domain(d3.range(bardata.length));


    var bars = drawbarchart.selectAll("rect.bar")
       .data(bardata, function(d){
         return d.Drivername;
       });

       bars
       .attr("fill","gray")
       .attr("opacity","0.2");



    bars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", function(d){
        if (d.Drivername==="Michael Schumacher") {
          return "red";
        } else {
          return "gray";
        }
      })
      .attr("opacity", 0.4)
      .on("mouseover",mouseoverBar)
      .on("mouseout", mouseoutBar);

    bars.exit()
      .transition()
      .duration(300)
      .attr("width",0)
      .remove();

    bars
      .transition()
      .duration(500)
      .ease("quad")
      .attr("width",function(d){
        return barxScale(+d[barvalue]);
      })
      .attr("height", baryScale.rangeBand())
      .attr("fill", function(d){
        if(d.Drivername ==="Michael Schumacher"){
          return "red";
        } else {
          return "gray";
        }
      })
      .attr("opacity",0.4)
      .attr("transform", function(d,i) {
                              return "translate(0," + baryScale(i) + ")";
                          });
    drawbarchart.transition().select(".barxaxis")
    .call(barxAxis);

    var barlabel = drawbarchart.selectAll("text.barlabels")
      .data(bardata, function(d){
        return d.Drivername;
      });

    barlabel.enter()
      .append("text")
      .attr("class", "barlabels");

    barlabel.exit()
      .remove();

    barlabel.transition()
      .duration(500)
      .text(function(d){
        return +d[barvalue];
      })
      .attr("x",function(d){
        return barxScale(+d[barvalue]);
      })
      .attr("y",function(d,i){
        return baryScale(i);
      })
      .attr("dy","1.2em")
      .attr("dx", "1.8em")
      .attr("text-anchor","end");

    var barlabeldriver = drawbarchart.selectAll("text.barlabeldriver")
      .data(bardata, function(d){
        return d.Drivername;
      });

    barlabeldriver.enter()
     .append("text")
     .attr("class", "barlabeldriver");

    barlabeldriver.exit()
     .remove();

    barlabeldriver.transition()
     .duration(500)
     .text(function(d){
       return d.Drivername;
     })
     .attr("x",-3)
     .attr("transform", function(d,i) {
             return "translate(" + 0+ "," + baryScale(i) + ")"
     })
     .attr("dy", "15px")
     .attr("dx", "-3px")
     .attr("text-anchor", "end");


     function mouseoverBar(d) {
     d3.select(this)
       .classed("barfocused", true)
       .classed("barunfocused", false)

     bartooltip
     .style("display", null)
     .html("<p>Driver:" + " " +d.Drivername +
           "</p>")
           .style("top", (d3.event.pageY - 10) + "px" )
           .style("left", (d3.event.pageX + 10) + "px");

    }

    function mouseoutBar(d) {
     d3.select(this)
     .classed("barfocused", false)
     .classed("barunfocused", true)

     bartooltip
     .style("display","none");

    }
}
}
