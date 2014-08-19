var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var insert = require('gulp-insert');
var preprocess = require('gulp-preprocess');
var fs = require('fs');
var rimraf = require('rimraf');

var DIST = "./dist";
var DIST_SRC = DIST + "/source";
var signallingServerArray = JSON.stringify(JSON.parse(fs.readFileSync('./localsignalling.json')));

gulp.task('clean', function(cb) {
    return rimraf(DIST, cb);
});

gulp.task('static', ['clean'], function() {
    return copyStaticFilesTo(DIST);
});

gulp.task('static_src', ['clean'], function() {
    return copyStaticFilesTo(DIST_SRC);
});

function copyStaticFilesTo(dest) {
	return gulp.src(['app/thirdparty/**', 'app/views/**', 'app/flags/**', 'app/styles/**', 'app/fonts/**', "app/*.html", "app/favicon.ico"], {base: 'app'})
        .pipe(gulp.dest(dest));
}

function generateMinifiedScript() {
    return gulp.src("app/scripts/cyclondemo.js")
        .pipe(browserify())
        .pipe(preprocess({context: {SIGNALLING_SERVERS: signallingServerArray}}))
        .pipe(uglify())
        .pipe(insert.prepend("/**\n\tWebRTC Cyclon Demo\n\tCopyright 2014, Nick Tindall\n*/\n"))
        .pipe(gulp.dest(DIST));
}

function generateScript() {
    return gulp.src("app/scripts/cyclondemo.js")
        .pipe(browserify())
        .pipe(preprocess({context: {SIGNALLING_SERVERS: signallingServerArray}}))
        .pipe(gulp.dest(DIST_SRC));
}

gulp.task('heroku:production', ['static_src', 'static'], function() {
    signallingServerArray = JSON.stringify(JSON.parse(fs.readFileSync('./herokusignalling.json')));
    generateScript();
    generateMinifiedScript();
});

gulp.task('quality', ['lint', 'test']);

gulp.task('default', ['static_src', 'static'], function() {
    generateScript();
    generateMinifiedScript();
});
