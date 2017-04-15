var sass = require('gulp-sass');
var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');


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


gulp.task('compress', function (cb) {
  pump([
    gulp.src(scripts),
    uglify(), babel({
      presets: ['es2015']
    }),
    concat('all.js'),
    gulp.dest('./app/dist/js')
  ],
    cb
  );
});

gulp.task('css', function () {
  return gulp.src(styles)
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
  gulp.watch(['./app/*.html', './app/*.js', './app/js/*.js',], ['html', 'js']);
});

gulp.task('watch-styles', function () {
  gulp.watch(['./app/styles/*.scss',], ['css']);
});

gulp.task('default', ['connect', 'watch', 'watch-styles']);

gulp.task('bundle', function () {
  return browserify({ entries: scripts })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/js'));
});
