// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import {
  output as pagespeed
}
from 'psi';
import pkg from './package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Lint JavaScript
gulp.task('jshint', () =>
  gulp.src('app/js/app.min.js')
  .pipe(reload({
    stream: true,
    once: true
  }))
  .pipe($.jshint())
  .pipe($.jshint.reporter('jshint-stylish'))
  .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
);

// Copy all files at the root level (app)
gulp.task('copy', () =>
  gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
  .pipe($.size({
    title: 'copy'
  }))
);
// Copy all files at the root level (app)
gulp.task('copy:fonts', () =>
  gulp.src([
    'app/css/fonts/*'
  ], {
    dot: true
  }).pipe(gulp.dest('dist/css/fonts'))
  .pipe($.size({
    title: 'copy:fonts'
  }))
);

// Compile and automatically prefix stylesheets
gulp.task('css', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src([
      'app/css/**/*.css'
    ])
    .pipe($.changed('.tmp/css', {
      extension: '.css'
    }))
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.minifyCss()))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe($.size({
      title: 'css'
    }));
});

// Concatenate and minify JavaScript
gulp.task('js', () =>
  gulp.src([
    'app/js/app.js',
    'app/js/models/foodItemModel.js',
    'app/js/models/trackedModel.js',
    'app/js/collections/dayCollection.js',
    'app/js/collections/searchResultsCollection.js',
    'app/js/collections/autocompleteCollection.js',
    'app/js/views/foodItemView.js',
    'app/js/views/dayView.js',
    'app/js/views/searchItemView.js',
    'app/js/views/searchView.js',
    'app/js/views/appView.js'
  ])
  .pipe($.concat('app.min.js'))
  .pipe(gulp.dest('app/js'))
  .pipe($.uglify())
  // Output files
  .pipe(gulp.dest('dist/js'))
  .pipe($.size({
    title: 'js'
  }))
);

gulp.task('js:libs', () =>
  gulp.src([
    'app/js/libs/pikaday.js'
  ])
  .pipe($.uglify())
  .pipe(gulp.dest('dist/js/libs'))
  .pipe($.size({
    title: 'js:libs'
  }))
);

gulp.task('clean:js', cb => del(['app/js/app.min.js'], {
  dot: true
}, cb))

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
  const assets = $.useref.assets({
    searchPath: '{.tmp,app}'
  });

  return gulp.src('app/**/*.html')
    .pipe(assets)

  // Concatenate and minify styles
  // In case you are still using useref build blocks
  .pipe($.if('*.css', $.minifyCss()))
    .pipe(assets.restore())
    .pipe($.useref())

  // Minify any HTML
  .pipe($.if('*.html', $.minifyHtml()))
    // Output files
    .pipe(gulp.dest('dist'))
    .pipe($.size({
      title: 'html'
    }));
});

// Clean output directory
gulp.task('clean', cb => del(['.tmp', 'dist/*', '!dist/.git'], {
  dot: true
}, cb));

// Watch files for changes & reload
gulp.task('serve', ['css', 'clean:js', 'js'], () => {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'UHA',
    server: ['.tmp', 'app']
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/css/**/*.css'], ['css', reload]);
  gulp.watch(['app/js/**/*.js', '!app/js/app.min.js'], ['clean:js', 'js', reload]);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () =>
  browserSync({
    notify: false,
    logPrefix: 'UHA',
    server: 'dist',
    baseDir: 'dist'
  })
);

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
  runSequence(
    'css', ['jshint', 'html', 'js', 'js:libs', 'copy', 'copy:fonts'],
    cb
  )
);
