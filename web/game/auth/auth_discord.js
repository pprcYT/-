const config = require('../../../sub/auth.json');

module.exports.config = {
    strategy: require('passport-discord').Strategy,
    color: '#7289DA',
    fontColor: '#FFFFFF',
    vendor: 'discord',
    displayName: 'withDiscord'
}

module.exports.strategyConfig = {
    authorizationURL: 'https://kkutu.xyz/login/discord/redirect',
    tokenURL: 'https://discordapp.com/api/oauth2/token',
    clientID: config.discord.clientID,
    clientSecret: config.discord.clientSecret,
    callbackURL: config.discord.callbackURL,
    passReqToCallback: true,
    scope: "identify"
}

module.exports.strategy = (process, MainDB, Ajae) => {
    return (req, accessToken, refreshToken, profile, done) => {
        const $p = {};

        // var fullname = profile.username+"#"+profile.discriminator;

        $p.authType = "discord";
        $p.id = $p.authType+"-"+profile.id;
        $p.name = profile.username;
        $p.title = profile.username;
        // $p.image = profile.avatar;

        process(req, accessToken, MainDB, $p, done);
    }
}