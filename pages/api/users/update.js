import nc from 'next-connect';
import User from '../../../model/Users';
import { requireSignin } from '../../../utils/authMiddlewares';
import dbConnect from '../../../utils/dbConnect';

dbConnect();

export default nc({
  onError(error, req, res) {
    res.status(501).send(`something went wrong ${error}`);
  },
  onNoMatch(req, res) {
    req.status(405).send(`method ${req.method} not allowed`);
  },
})
  .use(requireSignin)
  .put(async (req, res) => {
    const { name, password } = req.body;

    User.findOne({ _id: req.user._id }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'User not found',
        });
      }

      if (!name.trim()) {
        return res.status(400).json({
          error: 'name must not be empty',
        });
      } else {
        user.name = name;
      }

      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            error: 'Password must be 6 characters long',
          });
        } else {
          user.password = password;
        }
      }

      user.save((err, updatedUser) => {
        if (err) {
          return res.status(400).json({
            error: 'User update failed',
          });
        }

        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(updatedUser);
      });
    });
  });
