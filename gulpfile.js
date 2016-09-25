var gulp         = require('gulp');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserify   = require('gulp-browserify');
var uglify       = require('gulp-uglify');
var svgmin       = require('gulp-svgmin');
var svgstore     = require('gulp-svgstore');
var browserSync  = require('browser-sync').create();
var path         = require('path');

gulp.task('sass', function() {
  return gulp.src(['./src/scss/main.scss'])
    .pipe(sass({
      includePaths: './node_modules/',
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./assets/css/'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src('./src/js/main.js')
    .pipe(browserify())
    .pipe(uglify())
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('./assets/js/'));
});

gulp.task('svg', function () {
  return gulp.src('./src/img/svgsprites/**/*.svg')
    .pipe(svgmin(function(file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }]
      }
    }))
    .pipe(svgstore())
    .pipe(gulp.dest('./assets/img/'));
});

gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: './'
  });

  gulp.watch('**/*.scss', { cwd: './src/scss/' },           ['sass']);
  gulp.watch('**/*.js',   { cwd: './src/js/' },             ['scripts']);
  gulp.watch('**/*.svg',  { cwd: './src/img/svgsprites/' }, ['svg']);
  gulp.watch('*.html',    { cwd: './' }).on('change', browserSync.reload);
});

gulp.task('default', ['sass', 'scripts', 'svg', 'serve']);