var appState;
var sectionList = [];
var manufacturerList = {};
var listImage = document.getElementById("list_image");
var listManufacturer = document.getElementById("list_manufacturer");

var ready = function(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

var sortImages = function(a, b) {
  var aM = a.manufacturer.toLowerCase();
  var bM = b.manufacturer.toLowerCase();
  if(aM<bM) {
    return -1;
  } else if(aM>bM) {
    return 1;
  }
  return 0;
}

var showImages = function() {
  for(var c=0; c<images.length; c++) {
    console.log(images[c].manufacturer);
  }
}

var displayImages = function() {
  for(var c=0; c<images.length; c++) {
    displayImage(images[c],c);
  }
}

var displayImage = function(image,id) {
  imgString = image.manufacturer + " " + image.model;
  var img = new Laminar.Widget({
    element:"p",
    id:"img_" + id,
    parent: "#list_image",
  }).update();
  var imgLink = new Laminar.Widget({
    id:"image_link_" + id,
    element:"a",
    content:image.name,
    proplist:[["href",image.url]],
    parent:"#img_" + id
  }).update();
}

/* == Manufacturer == */
var buildManufacturerList = function() {
  for(var c=0; c<images.length; c++) {
    var m = images[c].manufacturer;
    var mList = Object.keys(manufacturerList);
    if(mList.indexOf(m)<0) {
      manufacturerList[m] = [];
    }
    manufacturerList[m].push(images[c].model);
  }
}

var displayManufacturerList = function() {
  var mList = Object.keys(manufacturerList);
  mList.sort();
  for(var c=0; c<mList.length; c++) {
    displayManufacturer(mList[c],c);
  }
}

var displayManufacturer = function(manufacturerName, id) {
  var name = new Laminar.Widget({
    id: "manufacturer" + id,
    content: manufacturerName,
    parent: "#list_manufacturer",
    classlist: ["manufacturer_entry"],
    datalist: {name:manufacturerName,id:id}
  });
  name.listenEvent("click",function(e,obj) {
    console.log(obj.getData("name") + " clicked");
  });
}

ready(function() {
  /* Set up state machines */
  appState = {'mode':'manufacturer'};
  var sections = document.querySelectorAll("section");
  /* Make all document sections react to appState */
  for(var c=0; c<sections.length; c++) {
    var sect = new Laminar.Widget(sections[c]);
    sect.states = ["active","inactive"];
    sect.watch(appState,"mode",function(v) {
      this.setState((this.getData("mode")==v) ? "active" : "inactive");
    }.bind(sect));  /* We have to BIND the function to the current object */
  }
})