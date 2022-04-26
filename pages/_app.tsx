import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@auth0/nextjs-auth0";
import {TopBar} from '../components/TopBar'
import {Footer} from '../components/Footer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <TopBar />
      <Component {...pageProps} />
      <Footer />
    </UserProvider>
  );
}

export default MyApp;
