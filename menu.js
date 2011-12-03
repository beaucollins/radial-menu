var Menu = function(element, options){
  if(!options) options = {};
  options = {
    degrees: options.degrees || 90,
    offset: options.degrees || -90,
    radius: options.radius || 150
  }
  
  this.node = element;
  this.menu_items = element.querySelectorAll('li');
  this.button = element.querySelector('a');
  this.state = 'closed';
  this.animations = [];
  
  var sheet = document.styleSheets[0];
  var degrees = options.degrees;
  var radius = options.radius;
  var offset = options.offset;
  var menu = this;
  
  this.eachItem(function(item, index, items){
    
    var degree = ((degrees / (items.length-1)) * index) + offset,
        position = Menu.degreeToPosition(degree),
        x = Math.round((position.x * radius)),
        y = Math.round((position.y * radius)),
        name = "ani-" + index,
        delay = index * 6;
    
    var rules = [
      [0,"{-webkit-transform: translate3d(0px, 0px, 0px); -webkit-transform-timing-function: ease-out; }"],
      [(delay + 10), "{ -webkit-transform: translate3d(0px, 0px, 0px);}"],
      [(40 + index * 3),"{ -webkit-transform: translate3d(" + (x * 1.2) + "px, " + (y * 1.2) + "px, 0px); -webkit-transform-timing-function: ease-in; }"],
      [65, "{ -webkit-transform: translate3d(" + (x*0.95) + "px, " + (y*0.95) + "px, 0px); -webkit-timing-function:ease-in-out}"],
      [100, "{ -webkit-transform: translate3d(" + x + "px, " + y + "px, 0px);}"]
    ];
    
    var open = "", reverse = "";
    rules.forEach(function(rule){
      open += rule[0] + '% ' + rule[1];
      reverse = (100-rule[0]) + '% ' + rule[1] + reverse;
    }, this);
    
    open = "@-webkit-keyframes " + name + "-open { " + open + "} ";
    reverse = "@-webkit-keyframes " + name + "-close { " + reverse + "}" ;

    sheet.insertRule(open);
    sheet.insertRule(reverse);
    item.querySelector('a').style.webkitTransition = '-webkit-transform 500ms ease-in-out';
    this.animations.push([item, name+'-open', name+"-close"]);
  });
  
  this.button.style.webkitTransition = "-webkit-transform 100ms linear";
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
  
  this.eachAnimation(function(animation){
    var item = animation[0];
    var closed = animation[2];
    var link = item.querySelector('a');
    item.style.webkitAnimation = closed + " 500ms";
    item.style.webkitAnimationFillMode = 'both';
    link.style.webkitTransform ="rotate(360deg)" ;
  })
}

Menu.prototype.open = function(){
  if(this.isOpen()) return;
  this.state = 'open';
  this.button.style.webkitTransform = 'rotate(-45deg)';
  
  this.eachAnimation(function(animation){
    var item = animation[0],
        open = animation[1],
        link = item.querySelector('a');
        
    item.style.webkitAnimation = open + " 700ms";
    item.style.webkitAnimationFillMode = 'both';
    link.style.webkitTransform = 'rotate(-360deg)';
    
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

