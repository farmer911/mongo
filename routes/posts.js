const router = require('express').Router();
const verify = require('./verifyToken');
const Post = require('../model/Posts');
const { postValidation } = require('../validation');

router.get('/', verify, async (req, res) => {
  const posts = await Post.find();
  res.send({
    data: posts
  })
})

router.post("/add", verify, async (req, res) => {
  const { error } = postValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    date: req.body.date
  })

  try {
    const savePost = await post.save();
    res.send({
      message: "Your blog was added",
      post: savePost
    })
  } catch (error) {
    return res.status(400).send(error)
  }
})

module.exports = router;
 