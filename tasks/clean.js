var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function(cb) {
	console.log("Clean");
  return del([
    'dist/*',
    'temp'
  ]);

});