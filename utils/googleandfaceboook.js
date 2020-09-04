// const sendGoogleToken = (tokenId) => {
//   axios
//     .post(`/api/auth/googlelogin`, {
//       idToken: tokenId,
//     })
//     .then((res) => {
//       console.log(res.data);
//       informParent(res);
//     })
//     .catch((error) => {
//       console.log('GOOGLE SIGNIN ERROR', error.response);
//     });
// };

// const informParent = (response) => {
//   authenticate(response, () => {
//     isAuth() && isAuth().role === 'admin'
//       ? router.push('/admin')
//       : router.push('/private');
//   });
// };

// const responseGoogle = (response) => {
//   console.log(response);
//   sendGoogleToken(response.tokenId);
// };

// const sendFacebookToken = (userID, accessToken) => {
//   axios
//     .post(`/api/auth/facebooklogin`, {
//       userID,
//       accessToken,
//     })
//     .then((res) => {
//       console.log(res.data);
//       informParent(res);
//     })
//     .catch((error) => {
//       console.log('GOOGLE SIGNIN ERROR', error.response);
//     });
// };

// const responseFacebook = (response) => {
//   console.log(response);
//   sendFacebookToken(response.userID, response.accessToken);
// };

{
  /* <GoogleLogin
                  clientId={`${process.env.GOOGLE_CLIENT}`}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className='w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline'>
                      <div className=' p-2 rounded-full '>
                        <i className='fab fa-google ' />
                      </div>
                      <span className='ml-4'>Sign In with Google</span>
                    </button>
                  )}
                />
                <FacebookLogin
                  appId={`${process.env.FACEBOOK_CLIENT}`}
                  autoLoad={false}
                  callback={responseFacebook}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      className='w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5'>
                      <div className=' p-2 rounded-full '>
                        <i className='fab fa-facebook' />
                      </div>
                      <span className='ml-4'>Sign In with Facebook</span>
                    </button>
                  )}
                /> */
}

// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
// import { GoogleLogin } from 'react-google-login';
