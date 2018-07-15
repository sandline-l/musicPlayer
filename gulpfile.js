//它是js文件，按js的方式来写。就是说可以用编程的方法，来
//运行任务,用编码的方式去定义一些任务
//引入依赖,要使用gulp，就先引入它
var gulp = require("gulp");
//压缩image文件
var imagemin = require("gulp-imagemin");
//引入 gulp-htmlclean 插件，压缩html文件 (使用这些插件之前,你想要下载这些插件)
var htmlclean = require("gulp-htmlclean");
//引入插件,压缩js文件
var uglify=require("gulp-uglify");
//去除js文件的调试代码
var stripDebug=require("gulp-strip-debug");
//连接js文件,将多个js文件整合成一个js文件
var concat=require("gulp-concat");
//确定各个js文件之间的先后顺序，相互依赖.可以让你去定义js之间的相互依赖
var deporder=require("gulp-deporder");
//将less转化为css
var less=require("gulp-less");
//引入postcss插件，允许你使用这个工具,它是一个工具的集合
var postcss=require("gulp-postcss");
//postcss工具里的补全css3前缀的插件
var autoprefixer=require("autoprefixer");
//postcss里的压缩css代码的插件
var cssnano=require("cssnano");
//引入这个插件,开启自己的服务器
var connect=require("gulp-connect");


var folder = {
    src :"src/",
    dist : "dist/"
}
//判断是不是生产环境，如果是就压缩代码。如果是开发环境就不压缩代码
//procss是node里的一个变量
//如果是开发模式,就是ture,如果是生产模式,就是false   production-->生成环境
var devMode=process.env.NODE_ENV !== "production";

//定义一个任务,任务名为"html",当执行这个任务时,就是执行后面的回调函数
gulp.task("html",function(){
    //将文件变成文件流(读取src/html下面的index.html文件)
    //如果是所有html,就是"html/*"
   var page=gulp.src(folder.src + "html/index.html")
                //当文件改变时，自动刷新浏览器
                .pipe(connect.reload());
            //如果是生产环境,就压缩代码
            if(!devMode){
                page.pipe(htmlclean());
            }
        //对文件流进行一些操作        
        //将文件输出到 dist/html 中去
        page.pipe(gulp.dest(folder.dist+"html/"))
})

gulp.task("images",function(){
    gulp.src(folder.src + "image/*")
        .pipe(imagemin())
        .pipe(connect.reload())
        .pipe(gulp.dest(folder.dist +"image/"))
})
gulp.task("js",function(){
    var js=gulp.src(folder.src + "js/*")
                .pipe(connect.reload());
        if(!devMode){
            js.pipe(uglify())
            .pipe(stripDebug())
            //我们现在不要这个js融合了,因为js融合可能会有一些bug
            //要是想用js融合,最好去使用webpack的模块化功能
            // .pipe(deporder())
            // .pipe(concat("main.js"))
            
        }  
        //concat 这个插件要填一个参数，是指1将这些js整合成一个js的那个的名字  
        js.pipe(gulp.dest(folder.dist +"js/"))
})
gulp.task("css",function(){
    var css=gulp.src(folder.src + "css/*")
                .pipe(connect.reload())
                .pipe(less()) ;
        //这里有一个顺序的问题，要先把less变成css代码
        //再进行压缩,不然就压缩不了因为它还是less代码的时候,这个插件不认
        var options=[autoprefixer()];
        if(!devMode){
            options.push(cssnano());
        } 
        //postcss这个工具里有很多插件，所以里面的值就用数组的形式传入  
        css.pipe(postcss(options))
            .pipe(gulp.dest(folder.dist +"css/"))
})
//任务监听，自动执行任务的功能。当有文件改变时，自动执行对应的任务
gulp.task("watch",function(){
    gulp.watch(folder.src+"html/*",["html"]);
    gulp.watch(folder.src+"images/*",["images"]);
    gulp.watch(folder.src+"js/*",["js"]);
    gulp.watch(folder.src+"css/*",["css"]);
})
//开启一个服务器
gulp.task("server",function(){
    connect.server({
        //配置你选择的端口
        post:"8080",
        //当文件改变时，自动刷新浏览器(热启)
        livereload:true
    });
})
// postcss是一个工具的集合，它提供了很多插件
gulp.task("default",["html","images","js","css","watch","server"])


