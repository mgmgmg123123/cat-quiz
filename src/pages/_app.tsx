import type { AppProps } from "next/app";
import "destyle.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
