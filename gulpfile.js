var sass = require('gulp-sass');
var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

var bower_base = './bower_components/';

var scripts = [
  bower_base + 'jquery/dist/jquery.min.js',
  // bower_base + 'jquery/dist/jquery.min.map',
  bower_base + 'sweetalert/dist/sweetalert.min.js',
  './bower_components/jquery.avgrund/jquery.avgrund.min.js',
  './app/js/*.js',
  './app/app.js',
];

var styles = [
  './bower_components/bootstrap/scss/*.scss',
  './app/styles/site.scss',
  bower_base + 'sweetalert/dist/sweetalert.css',
  bower_base + 'jquery.avgrund/style/avgrund.css'
]


gulp.task('minify-css', function (cb) {
  pump([
    gulp.src(styles),
    sass(),
    concat('bundle.min.css'),
    sourcemaps.init(),
    cleanCSS(),
    sourcemaps.write(),
    gulp.dest('./app/dist/css')
  ]),
    cb
});

gulp.task('minify-js', function (cb) {
  pump([
    gulp.src(scripts),
    babel({ presets: ['es2015'] }),
    concat('bundle.min.js'),
    uglify(),
    gulp.dest('./app/dist/js')
  ],
    cb
  );
});

gulp.task('css', function (cb) {
  return gulp.src(styles)
    .pipe(sass({
      //includePaths: [config.bootstrapDir + '/assets/stylesheets'],
    }))
    .pipe(gulp.dest('./app/dist/css'));
});


gulp.task('js', function () {
  return gulp.src(
    scripts)
    .pipe(concat('bundle.js'))
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
  gulp.watch(['./app/*.html', './app/*.js', './app/js/*.js',], ['html', 'js']);
});

gulp.task('watch-styles', function () {
  gulp.watch(['./app/styles/*.scss',], ['css']);
});

gulp.task('default', ['connect', 'watch', 'watch-styles']);

gulp.task('bundle',['minify-js','minify-css'] );
