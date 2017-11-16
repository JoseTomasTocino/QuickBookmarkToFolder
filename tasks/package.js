var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('package', function() {

  var manifest = require('../app/manifest.json');

  console.log(manifest.version);

  return gulp.src('dist/**/*')
    .pipe(zip('QuickBookmarkToFolder-' + manifest.version + '.zip'))
    .pipe(gulp.dest('packages'));

});
