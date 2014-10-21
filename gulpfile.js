"use strict";

var gulp = require('gulp'),
    sweet = require('gulp-sweetjs'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    docco = require('gulp-docco'),
    del = require('del'),
    build = 'build';

gulp.task('clean', function (done) {
  del([build, 'coverage'], done);
});

gulp.task('distclean', ['clean'], function(done) {
  del(['node_modules'], done);
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

gulp.task('lib', ['expand'], function () {
  return gulp
  .src('package.json')
  .pipe(gulp.dest(build + '/lib'));
});

gulp.task('doc', ['docco']);


gulp.task('default', ['lib', 'test', 'doc']);
