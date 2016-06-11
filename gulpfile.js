// Include Gulp
var gulp = require('gulp');

// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

// Define default destination folder
var dest = __dirname + '/app/webapp/dist/';

gulp.task('js', function() {

    var jsFiles = ['src/js/*'];

    gulp.src(plugins.mainBowerFiles().concat(jsFiles))
        .pipe(plugins.filter(['**/*.js']))
        .pipe(plugins.order([
            'jquery.js',
            '*'
        ]))
        .pipe(plugins.concat('main.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dest + 'js'));

});


gulp.task('build', function() {
    var filterJS = plugins.filter('**/*.js', { restore: true });
    return gulp.src('./bower.json')
        .pipe(plugins.mainBowerFiles({
            overrides: {
                bootstrap: {
                    main: [
                        './dist/js/bootstrap.js',
                        './dist/css/*.min.*',
                        './dist/fonts/*.*'
                    ]
                },
                font-awesome: {
                    main: [
                        './dist/css/*.min.*',
                        './fonts/*.*'
                    ]
                }
            }
        }))
        .pipe(filterJS)
        .pipe(plugins.concat('vendor.js'))
        .pipe(plugins.uglify())
        .pipe(filterJS.restore)
        .pipe(gulp.dest(dest));
});


gulp.task('watch', function() {
    gulp.watch(__dirname + '/app/webapp/js', ['build']);
});
