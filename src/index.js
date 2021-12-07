// console.log("Hello World!");
// XMLHttpRequest = unsafeWindow.XMLHttpRequest;

import Vue from 'vue'
import App from './views/App.vue'
import Watch from './views/Watch.vue'
import {proxy, unProxy} from "./units/ajaxHook/index";
import EventBus from "vue-bus";
//增加拖拽指令
Vue.directive(
 "drag",
     {
      inserted: function (el, binding, vnode) {
        var odiv = el.parentNode // 获取元素的父级 也就是这个移动的窗口
        el.onmousedown = function (eve) {
          eve = eve || window.event
          var mx = eve.pageX // 鼠标点击时的x坐标位置
          var my = eve.pageY // 鼠标点击时的y坐标位置
          var dleft = odiv.offsetLeft // 窗口初始的位置
          var dtop = odiv.offsetTop
          var clientWidth = document.documentElement.clientWidth // 页面的宽
          var oWidth = odiv.clientWidth // 窗口的宽度
          var maxX = clientWidth - oWidth // x轴能移动的最大距离
          var clientHeight = document.documentElement.clientHeight // 页面的高
          var oHeight = odiv.clientHeight // 窗口的高度
          var maxY = clientHeight - oHeight // y轴能移动的最大距离
          document.onmousemove = function (e) {
            e.preventDefault()
            var x = e.pageX // 移动时鼠标X坐标
            var y = e.pageY // 移动时鼠标Y坐标
            var left = x - mx + dleft // 移动后对话框新的left值
            var Top = y - my + dtop // 移动后对话框新的Top值
            if (left < 0) {
              left = 0
            }
            if (left > maxX) {
              left = maxX
            }
            if (Top < 0) {
              Top = 0
            }
            if (Top > maxY) {
              Top = maxY
            }
            odiv.style.left = left + 'px'
            odiv.style.top = Top + 'px'
            odiv.style.marginLeft = 0
            odiv.style.marginTop = 0
          }
          document.onmouseup = function () {
            document.onmouseup = ''
            document.onmousemove = ''
          }
        }
    }
});
 
Vue.use(EventBus);

    //适配浏览器插入root节点
var root = document.createElement("div")
root.id="app_root";
document.body.appendChild(root);


let curUri = window.location.href;
console.info("curl=",curUri)
if (curUri.indexOf("/web/xcloud/video-student/")>=0) {
    new Vue({
        el:"#app_root",
        render:h=>h(Watch)
    }); 
}else{
    //监听url发生变化，根据相应变化做出反应
    if (window.onurlchange === null) {  
        // feature is supported  
        window.addEventListener('urlchange', (info) => {
            //console.info("url 发生改变");

        });  
    }
    new Vue({
        el:"#app_root",
        render:h=>h(App)
    }); 
}
// window.getUrlPara =

String.prototype.getUrlPara = function(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = this.match(reg);
    if (r!=null) return unescape(r[2]); return null;
}

proxy({
    
    //请求发起前进入
    onRequest: (config, handler) => {
        // console.log(config.url)
        handler.next(config);
    },
    //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
    onError: (err, handler) => {
        // console.log(err.type)
        handler.next(err)
    },
    //请求成功后进入
    onResponse: (response, handler) => {
        //https://changjiang.yuketang.cn/c27/online_courseware/schedule/score_detail/single/3296805/0/
        
        var apiUrl=handler.xhr.config.url;
        //console.info("apiUrl:",apiUrl);
        if(apiUrl&&apiUrl.indexOf('/online_courseware/schedule/score_detail/single/')>0){
            //console.info("请求成绩单接口");
            setTimeout(() => {
                Vue.bus.emit("cjd_loaded",1);
            }, 2000); 
            //https://changjiang.yuketang.cn/video-log/get_video_watch_progress/?
        }else if(apiUrl && apiUrl.indexOf('/get_video_watch_progress/')>=0){
            var vid=apiUrl.getUrlPara("video_id")*1;
            //console.info("vid=",vid);
            if(vid>0){
                var datas = JSON.parse(response.response);
                if(datas && datas.data){
                    var s = datas.data[vid]
                    //console.warn("s=",s);
                    if (s && s.completed && s.completed==1) {
                        Vue.bus.emit("videoComplete",1);
                    }
                }
            }
             console.info("视频播放进度接口:",response);
            // console.info("handler:",handler);
            
             
        }
        handler.next(response)
    }
});
  
GM_setValue("YongGer_xty_isplay", 0)
GM_setValue("YongGer_xty_kc", {datas:[],index:0})
//监听一个存储器值的变化，用于信息同步
GM_addValueChangeListener("YongGer_xty_isplay", function(name, old_value, new_value, remote) {
    if (new_value==1) {
        console.warn("YongGer_xty_isplay=",new_value)
        GM_setValue("YongGer_xty_isplay", 0)
        //videoNext
        setTimeout(() => {
            Vue.bus.emit("videoNext",1);
        }, 2000);
        
    }
})