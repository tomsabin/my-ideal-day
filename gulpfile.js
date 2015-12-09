// https://css-tricks.com/gulp-for-beginners/

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync');

gulp.task('sass', function () {
  gulp.src('app/sass/application.scss')
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('watch', ['browserSync', 'sass'], function () {
  gulp.watch('app/sass/**/*.scss', ['sass'])
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/*.js', browserSync.reload);
})

gulp.task('default', ['watch']);
