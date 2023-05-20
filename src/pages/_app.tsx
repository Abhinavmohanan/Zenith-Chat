import PersistLogin from '@/components/persistLogin'
import Protected from '@/components/protectedRoute'
import { AuthProvider } from '@/context/AuthContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PersistLogin>
        <Protected>
            <Component {...pageProps} />
        </Protected>
       </PersistLogin>
    </AuthProvider>
  )
}
