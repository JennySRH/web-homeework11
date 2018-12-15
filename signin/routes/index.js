var express = require('express');
var router = express.Router();
var validator = require('../public/javascripts/validator');
var users = {};

router.get('/',function(req,res,next) {
    res.render('signup',{title:'注册',user:{}});
});

router.get('/signup',function(req,res,next) {
    res.render('signup',{title:'注册',user:{}});
});

router.post('/signup',function(req,res,next) {
    var user = req.body;
    try {
        checkUser(user);
        users[user.username] = user;
        req.session.user = users[user.username];
        res.redirect('/detail');
    } catch (error) {
        res.render('signup',{title:'注册',user:user,error:error.message});           
    }
});

router.all('*', function(req,res,next) {
    req.session.user ? next() : res.redirect('/signin');
});

router.get('/detail',function(req,res,next) {
    res.render('detail',{title:'详情',user:req.session.user});
});

module.exports = router;

function checkUser(user) {
    var errorMessages = [];
    for(var key in user) {
        if(!validator.isFieldValid(key,user[key])) {
            errorMessages.push(validator.form[key].errorMessage);
        }
        if(!validator.isAttrValueUnique(users,user,key)) {
            errorMessages.push(
                "key: " + key + " is not unique by value: " + user[key]
            );
        }
    }
    if(errorMessages.length > 0) {
        throw new Error(errorMessages.join('<br/>'));
    }
}

// var http = require('http');
// var urlTool = require('url');
// var querystring = require('querystring');
// var pug = require('pug');
// var fs = require('fs');
// var validator = require('../public/javascripts/validator');
// var users = {};

// http.createServer(function(req,res) {
//     switch(req.url) {
//         case '/validator.js':
//             sendFile(res,'validator.js','text/javascript');
//             break;
//         case '/signup.js':
//             sendFile(res,'signup.js','text/javascript');
//             break;
//         case '/style.css':
//             sendFile(res,'style.css','text/css');
//             break;
//         default:
//             req.method === 'POST' ? registerUser(req,res) : sendHtml(req,res);
//     }
// }).listen(8000);

// console.log("signup server is listening at 8000");

// function sendFile(res,filepath,mime) {
//     res.writeHead(200,{"Content-Type":mime});
//     res.end(fs.readFileSync(filepath));
// }

// function registerUser(req, res) {
//     req.on('data',function(chunk){
//         try{
//             var user = parseUser(chunk.toString());
//             checkUser(user);
//             users[user.username] = user;
//             res.writeHead(301,{Location: '?username=' + user.username});
//             res.end();
//         } catch(error){
//             console.warn("regist error: ",error);
//             showSignup(res, user, error.message);
//         }

//     });
// }



// function checkUser(user) {
//     var errorMessages = [];
//     for(var key in user) {
//         if(!validator.isFieldValid(key,user[key])) {
//             errorMessages.push(validator.form[key].errorMessage);
//         }
//         if(!validator.isAttrValueUnique(users,user,key)) {
//             errorMessages.push(
//                 "key: " + key + " is not unique by value: " + user[key]
//             );
//         }
//     }
//     if(errorMessages.length > 0) {
//         throw new Error(errorMessages.join('<br/>'));
//     }
// }


// function parseUser(message) {
//     var temp = decodeURIComponent(message);
//     params = temp.match(/username=(.+)&sid=(.+)&phone=(.+)&email=(.+)/);
//     var user = {username:params[1],sid: params[2],phone: params[3],email:params[4]};
//     console.log("user parsed is: ",user);
//     return user;
// }

// function sendHtml(req, res) {
//     var username = parseUsername(req);
//     if(!username || !isRegistedUser(username)) {
//         showSignup(res,{username: username},null);
//     } else {
//         showDetail(res,users[username]);
//     }
// }

// function parseUsername(req) {
//     return querystring.parse(urlTool.parse(req.url).query).username;
// }

// function isRegistedUser(username) {
//     return !!users[username];
// }

// function showSignup(res, user, error) {
//     showHtml(res,'signup.pug',{user:user,error:error});
// }


// function showDetail(res, user) {
//     console.log("here");
//     showHtml(res,'detail.pug',user);
// }

// //showHtml(res,'signup.pug',{user:user,error:error});
// function showHtml(res,template,data) {
//     res.writeHead(200,{"Content-Type":"text/html"});
//     res.end(pug.renderFile(template,data));    
// }