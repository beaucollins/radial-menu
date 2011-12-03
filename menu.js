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
  this.open = false;

  var sheet = document.styleSheets[0];
  var degrees = options.degrees;
  var radius = options.radius;
  var offset = options.offset;
  var menu = this;
  //this.positionItems();
  // lets position them
  this.eachItem(function(item, index, items){
    // create the animation
    var degree = ((degrees / (items.length-1)) * index) + offset,
        position = Menu.degreeToPosition(degree),
        x = Math.round((position.x * radius)),
        y = Math.round((position.y * radius)),
        name = "ani-" + index,
        delay = index * 4;
    
    var rule = "@-webkit-keyframes " + name + "{ \
       from {-webkit-transform: translate3d(0px, 0px, 0px); -webkit-transform-timing-function: ease-out; }\
       " + (delay + 10) + "% { -webkit-transform: translate3d(0px, 0px, 0px);}\
       " + (40 + index * 3) + "% { -webkit-transform: translate3d(" + (x * 1.2) + "px, " + (y * 1.2) + "px, 0px); -webkit-transform-timing-function: ease-in; }\
       65% { -webkit-transform: translate3d(" + (x*0.95) + "px, " + (y*0.95) + "px, 0px); -webkit-timing-function:ease-in-out}\
       to { -webkit-transform: translate3d(" + x + "px, " + y + "px, 0px);}\
       }";
    

    sheet.insertRule(rule);
    item.style.webkitAnimation = name + " 700ms alternate infinite";
    item.style.webkitAnimationPlayState = "paused";
    item.querySelector('a').style.webkitTransition = '-webkit-transform 500ms ease-in-out';
    item.addEventListener('webkitAnimationIteration', function(e){
      item.style.webkitAnimationPlayState = 'paused';
    });
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
  this.open = !this.open;
  if(this.open){
    this.button.style.webkitTransform = 'rotate(-45deg)';
  } else {
    this.button.style.webkitTransform = 'rotate(0deg)';
  }
  this.eachItem(function(item){
    item.style.webkitAnimationPlayState = 'running';
    var link = item.querySelector('a');
    link.style.webkitTransform = this.open ? 'rotate(-360deg)' : "rotate(360deg)" ;
  });
  
}

Menu.prototype.eachItem = function(callback){
  Array.prototype.forEach.call(this.menu_items, callback, this);
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

