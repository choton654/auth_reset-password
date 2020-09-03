import jwt from 'jsonwebtoken';
import nc from 'next-connect';
import User from '../../../model/Users';
import dbConnect from '../../../utils/dbConnect';
import { forgotPasswordValidator } from '../../../utils/valid';
const { validationResult } = require('express-validator');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.MAIL_KEY);
dbConnect();

export default nc({
  onError(error, req, res) {
    res.status(501).send(`something went wrong ${error}`);
  },
  onNoMatch(req, res) {
    req.status(405).send(`method ${req.method} not allowed`);
  },
}).put(forgotPasswordValidator, async (req, res) => {
  const { email } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((err) => err.msg)[0];
    return res.status(422).json({ errors: firstError });
  } else {
    User.findOne({ email }).exec((err, user) => {
      // if (err || user) {
      //   return res.status(400).json({
      //     error: 'User already exists with that email',
      //   });
      // }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '10m',
      });

      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Password Reset link`,
        html: `
                    <h1>Please use the following link to reset your password</h1>
                    <p>${process.env.CLIENT_URL}/resetpassword?token=${token}</p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
      };

      return user.updateOne({ resetPasswordLink: token }, (err, success) => {
        if (err) {
          console.log('RESET PASSWORD LINK ERROR', err);
          return res.status(400).json({
            error: 'Database connection error on user password forgot request',
          });
        } else {
          sgMail
            .send(emailData)
            .then((sent) => {
              // console.log('SIGNUP EMAIL SENT', sent)
              return res.json({
                message: `Email has been sent to ${email}. Follow the instruction to activate your account`,
              });
            })
            .catch((err) => {
              return res.json({
                message: err.message,
              });
            });
        }
      });
    });
  }
});
