"use strict";

var gulp = require('gulp'),
    sweet = require('gulp-sweetjs'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    del = require('del'),
    build = 'build';

gulp.task('clean', function (done) {
  del([build], done);
});

gulp.task('distclean', ['clean'], function(done) {
  del(['node_modules','**/*~'], done);
});

gulp.task('macros', function () {
  return gulp
    .src('src/**/*.sjs')
    .pipe(gulp.dest(build));
});

gulp.task('expand', ['macros'], function () {
  return gulp
    .src(['src/**/*.js'])
    .pipe(sweet({
      modules: ['./build/lib/macros'],
      sourceMap: true
    }))
    .pipe(gulp.dest(build));
});

gulp.task('test', ['expand'], function () {
  return gulp.src([build + '/lib/**/*.js'])
    .pipe(istanbul())
    .on('finish', function () {
      gulp
        .src('build/test/test.js', {
          read: false
        })
        .pipe(mocha())
        .pipe(istanbul.writeReports({
          dir: build + '/coverage'
        }));
    });
});

gulp.task('lib', ['expand'], function () {
  return gulp
  .src(['package.json', 'README.md'])
    .pipe(gulp.dest(build + '/lib'));
});

gulp.task('default', ['lib', 'test']);
