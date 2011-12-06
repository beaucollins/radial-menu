var Menu = function(element, options){
  if(!options) options = {};
  options = {
    degrees: options.degrees || 90,
    offset: options.offset || -90,
    radius: options.radius || 150
  }
  
  
  this.node = element;
  this.menu_items = element.querySelectorAll('li');
  this.button = element.querySelector('a');
  this.state = 'closed';
  this.animations = [];
  
  var sheet = document.styleSheets[0];
  var degrees = Math.max(Math.min(360, options.degrees), 0);
  var radius = options.radius;
  var offset = options.offset;
  var menu = this;
  var positions = degrees == 360 ? this.menu_items.length : this.menu_items.length - 1;
  this.guid = Menu.guid();
  this.eachItem(function(item, index, items){
    
    var degree = (((degrees / positions) * index) + offset) % 360,
        position = Menu.degreeToPosition(degree),
        x = Math.round((position.x * radius)),
        y = Math.round((position.y * radius)),
        guid = this.guid  + '-' + index,
        delay = (30/items.length) * index,
        delay2 = (20/items.length) * index
        
    var rules = [
      [0,"-webkit-transform: translate3d(0px, 0px, 0px); -webkit-transition-timing-function: ease-out;"],
      [(delay + 15), "-webkit-transform: translate3d(0px, 0px, 0px);"],
      [(45 + delay2),"-webkit-transform: translate3d(" + (x * 1.2) + "px, " + (y * 1.2) + "px, 0px); -webkit-transition-timing-function: ease-in;"],
      [65, "-webkit-transform: translate3d(" + (x*0.95) + "px, " + (y*0.95) + "px, 0px); -webkit-transition-timing-function:ease-in-out;"],
      [100, "-webkit-transform: translate3d(" + x + "px, " + y + "px, 0px);"]
    ];
    var rules_moz = [
      [0,"-moz-transform: translate(0px, 0px); -moz-transition-timing-function: ease-out;"],
      [(delay + 15), "-moz-transform: translate(0px, 0px);"],
      [(45 + delay2),"-moz-transform: translate(" + (x * 1.2) + "px, " + (y * 1.2) + "px); -moz-transition-timing-function: ease-in;"],
      [65, "-moz-transform: translate(" + (x*0.95) + "px, " + (y*0.95) + "px); -moz-transition-timing-function:ease-in-out;"],
      [100, "-moz-transform: translate(" + x + "px, " + y + "px);"]
    ];
    
    
    var open = "", reverse = "", open_moz = "", reverse_moz = "";
    rules.forEach(function(rule){
      open += rule[0] + '% {' + rule[1] + "}\n";
      reverse = (100-rule[0]) + '% {' + rule[1] + " }\n" + reverse;
    }, this);
    rules_moz.forEach(function(rule){
      open_moz += rule[0] + '% {' + rule[1] + "}\n";
      reverse_moz = (100-rule[0]) + '% {' + rule[1] + " }\n" + reverse_moz;
    }, this);
    
    open_moz = "@-moz-keyframes " + guid + "open {\n " + open_moz + "} ";
    reverse_moz = "@-moz-keyframes " + guid + "close {\n " + reverse_moz + "}" ;
    open = "@-webkit-keyframes " + guid + "open { " + open + "} ";
    reverse = "@-webkit-keyframes " + guid + "close { " + reverse + "}" ;
    
    try {
      sheet.insertRule(open, 0);
      sheet.insertRule(reverse, 0);
    } catch(e) {
      sheet.insertRule(open_moz, 0);
      sheet.insertRule(reverse_moz, 0);
    }
    
    var link = item.querySelector('a');
    link.style.webkitTransition = '-webkit-transform 500ms ease-in-out';
    link.style.MozTransition = "-moz-transform 500ms ease-in-out";
    this.animations.push([item, guid+'open', guid+"close"]);
  });
  
  this.button.style.webkitTransition = "-webkit-transform 100ms linear";
  this.button.style.MozTransition = "-moz-transform 100ms linear";
  if(this.button.ontouchstart !== undefined){
    this.button.addEventListener('touchstart', function(e){
      e.stopPropagation();
      e.preventDefault();
      menu.toggle();
    });
    this.button.addEventListener('touchmove', function(e){
      e.stopPropagation();
      e.preventDefault();
    });
    this.button.addEventListener('touchend', function(e){
      e.stopPropagation();
      e.preventDefault();
    });
    
  }else{
    this.button.addEventListener('mousedown', function(){
      menu.toggle();
    })
  }
  
  this.button.addEventListener('click', function(e){
    e.preventDefault();
  });
  
  var links = this.node.querySelectorAll('li a');
  for (var i=0; i < links.length; i++) {
    links[i].addEventListener('click', function(e){
      e.preventDefault();
    })
  };
  
}

Menu.guid = function(){
  if (this.menu_count === undefined) {
    this.menu_count = 0;
  } else {
    this.menu_count ++;
  }
  return "ani" + this.menu_count;
}

Menu.prototype.toggle = function(){
  if(this.isOpen()){
    this.close();
  } else {
    this.open();
  }  
}

Menu.prototype.close = function(){
  if(this.isClosed()) return;
  this.state = 'closed';
  this.button.style.webkitTransform = 'rotate(0deg)';
  this.button.style.MozTransform = 'rotate(0deg)';
  
  this.eachAnimation(function(animation){
    var item = animation[0];
    var closed = animation[2];
    var link = item.querySelector('a');
    item.style.webkitAnimation = closed + " 700ms";
    item.style.webkitAnimationFillMode = 'both';
    link.style.webkitTransform ="rotate(360deg)" ;
    item.style.MozAnimation = '700ms ease 0s normal both 1 ' + closed;
    link.style.MozTransform = "rotate(360deg)" ;
  })
}

Menu.prototype.open = function(){
  if(this.isOpen()) return;
  this.state = 'open';
  this.button.style.webkitTransform = 'rotate(-45deg)';
  this.button.style.MozTransform = 'rotate(-45deg)';
  this.eachAnimation(function(animation){
    var item = animation[0],
        open = animation[1],
        link = item.querySelector('a');
        
    item.style.webkitAnimation = open + " 800ms";
    item.style.webkitAnimationFillMode = 'both';
    link.style.webkitTransform = 'rotate(-360deg)';
    item.style.MozAnimation = open + " 800ms";
    item.style.MozAnimationFillMode = 'both';
    link.style.MozTransform = 'rotate(-360deg)';
    
  });
}

Menu.prototype.isOpen = function(){
  return this.state == 'open';
}

Menu.prototype.isClosed = function(){
  return !this.isOpen();
}

Menu.prototype.eachItem = function(callback){
  Array.prototype.forEach.call(this.menu_items, callback, this);
}

Menu.prototype.eachAnimation = function(callback){
  this.animations.forEach(callback, this);
}

Menu.degreeToRadian = function(degree){
  // radians  = (180/Pi) / degrees
  degree = degree == 0 ? 360 : degree;
  var rad =  (Math.PI/180) * degree;
  return rad;
}

Menu.radianToPosition = function(radian){
  return {
    x: Math.cos(radian),
    y: Math.sin(radian)
  }
}

Menu.degreeToPosition = function(degree){
  return Menu.radianToPosition(Menu.degreeToRadian(degree));
}

