/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2016-08-20 23:01:58
 * @version $Id$
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
// var imagemin = require('gulp-imagemin');

gulp.task('script', function() {
	// 将你的默认的任务代码放在这
	gulp.src('js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
});

gulp.task('css', function() {
	// 1. 找到文件
	gulp.src('css/*.css')
		// 2. 压缩文件
		.pipe(minifyCSS())
		// 3. 另存为压缩文件
		.pipe(gulp.dest('dist/css'))
});

// gulp.task('images', function() {
// 	// 1. 找到图片
// 	gulp.src('images/*.jpg')
// 		// 2. 压缩图片
// 		.pipe(imagemin({
// 			progressive: true
// 		}))
// 		// 3. 另存图片
// 		.pipe(gulp.dest('dist/images'))
// });

gulp.task('default', ['script', 'css']);