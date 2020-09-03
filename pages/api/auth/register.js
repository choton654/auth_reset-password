import jwt from 'jsonwebtoken';
import nc from 'next-connect';
import User from '../../../model/Users';
import dbConnect from '../../../utils/dbConnect';
import { errorHandler } from '../../../utils/dbErrorHandaling';
import { validRegister } from '../../../utils/valid';
const { validationResult } = require('express-validator');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.MAIL_KEY);
dbConnect();
// import jwt from 'express-jwt';

export default nc({
  onError(error, req, res) {
    res.status(501).send(`something went wrong ${error}`);
  },
  onNoMatch(req, res) {
    req.status(405).send(`method ${req.method} not allowed`);
  },
}).post(validRegister, async (req, res) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);
  const user = await User.findOne({ email });
  if (user)
    return res.status(400).json({
      errors: 'Email already taken',
    });

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((err) => err.msg)[0];
    return res.status(422).json({ errors: firstError });
  } else {
    const token = jwt.sign({ name, email, password }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account activation link',
      html: `
              <h1>Please use the following to activate your account</h1>
              <p>${process.env.CLIENT_URL}/activate?token=${token}</p>
              <hr />
              <p>This email may containe sensetive information</p>
              <p>${process.env.CLIENT_URL}</p>
              `,
    };

    sgMail
      .send(emailData)
      .then((sent) => {
        // console.log(sent);
        return res.status(200).json({
          message: `Email already send to ${email}`,
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(400).json({
          success: false,
          errors: errorHandler(err),
        });
      });
  }
});
