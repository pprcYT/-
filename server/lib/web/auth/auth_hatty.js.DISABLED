const config = require('../../sub/auth.json');

module.exports.config = {
    strategy: require('passport-wordpress-oauth-server').Strategy, // example: naver, require strategy
    color: '#000000', // example: #1EC800
    fontColor: '#FFFFFF', //example: #FFFFFF
    vendor: 'wordpress-oauth-server',
    displayName: '해티'
}

module.exports.strategyConfig = {
    clientID: config.hatty.clientID,
    clientSecret: config.hatty.clientSecret,
	wordpressUrl: config.hatty.serviceURL,
    callbackURL: config.hatty.callbackURL,
    passReqToCallback: true
}

module.exports.strategy = (process, MainDB, Ajae) => {
    return (req, accessToken, refreshToken, profile, done) => {
        const $p = {};

        $p.authType = "wordpress-oauth-server";
        $p.id = "hatty-"+profile.id;
        $p.name = profile.displayName;
        $p.title = profile.displayName;
        $p.image = profile._json.profile_image;
        
        /* 망할 셧다운제
        $p._age = profile._json.age.split('-').map(Number);
        $p._age = { min: ($p._age[0] || 0) - 1, max: $p._age[1] - 1 };
        $p.birth = profile._json.birthday.split('-').map(Number);
        if(MONTH < $p.birth[0] || (MONTH == $p.birth[0] && DATE < $p.birth[1])){
            $p._age.min--;
            $p._age.max--;
        }
        $p.isAjae = Ajae($p.birth, $p._age);
        */
        // $p.sex = profile[0].gender[0];

        process(req, accessToken, MainDB, $p, done);
    }
}