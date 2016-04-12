
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

  window.onresize = function() {
    resize("ms1");
    resize("ms2");
    resize("ms3");
  };

//global variable


var dateFormat = d3.time.format("%Y");



//load the data here.
queue()
    .defer(d3.csv, "data/drivertotal.csv")
    .defer(d3.csv, "data/pole.csv")
    .await(loadedData);

function loadedData(error,linechart,barchart) {
  drawlinechart1(linechart);
  drawbarchart1(barchart);

}
