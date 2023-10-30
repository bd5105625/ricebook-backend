
const mongoose = require('mongoose')
const articleSchema = require('./Schema/articleSchema')
const Article = mongoose.model('Article', articleSchema)
// const connectionString = process.env.MONGO_URL

const getUsernameFromCookie = require('./auth').getUsernameFromCookie;



async function createArticle(id, username, text, url) {
    const newArticle = new Article({ 
        pid: id,
        author:username, 
        text: text, 
        date: new Date(), 
        comments: [],
        img: url
    });
    await newArticle.save();
    return newArticle;
}

const getArticles = (req, res) => {
    (async () => {
        // const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        let users = req.body.follower
        users.push(req.body.user)
        // console.log("users", users, req.body.follower)
        const articles = await Article.find({ author: users, limit:1}).sort({date: -1});
        // console.log("I'm here!!", articles)
        if (!articles) {
            res.send({ articles: [] });
            // return res.sendStatus(401);
        }
        else {
            res.send({articles: articles});
        }

    })()
}

const getArticle = (req, res) => {
    (async () => {
        // const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        const username = getUsernameFromCookie(req);
        let parameter = req.params.id;
        let article = await Article.find({ author: parameter})
        if (article.length == 0) {
            let article = await Article.find({ author: username, pid : parameter})
            res.send({ articles: article})
        }
        else {
            res.send({articles: article});
        }
    })()


}

const addArticle = (req, res) => {
    (async () => {
        // const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        const username = getUsernameFromCookie(req);
        const articles = await Article.find({ author: req.body.author });
        if (articles.length == 0) {
            //add new article to null list
            let newArticle = await createArticle(0, req.body.author , req.body.text, req.body.url);
            res.send({ articles: [newArticle] });

        }
        else {
            let id = articles.length;
            let newArticle = await createArticle(id, req.body.author , req.body.text, req.body.url);
            articles.push(newArticle);
            res.send({articles: articles});
        }
    })()

}

const putArticle = (req, res) => {
    (async () => {
        // const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        const username = req.body.user
        const article = await Article.findOne({ author: username, _id: req.params.id});
        article.text = req.body.text;
        article.save();
        res.send({newArticles: article})
        // console.log("length of existing articles", article.length)
        // console.log(article)
        // // no article found
        // if (article.length == 0) {
        //     console.log("no article")
        //     // res.send({ articles: [] });
        //     return res.sendStatus(403);
        // }
        // else {
        //     let comment = req.body.commentId;
        //     let id = req.params.id;
        //     // let article = articles[id];
        //     // let article = articles.find((article) => article._id == id);
        //     console.log("article found, _id is", id, "article is", article)
        //     if (comment) {   // add comment
        //         article.comments.push(comment);
        //     }
        //     else {  // update article
        //         article.text = req.body.text;
        //     }
        //     article.save();
        //     res.send({articles: article});
        // }

    })()
}

const putComment = (req, res) => {
    (async () => {
        // const connector = mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        const article = await Article.findOne({ author: req.body.author, _id: req.body._id});
        console.log("req.body", req.body, "article", article)
        let todo = {
            author: req.body.user,
            text: req.body.text
        }
        console.log("todo", todo)
        article.comments.push((todo))
        article.save()
        res.send({newArticles: article})
    })()
}

const editComment = (req, res) => {

}

module.exports = (app) => {
    app.post('/articles', getArticles);
    app.get('/articles/:id', getArticle);
    app.put('/articles/:id', putArticle);
    app.post('/article', addArticle);
    app.post('/comment', putComment);
    app.put('/editComment', editComment);
}

module.exports.createArticle = createArticle;