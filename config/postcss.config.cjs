module.exports = {
	plugins: {
		autoprefixer: {
			// 指定目标浏览器
			overrideBrowserslist: [
				"Android 4.1",
				"iOS 7.1",
				"Chrome > 31",
				"ff > 31",
				"ie >= 8",
			],
			grid: true
		}
	}
}
