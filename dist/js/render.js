//渲染歌曲信息
(function($,root){
    var $body=$(document.body);
//渲染当前这首歌的信息
    function rendinfo(info){
        // console.log(info);
        var html='<div class="song-name">'+info.song+'</div>'+
                '<div class="atu-name">'+info.singer+'</div>'+
                '<div class="album">'+info.album+'</div>';
        $body.find('.song-info').html(html);
    }
//渲染当前这首歌的图片
    function rendimg(src){
        // console.log(src.image);
        var img=new Image();
        img.onload=function(){
            //这个是高斯模糊js文件对外暴露的功能接口,传入图片对象,和要渲染的节点
            root.blurImg(img,$body);
            $body.find('.song-img img').attr('src',src);
        }
        img.src=src;
    }
//渲染当前这首歌是否喜欢
    function rendIslike(isLike){
        if(isLike){
            $body.find('.like-btn').addClass('liking');
        }else{
            $body.find('.like-btn').removeClass('liking');
        }
    }
//对外暴露一个接口，render 。 它是一个函数，函数里面执行了几个渲染函数
    root.render=function(data){
        rendinfo(data);
        rendimg(data.image);
        rendIslike(data.isLike);
    }
})(window.Zepto,window.player||(window.player={}))

//root=window.player;