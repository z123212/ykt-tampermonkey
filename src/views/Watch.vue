<template>
    <div class="m_root">
        <div class="header" v-drag>
            学堂云刷课插件
        </div>
        <div class="body">
            
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
export default {
    data(){
        return{}
    },
    methods:{
        onVideoComplete(){
            GM_setValue("YongGer_xty_isplay", 1)
            setTimeout(() => {
                window.close();
            }, 3000);
        },
        reCheck(){
             var playBtn = $(".xt_video_player_play_btn");
            console.info(playBtn);
            if(playBtn.length>0 && !playBtn.hasClass("xt_video_player_play_btn_pause"))
                {
                    console.info("触发播放按钮");
                    $(".xt_video_player_play_btn").click();
                }
        },
        pageReady(){
            console.info("document ready!!")
            let that =this;
            setTimeout(()=>{
            //播放按钮
            //xt_video_player_play_btn fl xt_video_player_play_btn_pause
            var playBtn = $(".xt_video_player_play_btn");
            console.info(playBtn);
            if(playBtn.length>0 && !playBtn.hasClass("xt_video_player_play_btn_pause"))
                {
                    console.info("触发播放按钮");
                    $(".xt_video_player_play_btn").click();
                    setTimeout(that.reCheck, 2000);
                }
            
            //静音
           var mutedBtn= $(".xt_video_player_common_icon");//.click()
           if (mutedBtn.length>0 && !mutedBtn.hasClass("xt_video_player_common_icon_muted")) {
               mutedBtn.trigger("click");
           }
            },5000);
           
        }
    },
    mounted(){
        this.$bus.once("videoComplete",this.onVideoComplete);
        if (document.readyState === 'loading') {  // 此时加载尚未完成
                document.addEventListener('DOMContentLoaded', this.pageReady);
        }else{
            this.pageReady();
        }
       
    }
}
</script>

<style lang="sass" scoped>
.m_root{
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 10px;
    right: 10px;
    width: 200px;
    height: 300px;
    z-index: 3999;
    border: 1px solid #F00;
    border-radius: 10px;
    background-color: #EEE;
    overflow: hidden;
    .header{
        background-color: #FE0;
        
        height: 40px;
        cursor: pointer;
    }
    .body{
        flex: 0 1;

        .stBtn{
            width: 50px;
            border: 1px solid #000;
        }
    }
    .footer{
        background-color: #888;
        height: 40px;
    }
}
</style>