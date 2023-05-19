const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');

gulp.task('sass-compile', function () {
    return gulp
        .src(['./styles/*.scss', '!./styles/tailwind.scss'])
        .pipe(
            sass({
                // Values: nested, expanded, compact, compressed
                outputStyle: 'compressed'
            }).on('error', sass.logError)
        )
        .pipe(
            autoprefixer({
                cascade: false
            })
        )
        .pipe(
            rename(function (path) {
                path.basename = path.basename.replace(/\.scss/gi, '');
                path.extname = '.min.css';
            })
        )
        .pipe(gulp.dest('./assets'));
});

//watch command for `js` and `style`
gulp.task('styles', function () {
    gulp.watch(['./styles/*.scss', '!./styles/tailwind.scss'], gulp.series('sass-compile'));
});

gulp.task('default', gulp.parallel('styles'));