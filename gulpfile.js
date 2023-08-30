const gulp = require('gulp');
const concat = require('gulp-concat');
const minifyCss = require('gulp-minify-css');
const sass = require('gulp-sass')(require('node-sass'));

gulp.task('build_scripts', () => {
    return gulp.src(['main/**/*.js', 'components/**/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build_style', () => {
    return gulp.src(['styles/*.scss'])
        .pipe(concat('main.scss'))
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    gulp.watch(['styles/*.scss', 'shared/**/*.js', 'main/**/*.js', 'components/**/*.js'], { ignoreInitial: false }, gulp.parallel('build_scripts', 'build_style'))
});

gulp.task('default', gulp.parallel('build_scripts', 'build_style'));