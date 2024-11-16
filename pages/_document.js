import { ColorSchemeScript } from '@mantine/core'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en' suppressHydrationWarning>
      <Head>
        <ColorSchemeScript defaultColorScheme='auto' />
      </Head>
      <body>
        <Main className='h-full' />
        <NextScript />
      </body>
    </Html>
  )
}
