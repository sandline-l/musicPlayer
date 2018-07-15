
//将这个功能封装成一个函数的好处是，防止别人直接更改index的值。增加数据的安全性，减少可能由于
//更改index带来的bug
//将功能封装成一个函数,并且将这个函数保存为一个外部对象的一个方法
(function($,root){
    //功能是，控制歌曲的序号。构造函数
    function controlManager(len){
        this.index=0;
        // console.log(index);
        this.len=len;
    }
    //在构造函数的原型上定义方法
    controlManager.prototype={
        prev:function(){
            return this.getIndex(-1);
        },
        next:function(){
            return this.getIndex(1);
        },
        //操作index的值
        getIndex:function(val){
            //看当前的index是多少
            var index=this.index;
            //看当前有多少首歌
            var len=this.len;
            var curIndex=(index+val+len)%len;
            this.index=curIndex
            return curIndex;
        }
    }
//将构造函数暴露出去
    root.controlManager=controlManager;
})(window.Zepto,window.player||(window.player={}))