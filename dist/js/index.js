//主js文件
//因为习惯使用$,所以将window.Zepto赋值给$
var $=window.Zepto;
var root=window.player;
var $body=$(document.body);
var songList;
var controlmanager;
var audio=new root.audioManager();

//用ajax获取后台数据，并在成功的回调函数里进行一些操作
function getData(url){
    $.ajax({
        type:"GET",
        url:url,
        // async:false,
        success:function(data){
            songList=data.data;
            //因为root.controlManager(data.length)是一个构造函数,所以可以new
            controlmanager = new root.controlManager(data.data.length);
            // audiomanager = 
            //注意程序的顺序，先绑定事件之后，才能触发事件
            bindClick();
            bindTouch();
            root.playlist.renderlist(data.data);
            $body.trigger('play:change',0);
        },
        error:function(){
            console.log("error");
        }
    })
}
// getData("../moke/data.json");
getData("https://easy-mock.com/mock/5b10d0213a1a393db33d41a4/music/getmusicinfo");

// console.log(songList);     undefined
//说ajax是异步的，所以在外面打印的时候，可能该函数还没执行完，所以出现undefined
//说可以将它改为同步的，但是一般使用都是用的异步

//拖拽进度条
function bindTouch(){
    var $sliderPoint=$body.find('.slider-point');
    var offset=$body.find('.pro-wrapper').offset();
    var left=offset.left;
    var width=offset.width;
    // console.log(offset);
    $sliderPoint.on('touchstart',function(){
        //触碰到进度条小点的时候,停止进度条
        root.processor.stop();
    }).on('touchmove',function(e){
        var x=e.changedTouches[0].clientX;
        //获取当前拖动位置的百分比
        var percent=(x-left)/width;
        if(percent>1||percent<0){
            percent=0;
        }
        //更新进度条和播放时间
        root.processor.updata(percent);
    }).on('touchend',function(e){
        var x=e.changedTouches[0].clientX;
        var percent=(x-left)/width;
        if(percent>1||percent<0){
            percent=0;
        }
        var curDuration=songList[controlmanager.index].duration;
        var curTime=curDuration*percent;
        //手指抬起时,更新进度条和播放时间
        root.processor.updata(percent);
        //跳转到当前时间播放
        audio.jumpToplay(curTime);
        //在当前百分比开启进度条
        root.processor.start(percent);
        //更新播放按钮的状态
        $body.find('.play-btn').addClass('playing');
    })
    
}

function bindClick(){
    //移动端的click有300ms的延迟
    //因为需要渲染的除了页面，还有资源，还有喜欢的歌曲，所以可以将其提取出来，
    //放到一个自定义事件里(play:change)，来简化程序。（也可以放到一个函数里）
    //这个回调函数的第一个参数是event,第二个参数才是自定义的数据
    $body.on('play:change',function(event,index,flag){
        //渲染歌曲信息,图片和是否喜欢
        root.render(songList[index]);
        //渲染当前歌曲的总时间
        root.processor.renderAllTime(songList[index].duration);
        //当歌曲改变时，换掉歌曲的源
        audio.setAudioSource(songList[index].audio);
        //改变歌曲后，如果状态是播放，则继续播放。并且将进度条清零(重新开启进度条)
        if(audio.status=='play'||flag){
            audio.play();
            root.processor.start();
        }
        root.processor.updata(0);
    })
    //上一首按钮
    $body.on('click','.prev-btn',function(){
        var index=controlmanager.prev();      
        $body.trigger('play:change',index);
    })
    //下一首按钮
    $body.on('click','.next-btn',function(){
        console.log(12)
        var index=controlmanager.next();  
        $body.trigger('play:change',index);
    })
    //播放与暂停按钮
    $body.on('click','.play-btn',function(){     
        if(audio.status=='pause'){
            audio.play();
            root.processor.start();
            // $body.find('.play-btn').addClass('playing');
        }else if(audio.status=='play'){
            audio.pause();
            root.processor.stop();
            // $(this).removeClass('playing');
        }
        //改变播放按钮的样式
        $(this).toggleClass('playing');
    })
    //展示播放列表
    $body.on('click','.list-btn',function(){
        root.playlist.show(controlmanager);
    })
   
}


