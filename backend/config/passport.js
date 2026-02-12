const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const GitHubStrategy = require('passport-github2').Strategy; // <-- GitHub
const {
    findUserByGoogleId, createUserFromGoogle,
    findUserByDiscordId, createUserFromDiscord,
    findUserByGitHubId, createUserFromGitHub // <-- GitHub helpers
} = require('../models/User');
const jwt = require('jsonwebtoken');

// ===== GOOGLE =====
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const db = req.app.locals.db;
        let user = await findUserByGoogleId(db, profile.id);
        if (!user) {
            user = await createUserFromGoogle(db, {
                googleId: profile.id,
                email: profile.emails?.[0]?.value || null,
                name: profile.displayName,
                picture: profile.photos?.[0]?.value || null
            });
        }
        const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
        done(null, { user, token });
    } catch (err) {
        done(err, null);
    }
}));

// ===== DISCORD =====
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email'],
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const db = req.app.locals.db;
        let user = await findUserByDiscordId(db, profile.id);
        if (!user) {
            user = await createUserFromDiscord(db, {
                discordId: profile.id,
                email: profile.email,
                name: profile.username,
                picture: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null
            });
        }
        const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
        done(null, { user, token });
    } catch (err) {
        done(err, null);
    }
}));

// ===== GITHUB =====
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email'],
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const db = req.app.locals.db;
        let user = await findUserByGitHubId(db, profile.id);
        if (!user) {
            user = await createUserFromGitHub(db, {
                githubId: profile.id,
                email: profile.emails?.[0]?.value || null,
                name: profile.displayName || profile.username,
                picture: profile.photos?.[0]?.value || null
            });
        }
        const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
        done(null, { user, token });
    } catch (err) {
        done(err, null);
    }
}));

module.exports = passport;
