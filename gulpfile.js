'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var coveralls = require('gulp-coveralls');

var paths = {
  src: ['./lib/*.js'],
  test: ['./test/*.js']
};

gulp.task('lint-src', function() {
  return gulp.src(paths.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('lint-test', function() {
  return gulp.src(paths.test)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('lint', ['lint-src', 'lint-test']);

gulp.task('coveralls', function() {
  return gulp.src('./coverage/lcov.info')
    .pipe(coveralls());
});

gulp.task('test', function() {
  gulp.src(paths.src)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(['test/**/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .once('end', function() {
          /*eslint-disable */
          process.exit(0);
          /*eslint-enable */
        });
    });
});
