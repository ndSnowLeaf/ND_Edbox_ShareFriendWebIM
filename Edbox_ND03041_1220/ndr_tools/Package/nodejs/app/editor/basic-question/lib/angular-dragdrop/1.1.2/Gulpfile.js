"use strict";var jshint=require("gulp-jshint"),stylish=require("jshint-stylish"),gulp=require("gulp");gulp.task("lint",function(){return gulp.src("./draganddrop.js").pipe(jshint()).pipe(jshint.reporter(stylish))}),gulp.task("default",["lint"]);