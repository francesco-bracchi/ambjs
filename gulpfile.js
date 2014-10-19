"use strict";

var gulp = require('gulp'),
    sweet = require('gulp-sweetjs'),
    clean = require('gulp-clean'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    docco = require('gulp-docco'),
    build = 'build';

gulp.task('clean', function () {
  return gulp
    .src([build], {read: false})
    .pipe(clean());
});

gulp.task('macros', function () {
  return gulp
    .src('src/**/*.sjs')
    .pipe(gulp.dest(build));
});

gulp.task('sweet', ['macros'], function () {
  return gulp
    .src(['src/**/*.js'])
    .pipe(sweet({modules: ['./build/lib/macros']}))
    .pipe(gulp.dest(build));
});

gulp.task('test', ['sweet'], function () {
  return gulp.src([build + '/lib/**/*.js'])
    .pipe(istanbul())
    .on('finish', function () {
      gulp.src('build/test/test.js', {read: false})
        .pipe(mocha({
          reporter: 'nyan'
        }))
        .pipe(istanbul.writeReports());
    });
});

gulp.task('docco', function () {
  return gulp
    .src(['src/lib/**/*.js', 'src/lib/**/*.sjs'])
    .pipe(docco())
    .pipe(gulp.dest(build + '/doc'));
});

gulp.task('default', ['test', 'docco']);
