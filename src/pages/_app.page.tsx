import 'react-toastify/dist/ReactToastify.min.css'
import '../lib/dayjs'
import { SessionProvider } from 'next-auth/react'
import { globalStyles } from '@/styles/global'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { DefaultSeo } from 'next-seo'
import { queryClient } from '@/lib/react-query'
import { QueryClientProvider } from '@tanstack/react-query'

globalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />

        <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'pt_BR',
            url: 'https://www.call.manogui.com.br/',
            siteName: 'call',
          }}
          twitter={{
            handle: '@handle',
            site: '@site',
            cardType: 'summary_large_image',
          }}
        />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </QueryClientProvider>
    </SessionProvider>
  )
}
