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
  .get(async (req, res) => {
    const {
      query: { userId },
    } = req;
    // console.log(userId);
    const user = await User.findOne({ _id: userId });
    // console.log('user', user);

    if (!user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    return res.status(200).json(user);
    // User.findOne({ _id: userId }).exec((err, user) => {

    // });
  });
