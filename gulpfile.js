var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var insert = require("gulp-insert");

var DIST = "./dist";
var DIST_SRC = "./dist/source";

gulp.task('clean', function() {
    return gulp.src(DIST).pipe(clean());
});

gulp.task('static', ['clean'], function() {
    return copyStaticFilesTo(DIST);
});

gulp.task('static_src', ['clean'], function() {
    return copyStaticFilesTo(DIST_SRC);
});

function copyStaticFilesTo(dest) {
	return gulp.src(['app/thirdparty/**', 'app/views/**', 'app/flags/**', 'app/styles/**', "app/*.html"], {base: 'app'})
        .pipe(gulp.dest(dest));
}

gulp.task("script", ["static"], function() {
    return gulp.src("app/scripts/cyclondemo.js")
        .pipe(browserify())
        .pipe(uglify())
        .pipe(insert.prepend("/**\n\tWebRTC Cyclon Demo\n\tCopyright 2014, Nick Tindall\n*/\n"))
        .pipe(gulp.dest(DIST));
});

gulp.task('script_src', ["static_src"], function() {
    return gulp.src("app/scripts/cyclondemo.js")
        .pipe(browserify())
        .pipe(gulp.dest(DIST_SRC));
});

gulp.task('heroku:production', ['default']);

gulp.task('quality', ['lint', 'test']);

gulp.task('default', ['script', 'script_src']);
