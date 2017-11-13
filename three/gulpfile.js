var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('default', shell.task([
  //'browserify -r async client.js -o bundle.js',
  //'cp client.js js/client.js',
  //'cp SimpleLogger.js js/SimpleLogger.js',
  //'cp BellTimer.js js/BellTimer.js',
  'browserify client.js > src/bundle.js',
  'npm run build',
  'uglifyjs -c -m -- bundle.js',
  //'cp js/bundle.js js/bundle.min.js',
  'node index.js'
]));