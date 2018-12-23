var express = require('express');
var router = express.Router();
var userManager = require('../models/user');

//	detail
router.get('/detail', function(req, res, next) {
	if (req.session.err) {
		delete req.session.err
		res.render('detail', { title: 'detail', user: req.session.user, error: 1 })
	  } else if (req.session.user) {
		res.render('detail', { title: 'detail', user: req.session.user, error: 0 })
	  } else {
		res.redirect('signin')
	  }
});

// signin
router.get('/signin', function(req, res, next) {
	// 如果已经登录，则直接跳转detail界面
	if (req.session.user) {
		res.redirect('/detail');
	} 
	// 未登录则跳转登录界面
	else {
		console.log("in get signin");
		res.render('signin', {title: 'sign in',user: {}})
	  }
});

router.post('/signin', function(req, res, next) {
	console.log("in post signin");
	userManager.findUser(req.body.username, req.body.password)
		.then(function(user) {
			req.session.user = user;
			console.log("in post signin then");
			res.redirect('/detail');
		})
		.catch(function(err) {
			console.log(err);
			res.render('signin', {
				title: '登陆',
				user: req.body,
				error: err
			});
		});
});

// signout
router.get('/signout', function(req, res, next) {
	delete req.session.user;
	res.redirect('/signin');
});

//	signup or regist
router.get('/regist', function(req, res, next) {
	// 同signin一样，如果已经登录则跳转detail页面，必须登出才能注册新用户
	if(req.session.user) {
		res.redirect('detail');
	}
	else {
		res.render('signup', {
			title: '注册',
			user: {},
			error:{}
		});
	}

});


router.post('/regist', function(req, res, next) {
	var user = req.body;
	userManager.checkUser(user)
		.then(function() {
			userManager.createUser(user);
		})
		.catch(function(error) {
			res.render('signup', {
				title: '注册',
				user: user,
				error: error
			});
		})
		.then(function() {
			req.session.user = user;
			res.redirect('/detail');
		})
		.catch(function(error){});
});


// 判断用户试图通过http://localhost:8000?username=ab的访问权限
router.all('*', function(req, res, next) {
	if (req.session.user && req.query.username) {
		req.session.err = (req.query.username != req.session.user.username ? 1 : 0);
		res.redirect('/detail');
	}
	else if (req.session.user) {
		res.redirect('/detail');
	}
	else {
		res.redirect('/signin');
	}
});

module.exports = router;
