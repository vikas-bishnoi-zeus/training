function setHeightWidth(canvas,height,width){
    canvas.height =height;
    // console.log(div.clientHeight);
    canvas.width = width;
}


const div = document.getElementById("main-area");

const horizontalCanvas = document.getElementById("horizontal");
setHeightWidth(horizontalCanvas,30,screen.width-100);
const ctxup = horizontalCanvas.getContext("2d");

const verticalCanvas = document.getElementById("vertrical");
setHeightWidth(verticalCanvas,screen.height-30,100);
const ctxside = verticalCanvas.getContext("2d");


const canvas = document.getElementById("spreadsheet");
setHeightWidth(canvas,screen.height-30,screen.width-100)
const ctx = canvas.getContext("2d");




const container = document.getElementById("main-area");

const verticalScroll = document.getElementById("verticalScroll");

const horizontalScroll = document.getElementById("horizontalScroll");

let contentWidth = 3000; // Initial content width

let contentHeight = 1800; // Initial content height

let scrollX = 0;

let scrollY = 0;

let rows = 60; // Initial number of rows
let colms=30;
// Initial scrollbar sizes

var cells=[];
var verticalcell=[];
var horizontalcell=[];

var columnSizePrefix=[0];
var rowSizePrefix=[0];

