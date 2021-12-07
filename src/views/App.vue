<template>
    <div class="m_root">
        <div class="header" v-drag>
            学堂云刷课插件
        </div>
        <div class="body">
            <div class="stBtn" @click="onBtnClick">{{curTxt}}</div>
             <div>播放：{{stateTxt}}</div>
             <div>剩余：{{needStu.length}}</div>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
import eventConole from "@/components/EventConsole.vue"

export default {
    components:{eventConole},
    data(){
        return {
hl:'hello world',
curTxt:"点击开始",
curState:0,
initd:0,
needStu:[],
stateTxt:""
        }
    },
    methods:{
        onBtnClick(){
            if(this.curState===0){
                this.curState = 1;
                this.curTxt ='点击停止';
                if(this.initd==0){
                    this.$bus.once("cjd_loaded",this.onCjdLoaded);
                    this.initd =1;
                     var cjd = $("#tab-student_school_report");
                     if(!cjd.hasClass("is-active")){
                         cjd.click();
                     }else{
                         this.onCjdLoaded();
                     }
                }else{
                    this.startPlay();
                }
               
            }else{
                this.curTxt ='点击开始';
                this.curState = 0;
            }
        },
        onCjdLoaded(){
            console.info("in onCjdLoaded event");
            // this.$off("cjd_loaded");
            var lis = $("li.study-unit");
            const that =this;
            lis.forEach(item => {
                var isShiP = $("i.icon-set",item).hasClass("icon--shipin1");
                if (isShiP) {
                    const isF =$("span.font14",item).text();
                   //console.info("isShiP:",isShiP,"isF:",isF)
                   if (isF.indexOf("已完成")<0) {
                       that.needStu.push($("div.hoverblue",item))
                   }
                }
            });
           setTimeout(() => {
               that.startPlay();
           }, 500);
        },
        startPlay(){
             if (this.needStu.length>0 && this.curState===1) {
                let one = this.needStu.shift();
                if (one) {
                   this.stateTxt = $(one).text();
                    $(one).click();
                }
            }
        }
    },
    mounted(){
        this.$bus.on("videoNext",this.startPlay)
    }
}
</script>

<style lang="scss" scoped>
.m_root{
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 10px;
    right: 10px;
    width: 200px;
    height: 300px;
    z-index: 999;
    border: 1px solid #EEE;
    border-radius: 10px;
    background-color: #FFF;
    overflow: hidden;
    .header{
        background-color: #FE0;
        text-align: center;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        border-bottom: 1px solid #999;
    }
    .body{
        flex: 0 1;
        flex-grow: 1;
    padding: 5px;
        .stBtn{
            width: 150px;
            margin: 5px auto;
            border: 1px solid rgb(37, 35, 35);
            background-color: rgb(30, 81, 148);
            text-align: center;
            border-radius: 5px;
            padding: 5px;
            color: #FFF;
            
        }
    }
    .footer{
        background-color: #888;
        height: 40px;
    }
}
</style>