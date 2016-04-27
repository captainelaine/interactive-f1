function drawendlinechart(data) {

  var linefullwidth = 850;
  var linefullheight = 400;
  var linemargin = {top:50, right: 150, bottom: 50, left:80};
  var linewidth = linefullwidth - linemargin.left - linemargin.right;
  var lineheight = linefullheight - linemargin.top - linemargin.bottom;
  var linechart1 = d3.select("#linechart2")
      .append("svg")
      .attr("width", linefullwidth)
      .attr("height", linefullheight)
      .append("g")
      .attr("transform", "translate(" + linemargin.left + "," + linemargin.top + ")");
  var linexScale = d3.time.scale()
             .range([0,linewidth]);

  var lineyScale = d3.scale.linear()
            .range([0, lineheight]);

  var linexAxis = d3.svg.axis()
      .scale(linexScale)
      .orient("bottom")
      .ticks(10)
      .tickFormat(function(d){
        return dateFormat(d);
      })
      .innerTickSize([10])
      .outerTickSize([10]);

  var lineyAxis = d3.svg.axis()
      .scale(lineyScale)
      .orient("left")
      .outerTickSize([10]);

  var line = d3.svg.line()
      .x(function(d){
        return linexScale(dateFormat.parse(d.year));
      })
      .y(function(d){
        return lineyScale(+d.point);
      });

  var linecharttooltip1 = d3.select("#linechart2")
      .append("div")
      .attr("class","linecharttooltip1");

      console.log(data);
      var years = ["2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015"];


      var fulldata = [];

     data.forEach(function(d,i){
       var performance=[];
       years.forEach(function(y){
         if(d[y]){
           performance.push({
             year: y,
             point: d[y],
             team: d.Team

           });
         }
       });


      fulldata.push({
        team:d.Team,
        performance: performance,
      });

     });
     console.log(fulldata);

    linexScale.domain(
      d3.extent(years, function(d){
        return dateFormat.parse(d);
      })
    );

    lineyScale.domain([
      d3.max(fulldata, function(d){
        return d3.max(d.performance, function(d){
          return +d.point;
        });
      }),
      0
    ]);

    var drawline = linechart1.selectAll("g.lines")
       .data(fulldata)
       .enter()
       .append("g")
       .attr("class","lines")
       .on("mouseover", mouseoverline)
       .on("mouseout", mouseoutline)
       ;

    drawline.selectAll("path")
       .data(function(d){
         return [d.performance];
        })
       .enter()
       .append("path")
       .attr("class","line")
       .attr("d",line)
       .style("stroke", function(d,i){
         if (d[i].team === "Ferrari"){
           return "red";
         } else if (d[i].team === "Mercedes") {
           return "steelblue";
         } else if (d[i].team === "Red Bull") {
           return "purple";
         } else if (d[i].team === "McLaren") {
           return "rgb(254,197,54)";
         } else {
         return "lightgray";
         }
       });



    var linecircles = drawline.selectAll("circle")
        .data(function(d){
          return d.performance;
        })
        .enter()
        .append("circle");

    linecircles.attr("cx", function(d){
      return linexScale(dateFormat.parse(d.year));
    })
      .attr("cy", function(d){
        return lineyScale(+d.point);
      })
      .attr("r",3)
      .style("opacity", 0);

    linecircles
    .on("mouseover", mouseovercircle)
    .on("mousemove", mousemovecircle)
    .on("mouseout",mouseoutcircle);

    drawline.append("text")
    .datum(function(d){
      return{
        name: d.team,
        value: d.performance[d.performance.length -1]
      };
    })
    .attr("transform", function(d){
        return "translate("+ (linewidth + 3) + "," + lineyScale(+d.value.point) +")";
      })
      .attr("x",3)
      .attr("dy", "1px")
      .text(function(d){
        return d.name;
      })
      .classed("endlinenamelabel",true);

     d3.selectAll(".endlinenamelabel")
     .classed("hidden", true);

     linechart1.append("g")
       .attr("class","linexaxis")
       .attr("transform", "translate(0," + lineheight + ")")
       .call(linexAxis);

     linechart1.append("g")
          .attr("class", "lineyaxis")
          .call(lineyAxis);

      d3.selectAll("g.lines")
        .on("mouseover", mouseoverline)
        .on("mouseout", mouseoutline);

      linechart1.append("text")
        .attr("class", "linexlabel")
        .attr("transform", "translate(" + (linemargin.left + linewidth / 2) + " ," +
                                (lineheight + linemargin.bottom) + ")")
         .style("text-anchor", "middle")
         .attr("dy", "-1px")
         .attr("dx", "-70px")
         .text("Season");

       linechart1.append("text")
       .attr ("class", "lineylabel")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - linemargin.left) // you may need to adjust this
      .attr("x", 0 - (lineheight / 2)) // you may need to adjust
      .attr("dy", "3em")
      .style("text-anchor", "middle")
      .text("Total Points");

      function mouseoverline(d) {
        d3.selectAll("path.line").classed("unfocused", true);
        d3.select(this).select("path.line").classed("unfocused",false).classed("focused", true);

        d3.selectAll(".endlinenamelabel").classed("unfocused",true);
        d3.select(this).select(".endlinenamelabel").classed("hidden",false).classed("focused",true);
      }

      function mouseoutline(d){
        d3.selectAll("path.line").classed("unfocused",false).classed("focused",false);
        linecharttooltip1.style("display","none");
        d3.selectAll("text.endlinenamelabel").classed("focused",false).classed("hidden",true);
    }

      function mouseovercircle(d){
        d3.select(this)
        .transition()
        .style("opacity",1)
        .style("fill", function(d){
          if (d.driver==="Michael Schumacher"){
            return "red";
          } if(d.driver ==="Fernando Alonso") {
            return "rgb(30,164,224)";} else {
            return "gray";
          }
        })
        .attr("r",6);

        linecharttooltip1
        .style("display",null)
        .html("<p>Team:" + d.team + "</br>Season:" + d.year + "</br>Points:" + d.point + "</p>");
      }

      function mousemovecircle(d){
        linecharttooltip1
        .style("top", (d3.event.pageY + 5) + "px" )
        .style("left", (d3.event.pageX - 200) + "px");
      }

      function mouseoutcircle(d){
        d3.select(this)
        .transition()
        .style("opacity",0)
        .attr("r",3);

        linecharttooltip1
        .style("display","none");
        }
}
