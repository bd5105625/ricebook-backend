const getUsernameFromCookie = require('./auth').getUsernameFromCookie;

const mongoose = require('mongoose')
const profileSchema = require('./Schema/profileSchema')
const Profile = mongoose.model('Profile', profileSchema)
const connectionString = "mongodb+srv://users_for_531:1234567890@cluster0.rano8e1.mongodb.net/social?retryWrites=true&w=majority";

const getFollowing = (req, res) => {
    // console.log("test")
    // res.send("test")
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        username = getUsernameFromCookie(req);
        const user = await Profile.findOne({ username: username });
        if (!user) {
            return res.sendStatus(401);
        }
        let msg = {username: username, following: user.following}
        res.send(msg)
    })()
}

const putFollowing = (req, res) => {
    // this add the user to the following list
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        // get username from cookie
        let username = getUsernameFromCookie(req);
        
        const newFollowing = await Profile.findOne({ displayname: req.params.user });
        console.log("new following", newFollowing)
        if (!newFollowing) {
            return res.sendStatus(401);
        }
        const user = await Profile.findOne({ username: username });
        user.following.push(req.params.user);
        await user.save();
        let msg = {username: username, following: user.following}
        res.send(msg)
    })()
}

const deleteFollowing = (req, res) => {
    // this remove the user from the following list
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        // get username from cookie
        let username = getUsernameFromCookie(req);
        const delete_user = await Profile.findOne({ displayname: req.params.user });
        console.log("delete user", delete_user)
        if (!delete_user) {
            return res.sendStatus(401);
        }
        const user = await Profile.findOne({ username: username });
        user.following = user.following.filter((item) => item !== req.params.user);
        await user.save();
        let msg = {username: username, following: user.following}
        res.send(msg)
    })()
}


module.exports = (app) => {
    app.get('/following', getFollowing)
    app.get('/follower', getFollowing)
    app.put('/following/:user', putFollowing)
    app.delete('/following/:user', deleteFollowing)
}
