var appState;
var sectionList = [];
var manufacturerList = {};
var listImage, listManufacturer;

var ready = function(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/* == Image List == */
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

var clearImages = function() {
  listImage.empty();
}

var displayImages = function(filterFunction,argList) {
  clearImages();
  if(filterFunction===null || filterFunction===undefined) {
    filterFunction = function() { return true };
  }
  for(var c=0; c<images.length; c++) {
    if(filterFunction(images[c],argList)) displayImage(images[c],c);
  }
}

var displayImage = function(image,id) {
  imgString = image.manufacturer + " " + image.model;
  var img = new Laminar.Widget({
    id:"img_" + id,
    classlist:["image_entry","layout-align-baseline"],
    parent: listImage
  });

  var imgLink = new Laminar.Widget({
    id:"image_link_" + id,
    element:"a",
    content:image.name,
    proplist:[["href",image.url]],
    classlist:["image_link","list_entry","layout-xs-width-1-1","layout-sm-width-2-3","layout-md-width-1-2"],
    parent:img
  });
  var imgVersion = new Laminar.Widget({
    id:"image_version_" + id,
    classlist:["image_version","layout-xs-hidden","layout-sm-width-1-3","layout-md-width-1-4"],
    content:"v: " + image.version,
    parent:img
  });
  var imgChannel = new Laminar.Widget({
    id:"image_channel_" + id,
    classlist:["image_channel","layout-xs-hidden","layout-sm-hidden","layout-md-width-1-4"],
    content:"c: " + image.channel,
    parent:img
  });
}

/* == Filter Functions for displaying subsets of the image list == */
var filterByManufacturer = function(image,manufacturer) {
  return (image.manufacturer.toLowerCase()==manufacturer.toLowerCase())
}

/* == Manufacturer List == */
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
    classlist: ["list_entry"],
    datalist: {name:manufacturerName,id:id}
  });
  name.listenEvent("click",function(e,obj) {
    displayImages(filterByManufacturer,obj.getData("name"));
    setAppState("image");
  });
}

/* == APP STATE and triggers for modifying it == */
var setAppState = function(mode) {
  appState.__set_mode = mode;
}

var setSectionModeActions = function() {
  var sections = document.querySelectorAll("section");
  /* Make all document sections react to appState */
  for(var c=0; c<sections.length; c++) {
    var sect = new Laminar.Widget(sections[c]);
    sect.states = ["active","inactive"];
    sect.watch(appState,"mode",function(v) {
      this.setState((this.getData("mode")==v) ? "active" : "inactive");
    }.bind(sect));  /* We have to BIND the function to the current object */
  }
}

var setSectionTitleActions = function() {
  var sectionTitles = document.querySelectorAll(".sectiontitle");
  for(var c=0; c<sectionTitles.length; c++) {
    var sectionTitle = new Laminar.Widget(sectionTitles[c]);
    var sectionMode = sectionTitle.getData("mode");
    if(sectionMode!==undefined) {
      sectionTitle.listenEvent("click",function(e,obj) {
        setAppState(obj.getData("mode"));
      });
    }
    var sectionList = new Laminar.Widget({
      id:"list_" + sectionMode,
      classlist:["layout-col","sectionlist"],
      parent:"#select_" + sectionTitle.getData("mode")
    });
    if(sectionMode=="image") listImage = sectionList;
    if(sectionMode=="manufacturer") listManufacturer = sectionList;
  }
}

ready(function() {
  appState = {'mode':'manufacturer'}; // Set default app state
  images.sort(sortImages);  // Sort images retrieved from JSON
  setSectionModeActions();  // Make the sections reactive based on app state
  setSectionTitleActions(); // When you click on the section title change the app state
  setAppState("manufacturer");
  //appState.__set_mode = "manufacturer";
  buildManufacturerList();
  displayManufacturerList();
  displayImages();
})