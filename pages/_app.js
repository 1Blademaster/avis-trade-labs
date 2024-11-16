// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'

import '@/styles/globals.css'

import { UserProvider } from '@auth0/nextjs-auth0/client';
import { createTheme, MantineProvider } from '@mantine/core'

const theme = createTheme({
  /** Put your mantine theme override here */
})



export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
        <MantineProvider theme={theme}>
            <Component {...pageProps} />;
        </MantineProvider>
    </UserProvider>
  )
}
