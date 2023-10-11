//import function from auth.js
// const isLoggedIn = require('./auth').isLoggedIn;
// import { uploadImage } from './uploadCloudinary';
// const isLoggedIn = require('./auth').isLoggedIn;
// const connectionString = require('./auth').connectionString;
const getUsernameFromCookie = require('./auth').getUsernameFromCookie;

const mongoose = require('mongoose')
const userSchema = require('./Schema/userSchema')
const profileSchema = require('./Schema/profileSchema')
const User = mongoose.model('User', userSchema)
const Profile = mongoose.model('Profile', profileSchema)
const connectionString = "mongodb+srv://users_for_531:1234567890@cluster0.rano8e1.mongodb.net/social?retryWrites=true&w=majority";
const multer = require('multer')
const stream = require('stream')
const upCloud = require('./uploadCloudinary')

const profile = {
    username: 'DLeebron',
    headline: 'This is my headline!',
    email: 'foo@bar.com',
    zipcode: 12345,
    dob: '128999122000',
    avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg',
}

const getHeadline = (req, res) => {
    console.log("in getHeadline");
    // this return the requested user headline
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        const user = await Profile.findOne({ username: req.params.user });
        if (!user) {
            return res.sendStatus(401);
        }
        let msg = {username: req.params.user, headline: user.headline}
        res.send(msg)
    })()
    
}



const putHeadline = (req, res) => {
    // this update the user headline
    console.log("in putHeadline");
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let username = getUsernameFromCookie(req);
        const user = await Profile.findOneAndUpdate({ username: username }, { headline: req.body.headline });
        if (!user) {
            return res.sendStatus(401);
        }
        let msg = {username: req.params.user, headline: req.body.headline}
        res.send(msg)
    })()

}



const getEmail = (req, res) => {
    // this return the user email
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        const user = await Profile.findOne({ username: req.params.user });
        if (!user) {
            return res.sendStatus(401);
        }
        let msg = {username: req.params.user, email: user.email}
        res.send(msg)
    })()
}

const putEmail = (req, res) => {
    // this update the user email
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let username = getUsernameFromCookie(req);
        const user = await Profile.findOneAndUpdate({ username: username }, { email: req.body.email });
        if (!user) {
            return res.sendStatus(401);
        }
        let msg = {username: username, email: req.body.email}
        res.send(msg)
    })()
}

const getZipcode = (req, res) => {
    // this return the user zipCode
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        const user = await Profile.findOne({ username: req.params.user });
        if (!user) {
            return res.sendStatus(401);
        }
        let msg = {username: req.params.user, zipCode: user.zipCode}
        res.send(msg)
    })()
}

const putZipcode = (req, res) => {
    // this update the user zipCode
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let username = getUsernameFromCookie(req);
        const user = await Profile.findOneAndUpdate({ username: username }, { zipcode: req.body.zipcode });
        if (!user) {
            return res.sendStatus(401);
        }
        let msg = {username: username, zipCode: req.body.zipcode}
        res.send(msg)
    })()
    //     const user = await Profile.findOne({ username: username });
    //     if (!user) {
    //         return res.sendStatus(401);
    //     }
    //     user.zipCode = req.body.zipcode;
    //     await user.save();
    //     let msg = {username: username, zipCode: user.zipCode}
    //     res.send(msg)
    // })()
}

const getAvatar = (req, res) => {
    // this return the user avatar
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        const user = await Profile.findOne({ username: req.params.user });
        if (!user) {
            return res.sendStatus(401);
        }
        let msg = {username: req.params.user, avatar: user.avatar}
        res.send(msg)
    })()
}

const putAvatar = (req, res) => {
    //form-data
    // this update the user avatar
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        // let username = getUsernameFromCookie(req);
        // const user = await Profile.findOneAndUpdate({ username: req.body.user, avatar: req.body.avatar });
        const user = await Profile.findOne({ username: req.body.user });
        console.log('input url', req.body, user)
        if (!user) {
            return res.sendStatus(401);
        }
        user.avatar = req.body.avatar;
        await user.save();
        let msg = {username: username, avatar: req.body.avatar, message: 'avatar updated'}
        res.send(msg)
    })()
    
}

const doUpload = (publicId, req, res, next) => {

	// const uploadStream = cloudinary.uploader.upload_stream(result => {    	
    //      // capture the url and public_id and add to the request
	// 	req.fileurl = result.url
	// 	req.fileid = result.public_id
	// 	next()
	// }, { public_id: req.body[publicId]})
    console.log("in doUpload", req.file)

	// multer can save the file locally if we want
	// instead of saving locally, we keep the file in memory
	// multer provides req.file and within that is the byte buffer

	// we create a passthrough stream to pipe the buffer
	// to the uploadStream function for cloudinary.
	// const s = new stream.PassThrough()
	// s.end(req.file.buffer)
	// s.pipe(uploadStream)
	// s.on('end', uploadStream.end)
	// and the end of the buffer we tell cloudinary to end the upload.
    // res.send({url: req.fileurl, id: req.fileid})
}

