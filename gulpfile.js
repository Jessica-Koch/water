var gulp = require('gulp'),
 babel       = require('gulp-babel'),
 cssnano = require('gulp-cssnano'),
 sass = require('gulp-sass');

gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
        .pipe(babel()) //Turn your ES6 to ES5
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('build', [
    'js',
]);

gulp.task('watch', function(){
    gulp.watch('./src/js/*.js', ['js']);
});

gulp.task('default', ['build', 'watch']);