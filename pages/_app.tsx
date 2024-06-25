/* eslint-disable react/jsx-props-no-spreading */
import { AppProps } from 'next/app'
import React from 'react'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
