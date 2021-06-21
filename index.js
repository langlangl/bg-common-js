
import Track from '@/utils/track'
import store from '@/vuex/store'

/**
 * @description 获取hash分流a/b策略
 * @param {*} str 
 */
export const getHashCode = (str) => {
    let hash = 0; // 获取哈希值
    let i;
    let chr;
    let len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i += 1) {
        chr = str.charCodeAt(i);
        // eslint-disable-next-line no-bitwise
        hash = (hash << 5) - hash + chr;
        // eslint-disable-next-line no-bitwise
        hash |= 0;
    }
    hash = Math.abs(hash);
    hash %= 100;
    // A1:[0,25) A2:[25,50) B1:[50,75) B2:[75,100)
    return hash >= 50 ? 'B' : 'A';
  
};

/**
 * @description GUID（全球唯一标识）是微软使用的一个术语，由一个特定的算法，给某一个实体，如Word文档，创建一个唯一的标识，GUID值就是这个唯一的标识码.除了.Net有专门的方法生成外，JS也可以生成GUID
 * @returns 
 */
export const guid =()=>{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

/**
 * @description 获取url参数
 * @param {*} name 
 * @returns 
 */
export const getUrlParams =(name)=>{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if(r!=null) return  r[2]; return null;
}

/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */

export const debounce = (func, wait, immediate,info) => {
  let timer;
  let context;
  let args;

  // 延迟执行函数
  const later = () =>
      setTimeout(() => {
          // 延迟函数执行完毕，清空缓存的定时器序号
          timer = null;
          // 延迟执行的情况下，函数会在延迟函数中执行
          // 使用到之前缓存的参数和上下文
          if (!immediate) {
              func.apply(context, args);
              // eslint-disable-next-line no-multi-assign
              context = args = null;
          }
      }, wait);

  // 这里返回的函数是每次实际调用的函数
  // eslint-disable-next-line func-names
  return function (...params) {
      // 如果没有创建延迟执行函数（later），就创建一个
      if (!timer) {
          timer = later();
          // 如果是立即执行，调用函数
          // 否则缓存参数和调用上下文
          if (immediate) {
              func.apply(this, params);
          } else {
              context = this;
              args = params;
          }
          // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
          // 这样做延迟函数会重新计时
      } else {
          clearTimeout(timer);
          timer = later();
      }
  };
};

/**
 * 节流函数
 * @param {*} fn 
 * @param {*} wait 
 * @returns 
 */
export const throttle = (fn,wait) =>{
    var timer = null;
    return function(){
        var context = this;
        var args = arguments;
        if(!timer){
            timer = setTimeout(function(){
                fn.apply(context,args);
                timer = null;
            },wait)
        }
    }
}
/**
 * @description 两个版本号判断
 * @param {*} v1 
 * @param {*} v2 
 * @returns 
 */
export const compareVersion = (v1, v2) => {
    if (v1 == v2) {
      return 0;
    }
    const vs1 = v1.split(".").map(a => parseInt(a));
    const vs2 = v2.split(".").map(a => parseInt(a));
    const length = Math.min(vs1.length, vs2.length);
    for (let i = 0; i < length; i++) {
      if (vs1[i] > vs2[i]) {
        return 1;
      } else if (vs1[i] < vs2[i]) {
        return -1;
      }
    }
  
    if (length == vs1.length) {
      return -1;
    } else {
      return 1;
    }
  }


export const jumpOfferWall = (source,track,pageTitle)=>{
  let {app} = sessionStorage;
  app = app ? JSON.parse(app) : {};
  const bundle = app.bundle;
    const result = compareVersion(app.sdkv,"1.4.4")
    if(result == -1 || bundle !="com.push.surprise" && !window.AdSDK.OfferWall.isReady()){
      if(track)
      track.trackEvent({
        ev: "OfferWall",
        remarks: source,
        elementName:"",
        pageTitle: pageTitle,
      })
      store.commit('setIntegralWallSource', source)
      store.commit('setIsShowIntgralWall', true)
    }else{
      window.AdSDK.OfferWall.showAd(source)
    } 
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
 export const parallelDownloadfn = ({
  landPage,
  pageTitle,
  elementName,    //事件名称
  trackLink = "", //track链接
  trackState = "",//track状态
  source = "bto", //渠道名称 ：channal
  flag = false, //是否需要埋点  ，true：埋点 ，false:不埋点
  sourceType = "", //资源类型
  isWebView=false, //是否用webview的方式打开
  track
}) => {
  if (!landPage) {
    console.error("landPage为必传参数！");
    return;
  }
  if (!pageTitle) {
    console.error("pageTitle为必传参数！");
    return;
  }
  if (!elementName) {
    console.error("elementName为必传参数！");
    return;
  }
  let { device, pos, ecData, app } = sessionStorage;
  device = device ? JSON.parse(device) : {};
  ecData = ecData ? JSON.parse(ecData) : {};
  app = app ? JSON.parse(app) : {};
  pos = pos ? JSON.parse(pos) : {}
  const jumpUrl = ecData.best + "/ad/jump";
  const did = device.did;
  const bundle = app.bundle;
  const time = new Date().getTime();
  let isGp = landPage.indexOf("play.google.com") != -1;
  let isSelfHost =landPage.indexOf("dl.abea3.xyz") != -1  //是否是自己内部的落地页
  isWebView = isWebView ||  ""
  const params = `?isWebView=${isWebView}opentype=${pageTitle}&did=${did}&source=${source}&bundle=${bundle}&ts=${time}&sourceType=${sourceType}`
  let url = `${landPage}${params}`;
  let jumpPage = (isGp || !isSelfHost) ? landPage : `${jumpUrl}?dataPageTitle=${pageTitle}&dataElementName=${elementName}&dataRemarks=${source}&url=${encodeURIComponent( url )}&bundle=${bundle}&did=${did}&mpid=${pos.mpid}&pos=${pos.id}&crid=${ pos.crid }&cpid=${pos.cpid}`;
  if (flag && track) {
    track.trackEvent({
      ev: source,
      remarks: "",
      elementName: elementName,
      pageTitle: pageTitle,
    });
  }
  if (trackState == "rewarded") {
    trackLink = "";
  }
  const isNew = compareVersion(app.sdkv, "1.2.15");
  if(isWebView ||  bundle == 'com.orange.media3'){
    window.AdSDK.WebView.loadURL(jumpPage,555,666)
    setTimeout(()=>{
      window.AdSDK.WebView.show(666)
    },500)
    return;
  }
  if (isNew != -1 && trackLink && trackState != "rewarded") {
    //是否是新的sdk版本   是   并行
    window.AdSDK.openBrowser(jumpPage, {
      landUrl: landPage,
      trackerUrl: trackLink,
    });
  } else {
    window.AdSDK.openBrowser(trackLink ? trackLink : jumpPage);
  }
}
