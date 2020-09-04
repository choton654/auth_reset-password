import cookie from 'cookie';
import App from 'next/app';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../Components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  const { ctx } = appContext;
  const { token } = cookie.parse(
    ctx.req ? ctx.req.headers.cookie || '' : document.cookie,
  );

  const redirectUser = (ctx, location) => {
    if (ctx.req) {
      ctx.res.writeHead(302, { Location: location });
      ctx.res.end();
    } else {
      Router.push(location);
    }
  };

  if (!token) {
    const protectRoute =
      ctx.pathname === '/activate' ||
      ctx.pathname === '/forgetpassword' ||
      ctx.pathname === '/resetpassword';

    if (protectRoute) {
      redirectUser(ctx, '/');
    }
  }

  return { ...appProps };
};

export default MyApp;
