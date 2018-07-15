(function($,root){
    
    var $body=$(document.body);
    var control;
    var $playstr=$(`<div class='play-list'>
                    <div class='list-header'>播放列表</div>
                    <ul></ul>
                    <div class='list-close'>关闭</div>
                    </div>`);
    //渲染播放列表
    function renderlist(songList){
        console.log(songList);
        var len=songList.length;
        var index=controlmanager.index;
        console.log(index);
        var str='';
        for(i=0;i<len;i++){
            str+=`<li>${songList[i].song}<span>${songList[i].singer}</span></li>`
        }
        $playstr.find('ul').html(str);
        signSong(index);
        $body.find('.wrapper').append($playstr);
        bindEvent();
    }
    function bindEvent(){
        //给关闭按钮绑定事件,关闭播放列表
        $body.on('click','.list-close',function(){
            $body.find('.play-list').removeClass('show');
        })
        $body.find('li').on('click',function(){
            //获取当前点击的li的索引
            var index=$(this).index();
            console.log(index);
            //将该li标记
            signSong(index);
            //让当前播放索引等于被点击li的索引
            control.index=index;
            //触发改变播放歌曲事件
            $(this).trigger('play:change',[index,true]);
            //隐藏歌曲列表
            $playstr.removeClass("show")
            //改变播放按钮状态
            $body.find('.play-btn').addClass('playing');    
        })
    }
    //标记li
    function signSong(index){
        $body.find('.sign').removeClass('sign');
        $playstr.find('ul li').eq(index).addClass('sign');
    }
    //显示播放列表,并渲染当前被标记的li
    function show(controlmanager){
        control=controlmanager;
        $body.find('.play-list').addClass('show');
        signSong(control.index);
    }
    root.playlist={
        renderlist:renderlist,
        show:show
    }
    
})(window.Zepto,window.player||(window.player={}))