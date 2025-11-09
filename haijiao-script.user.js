// ==UserScript==
// @name         sea角社区脚本
// @namespace    haijiao-script
// @version      0.1.11
// @author       memopac
// @description  sea角社区视频解析
// @license      MIT
// @icon         https://pomf2.lain.la/f/erejxtfo.ico
// @match        *://*.haijiao.com/*
// @match        *://*/post/details*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1
// @require      https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js
// @require      https://cdn.jsdelivr.net/npm/dplayer@latest/dist/DPlayer.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-start
// @antifeature  payment
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .crack_container{position:fixed;top:80px;right:20px;background-color:#ebebeb;z-index:99999999999}.crack_title{font-size:20px;font-weight:700;text-align:center;border:1px solid #000;cursor:pointer;display:block}.crack_player{position:fixed;top:0;bottom:0;left:0;right:0}.crack_player .iframeBox{width:70vw;margin:auto} ");

(function ($$1) {
  'use strict';

  function getSellerContainer() {
    const element = document.querySelector("span.sell-btn") || document.querySelector("div.pagecontainer") || document.querySelector("div.publicContainer");
    return element;
  }
  const handleEmptySellerContainer = () => {
    const element = getSellerContainer();
    if (element) {
      $(element).html("");
    }
  };
  const handleCrackTime = (cb) => {
    const mutationObserver = new MutationObserver(() => {
      const element = getSellerContainer();
      if (element) {
        const isDisconnect = cb == null ? void 0 : cb();
        if (isDisconnect) {
          mutationObserver.disconnect();
        }
      }
    });
    setTimeout(() => {
      mutationObserver.disconnect();
    }, 120 * 1e3);
    mutationObserver.observe(document.body, {
      attributes: true,
      childList: true
    });
  };
  const logScriptInfo = () => {
    logger(
      "漏洞来源于 linuxdo 社区这篇三级帖子：https://linux.do/t/topic/1125143"
    );
  };
  const logger = (...reset) => {
    console.log("\x1B[42m%s\x1B[0m", "HAIJIAO-SCRIPT", ...reset);
  };
  const getPostId = () => {
    const pattern = /pid=(\d+)/;
    const match = window.location.href.match(pattern);
    return match == null ? void 0 : match[1];
  };
  const functionArr = [];
  var _wr = function(type) {
    var orig = window.history[type];
    return function() {
      var rv = orig.apply(this, arguments);
      var e = new Event(type);
      e.arguments = arguments;
      window.dispatchEvent(e);
      return rv;
    };
  };
  history.pushState = _wr("pushState");
  window.addEventListener("pushState", () => {
    functionArr.forEach((cb) => cb());
  });
  const handleUrlChange = (cb) => {
    functionArr.push(cb);
  };
  const isString = (data) => Object.prototype.toString.call(data) === "[object String]";
  const isObject = (data) => Object.prototype.toString.call(data) === "[object Object]";
  const getDownloadUrl = (url, title) => {
    const realUrl = `https://tools.thatwind.com/tool/m3u8downloader#m3u8=${encodeURIComponent(
    url
  )}&referer=${window.location.href}&filename=${title}`;
    return realUrl;
  };
  const idleCallback = (callback) => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(callback);
    } else if (window.setTimeout) {
      window.setTimeout(callback, 500);
    } else {
      callback();
    }
  };
  const decodeEncryptString = (text) => {
    const isStringData = isString(text);
    let data = text;
    try {
      if (isStringData) {
        const tmpDataObj = JSON.parse(text);
        const isBareObjectData = isObject(tmpDataObj == null ? void 0 : tmpDataObj.data);
        const isBareStringData = isString(tmpDataObj == null ? void 0 : tmpDataObj.data);
        if (isBareObjectData) {
          data = tmpDataObj == null ? void 0 : tmpDataObj.data;
        } else if (isBareStringData) {
          data = bareDecode(tmpDataObj == null ? void 0 : tmpDataObj.data);
        }
      }
    } catch (error) {
      logger("解密失败");
    }
    return data;
  };
  const bareDecode = (text) => {
    return JSON.parse(atob(atob(atob(text))));
  };
  const bareEncode = (data) => {
    return btoa(btoa(btoa(JSON.stringify(data))));
  };
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var events = ["load", "loadend", "timeout", "error", "readystatechange", "abort"];
  var OriginXhr = "__origin_xhr";
  function configEvent(event, xhrProxy) {
    var e = {};
    for (var attr in event)
      e[attr] = event[attr];
    e.target = e.currentTarget = xhrProxy;
    return e;
  }
  function hook(proxy2, win) {
    win = win || window;
    var originXhr = win.XMLHttpRequest;
    var hooking = true;
    var HookXMLHttpRequest = function() {
      var xhr = new originXhr();
      for (var i = 0; i < events.length; ++i) {
        var key = "on" + events[i];
        if (xhr[key] === void 0)
          xhr[key] = null;
      }
      for (var attr in xhr) {
        var type = "";
        try {
          type = typeof xhr[attr];
        } catch (e) {
        }
        if (type === "function") {
          this[attr] = hookFunction(attr);
        } else if (attr !== OriginXhr) {
          Object.defineProperty(this, attr, {
            get: getterFactory(attr),
            set: setterFactory(attr),
            enumerable: true
          });
        }
      }
      var that = this;
      xhr.getProxy = function() {
        return that;
      };
      this[OriginXhr] = xhr;
    };
    HookXMLHttpRequest.prototype = originXhr.prototype;
    HookXMLHttpRequest.prototype.constructor = HookXMLHttpRequest;
    win.XMLHttpRequest = HookXMLHttpRequest;
    Object.assign(win.XMLHttpRequest, { UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4 });
    function getterFactory(attr) {
      return function() {
        var originValue = this[OriginXhr][attr];
        if (hooking) {
          var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : originValue;
          var attrGetterHook = (proxy2[attr] || {})["getter"];
          return attrGetterHook && attrGetterHook(v, this) || v;
        } else {
          return originValue;
        }
      };
    }
    function setterFactory(attr) {
      return function(v) {
        var xhr = this[OriginXhr];
        if (hooking) {
          var that = this;
          var hook2 = proxy2[attr];
          if (attr.substring(0, 2) === "on") {
            that[attr + "_"] = v;
            xhr[attr] = function(e) {
              e = configEvent(e, that);
              var ret = proxy2[attr] && proxy2[attr].call(that, xhr, e);
              ret || v.call(that, e);
            };
          } else {
            var attrSetterHook = (hook2 || {})["setter"];
            v = attrSetterHook && attrSetterHook(v, that) || v;
            this[attr + "_"] = v;
            try {
              xhr[attr] = v;
            } catch (e) {
            }
          }
        } else {
          xhr[attr] = v;
        }
      };
    }
    function hookFunction(fun) {
      return function() {
        var args = [].slice.call(arguments);
        if (proxy2[fun] && hooking) {
          var ret = proxy2[fun].call(this, args, this[OriginXhr]);
          if (ret)
            return ret;
        }
        return this[OriginXhr][fun].apply(this[OriginXhr], args);
      };
    }
    function unHook() {
      hooking = false;
      if (win.XMLHttpRequest === HookXMLHttpRequest) {
        win.XMLHttpRequest = originXhr;
        HookXMLHttpRequest.prototype.constructor = originXhr;
        originXhr = void 0;
      }
    }
    return { originXhr, unHook };
  }
  var eventLoad = events[0], eventLoadEnd = events[1], eventTimeout = events[2], eventError = events[3], eventReadyStateChange = events[4], eventAbort = events[5];
  var prototype = "prototype";
  function proxy(proxy2, win) {
    win = win || window;
    return proxyAjax(proxy2, win);
  }
  function trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
  }
  function getEventTarget(xhr) {
    return xhr.watcher || (xhr.watcher = document.createElement("a"));
  }
  function triggerListener(xhr, name) {
    var xhrProxy = xhr.getProxy();
    var callback = "on" + name + "_";
    var event = configEvent({ type: name }, xhrProxy);
    xhrProxy[callback] && xhrProxy[callback](event);
    var evt;
    if (typeof Event === "function") {
      evt = new Event(name, { bubbles: false });
    } else {
      evt = document.createEvent("Event");
      evt.initEvent(name, false, true);
    }
    getEventTarget(xhr).dispatchEvent(evt);
  }
  function Handler(xhr) {
    this.xhr = xhr;
    this.xhrProxy = xhr.getProxy();
  }
  Handler[prototype] = /* @__PURE__ */ Object.create({
    resolve: function resolve(response) {
      var xhrProxy = this.xhrProxy;
      var xhr = this.xhr;
      xhrProxy.readyState = 4;
      xhr.resHeader = response.headers;
      xhrProxy.response = xhrProxy.responseText = response.response;
      xhrProxy.statusText = response.statusText;
      xhrProxy.status = response.status;
      triggerListener(xhr, eventReadyStateChange);
      triggerListener(xhr, eventLoad);
      triggerListener(xhr, eventLoadEnd);
    },
    reject: function reject(error) {
      this.xhrProxy.status = 0;
      triggerListener(this.xhr, error.type);
      triggerListener(this.xhr, eventLoadEnd);
    }
  });
  function makeHandler(next) {
    function sub(xhr) {
      Handler.call(this, xhr);
    }
    sub[prototype] = Object.create(Handler[prototype]);
    sub[prototype].next = next;
    return sub;
  }
  var RequestHandler = makeHandler(function(rq) {
    var xhr = this.xhr;
    rq = rq || xhr.config;
    xhr.withCredentials = rq.withCredentials;
    xhr.open(rq.method, rq.url, rq.async !== false, rq.user, rq.password);
    for (var key in rq.headers) {
      xhr.setRequestHeader(key, rq.headers[key]);
    }
    xhr.send(rq.body);
  });
  var ResponseHandler = makeHandler(function(response) {
    this.resolve(response);
  });
  var ErrorHandler = makeHandler(function(error) {
    this.reject(error);
  });
  function proxyAjax(proxy2, win) {
    var onRequest = proxy2.onRequest, onResponse = proxy2.onResponse, onError = proxy2.onError;
    function getResponseData(xhrProxy) {
      var responseType = xhrProxy.responseType;
      if (!responseType || responseType === "text") {
        return xhrProxy.responseText;
      }
      var response = xhrProxy.response;
      if (responseType === "json" && !response) {
        try {
          return JSON.parse(xhrProxy.responseText);
        } catch (e) {
          console.warn(e);
        }
      }
      return response;
    }
    function handleResponse(xhr, xhrProxy) {
      var handler = new ResponseHandler(xhr);
      var ret = {
        response: getResponseData(xhrProxy),
        status: xhrProxy.status,
        statusText: xhrProxy.statusText,
        config: xhr.config,
        headers: xhr.resHeader || xhr.getAllResponseHeaders().split("\r\n").reduce(function(ob, str) {
          if (str === "")
            return ob;
          var m = str.split(":");
          ob[m.shift()] = trim(m.join(":"));
          return ob;
        }, {})
      };
      if (!onResponse)
        return handler.resolve(ret);
      onResponse(ret, handler);
    }
    function onerror(xhr, xhrProxy, error, errorType) {
      var handler = new ErrorHandler(xhr);
      error = { config: xhr.config, error, type: errorType };
      if (onError) {
        onError(error, handler);
      } else {
        handler.next(error);
      }
    }
    function preventXhrProxyCallback() {
      return true;
    }
    function errorCallback(errorType) {
      return function(xhr, e) {
        onerror(xhr, this, e, errorType);
        return true;
      };
    }
    function stateChangeCallback(xhr, xhrProxy) {
      if (xhr.readyState === 4 && xhr.status !== 0) {
        handleResponse(xhr, xhrProxy);
      } else if (xhr.readyState !== 4) {
        triggerListener(xhr, eventReadyStateChange);
      }
      return true;
    }
    var { originXhr, unHook } = hook({
      onload: preventXhrProxyCallback,
      onloadend: preventXhrProxyCallback,
      onerror: errorCallback(eventError),
      ontimeout: errorCallback(eventTimeout),
      onabort: errorCallback(eventAbort),
      onreadystatechange: function(xhr) {
        return stateChangeCallback(xhr, this);
      },
      open: function open(args, xhr) {
        var _this = this;
        var config = xhr.config = { headers: {} };
        config.method = args[0];
        config.url = args[1];
        config.async = args[2];
        config.user = args[3];
        config.password = args[4];
        config.xhr = xhr;
        var evName = "on" + eventReadyStateChange;
        if (!xhr[evName]) {
          xhr[evName] = function() {
            return stateChangeCallback(xhr, _this);
          };
        }
        if (onRequest)
          return true;
      },
      send: function(args, xhr) {
        var config = xhr.config;
        config.withCredentials = xhr.withCredentials;
        config.body = args[0];
        if (onRequest) {
          var req = function() {
            onRequest(config, new RequestHandler(xhr));
          };
          config.async === false ? req() : setTimeout(req);
          return true;
        }
      },
      setRequestHeader: function(args, xhr) {
        xhr.config.headers[args[0].toLowerCase()] = args[1];
        if (onRequest)
          return true;
      },
      addEventListener: function(args, xhr) {
        var _this = this;
        if (events.indexOf(args[0]) !== -1) {
          var handler = args[1];
          getEventTarget(xhr).addEventListener(args[0], function(e) {
            var event = configEvent(e, _this);
            event.type = args[0];
            event.isTrusted = true;
            handler.call(_this, event);
          });
          return true;
        }
      },
      getAllResponseHeaders: function(_, xhr) {
        var headers = xhr.resHeader;
        if (headers) {
          var header = "";
          for (var key in headers) {
            header += key + ": " + headers[key] + "\r\n";
          }
          return header;
        }
      },
      getResponseHeader: function(args, xhr) {
        var headers = xhr.resHeader;
        if (headers) {
          return headers[(args[0] || "").toLowerCase()];
        }
      }
    }, win);
    return {
      originXhr,
      unProxy: unHook
    };
  }
  const recoverBannedUser = async (id, response) => {
    const originData = JSON.parse(response.response);
    const data = originData;
    if ((data == null ? void 0 : data.errorCode) !== 0) {
      data.isEncrypted = true;
      data.errorCode = 0;
      data.success = true;
      data.message = "";
      const newUrl = `/api/topic/node/topics?page=1&userId=${id}&type=0`;
      const fetchData = await fetch(newUrl);
      const fetchText = await fetchData.text();
      const fetchJson = JSON.parse(fetchText);
      const formatData = bareDecode(fetchJson.data);
      let total = formatData.page.total;
      let uid = `[banned]`;
      if (`results` in formatData) {
        uid = formatData.results[0].user.nickname + ` ` + uid;
      }
      const tmpData = {
        isFavorite: false,
        likeCount: 12,
        user: {
          id: parseInt(id),
          nickname: uid,
          avatar: "29",
          description: `hj community`,
          topicCount: total,
          videoCount: 0,
          commentCount: 303,
          fansCount: 57,
          favoriteCount: 39,
          status: 0,
          sex: 1,
          vip: 0,
          vipExpiresTime: "0001-01-01 00:00:00",
          certified: false,
          certVideo: false,
          certProfessor: false,
          famous: false,
          forbidden: false,
          tags: null,
          role: 0,
          popularity: 10,
          diamondConsume: 0,
          title: {
            id: 0,
            name: "",
            consume: 0,
            consumeEnd: 0,
            icon: ""
          },
          friendStatus: false,
          voiceStatus: false,
          videoStatus: false,
          voiceMoneyType: 0,
          voiceAmount: 0,
          videoMoneyType: 0,
          videoAmount: 0,
          depositMoney: 0
        }
      };
      originData.data = bareEncode(tmpData);
      return JSON.stringify(originData);
    }
    return response.response;
  };
  function injectHttp(detailCb, videoCb) {
    proxy(
      {
        //请求成功后进入
        onResponse: async (response, handler) => {
          var _a;
          const { url } = response.config;
          if (url.includes("/api/address/")) {
            videoCb(response.response);
          }
          if (/\/api\/topic\/\d+/.test(url)) {
            idleCallback(() => {
              detailCb(response.response);
            });
          }
          if (/\/api\/user\/info\/\d+/.test(url)) {
            const id = (_a = url.match(/\/api\/user\/info\/(\d+)/)) == null ? void 0 : _a[1];
            if (id) {
              response.response = await recoverBannedUser(id, response);
            }
          }
          handler.next(response);
        }
      },
      _unsafeWindow
    );
  }
  const getRealVideoSrc = (content) => {
    try {
      let ts_path = content.split("\n")[6];
      let reg = ts_path.match(/([\w_]+_?)[\d]+.ts/);
      if (reg) {
        const newUrl = ts_path.replace(reg[0], reg[1] + ".m3u8");
        return newUrl;
      }
    } catch (error) {
      return "";
    }
    return "";
  };
  const $container = $$1(
    `<div class="crack_container" id="crack_container">
  </div>`
  );
  const initCrackDom = () => {
    $$1("body").append($container);
  };
  const videosSuccessHelperDom = (url) => {
    const jumpUrl1 = `https://m3u8play.dev/?url=${url}`;
    const jumpLink1 = $$1(
      '<a class="crack_title crack_jump_link" target="_blank">跳转播放1</a>'
    ).attr("href", jumpUrl1);
    const jumpUrl2 = `https://m3u8play.com/?play=${encodeURIComponent(url)}`;
    const jumpLink2 = $$1(
      '<a class="crack_title crack_jump_link" target="_blank">跳转播放2</a>'
    ).attr("href", jumpUrl2);
    const title = $$1("#details-page > div.header > h2 > span").text();
    const downloadUrl = getDownloadUrl(url, title);
    const downloadLink = $$1(
      '<a class="crack_title crack_jump_link" target="_blank" data-type="download">下载视频</a>'
    ).attr("href", downloadUrl);
    const copyUrl = $$1(`
    <div class="crack_title crack_jump_link" target="_blank" data-type="copy">复制视频链接</div>`);
    copyUrl.on("click", () => {
      _GM_setClipboard(url, "text/plain");
      copyUrl.text("复制成功");
    });
    $container.append(jumpLink1).append(jumpLink2).append(downloadLink).append(copyUrl);
  };
  const audiosSuccess = (audios) => {
    const sellContainer = getSellerContainer();
    if (!sellContainer) {
      return;
    }
    audios.forEach((audio) => {
      const $audio = $$1(
        `<audio src="${audio.remoteUrl}" controls="controls"></audio>`
      );
      $$1(sellContainer).append($audio);
    });
  };
  const videosSuccess = (url) => {
    const sellContainer = getSellerContainer();
    if (!sellContainer) {
      return;
    }

    // 创建DPlayer容器
    const playerId = `dplayer_${Date.now()}`;
    const $playerContainer = $$1(`<div id="${playerId}" style="width: 100%; height: 400px; margin: 10px 0;"></div>`);
    $$1(sellContainer).append($playerContainer);

    // 初始化DPlayer
    try {
      const dp = new DPlayer({
        container: document.getElementById(playerId),
        autoplay: false,
        theme: '#FADFA3',
        loop: false,
        lang: 'zh-cn',
        screenshot: true,
        hotkey: true,
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        video: {
          url: url,
          type: 'hls', // M3U8文件使用HLS类型
        },
        pluginOptions: {
          hls: {
            // HLS配置选项
            enableWorker: false,
            lowLatencyMode: true,
          },
        },
      });

      logger("DPlayer播放器创建成功:", url);

      // 监听播放器事件
      dp.on('loadedmetadata', function () {
        logger("视频元数据加载完成");
      });

      dp.on('error', function (info) {
        logger("播放器错误:", info);
      });

    } catch (error) {
      logger("创建DPlayer失败，使用备用iframe方案:", error);
      // 如果DPlayer创建失败，回退到iframe方案
      $playerContainer.remove();
      const encodeUrl1 = `https://m3u8play.dev/?url=${url}`;
      const $iframe = $$1(
        `<iframe width="100%" height='400' frameborder='0' align='center' allow="fullscreen" allow="autoplay" id='iframe' src="${encodeUrl1}"></iframe>`
      ).css({ width: "100%" });
      $$1(sellContainer).append($iframe);
    }
  };
  function handleMoreButtonMobile() {
    $$1("button:contains('点击展开完整贴文')").click();
  }
  const removeContainer = () => {
    $$1("#crack_container").remove();
  };
  const hackPostTitle = (title) => {
    const $ele = $$1("#details-page > div.header > h2 > span");
    const originTitle = $ele.text();
    $ele.text(`${title}${originTitle}`);
  };
  logScriptInfo();
  const handleDetailCallback = (response) => {
    logger("开始处理帖子详情数据");
    const data = decodeEncryptString(response);
    logger("解密后的数据:", data);
    const attachments = data.attachments;
    const images = [];
    const videos = [];
    const audios = [];
    attachments.forEach((element) => {
      if (element.category === "images") {
        images.push(element);
      } else if (element.category === "audio") {
        audios.push(element);
      } else if (element.category === "video") {
        videos.push(element);
      }
    });
    handleMoreButtonMobile();
    if ((images == null ? void 0 : images.length) > 0) {
      const sellImgs = images.filter(
        (img) => !data.content.includes(`data-id="${img.id}"`)
      );
      if (sellImgs.length)
        ;
    }
    if ((audios == null ? void 0 : audios.length) > 0) {
      audiosSuccess(audios);
    }
    if ((videos == null ? void 0 : videos.length) > 0) {
      videos.forEach(async (video) => {
        const url = video == null ? void 0 : video.remoteUrl;
        if (url) {
          logger("获取到视频地址:", url);
          // 获取预览地址内容并解析真实文件名
          try {
            const response2 = await fetch(url);
            const data2 = await response2.text();
            const realVideoPath = getRealVideoSrc(data2);

            if (realVideoPath) {
              // 提取文件名部分（如果getRealVideoSrc返回的是完整路径）
              const realFileName = realVideoPath.includes('/') ?
                realVideoPath.split('/').pop() : realVideoPath;

              // 将预览地址中的文件名替换为真实文件名
              const realUrl = url.replace(/\/[^\/]+_i_preview\.m3u8$/, `/${realFileName}`);
              logger("解析得到真实视频地址:", realUrl);
              videosSuccessHelperDom(realUrl);
              videosSuccess(realUrl);
            } else {
              logger("无法解析真实文件名，使用原地址");
              handleVideoCallback(data2);
            }
          } catch (error) {
            logger("获取视频内容失败:", error);
          }
        }
      });
    }
    const titleObj = {
      图片: images.length > 0,
      视频: videos.length > 0,
      音频: audios.length > 0
    };
    const titleStr = Object.entries(titleObj).filter((item) => item[1]).map((item) => item[0]).join("、");
    if (titleStr.length > 0) {
      const titlePrefix = `[${titleStr}]`;
      hackPostTitle(titlePrefix);
    }
  };
  const handleVideoCallback = (videoResponse) => {
    logger("开始解析视频");
    const videoSrc = getRealVideoSrc(videoResponse);
    if (!videoSrc) {
      logger("解析视频失败");
      return;
    }
    logger("解析视频成功");
    handleMoreButtonMobile();
    videosSuccessHelperDom(videoSrc);
    videosSuccess(videoSrc);
  };
  const mainFunctionArray = [];
  initCrackDom();
  injectHttp(
    (response) => {
      mainFunctionArray.push(() => handleDetailCallback(response));
    },
    () => {
    }
  );
  handleUrlChange(() => {
    const pid = getPostId();
    if (!pid) {
      removeContainer();
    }
  });
  handleCrackTime(() => {
    handleEmptySellerContainer();
    const isSuccess = mainFunctionArray.length > 0;
    if (isSuccess) {
      setTimeout(() => {
        mainFunctionArray.forEach((cb) => cb());
      }, 1e3);
    }
    return isSuccess;
  });

})(jQuery);
