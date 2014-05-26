'use strict';

var loggedIn = require('../middleware/islogged');
var mongoose = require('mongoose');
require('../models/post');
var BlogPost = mongoose.model('BlogPost');

module.exports = function ( app ) {
    app.route('/post/:id')
        .get(function ( req, res, next ) {
            var query = BlogPost.findById( req.param('id') );
            // runs additional query to find the author of the post
            query.populate( 'author' );
            // run the query
            query.exec(function ( err, post ) {
                if ( err ) return next( err );
                if ( !post ) return next(); // 404
                res.render( 'post/view', { post: post } );
            });
        });

    app.route('/post')
        .get(loggedIn, function ( req, res ) {
            res.render('posts/create');
        })
        .post(loggedIn, function ( req, res, next ) {
            var title = req.param('title');
            var body = req.param('body');
            var user = req.session.user;

            BlogPost.create({
                title: title,
                body: body,
                author: user
            }, function ( err, post ) {
                if ( err ) return next( err );
                res.redirect('/post/' + post.id);
            });
        });
};
