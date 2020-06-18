/**
 * Rule the words! KKuTu Online
 * Copyright (C) 2017 JJoriping(op@jjo.kr)
 * Copyright (C) 2017-2020 AlphaKKuTu(admin@kkutu.xyz)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

module.exports = function(gitServer) {
	var JLog = require("../sub/jjlog");

	JLog.info("<< KKuTuDotNet Redirect >>");
	gitServer.disable('x-powered-by');
	gitServer.get('*', function(req, res, next) {
		res.header('Content-Security-Policy', "default-src 'self' 'unsafe-inline' *.cloudflare.com *.kkutu.xyz cdn.jsdelivr.net t1.daumcdn.net *.ad.daum.net static.cloudflareinsights.com aem-collector.daumkakao.io www.google.com www.googletagmanager.com www.google-analytics.com *.gstatic.com connect.facebook.net *.facebook.com data: ws:");
		res.header('X-Frame-Options', 'sameorigin');
		res.header('X-XSS-Protection', '1; mode=block');
		res.header('X-Content-Type-Options', 'nosniff');
		res.redirect('https://kkutu.xyz' + req.url);
	});
}