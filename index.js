const express = require('express');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const auth = require('./src/auth');
const profile = require('./src/profile')
const following = require('./src/following')
const article = require('./src/articles')
var cors = require('cors')

const connectionString = process.env.MONGO_URL

const connectDB = async () => {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })

        console.log("MongoDB connected!")
    } catch (err) {
        console.log('Failed to connect to MongoDB', err)
    }
}
connectDB()

const corsOptions = {
    origin: 'http://localhost:3001',
    // origin: 'http://brad_ricebook.surge.sh',
    credentials: true,
    
    // allowCredentials: "true"
    
}

let articles = [{ id: 0, author: 'Mack', body: 'Post 1' },
    { id: 1, author: 'Jack', body: 'Post 2' },
    { id: 2, author: 'Zack', body: 'Post 3' }];

const hello = (req, res) => res.send({ text: 'hello world!!' });

const getArticles = (req, res) => res.send(articles);

// TODO: get the correct article by using the id
const getArticle = (req, res) => {
    res.send(articles[req.params.id]);

}


    // res.send(articles[res.params.id]);


const addArticle = (req, res) => {
    // TODO: add an article (i.e. push new article on existing article array)
    let post = req.body;
    let article = { id: articles.length, author: post.author, body: post.body };
    articles.push(article);
    console.log(articles);
    res.send(article);
}

const testhere = (req, res) => {
    res.send({ text: 'test here!!' })
}

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.get('/', hello);
app.get('/testhere', testhere);
// app.get('/test', hello);
auth(app);
profile(app);
following(app);
article(app);

// app.get('/articles', getArticles);
// app.get('/articles/:id', getArticle);
// app.post('/article', addArticle);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`)
});
