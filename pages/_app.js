// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'

import '@/styles/globals.css'

import { createTheme, MantineProvider } from '@mantine/core'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import Navbar from '@/components/navbar'

const theme = createTheme({
  /** Put your mantine theme override here */
})

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <MantineProvider theme={theme}>
        <Navbar />
        <Component {...pageProps} />
      </MantineProvider>
    </UserProvider>
  )
}
