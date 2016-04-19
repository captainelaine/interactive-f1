
//This is the script for the whole page, which make every section has the window size.
 var pagewidth = window.innerWidth;
 var pageheight = window.innerHeight;

 function resize(d) {

   document.getElementById(d).style.height = pageheight + "px";
   document.getElementById(d).style.width = pagewidth + "px";
 };


  resize("ms1");
  resize("ms2");
  resize("ms3");
  resize("page4");

  window.onresize = function() {
    resize("ms1");
    resize("ms2");
    resize("ms3");
    resize("page4");
  };

//global variable
var dateFormat = d3.time.format("%Y");


//load the data here.
queue()
    .defer(d3.csv, "data/drivertotal.csv")
    .defer(d3.csv, "data/pole.csv")
    .defer(d3.csv, "data/mapdata.csv", typestyle)
    .defer(d3.csv, "data/World_Development_Indicators_Metadata_Countries.csv", makeLookup)
    .defer(d3.json, "data/countries.json")
    .await(loadedData);

function loadedData(error,linechart,barchart,map1,map2,map3) {

  console.log(error);
  drawlinechart1(linechart);
  drawbarchart1(barchart);
  drawmapchart(map1,map2,map3);


}

function typestyle(d) {
    d.country = d.Country;
    d.year = dateFormat.parse(d.Year);
    d.result = d.Win;
    return d;
}

function makeLookup(d) {
    countryById.set(d.ISO3, d);
    return d;
}
