const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sftp = require("gulp-sftp");
require("dotenv").config();

const onError = function (error) {
	console.log(error);
};

gulp.task("deploy", function () {
	return gulp
		.src(["./www/**/*"])
		.pipe(
			plumber({
				errorHandler: onError,
			})
		)
		.pipe(
			sftp({
				host: process.env.SFTP_HOST,
				user: process.env.SFTP_USER,
				remotePath: process.env.SFTP_PATH,
				key: process.env.SFTP_PEM,
			})
		);
});

gulp.task("deploy-test", function () {
	return gulp
		.src(["./www/**/*"])
		.pipe(
			plumber({
				errorHandler: onError,
			})
		)
		.pipe(
			sftp({
				host: process.env.SFTP_HOST_TEST,
				user: process.env.SFTP_USER_TEST,
				remotePath: process.env.SFTP_PATH_TEST,
				key: process.env.SFTP_PEM,
			})
		);
});