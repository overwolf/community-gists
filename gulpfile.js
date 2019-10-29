var gulp = require("gulp"),
  del = require("del"),
  async = require('async'),
  manifest = require('./manifest.json');

const zip = require("gulp-zip");

gulp.task("clean", function(cb) {
  del(["./release", "./release-packages"]).then(deleted => {
    console.log(deleted.join("\n"));
    cb();
  });
});

gulp.task("copy", function(cb) {

  async.series([
    function(next) {
      gulp.src("./IconMouse*.png").pipe(gulp.dest("./build/")).on('end', next);    
    },
    function(next) {
      gulp.src("./*.ico").pipe(gulp.dest("./build/")).on('end', next);    
    },
    function(next) {
      gulp.src("./manifest.json").pipe(gulp.dest("./build/")).on('end', next);    
    },
    function(next) {
      gulp
        .src("./plugins/*.dll")
        .pipe(gulp.dest("./build/plugins/"))
        .on("error", function(err) {}).on('end', next);   
    },
    function(next) {
      gulp
        .src("./truckyPlugins/*.dll")
        .pipe(gulp.dest("./dist/plugins/"))
        .on("error", function(err) {
          console.log(err);
        }).on('end', next);
    }
  ], cb);
});

gulp.task("release", function(cb) {

  async.series([
    function(next)
    {
      gulp.src("./plugins/*.dll").pipe(gulp.dest("./release/app/plugins/")).on('end', next);
    },
    function(next)
    {
      gulp.src("./truckyPlugins/*.dll").pipe(gulp.dest("./release/app/truckyPlugins/")).on('end', next);
    },
    function(next)
    {
      gulp.src("./*.ico").pipe(gulp.dest("./release/app/")).on('end', next);
    },
    function(next)
    {
      gulp.src("./manifest.json").pipe(gulp.dest("./release/app/")).on('end', next);
    },
    function(next)
    {
      gulp.src("./IconMouse*.png").pipe(gulp.dest("./release/app/")).on('end', next);
    },
    function(next)
    {
      gulp.src("./build/**/*").pipe(gulp.dest("./release/app/build")).on('end', next);
    },
    function(next)
    {
      gulp.src("./store/**/*").pipe(gulp.dest("./release/store/")).on('end', next);
    },
    function(next)
    {
      var version =  manifest.meta.version;

      gulp
      .src("./release/**/*")
      .pipe(zip("TruckyOverlay_store_" + version + ".zip"))
      .pipe(gulp.dest("./release-packages")).on('end', next);
    }
  ], cb);
});

gulp.task("opk", function(cb) {

  async.series([
    function(next)
    {
      var version =  manifest.meta.version;

      gulp
      .src("./release/app/**/*")
      .pipe(zip("TruckyOverlay_" + version + ".opk"))
      .pipe(gulp.dest("./release-packages")).on('end', next);
    }
  ], cb);
});

gulp.task("do-release", gulp.series("clean",  "release", "opk"));
