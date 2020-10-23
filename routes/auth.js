const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req,res) => {
    //Handle error
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    // Checking email already exist in the database
    const emailExist = await User.findOne({ email: req.body.email})
    if (emailExist) return res.status(400).send({message: "Email already exist"})
  
    //Hash passwords
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
  try {
    const saveUser = await user.save();
    res.send(saveUser)
  } catch(e) {
    res.status(400).send(e)
  }
});
 
router.post('/login', async (req, res) => {

  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findOne({ email: req.body.email})
  if (!user) return res.status(400).send({ data:{message: "Email not found" }})

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if(!validPass) return res.status(400).send('Invalid password');

  //token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token)
      .send({
        message: "Login success",
        token: token,
        name: user.name
      });
})

module.exports = router;
