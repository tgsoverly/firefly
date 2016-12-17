
var defaultSettings = {
  elementSelector:"#container",
  pixieCount: 100
};

var settings;
var containerWidth;
var containerHeight;
var container;

var canvas;
var con;
var g;
var pxs = new Array();
var redrawInterval = 50;

module.exports = function(userSettings){
  console.log("loading firefly");
  settings = $.extend({}, defaultSettings, userSettings);
  container = $(settings.elementSelector);

  container.append('<canvas id="firefly-canvas"></canvas>');
  var canvas = document.getElementById('firefly-canvas');
	con = canvas.getContext('2d');
  resize();

  $(window).resize(resize);

  for(var i = 0; i < settings.pixieCount; i++) {
		pxs[i] = new Circle();
		pxs[i].reset();
	}
	setInterval(draw, redrawInterval);
};

function resize(){
  console.log("resizing firefly container");
  containerWidth = container.outerWidth();
  containerHeight = container.outerHeight();
  $("#firefly-canvas").attr('width', containerWidth).attr('height',containerHeight);
}

function draw() {
	con.clearRect(0,0,containerWidth,containerHeight);
	for(var i = 0; i < pxs.length; i++) {
		pxs[i].fade();
		pxs[i].move();
		pxs[i].draw();
	}
}

function Circle() {
	this.s = {ttl:8000, xmax:5, ymax:2, rmax:10, rt:1, xdef:960, ydef:540, xdrift:4, ydrift: 4, random:true, blink:true};

	this.reset = function() {
		this.x = (this.s.random ? containerWidth*Math.random() : this.s.xdef);
		this.y = (this.s.random ? containerHeight*Math.random() : this.s.ydef);
		this.r = ((this.s.rmax-1)*Math.random()) + 1;
		this.dx = (Math.random()*this.s.xmax) * (Math.random() < .5 ? -1 : 1);
		this.dy = (Math.random()*this.s.ymax) * (Math.random() < .5 ? -1 : 1);
		this.hl = (this.s.ttl/redrawInterval)*(this.r/this.s.rmax);
		this.rt = Math.random()*this.hl;
		this.s.rt = Math.random()+1;
		this.stop = Math.random()*.2+.4;
		this.s.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
		this.s.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
	}

	this.fade = function() {
		this.rt += this.s.rt;
	}

	this.draw = function() {
		if(this.s.blink && (this.rt <= 0 || this.rt >= this.hl)) this.s.rt = this.s.rt*-1;
		else if(this.rt >= this.hl) this.reset();
		var newo = 1-(this.rt/this.hl);
		con.beginPath();
		con.arc(this.x,this.y,this.r,0,Math.PI*2,true);
		con.closePath();
		var cr = this.r*newo;
		g = con.createRadialGradient(this.x,this.y,0,this.x,this.y,(cr <= 0 ? 1 : cr));
		g.addColorStop(0.0, 'rgba(238,180,28,'+newo+')');
		g.addColorStop(this.stop, 'rgba(238,180,28,'+(newo*.2)+')');
		g.addColorStop(1.0, 'rgba(238,180,28,0)');
		con.fillStyle = g;
		con.fill();
	}

	this.move = function() {
		this.x += (this.rt/this.hl)*this.dx;
		this.y += (this.rt/this.hl)*this.dy;
		if(this.x > containerWidth || this.x < 0) this.dx *= -1;
		if(this.y > containerHeight || this.y < 0) this.dy *= -1;
	}

	this.getX = function() { return this.x; }
	this.getY = function() { return this.y; }
}
