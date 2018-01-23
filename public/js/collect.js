(function collect() {

		function get_base() {
				const client_id = getClientID();
				const current_url = window.location.href;
				const referer_url = document.referrer;
				const useragent = navigator.userAgent;
				const token = conf_token || '';
				return {client_id: client_id, current_url: current_url, referer_url: referer_url, useragent: useragent, token: token}
		}

		// to do 计算ajax的时间 开始时间对象 {url:'xxx',timestamp:11111}
		let begin = [];

		hookAjax({
				onreadystatechange: function (xhr) {
						if (xhr.readyState === 4) {
								const end_time = Date.now();
								const url = xhr.responseURL;
								if (url.includes('collect')) {
										//如果是当前域的接口直接return，否则会死循环
										return;
								}
								// 请求状态
								let status = xhr.status;
								// todo 写入数据库
								const begin_time = begin.find(item => item.url === url);
								if (begin_time) {
										const times = end_time - begin_time.timestamp;
										// 调接口
										postAjax('http://localhost:3000/collect', {
												type: 0,
												data: {
														timing: times,
														request_url: url,
														response_status: status,
														...get_base()
												}
										})
								}
						}
						// console.log('onreadystatechange called:%s',xhr)
				},
				open: function (arg) {
						const begin_time_index = begin.findIndex((item, index) => item.url === arg[1])
						const now = Date.now()
						if (begin_time_index === -1) {
								begin.push({url: arg[1], timestamp: now})
						} else {
								begin.splice(begin_time_index, 1, {
										url: arg[1],
										timestamp: now
								})
						}

						// console.log('open called:method:%s,url:%s,async:%s', arg[0], arg[1], arg[2])
				},
				send: function (arg) {
						// post 才会有arg, get 为 null console.log('send called:%s',arg[0])
				}
		})

		function postAjax(url, data) {
				const request = new XMLHttpRequest();
				request.onreadystatechange = (xhr) => {
						if (xhr.readyState === 4) {
								//成功
						}
				}
				request.open('POST', url, true);
				request.setRequestHeader('Content-Type', 'application/json');
				request.send(JSON.stringify(data));
		}

		function hookAjax(funs) {
				window._ahrealxhr = window._ahrealxhr || XMLHttpRequest
				XMLHttpRequest = function () {
						this.xhr = new window._ahrealxhr;
						for (var attr in this.xhr) {
								var type = "";
								try {
										type = typeof this.xhr[attr]
								} catch (e) {}
								if (type === "function") {
										this[attr] = hookfun(attr);
								} else {
										Object.defineProperty(this, attr, {
												get: getFactory(attr),
												set: setFactory(attr)
										})
								}
						}
				}

				function getFactory(attr) {
						return function () {
								return this.hasOwnProperty(attr + "_")
										? this[attr + "_"]
										: this.xhr[attr];
						}
				}

				function setFactory(attr) {
						return function (f) {
								var xhr = this.xhr;
								var that = this;
								if (attr.indexOf("on") != 0) {
										this[attr + "_"] = f;
										return;
								}
								if (funs[attr]) {
										xhr[attr] = function () {
												funs[attr](that) || f.apply(xhr, arguments);
										}
								} else {
										xhr[attr] = f;
								}
						}
				}

				function hookfun(fun) {

						return function () {
								// 超时时间
								this.xhr.timeout = this.timeout || 0;
								var args = []
										.slice
										.call(arguments)
								if (funs[fun] && funs[fun].call(this, args, this.xhr)) {
										return;
								}
								return this
										.xhr[fun]
										.apply(this.xhr, args);
						}
				}
				return window._ahrealxhr;
		}

		function setClientID() {
				// 写clientId
				const clientId = (Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)).substr(0, 32);
				localStorage.setItem('front_client_id', clientId);
				return clientId;
		}

		function getClientID() {
				return localStorage.getItem('front_client_id') || setClientID();
		}

		document.body.onload = () => {
				//     let timing = performance.timing,      start = timing.navigationStart,
				// dnsTime = 0,      tcpTime = 0,      firstPaintTime = 0,      domRenderTime =
				// 0,      loadTime = 0; console.log(timing.loadEventEnd) dnsTime =
				// timing.domainLookupEnd - timing.domainLookupStart; tcpTime =
				// timing.connectEnd - timing.connectStart; firstPaintTime =
				// timing.responseStart - start; domRenderTime = timing.domContentLoadedEventEnd
				// - start; loadTime = timing.loadEventEnd - timing.navigationStart;
				// console.log(timing.loadEventEnd) console.log('DNS解析时间:', dnsTime ,
				// '\nTCP建立时间:', tcpTime, '\n首屏时间:', firstPaintTime,  '\ndom渲染完成时间:',
				// domRenderTime, '\n页面onload时间:', loadTime);
		}

		window.addEventListener('error', (event) => {
			console.log(event)
			// 	postAjax('http://localhost:3000/collect', {
			// 		type: 1,
			// 		data: {
			// 			message: message,
			// 			source: source,
			// 			line: lineno,
			// 			...get_base()
			// 		}
			// })
			// console.log('message:%s,source:%s,lineno:%s,colno:%s,error:%s', message, source, lineno, colno, error)
		})

})()