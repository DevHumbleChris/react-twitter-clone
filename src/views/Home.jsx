import React from 'react'
import Sidebar from '../components/Sidebar'
import HomeTweets from '../components/HomeTweets'
import Feeds from '../components/Feeds'

export default function Home() {
  return (
    <main class="grid grid-cols-6 sm:grid-cols-8 gap-2 space-x-2">
        <Sidebar />
        <HomeTweets />
        <Feeds />
    </main>
  )
}
