import Cors from 'cors';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import nc from 'next-connect';
import initMiddleware from '../../../lib/initmiddleware';
import User from '../../../model/Users';
import dbConnect from '../../../utils/dbConnect';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);

dbConnect();

const cors = initMiddleware(
  Cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
);

export default nc({
  onError(error, req, res) {
    res.status(501).send(`something went wrong ${error}`);
  },
  onNoMatch(req, res) {
    req.status(405).send(`method ${req.method} not allowed`);
  },
}).post(async (req, res) => {
  await cors(req, res);

  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
    .then((res) => {
      const { email_verified, name, email } = response.payload;

      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: '7d',
            });
            const { _id, email, name, role } = user;

            return res.status(200).json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                return res.status(400).json({
                  error: 'User signup failed with google',
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' },
              );

              const { _id, email, name, role } = data;

              return res.status(200).json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        res.status(500).json({
          error: 'Google login failed. Try again',
        });
      }
    })
    .catch((err) => console.error(err));
});
