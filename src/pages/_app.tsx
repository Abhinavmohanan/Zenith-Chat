import PersistLogin from '@/components/persistLogin'
import Protected from '@/components/protectedRoute'
import { AuthProvider } from '@/context/AuthContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PersistLogin>
        <Protected>
        <Head>
        <title>Zenith Chat</title>
        <meta property="og:title" content="Zenith Chat" key="title" />
      </Head>
            <Component {...pageProps} />
        </Protected>
       </PersistLogin>
    </AuthProvider>
  )
}
