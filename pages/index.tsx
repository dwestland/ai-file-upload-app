// pages/index.tsx
import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  const year = new Date().getFullYear()
  const [file, setFile] = useState<File | null>(null)
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isFileEmpty, setIsFileEmpty] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setIsFileEmpty(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setIsFileEmpty(true)
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/ai-message', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok) {
        setResponse(data.name)
      } else {
        setError(data.message || 'An error occurred')
      }
    } catch (err) {
      setError('An error occurred while processing your request')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>AI File Analyzer</title>
      </Head>

      <main className={styles.main}>
        <Image
          src="/file-upload.png"
          width={200}
          height={200}
          alt="file Upload"
        />
        <h2>Welcome to</h2>
        <h1 className={styles.title}>AI File Analyzer</h1>
        <p className={styles.description}>
          Upload your CSV or PDF file for analysis
        </p>
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".csv,.pdf" onChange={handleFileChange} />
          {isFileEmpty ? (
            <p className={styles.validationError}>Please upload a file!</p>
          ) : (
            <p className={styles.validationError}>&nbsp;</p>
          )}
          <button type="submit" className={styles.bnt}>
            Analyze File
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