// const uploadImage = (publicId) => (req, res, next) =>
// 	multer().single('image')(req, res, () => 
//     doUpload(publicId, req, res, next))

const getDob = (req, res) => {
    // this return the user dob
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let username = getUsernameFromCookie(req);
        const user = await Profile.findOne({ username: username });
        if (!user) {
            return res.sendStatus(401);
        }
        else {

            // // let dob = user.dob; 
            // let dob = "19990222"
            // // transform the dob to milliseconds
            // let dobMilliseconds = Date.parse(dob);
            // // get the current date
            // let currentDate = new Date();
            // // get the current date in milliseconds    
            let msg = {username: username, dob: user.dob}
            res.send(msg)
        }
    })()    
}


const testhere = (req, res) => {
    let username = getUsernameFromCookie(req);
    console.log(username)
    res.send({ username: username })
}

const getProfile = (req, res) => {
    // this return the user profile
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let username = getUsernameFromCookie(req);
        const user = await Profile.findOne({ username: username });
        if (!user) {
            return res.sendStatus(401);
        }
        else {
            let msg = {username: username, displayname: user.displayname, email: user.email, zipcode: user.zipcode, avatar: user.avatar, dob: user.dob, phone: user.phone, headline: user.headline, following: user.following}
            res.send(msg)
        }
    })()
}

const putDisplayname = (req, res) => {
    // this update the user displayname
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let username = getUsernameFromCookie(req);
        const user = await Profile.findOneAndUpdate({ username: username }, { displayname: req.body.displayname });
        if (!user) {
            return res.sendStatus(401);
        }
        let msg = {username: username, displayname: req.body.displayname}
        res.send(msg)
    })()
}

const putProfile = (req, res) => {
    // this update the user profile
    (async () => {
        const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        // const user = await Profile.findOneAndUpdate({ username: req.body.user , displayname: req.body.displayname, phone: req.body.phone, zipcode: req.body.zipcode, email: req.body.email});
        const user = await Profile.findOne({ username: req.body.user });
        if (!user) {
            return res.sendStatus(401);
        }
        else {
            let msg = {username: username, displayname: req.body.displayname, email: req.body.email, zipcode: req.body.zipcode, phone: req.body.phone}
            user.displayname = req.body.displayname;
            user.email = req.body.email;
            user.zipcode = req.body.zipcode;
            user.phone = req.body.phone;
            await user.save();
            // putZipcode(req, res)
            // putEmail(req, res)
            // putDisplayname(req, res)
            console.log("req.body",msg)
            res.send(msg)
        }
    })()
}
            
// const getFollowerProfile = (req, res) => {
//     // this return the user profile
//     (async () => {
//         const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
//         // let username = getUsernameFromCookie(req);
//         // console.log("I'm in getFollowerProfile and what is username", username)
//         console.log("get follower's profile", req.body.follower)
//         const user = await Profile.findOne({ username: req.body.follower });
//         if (!user) {
//             return res.sendStatus(401);
//         }
//         else {
//             let msg = {username: req.body.follower, avatar: user.avatar, headline: user.headline}
//             res.send(msg)
//         }
//     })()
// }

const getFollowerProfile = (req, res) => {
    // this return the user profile
    (async () => {
    const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    // let username = getUsernameFromCookie(req);
    // console.log("I'm in getFollowerProfile and what is username", username)
    console.log("get follower's profile", req.body.follower)
    const user = await Profile.find({ username: req.body.follower });
    if (!user) {
        return res.sendStatus(401);
    }
    else {
        console.log("user!!!", user)
        // let msg = {username: req.body.follower, avatar: user.avatar, headline: user.headline}
        res.send(user)
    }
    })()
}
const test = (req, res) => {
    console.log("I'm in test", req.body)
}


module.exports = (app) => {
    // isLoggedIn(app);
    app.get('/test', testhere);
    app.get('/headline/:user?', getHeadline);
    app.put('/headline', putHeadline);
    // app.get('following/:user?', getFollowing);
    // app.put('following/:user', putFollowing);
    // // delete following
    // app.delete('following/:user', deleteFollowing);
    app.get('/email/:user?', getEmail);
    app.put('/email', putEmail);
    app.get('/zipcode/:user?', getZipcode);
    app.put('/zipcode', putZipcode);
    app.get('/avatar/:user?', getAvatar);
    app.put('/avatar', putAvatar);
    // app.post('/avatar', uploadImage('avatar'));
    app.get('/dob/:user?', getDob);
    app.get('/profile', getProfile);
    app.put('/displayname', putDisplayname)
    app.put('/profile', putProfile)
    app.post('/followerProfile', getFollowerProfile)
    upCloud.setup(app);

}