import jwt from 'jsonwebtoken';
import nc from 'next-connect';
import User from '../../../model/Users';

export default nc({
  onError(error, req, res) {
    res.status(501).send(`something went wrong ${error}`);
  },
  onNoMatch(req, res) {
    req.status(405).send(`method ${req.method} not allowed`);
  },
}).post((req, res) => {
  const { token } = req.body;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        console.log('Activation error');
        return res.status(401).json({
          errors: 'Expired link. Signup again',
        });
      } else {
        const { name, email, password } = decode;
        const user = await User.findOne({ email });
        if (user)
          return res.status(400).json({
            errors: 'Email already taken',
          });
        console.log(email);
        try {
          const newUser = await new User({
            name,
            email,
            password,
          });

          newUser.save();

          res.status(200).json({
            success: true,
            user: newUser,
            message: 'Signup success',
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  } else {
    res.status(500).json({
      message: 'error happening please try again',
    });
  }
});
