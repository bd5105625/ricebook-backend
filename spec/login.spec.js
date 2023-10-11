// validate Post image

require('es6-promise').polyfill();
require('isomorphic-fetch');
const mongoose = require('mongoose')
const articleSchema = require('./../src/Schema/articleSchema')
const Article = mongoose.model('Article', articleSchema)
const createArticle = require('./../src/articles').createArticle;

const url = path => `http://localhost:3000${path}`;
const connectionString = "mongodb+srv://users_for_531:1234567890@cluster0.rano8e1.mongodb.net/?retryWrites=true&w=majority";



describe('Validate backend function', () => {
    console.log("in describe")
    let cookie
    let length


    it("Test POST/register", (done) => {
        let regUser = {
            username: 'testUser', 
            password: '123',
            email: "bd5105625@rice.edu",
            dob: "19990222",
            zipcode: "77005",
            headline: "Rice Owls are awesome"
        };
        fetch(url('/register'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(regUser)
        }).then(res => res.json()).then(res => {
            expect(res.username).toBe('testUser');
            expect(res.result).toBe('register success');
            done();
        })
    })
    
    it("Test POST/login", (done) => {
        let loginUser = {username:'testUser', password:'123'};
        fetch(url('/login'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginUser)
        }).then(res => {
            cookie = res.headers.get('set-Cookie');
            return res.json();
        })
        .then(res => {
            expect(res.username).toEqual('testUser');
            expect(res.result).toEqual('login success');
            done();
        })
    })
    
    it("Test GET/headline", (done) => {

        fetch(url('/headline/testUser'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'cookie': cookie
            }
        }).then(res => res.json()).then(res => {
            if(cookie){
                
                expect(res.headline).toEqual('Rice Owls are awesome');
                done();
            }
            else{
                
                console.log("cookie is null in get headline")
                done()
            }
        })
    })
    
    it("Test PUT/headline", (done) => {
        let newHeadline = {headline: "I am a new headline"};
        fetch(url('/headline'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'cookie': cookie
            },
            body: JSON.stringify(newHeadline)
        }).then(res => res.json()).then(res => {
            if(cookie){
                // expect(res.headline).toEqual('I am a new headline');
                expect(res.headline).toEqual(newHeadline.headline);
                done();
            }
            else{
                console.log("cookie is null in put headline")
                done()
            }
        })
    })
    
    it("Test GET/articles", (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'cookie': cookie
            }
            }).then(res => res.json()).then(res => {
                // console.log("res is ", res.articles)
                length = res.articles.length
                expect(res.articles.length).toEqual(0);
                done();
            })
    })

    it("Test Post/article", (done) => {
        fetch(url('/article'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'cookie': cookie
            },
            body: JSON.stringify({
                text: "I am a new article",
            })
        }).then(res => res.json()).then(res => {
            expect(res.articles.length).toEqual(length + 1);
            expect(res.articles[length].text).toEqual("I am a new article");
            done();
        })
    })


    it("Test GET/articles/id", (done) => {
        fetch(url('/articles/0'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'cookie': cookie
            }
            }).then(res => res.json()).then(res => {
                expect(res.articles.length).toEqual(1);
                expect(res.articles[0].text).toEqual("I am a new article")
                
            })
        fetch(url('/articles/1'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'cookie': cookie
            }
            }).then(res => res.json()).then(res => {
                expect(res.articles.length).toEqual(0);
                expect(res.articles[1]).toEqual(undefined)
                done();
            })
    })

    //     (async () => {
    //         const connect = mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});
    //         const username = 'testUser';
    //         const articles = await Article.find({author: username});
    //         if (articles.length == 0) {
    //             console.log("no article")
    //             expect(articles.length).toEqual(0);
    //             done();
    //         }
    //         else {
    //             done()
                
    //         }
    //     }
    // )()
    // })

        // let newArticle = {
        //     author = "testUser",

        //     text: "I am a new article",
            


    // it("Test  Get/articles/:id", (done) => {
    //     fetch(url('/articles/0'), {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'cookie': cookie
    //         }
    //     }).then(res => res.json()).then(res => {
    //         expect(res.articles.length).toBe(1);
    //         done();
    //     })
    // })
    
    it("Test PUT/logout", (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie
        }
        }).then(res => {
            //clear cookie
            cookie = null;
            done();
        })
        
    })
})