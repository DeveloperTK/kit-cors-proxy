import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>KIT CORS Proxy</title>
        <meta name="description" content="KIT CORS Proxy Landing Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="#">kit-cors-proxy</a>!
        </h1>

        <p className={styles.description}>
          I am proxying information from{' '}
          <code className={styles.code}>*.kit.edu</code>
        </p>

        <div className={styles.grid}>
          <a href="https://github.com/DeveloperTK/kit-cors-proxy" className={styles.card}>
            <h2>GitHub &rarr;</h2>
            <p>View this project on GitHub and find out how to use the API.</p>
          </a>

          <a href="https://github.com/DeveloperTK/kit-mobile-pwa" className={styles.card}>
            <h2>KIT Mobile PWA &rarr;</h2>
            <p>See this proxy in action in the new and improved (unofficial) KIT App</p>
          </a>

          <a
            href="https://github.com/DeveloperTK/kit-cors-proxy/CODEOWNERS"
            className={styles.card}
          >
            <h2>General Contact &rarr;</h2>
            <p>Contact the maintainers listed on the GitHub page.</p>
          </a>

          <a
            href="mailto:kitmobile@foxat.de"
            className={styles.card}
          >
            <h2>Abuse & Legal &rarr;</h2>
            <p>
              Any reports or complaints? Reach us directly
            </p>
          </a>
        </div>
      </main>
    </div>
  )
}
