const LICENSE = [
	"Rule the Words!, AlphaKKuTu Online. ⓒ 2017-2019 AlphaKKuTu. All Rights Reserved.",
	"This program is distributed by terms of GNU Affero General Public License.",
	"For more information, please check: <https://www.gnu.org/licenses/agpl-3.0.html>."
].join('\n');

var File = require('fs');

const LIST = [
	"global",
	
	"in_login",
	"in_game_kkutu",
	"in_game_kkutu_help",
	"in_game_kkutu_user",
	"in_admin",
	"in_portal",
	"in_loginfail",
	
	"kpanel/in_admin",
	"kpanel/in_daneo",
	"kpanel/in_user"
];
const KKUTU_LIST = [
	"web/game/lib/kkutu/head.js",
	"web/game/lib/kkutu/ready.js",
	"web/game/lib/kkutu/rule_classic.js",
	"web/game/lib/kkutu/rule_jaqwi.js",
	"web/game/lib/kkutu/rule_crossword.js",
	"web/game/lib/kkutu/rule_typing.js",
	"web/game/lib/kkutu/rule_hunmin.js",
	"web/game/lib/kkutu/rule_daneo.js",
	"web/game/lib/kkutu/rule_drawing.js",
	"web/game/lib/kkutu/rule_sock.js",
	"web/game/lib/kkutu/body.js",
	"web/game/lib/kkutu/tail.js"
];

module.exports = function(grunt){
	var i, files = {}, cons = {};
	var KKUTU = "web/game/public/js/in_game_kkutu.min.js";
	
	for(i in LIST){
		files["web/game/public/js/"+LIST[i]+".min.js"] = "web/gamelib/"+LIST[i]+".js";
	}
	files[KKUTU] = KKUTU_LIST;
	
	grunt.initConfig({
		uglify: {
			options: {
				banner: "/**\n" + LICENSE + "\n*/\n\n"
			},
			build: {
				files: files
			}
		},
		concat: {
			basic: {
				src: KKUTU_LIST,
				dest: "web/game/lib/in_game_kkutu.js"
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-contrib-concat');
	
	grunt.registerTask('default', ['concat', 'uglify']);
	grunt.registerTask('pack', 'Log', function(){
		var done = this.async();
		var url = __dirname + "/" + KKUTU;
		
		File.readFile(url, function(err, res){
			File.writeFile(url, "(function(){" + res.toString() + "})();", function(err, res){
				done();
			});
		})
	});
};