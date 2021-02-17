const del = require('del'),
	gulp = require('gulp'),
	rename = require('gulp-rename'),
	soucermaps = require('gulp-sourcemaps'),
	terser = require('gulp-terser'),
	src = './src/sprestassist.js',
	destination = './dist';


const createDist = (source, destination) => {
	return gulp.src(source)
	.pipe(gulp.dest(destination))
	.pipe(rename(function (path) {
		path.basename += '.min';
	}))
	.pipe(soucermaps.init())
	.pipe(terser())
	.pipe(soucermaps.write('./'))
	.pipe(gulp.dest(destination))
};

gulp.task('build', () => {
	const files = createDist(src, destination);
	return files;
});

gulp.task('clean', () => {
	return del('./dist/**')
})

// default task
gulp.task('default', gulp.series('clean', 'build'));