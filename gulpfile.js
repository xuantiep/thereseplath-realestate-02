

// -----------------------------------------------
//
//   A not-so-simple gulpfile.
//   Based on: https://github.com/drewbarontini/noise
//
// -----------------------------------------------
//
//   ToDo:
// - linting
//
// -----------------------------------------------


var gulp    = require( 'gulp' );
// var run     = require( 'run-sequence' );
var plugins = require( 'gulp-load-plugins' )( {
    lazy: true,
    rename : {
        'gulp-sass-lint'  : 'sasslint',
        'gulp-svg-symbols': 'svgsymbols',
        'psi'             : 'pagespeedindex'
    }

} );


// -----------------------------------------------
//   Options
// -----------------------------------------------

var options = {

    default : {
        tasks : [ 'build', 'watch' ]
    },

    build : {
        tasks       : [ 'images', 'compile:sass', 'minify:js', 'fonts' ],
        destination : 'public/'
    },

    production : {
        tasks : [ 'build', 'minify:css' ]
    },

    css : {
        files       : 'public/styles/*.css',
        file        : 'public/styles/application.css',
        destination : 'public/styles'
    },

    fonts : {
        files       : 'src/fonts/*.{otf,ttf,eot,woff,woff2,svg}',
        destination : 'public/fonts'
    },

    icons : {
        files       : 'src/icons/ic-*.svg',
        destination : 'public/icons'
    },

    images : {
        files       : 'src/images/*',
        destination : 'public/images'
    },

    js : {
        // files       : 'src/scripts/*.js',
        files : [
            'node_modules/fontfaceonload/dist/fontfaceonload.js',
            'src/scripts/*.js'
        ],
        file        : 'src/scripts/application.js',
        destination : 'public/scripts'
    },

    sass : {
        files       : 'src/styles/*.scss',
        destination : 'public/styles'
    },

    watch : {
        files : function() {
            return [
                options.images.files,
                options.js.files,
                options.sass.files
            ]
        },
        run : function() {
            return [
                [ 'images' ],
                [ 'minify:js' ],
                // [ 'compile:sass', 'minify:css' ]
                [ 'compile:sass' ]
            ]
        }
    }
}


// -----------------------------------------------
//   Tasks
// -----------------------------------------------

gulp.task( 'default', options.default.tasks );

gulp.task( 'build', function() {
    options.build.tasks.forEach( function( task ) {
        gulp.start( task );
    } );
});

gulp.task( 'production', options.production.tasks );

gulp.task( 'fonts', function() {
    gulp.src( options.fonts.files )
        .pipe( gulp.dest( options.fonts.destination ) )
        .pipe( plugins.size({title: 'fonts'}) );
});

gulp.task( 'images', function() {
    gulp.src( options.images.files )
        // .pipe( plugins.cache( plugins.imagemin({ })))
        .pipe( plugins.imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe( gulp.dest( options.images.destination ) )
        .pipe( plugins.size({title: 'images'}) );
});

gulp.task( 'compile:sass', function() {
    gulp.src( options.sass.files )
        // .pipe( plugins.plumber() )
		// .pipe( plugins.sourcemaps.init() )
		// .pipe( plugins.sass().on('error', sass.logError))
		.pipe( plugins.sass( {
			indentedSyntax: true,
			errLogToConsole: true
		} ) )
        .pipe( plugins.autoprefixer( {
                browsers : [ 'last 2 versions' ],
                cascade  : false
        } ) )
        .pipe( plugins.sourcemaps.write() )
        .pipe( gulp.dest( options.sass.destination ) )
        .pipe( plugins.size({title: 'styles'}) )
        .pipe( plugins.connect.reload() );
});

gulp.task( 'minify:css', function () {
    gulp.src( options.css.file )
        .pipe( plugins.plumber() )
        .pipe( plugins.uncss ( {
            html: [
                '_site/**/*.html',
            ],
            uncssrc: '.uncssrc'
        } ) )
        .pipe( plugins.cssnano( { advanced: false } ) )
        .pipe( plugins.rename( { suffix: '.min' } ) )
        .pipe( gulp.dest( options.css.destination ) )
        .pipe( plugins.size({title: 'styles'}) )
        .pipe( plugins.connect.reload() );
});

gulp.task( 'minify:js', function () {
    gulp.src( options.js.files )
        .pipe( plugins.plumber() )
        .pipe( plugins.concat('application.js') )
        .pipe( plugins.uglify() )
        .pipe( plugins.rename( { suffix: '.min' } ) )
        .pipe( gulp.dest( options.js.destination ) )
        .pipe( plugins.connect.reload() );
});

// Creates SVG sprite and demo page.
// Alt: https://github.com/Hiswe/gulp-svg-symbols & OUI

gulp.task( 'icons', function() {
    gulp.src( options.icons.files )
        .pipe( plugins.svgmin() )
        .pipe( plugins.svgstore( { inlineSvg: true } ) )
        .pipe( gulp.dest( options.icons.destination ) );
});

gulp.task( 'watch', function() {
    var watchFiles = options.watch.files();
    watchFiles.forEach( function( files, index ) {
        gulp.watch( files, options.watch.run()[ index ]  );
    } );
});
