import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  const year = new Date().getFullYear()
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMessageEmpty, setIsMessageEmpty] = useState(false)

  const handleSubmit = (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e) e.preventDefault()
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

  const commentEnterSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>AI Upload App</title>
      </Head>

      <main className={styles.main}>
        <Image
          src="/file-upload.png"
          width={200}
          height={200}
          alt="file Upload"
        />
        <h2>Welcome to</h2>
        <h1 className={styles.title}>AI File Upload App</h1>
        <p className={styles.description}>Upload your file and prompt</p>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Give me a prompt"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={commentEnterSubmit}
          />
          {isMessageEmpty ? (
            <p className={styles.validationError}>
              Please tell us what you want to do!
            </p>
          ) : (
            <p className={styles.validationError}>&nbsp;</p>
          )}
          <button type="submit" className={styles.bnt}>
            Get Response
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
        <p>Somebody &nbsp;&nbsp; &copy; {year}</p>
      </footer>
    </div>
  )
}
