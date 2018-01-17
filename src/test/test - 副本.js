
var utilities = require('./utilities');
var _Event = {
	on: function(event, querySelector, callback, useCapture) {
		// 将事件触发执行的函数存储于DOM上, 在清除事件时使用
		return this.addEvent(this.getEventObject(event, querySelector, callback, useCapture));
	},

	off: function(event, querySelector) {
		return this.removeEvent(this.getEventObject(event, querySelector));
	},

	bind: function(event, callback, useCapture) {
		return this.on(event, undefined, callback, useCapture);
	},

	unbind: function(event) {
		return this.removeEvent(this.getEventObject(event));
	},

	trigger: function(event) {
		utilities.each(this.DOMList, function(index, element){
			try {
				// #Event001: trigger的事件是直接绑定在当前DOM上的
				if (element.jToolEvent && element.jToolEvent[event].length > 0) {
					var myEvent = new Event(event); // #Event002: 创建一个事件对象，用于模拟trigger效果
					element.dispatchEvent(myEvent);
				}
				// 当前为预绑定: 非click
				else if (event !== 'click'){
					// utilities.error('预绑定的事件只有click事件可以通过trigger进行调用');
				}
				// 当前为预绑定: click事件, 该事件为浏览器特性
				else if (event === 'click'){
					element[event]();
				}
			} catch(e) {
				// utilities.error('事件:['+ event +']未能正确执行, 请确定方法已经绑定成功');
			}
		});
		return this;
	},

	// 获取 jTool Event 对象
	getEventObject: function(event, querySelector, callback, useCapture) {
		// $(dom).on(event, callback);
		if (typeof querySelector === 'function') {
			useCapture = callback || false;
			callback = querySelector;
			querySelector = undefined;
		}
		// event callback 为必要参数
		if (!event) {
			// utilities.error('事件绑定失败,原因: 参数中缺失事件类型');
			return this;
		}

		// 子选择器不存在 或 当前DOM对象包含Window Document 则将子选择器置空
		if(!querySelector || utilities.type(this.DOMList[0]) !== 'element'){
			querySelector = '';
		}
		// #Event003 存在子选择器 -> 包装回调函数, 回调函数的参数
		// 预绑定功能实现
		if(querySelector !== ''){
			var fn = callback;
			callback = function(e){
				// 验证子选择器所匹配的nodeList中是否包含当前事件源 或 事件源的父级
				// 注意: 这个方法为包装函数,此处的this为触发事件的Element
				var target = e.target;
				while(target !== this ){
					if([].indexOf.call( this.querySelectorAll(querySelector), target) !== -1){
						fn.apply(target, arguments);
						break;
					}
					target = target.parentNode;
				}
			};
		}
		var eventSplit = event.split(' ');
		var eventList = [],
			eventScopeSplit,
			eventObj;

		utilities.each(eventSplit, function(i, eventName) {
			if (eventName.trim() === '') {
				return true;
			}

			eventScopeSplit = eventName.split('.');
			eventObj = {
				eventName: eventName + querySelector,
				type: eventScopeSplit[0],
				querySelector: querySelector,
				callback: callback || utilities.noop,
				useCapture: useCapture || false,
				// TODO: nameScope暂时不用
				nameScope: eventScopeSplit[1] || undefined
			};
			eventList.push(eventObj);
		});
		return eventList;
	},

	// 增加事件,并将事件对象存储至DOM节点
	addEvent: function(eventList) {
		var _this = this;
		utilities.each(eventList, function (index, eventObj) {
			utilities.each(_this.DOMList, function(i, v){
				v.jToolEvent = v.jToolEvent || {};
				v.jToolEvent[eventObj.eventName] = v.jToolEvent[eventObj.eventName] || [];
				v.jToolEvent[eventObj.eventName].push(eventObj);
				v.addEventListener(eventObj.type, eventObj.callback, eventObj.useCapture);
			});
		});
		return _this;
	},

	// 删除事件,并将事件对象移除出DOM节点
	removeEvent: function(eventList) {
		var _this = this;
		var eventFnList; //事件执行函数队列
		utilities.each(eventList, function(index, eventObj) {
			utilities.each(_this.DOMList, function(i, v){
				if (!v.jToolEvent) {
					return;
				}
				eventFnList = v.jToolEvent[eventObj.eventName];
				if (eventFnList) {
					utilities.each(eventFnList, function(i2, v2) {
						v.removeEventListener(v2.type, v2.callback);
					});
					v.jToolEvent[eventObj.eventName] = undefined;
				}
			});
		});
		return _this;
	}
};

module.exports = _Event;



var toString = Object.prototype.toString;

var class2type = {
	'[object String]': 'string',
	'[object Boolean]': 'boolean',
	'[object Undefined]': 'undefined',
	'[object Number]': 'number',
	'[object Object]': 'object',
	'[object Error]': 'error',
	'[object Function]': 'function',
	'[object Date]': 'date',
	'[object Array]': 'array',
	'[object RegExp]': 'regexp',
	'[object Null]': 'null',
	'[object NodeList]': 'nodeList',
	'[object Arguments]': 'arguments',
	'[object Window]': 'window',
	'[object HTMLDocument]': 'document'
};

