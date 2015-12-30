var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync');

gulp.task('sass', function () {
  gulp.src('app/sass/application.scss')
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('app/assets'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('build', function () {
  gulp.src('app/assets/**/*').pipe(gulp.dest('build/assets/'));
  gulp.src('app/index.html').pipe(gulp.dest('build/'));
  gulp.src('app/feed/index.html').pipe(gulp.dest('build/feed'));
  gulp.src('app/close.html').pipe(gulp.dest('build/'));
  gulp.src('app/sass/application.scss')
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('build/assets/'))
})

gulp.task('watch', ['browserSync', 'sass'], function () {
  gulp.watch('app/sass/**/*.scss', ['sass'])
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);
