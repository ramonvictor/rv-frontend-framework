/*******************************************************************************
1. DEPENDENCIES
*******************************************************************************/

var gulp = require('gulp'),                             // gulp core
    compass = require('gulp-compass'),                  // compass compiler
    uglify = require('gulp-uglify'),                    // uglifies the js
    jshint = require('gulp-jshint'),                    // check if js is ok
    rename = require("gulp-rename");                    // rename files
    concat = require('gulp-concat'),                    // concatinate js
    notify = require('gulp-notify'),                    // send notifications to osx
    plumber = require('gulp-plumber'),                  // disable interuption
    stylish = require('jshint-stylish'),                // make errors look good in shell
    minifycss = require('gulp-minify-css'),             // minify the css files
    browserSync = require('browser-sync'),              // inject code to all devices
    autoprefixer = require('gulp-autoprefixer');        // sets missing browserprefixes



/*******************************************************************************
2. FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
*******************************************************************************/

var target = {
    sass_src : 'css/scss/**/*.scss',                        // all sass files
    css_dest : 'css',                                // where to put minified css
    sass_folder : 'css/scss',                                // where to put minified css
    js_lint_src : [                                     // all js that should be linted
        'js/dev/app.fn.js'
    ],
    js_uglify_src : [                                   // all js files that should not be concatinated
        'js/dev/rv-modernizr.js',
        'js/dev/app.fn.js'
    ],
    js_concat_src : [                                   // all js files that should be concatinated
        'js/dev/app.fn.js'
    ],
    js_dest : 'js',                                  // where to put minified js
    css_img : 'css/i'
};


/*******************************************************************************
3. COMPASS TASK
*******************************************************************************/

gulp.task('compass', function() {
    gulp.src(target.sass_src)
        .pipe(plumber()) 
        .pipe(compass({
            css: target.css_dest,
            sass: target.sass_folder,
            image: target.css_img
        }))
        .pipe(autoprefixer(
            'last 2 version',
            '> 1%',
            'ie 8',
            'ie 9',
            'ios 6',
            'android 4'
        ))
        .pipe(minifycss())
        .pipe(gulp.dest(target.css_dest)); 
});


/*******************************************************************************
4. JS TASKS
*******************************************************************************/

// lint my custom js
gulp.task('js-lint', function() {
    gulp.src(target.js_lint_src)                        // get the files
        .pipe(jshint())                                 // lint the files
        .pipe(jshint.reporter(stylish))                 // present the results in a beautiful way
});

// minify all js files that should not be concatinated
gulp.task('js-uglify', function() {
    gulp.src(target.js_uglify_src)                      // get the files
        .pipe(uglify())                                 // uglify the files
        .pipe(rename(function(dir,base,ext){            // give the files a min suffix
            var trunc = base.split('.')[0];
            return trunc + '.min' + ext;
        }))
        .pipe(gulp.dest(target.js_dest))                // where to put the files
        // .pipe(notify({ message: 'JS processed!'}))     // notify when done
        ;
});

// minify & concatinate all other js
/*
gulp.task('js-concat', function() {
    gulp.src(target.js_concat_src)                      // get the files
        .pipe(uglify())                                 // uglify the files
        .pipe(concat('scripts.min.js'))                 // concatinate to one file
        .pipe(gulp.dest(target.js_dest))                // where to put the files
        .pipe(notify({message: 'JS processed!'}));      // notify when done
});
*/


/*******************************************************************************
5. BROWSER SYNC
*******************************************************************************/

gulp.task('browser-sync', function() {
    browserSync.init([ target.css_dest + '/*.css', target.js_dest + '/*.js', '**/*.html'], {  // files to inject
        proxy: {
            host: 'localhost',             // development server
            port: '80'                               // development server port
        }
    }).on("file:reload", function (file) {
        console.log("# file changed: " + file.assetFileName);
    });
});

/*******************************************************************************
1. GULP TASKS
*******************************************************************************/
gulp.task('watch', function() {
    gulp.watch(target.sass_src, ['compass']);
    gulp.watch(target.js_lint_src, ['js-lint']);
    gulp.watch(target.js_uglify_src, ['js-uglify']);
});


gulp.task('default', ['compass', 'js-lint', 'js-uglify', 'browser-sync', 'watch']);
