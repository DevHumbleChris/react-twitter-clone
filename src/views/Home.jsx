import React from 'react'
import Sidebar from '../components/Sidebar'

export default function Home() {
  return (
    <main class="grid grid-cols-6 sm:grid-cols-8 gap-2 space-x-2">
        <Sidebar />
    </main>
  )
}
