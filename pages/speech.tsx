import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function SpeechPage() {
  const year = new Date().getFullYear()
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMessageEmpty, setIsMessageEmpty] = useState(false)

  const html = '<span speak="Hello, I am a React component and I can speak!">'

  useEffect(() => {
    const msg = new SpeechSynthesisUtterance(
      'Hello, I am a React component and I can speak!'
    )
    window.speechSynthesis.speak(msg)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message === '') {
      setIsMessageEmpty(true)
      // return
    } else {
      setIsMessageEmpty(false)

      setIsLoading(true)
      fetch('/api/ai-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })
        .then((res) => res.json())
        .then((data) => setResponse(data.name))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false))
    }
  }

  // const commentEnterSubmit = (e) => {
  //   if (e.key === 'Enter' && e.shiftKey === false) {
  //     // const data = { content: e.target.value }
  //     return handleSubmit(handleSubmit(e))
  //   }
  // }

  return (
    <div className={styles.container}>
      <Head>
        <title>Ai Inspire Me</title>
      </Head>

      <main className={styles.main}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <Image src="/lightbulb.png" width={200} height={200} alt="lightbulb" />
        <h2>Welcome to</h2>
        <h1 className={styles.title}>Speech Page</h1>
        <p className={styles.description}>Tell us what you want to do today</p>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Go out for coffee with an old friend"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            // onKeyPress={commentEnterSubmit}
          />
          {isMessageEmpty ? (
            <p className={styles.validationError}>
              Please tell us what you want to do!
            </p>
          ) : (
            <p className={styles.validationError}>&nbsp;</p>
          )}
          <button type="submit" className={styles.bnt}>
            Get Inspired
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        {isLoading ? (
          <div className={styles.loading}>
            <Image src="/loading.gif" width={100} height={100} alt="loading" />
          </div>
        ) : (
          <p className={styles.response}>{response}</p>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Ai Inspire Me.com &nbsp;&nbsp; &copy; {year}</p>
      </footer>
    </div>
  )
}
