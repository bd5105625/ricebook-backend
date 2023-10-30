const mongoose = require('mongoose')
const userSchema = require('./Schema/userSchema')
const profileSchema = require('./Schema/profileSchema')
const User = mongoose.model('User', userSchema)
const Profile = mongoose.model('Profile', profileSchema)



// const connectionString = process.env.MONGO_URL


let userObjs = { };
let sessionUser = {};
const md5 = require('md5')
let cookieKey = 'sid';


async function createUser(username, salt, hash) {
    const newUser = new User({ username: username, salt: salt, hash: hash });
    await newUser.save();
}

async function createProfile(username, displayName, phone, email, dob, zipCode, avatar, headline, following) {
    const newProfile = new Profile({ username: username, displayname: displayName, phone: phone, email: email, dob: dob, zipcode: zipCode, avatar: avatar, headline: headline, following: following });
    await newProfile.save();
}
// async function createProfile() {
//     // const newProfile = new Profile({ username: "test", email: "test", dob: "test", zipCode: "test", avatar: "test", headline: "test", following: ["test"] });
//     // const newProfile = new Profile({username: "test", email: "test", zipcode: "test", dob: "test", avatar: "test", headline: "test", following: ["test"]});
//     await newProfile.save();
// }
const login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // log in to server, sets session id and hash cookies

    if (!username || !password) {
        return res.sendStatus(400);
    }

    
    //get user from database
    (async () => {
        console.log("in login")
        // const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.sendStatus(401);
        }
        let salt = user.salt;
        let hash = md5(salt + password);
        if (hash !== user.hash) {
            return res.sendStatus(401);
        }
        let sid = md5(username)
        sessionUser[sid] = username;
        // login success
        // set cookie
        res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true, sameSite: 'none', secure: true});
        console.log("sid",sid)
        let msg = { username: username, result: 'login success' };
        console.log("session user", sessionUser)
        
        res.send(msg);
        
    })()

    // get user from local userObjs
    // let user = userObjs[username];

    // if (!user) {
    //     return res.sendStatus(401);
    // }
    // let salt = user.salt;
    // let hash = md5(salt + password);
    // if (hash !== user.hash) {
    //     return res.sendStatus(401);
    // }
    // let msg = { username: username, result: 'success' };
    // res.send(msg);
    

}

const logout = (req, res) => {
    console.log("in logout")
    // log out of server, clears session id and hash cookies
    res.clearCookie(cookieKey);
    let msg = "Logout success";
    res.send(msg);
}

const register = (req, res) => {
    (async () => {
        console.log("in register")
        // const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        const username = req.body.username;
        const password = req.body.password;

        let salt = username + new Date().getTime();
        let hash = md5(salt + password);

        // store user info in userObjs
        userObjs[username] = { username: username, salt: salt, hash: hash };
        // check if username already exists
        const user = await User.findOne ({ username: username });
        if (user) {
            console.log("username already exists")
            return res.sendStatus(400);
        }
        
        // store user to database
        createUser(username, salt, hash);

        const displayName = req.body.displayname;
        const phone = req.body.phone;
        const email = req.body.email;
        const dob = req.body.dob;
        const zipCode = req.body.zipcode;
        const headline = "Rice Owls are awesome"
        const avatar = "https://st4.depositphotos.com/9998432/23259/v/600/depositphotos_232591962-stock-illustration-person-gray-photo-placeholder-man.jpg"
        const following = []

        // store user's profile to database
        // await createProfile()
        createProfile(username, displayName, phone, email, dob, zipCode, avatar, headline, following);
        // register a new user

        console.log("successfully registered")



        let msg = { username: username, result: 'register success' };
        res.send(msg);
    })()
}

const putPassword = (req, res) => {
    const password = req.body.password;
    // change password
    // TODO revise the following line
    let sid = req.cookies[cookieKey];
    let username = sessionUser[sid];
    // change password in database
    (async () => {
        // const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.sendStatus(401);
        }
        let salt = user.salt;
        let hash = md5(salt + password);
        user.hash = hash;
        await user.save();
    })()


    let msg = { username: username, result: 'password change success' };
    res.send(msg);
}

const isLoggedIn = (req, res, next) => {

    console.log("isLoggedIn middleware");
    // check if the user has the cookie
    if (!req.cookies) {
        console.log("no cookie");
        return res.sendStatus(401);
    }
    let sid = req.cookies[cookieKey];
    console.log('isloggined cookies', req.cookies)
    if (!sid) {
        console.log("no sid");
        return res.sendStatus(401)
    }
    let username = sessionUser[sid];
    if (username) {
        next();
    } else {
        console.log("no username");
        return res.sendStatus(401);
    }
}

const getUsernameFromCookie = (req, res) => {
    let sid = req.cookies[cookieKey];
    let username = sessionUser[sid];
    if (username) {
        return username;
    } else {
        return null;
    }
}

const testFunction = (req, res) => {
    console.log("test middleware");
    if(req.body.test) {
        console.log(req.body.test)
    }
    else{
        console.log("no test argument")
    }
    res.send({ hello: 'test in auth' });
}

module.exports = (app) => {
    // isLoggedIn is a middleware function
    app.post('/register', register);
    app.post('/login', login);
    app.use(isLoggedIn);
    app.put('/logout', logout);
    app.put('/password', putPassword); //update password
    app.get('/testauth', testFunction);

}
module.exports.isLoggedIn = isLoggedIn;
module.exports.testFunction = testFunction;
module.exports.getUsernameFromCookie = getUsernameFromCookie;