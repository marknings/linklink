var NAME="main";
var gulp=require('gulp');
var fileInclude=require('gulp-file-include');
var rename=require('gulp-rename');
var less=require('gulp-less');
var concat=require('gulp-concat');
var ejs=require('gulp-ejs');
var clean=require('gulp-clean');

//代替 minifycss
var cleanCSS = require('gulp-clean-css');
//var minifycss=require('gulp-minify-css');
var uglify=require('gulp-uglify');
var jshint=require('gulp-jshint');

var webDir="../web/";

//默认任务
/*gulp.task('default',['clean'],function(){
    gulp.start('buildCss','buildJs','buildHTML');
});*/
gulp.task('default',['buildCss','buildJs','buildHTML','copyImg']);
//语法检查
gulp.task('jshint',function(){
    gulp.src('source/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
gulp.task('clean',function(){
    gulp.src([webDir+'*.html',webDir+'module/*',webDir+'common/*'])
        .pipe(clean());
});
//生成css
gulp.task('buildCss',function(){
    gulp.src(['source/less/main.less'])
        .pipe(less())
        .pipe(concat(NAME+'.css'))
        /*.pipe(gulp.dest('source/'))*/
        .pipe(rename(NAME+'.min.css'))
        .pipe(cleanCSS({compatibility: 'ie7'}))
        .pipe(gulp.dest(webDir+'common/css'));
});
//生成js
var srcFiles=['source/js/*.js'];
gulp.task('buildJs',function(){
    gulp.src(srcFiles)
        /*.pipe(concat(NAME+'.js'))*/
        /*.pipe(gulp.dest('source/'))*/
        /*.pipe(rename(NAME+'.min.js'))*/
        /*.pipe(uglify())*/
        .pipe(rename(function(path){
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest(webDir+'common/js'));
});
//生成HTML
gulp.task('buildHTML',function(){
    gulp.src(['source/views/*.ejs','source/views/module*/**/*.ejs'])
        .pipe(ejs({},{ext: '.html'}))
        .pipe(gulp.dest(webDir))
});
//拷贝图片
gulp.task('copyImg',function(){
    gulp.src(['source/less/img/*.*'])
        .pipe(gulp.dest(webDir+'common/img/'));
});



