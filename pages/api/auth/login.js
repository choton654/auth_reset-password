import { validationResult } from 'express-validator';
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
}).post(async (req, res) => {
  const errors = validationResult(req);

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(422).json({
        errors: firstError,
      });
    } else {
      if (!user) {
        return res.status(400).json({
          errors: 'User with that email does not exist. Please signup',
        });
      }

      if (!user.authenticate(password)) {
        return res.status(400).json({
          errors: 'Email and password do not match',
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
      );

      const { _id, name, email, role } = user;

      return res.status(200).json({
        token,
        user: {
          _id,
          name,
          email,
          role,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
});