function isChrome() {
	return navigator.userAgent.indexOf('Chrome') == -1 ? false : true;
}

function isWindow(object) {
	return object !== null && object === object.window;
}

function isArray(value) {
	return Array.isArray(value);
}

function type(value) {
	return class2type[toString.call(value)] || (value instanceof Element ? 'element' : '');
}

function noop() {}

function each(object, callback) {

	// 当前为jTool对象,循环目标更换为jTool.DOMList
	if(object && object.jTool){
		object = object.DOMList;
	}

	var objType = type(object);

	// 为类数组时, 返回: index, value
	if (objType === 'array' || objType === 'nodeList' || objType === 'arguments') {
		// 由于存在类数组 NodeList, 所以不能直接调用 every 方法
		[].every.call(object, function(v, i){
			var tmp = isWindow(v) ? noop() : (v.jTool ? v = v.get(0) : noop()); // 处理jTool 对象
			return callback.call(v, i, v) === false ? false : true;
		});
	} else if (objType === 'object') {
		for(var i in object){
			if(callback.call(object[i], i, object[i]) === false) {
				break;
			}
		}
	}
}

// 清除字符串前后的空格
function trim(text) {
	return text.trim();
}

// 抛出异常信息
function error(msg){
	throw new Error('[jTool Error: '+ msg + ']');
}

// 检测是否为空对象
function isEmptyObject(obj) {

	var isEmptyObj = true;

	for (var pro in obj) {
		if(obj.hasOwnProperty(pro)) {
			isEmptyObj = false;
		}
	}

	return isEmptyObj;
}

// 获取节点样式: key为空时则返回全部
function getStyle(dom, key){
	return key ? window.getComputedStyle(dom)[key] : window.getComputedStyle(dom);
}

// 获取样式的单位
function getStyleUnit(style) {
	var unitList = ['px', 'vem', 'em', '%'],
		unit = '';

	// 样式本身为纯数字,则直接返回单位为空
	if(typeof(style) === 'number'){
		return unit;
	}

	each(unitList, function (i, v) {
		if(style.indexOf(v) !== -1){
			unit = v;
			return false;
		}
	});

	return unit;
}

// 字符格式转换: 连字符转驼峰
function toHump(text) {
	return text.replace(/-\w/g, function(str){
		return str.split('-')[1].toUpperCase();
	});
}

//字符格式转换: 驼峰转连字符
function toHyphen(text) {
	return text.replace(/([A-Z])/g,"-$1").toLowerCase();
}

// 通过html字符串, 生成DOM.  返回生成后的子节点
// 该方法无处处理包含table标签的字符串,但是可以处理table下属的标签
function createDOM(htmlString) {
	var jToolDOM = document.querySelector('#jTool-create-dom');
	if (!jToolDOM || jToolDOM.length === 0) {
		// table标签 可以在新建element时可以更好的容错.
		// div标签, 添加thead,tbody等表格标签时,只会对中间的文本进行创建
		// table标签,在添加任务标签时,都会成功生成.且会对table类标签进行自动补全
		var el = document.createElement('table');
		el.id = 'jTool-create-dom';
		el.style.display = 'none';
		document.body.appendChild(el);
		jToolDOM = document.querySelector('#jTool-create-dom');
	}

	jToolDOM.innerHTML = htmlString || '';
	var childNodes = jToolDOM.childNodes;

	// 进行table类标签清理, 原因是在增加如th,td等table类标签时,浏览器会自动补全节点.
	if (childNodes.length == 1 && !/<tbody|<TBODY/.test(htmlString) && childNodes[0].nodeName === 'TBODY') {
		childNodes = childNodes[0].childNodes;
	}
	if (childNodes.length == 1 && !/<thead|<THEAD/.test(htmlString) && childNodes[0].nodeName === 'THEAD') {
		childNodes = childNodes[0].childNodes;
	}
	if (childNodes.length == 1 && !/<tr|<TR/.test(htmlString) &&  childNodes[0].nodeName === 'TR') {
		childNodes = childNodes[0].childNodes;
	}
	if (childNodes.length == 1 && !/<td|<TD/.test(htmlString) && childNodes[0].nodeName === 'TD') {
		childNodes = childNodes[0].childNodes;
	}
	if (childNodes.length == 1 && !/<th|<TH/.test(htmlString) && childNodes[0].nodeName === 'TH') {
		childNodes = childNodes[0].childNodes;
	}
	jToolDOM.remove();
	return childNodes;
}

module.exports = {
	isWindow: isWindow,
	isChrome: isChrome,
	isArray: isArray,
	noop: noop,
	type: type,
	toHyphen: toHyphen,
	toHump: toHump,
	getStyleUnit: getStyleUnit,
	getStyle: getStyle,
	isEmptyObject: isEmptyObject,
	trim: trim,
	error: error,
	each: each,
	createDOM: createDOM,
	version: '1.2.21'
};