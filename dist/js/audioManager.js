//音频管理，用来播放，暂停，设置资源
(function($,root){
    var $body=$(document.body);
    function audioManager(){
        //创建一个音频对象
         this.audio=new Audio('');
         //当前歌曲状态
         this.status='pause';
         this.bindEvent();
    }
    audioManager.prototype={
        //绑定事件,监听歌曲是否播放完成,播放完成就跳到下一首播放
        bindEvent:function(){
            $(this.audio).on('ended',function(){
                $body.find('.next-btn').trigger('click');
            })
        },
        play:function(){
            //播放音频,并将状态改为播放状态
            this.audio.play(); 
            this.status='play';
        },
        pause:function(){
            //播放音频,并将状态改为暂停状态
            this.audio.pause();
            this.status='pause';
        },
        setAudioSource:function(src){
            // 改变歌曲链接
            this.audio.src=src;
            // 重新加载音频
            this.audio.load();
        },
        //跳转到当前时间播放
        jumpToplay:function(time){
            this.audio.currentTime=time;
            this.play();
        }
    }
    root.audioManager=audioManager;
})(window.Zepto,window.player||(window.player={}))

//root=window.player;