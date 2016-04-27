
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
  resize("page5");
  resize("homepage");


  window.onresize = function() {
    resize("ms1");
    resize("ms2");
    resize("ms3");
    resize("page4");
    resize("page5");
    resize("homepage");
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
    .defer(d3.csv, "data/ISOmulti.csv", typeFix)
    .defer(d3.csv, "data/teamtotal.csv")
    .await(loadedData);

function loadedData(error,linechart,barchart,map1,map2,map3,mapline,endlinechart) {

  console.log(error);
  drawlinechart1(linechart);
  drawbarchart1(barchart);
  drawmapchart(map1,map2,map3,mapline);
  drawendlinechart(endlinechart);


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

function typeFix(d) {
  d.AUS = +d.AUS;
  d.MYS = +d.MYS;
  d.CHN = +d.CHN;
  d.ESP = +d.ESP;
  d.MCO = +d.MCO;
  d.CAN = +d.CAN;
  d.GBR = +d.GBR;
  d.HUN = +d.HUN;
  d.BEL = +d.BEL;
  d.ITA = +d.ITA;
  d.SGP = +d.SGP;
  d.JPN = +d.JPN;
  d.BRA = +d.BRA;
  d.ARE = +d.ARE;
  d.BHR = +d.BHR;
  d.USA = +d.USA;
  d.FRA = +d.FRA;
  d.DEU = +d.DEU;
  d.TUR = +d.TUR;
  d.SMR = +d.SMR;
  d.AUT = +d.AUT;
  d.KOR = +d.KOR;
  d.IND = +d.IND;
  d.RUS = +d.RUS;
  d.MEX = +d.MEX;

  return d;
}
