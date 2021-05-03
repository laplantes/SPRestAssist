'use strict';

const del = require('del'),
	gulp = require('gulp'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	terser = require('gulp-terser'),
	src = './src/sprestassist.js',
	destination = './dist';

// minify and push file, minified file, and source map to dist folder
const createDist = (source, dest) => {
	return gulp.src(source)
	.pipe(gulp.dest(dest))
	.pipe(rename(function (path) {
		path.basename += '.min';
	}))
	.pipe(sourcemaps.init())
	.pipe(terser())
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(dest))
};

// gulp task to call the createDist function
gulp.task('build', () => {
	const files = createDist(src, destination);
	return files;
});

// gulp task to remove all files from the dist directory
gulp.task('clean', () => {
	return del('./dist/**')
})

// default task
gulp.task('default', gulp.series('clean', 'build'));