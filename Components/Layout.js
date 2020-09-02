import Head from 'next/head';

export default function Layout({
  children,
  title = 'This is the default title',
}) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link
          href='https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css'
          rel='stylesheet'
        />
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap'
          rel='stylesheet'
        />
        <link rel='apple-touch-icon' href='%PUBLIC_URL%/logo192.png' />
      </Head>

      {children}
    </div>
  );
}
