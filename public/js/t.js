

// 代理模式， 缓存代理

  const calculate = function (...input) {
    let result = 1;
    for (let i = 0, l = input.length; i < l; i++) {
      result = result * input[i];
    }
    console.log('计算');
    return result;
  }

  const proxyMult = (function() {
    const cache = {};
    return function(...input) {
      const key = input.join(',');
      return cache[key] || (cache[key] = calculate.apply(this, input));
    }
  })();


//策略模式

const strategies = {
  isNonEmpty: function(value, errMsg) {
    if(value === '') {
      return errMsg;
    }
  },
  minLength: function(value, length, errMsg) {
    if(value.length < length) {
      return errMsg;
    }
  },
  isMobile: function(value, errMsg) {
    if(!/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value)) {
      return errMsg;
    }
  }
}

const Validator = function() {
  this.cache = [];
}

Validator.prototype.add = function(v, rules) {
  for(let i = 0,rule; rule=rules[i++];) {
      const ary = rule.strategy.split(':');
      const errMsg = rule.errMsg;
      this.cache.push(function() {
        const strategy = ary.shift();
        ary.unshift(v);
        ary.push(errMsg);
        return strategies[strategy].apply(null, ary);
      })
    }
}

Validator.prototype.start = function() {
  for(let i = 0, fn; fn = this.cache[i++]; ) {
    let msg = fn();
    if(msg) {
      return msg;
    }
  }
}

const validataFunc = function() {
  const validator = new Validator();
  //添加校验规则
  validator.add($('input[name="userName"]').val(), [{strategy: 'isNonEmpty', errMsg: '用户名不能为空'}, {strategy: 'minLength:10', errMsg: '用户名长度不能少于10位'}])
  validator.add($('input[name="passWord"]').val(), [{strategy: 'minLength:6', errMsg: '密码长度不能少于6位'}])
  return validator.start();
}

$('#register').on('submit', function(){
  console.log(1)
  const errMsg = validataFunc();
  if(errMsg){
    alert(errMsg);
    return false;
  }
})

//代理模式

const myImage = (function() {
  const imgNode = document.createElement('img');
  document.body.appendChild(imgNode);
  return function(src) {
    imgNode.src = src;
    imgNode.width = 200;
    imgNode.height = 200;
  }
})();

const proxyImage = (function() {
  const img = new Image;
  img.onload = function() {
    myImage(this.src)
  }
  return function(src) {
    myImage('/images/loading.gif');
    img.src = src;
  }
})();

//发布-订阅模式
//1.发布者， 2.缓存队列，3.发布消息遍历队列
const publisher = {
  sublist: new Set(),
  listen: function(fn) {
    this.sublist.add({k: fn.name, v: fn});
  },
  trigger: function() {
    this.sublist.forEach((v, k) => {
      v.v.apply(this, arguments)
    })
  }
}

const subscribe = () => {
  console.log('我订阅')
  publisher.listen(function(v) {
    console.log('我收到订阅%s', v);
  })
}

const publish = () => {
  console.log('我发布信息')
  publisher.trigger($('#news').val())
}



//图片懒加载

(function(){
 let offset = 0, time = 250, delay = null, imgList = [], container = '', containerHeight = 0; 
 function imgLoad(v){
  container = v;
  containerHeight = document.getElementById(container).offsetHeight;
  imgList = [...document.getElementsByClassName('imgLazyLoad')];
  document.getElementById(container).addEventListener('scroll', _scoll, false);
 }
 function _scoll() {
  if(imgList.length === 0) {
    document.getElementById(container).removeEventListener('scroll', _scoll, false);
    return;
  }
  clearTimeout(delay);
  delay = setTimeout(() => {
    offset = document.getElementById(container).scrollTop;
    _loadImg();
  }, time);
 }
 function _loadImg() {
  for(let i =0,len = imgList.length; i < len; i++) {
    if(_show(imgList[i])) {
      imgList[i].src = imgList[i].getAttribute('data-src');
      imgList[i].onload = () => {
        // 图片加载完后，把对象从队列中移除防止 多次加载图片
        imgList.splice(i, 1);
      }
    }
  }
 }

 function _show(el) {
   // 图片高度 小于 可视区域，则图片需要加载src
  return el.offsetTop <= containerHeight + offset
 }
 imgLoad(container||'container');
})()