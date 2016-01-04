var gulp = require('gulp');
var babel       = require('gulp-babel');

gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
        .pipe(babel()) //Turn your ES6 to ES5
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('default', ['js']);