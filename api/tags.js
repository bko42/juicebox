const express = require('express');
const tagsRouter = express.Router();
const { requireUser } = require('./utils');
const {     
    getPostsByTagName,
    
} = require('../db');


tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    const { tagName } = req.params;
    try {
        const tagNamePost = await getPostsByTagName(tagName)
      // use our method to get posts by tag name from the db
      const posts = tagNamePost.filter(post => {
        return post.active || (req.user && post.author.id === req.user.id);
      });
      if(posts.length) {
        res.send({posts})
      } else {
        next(
            { 
                name: 'PostByTagName',
                message: 'Could not get post by tagname'
            }
        )
      }
      // send out an object to the client { posts: // the posts }
    } catch ({ name, message }) {
      // forward the name and message to the error handler
      next({ name, message})
    }
  });

module.exports = tagsRouter;