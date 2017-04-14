var sass = require('gulp-sass');
var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('gulp-browserify');

var bower_base = './bower_components/';

var scripts = [
  bower_base + 'jquery/dist/jquery.min.js',
  bower_base + 'jquery/dist/jquery.min.map',
  './app/app.js',
  './app/js/*.js',
];

gulp.task('css', function () {
  return gulp.src('./bower_components/bootstrap/scss/*.scss')
    .pipe(sass({
      //includePaths: [config.bootstrapDir + '/assets/stylesheets'],
    }))
    .pipe(gulp.dest('./app/dist/css'));
});


gulp.task('js', function () {
  return gulp.src(
    scripts)
    .pipe(gulp.dest('./app/dist/js'));
});

gulp.task('connect', function () {
  connect.server({
    root: 'app',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./app/*.html', './app/*.js','./app/js/*.js'], ['html', 'js']);
});

gulp.task('default', ['connect', 'watch']);

gulp.task('bundle', function () {
  return browserify({ entries: scripts })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/js'));
});
