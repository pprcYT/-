module.exports = function(gitServer) {
	var proxy = require("express-http-proxy");
	var JLog = require("../sub/jjlog");

	JLog.info("<< KKuTuDotNet Git >>");
	gitServer.disable('x-powered-by');
	gitServer.use(proxy('http://127.0.0.1:3716'), function(req, res, next) {
		// res.header('Content-Security-Policy', "default-src 'self' 'unsafe-inline' *.cloudflare.com *.kkutu.xyz cdn.jsdelivr.net t1.daumcdn.net *.ad.daum.net static.cloudflareinsights.com aem-collector.daumkakao.io www.google.com www.googletagmanager.com www.google-analytics.com *.gstatic.com connect.facebook.net *.facebook.com data: ws:");
		res.header('X-Frame-Options', 'sameorigin');
		res.header('X-XSS-Protection', '1; mode=block');
		res.header('X-Content-Type-Options', 'nosniff');
	});
}