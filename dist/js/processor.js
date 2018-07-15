//进度条
//渲染最大歌曲时间
(function($,root){
    var $body=$(document.body);
    //当前歌曲总时间
    var curDuration;
    var frameId;
    var lastpercent=0;
    var startTime;
    //将毫秒计的时间转化为分秒
   function formatTime(duration){
        // 将传进来的时间四舍五入
       duration=Math.round(duration);
       var minute=Math.floor(duration/60);
       var second=duration%60;
       if(minute<10){
           minute='0'+minute;
       }
       if(second<10){
        second='0'+second;
    }
        return minute+':'+second;
   }
   //渲染总时间,传进来的参数duration是当前歌曲的总时间(毫秒计)
   function renderAllTime(duration){
       //当切换歌曲时，清除上一首歌记录的lastpercent(播放时间记录)
       lastpercent=0;
       curDuration=duration;
       var allTime=formatTime(duration);
        $body.find('.all-time').html(allTime);
   }
   //更新当前播放时间curTime和进度条，将当前播放百分比传进去
   function updata(percent){
       //求当前播放时间,curDuration是总时间(毫秒计),得到的是有很多小数位的时间
        var curTime=percent*curDuration;
        //将当前播放时间转化为分秒形式
        curTime=formatTime(curTime);
        //更新当前播放时间
        $body.find(".cur-time").html(curTime);
        //更新进度条
        var percentage=(percent-1)*100+"%";
        $body.find(".pro-top").css({
            transform:"translateX("+percentage+")",
        })
   }
   function stop(){
       //取得停止时候的时间戳
       var stopTime=new Date().getTime();
       //记录上次播放百分比,上次播放百分比=上次播放百分比+(停止播放时间-开始播放时间)/总时间
       lastpercent=lastpercent+(stopTime-startTime)/(curDuration*1000);
    //    将动画清掉,让进度条不再动
       cancelAnimationFrame(frameId);
   }
   //开启进度条
   function start(percentage){
       //如果拖动进度条(就传进了参数),就将当前的百分比赋给上一次的百分比
       //没有传参,就不改变lastpercent的值
       lastpercent=percentage===undefined?lastpercent:percentage;
    //    每次开启进度条的时候,都将之前的动画给清除
        cancelAnimationFrame(frameId);
        startTime=new Date().getTime();
        function frame(){
            // 获取当前时间
            var curTime=new Date().getTime();
            //取得当前播放百分比
            var percent=lastpercent+(curTime-startTime)/(curDuration*1000);    
            //console.log(percent);
           if(percent<1){
               frameId=requestAnimationFrame(frame);
               updata(percent);
           }else{
               cancelAnimationFrame(frameId);
           }
       }
       frame();
   }
    root.processor={
        renderAllTime:renderAllTime,
        start:start,
        stop:stop,
        updata:updata,
    }
})(window.Zepto,window.player||(window.player={}))

//root=window.player;