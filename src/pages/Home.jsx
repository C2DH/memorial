import React, { Suspense } from 'react'

import '../styles/pages/Home.css'
import Hero from '../components/Hero/Hero'

const Home = () => {
  return (
    <>
      <Suspense fallback={null}>
        <Hero />
      </Suspense>
    </>
  )
}
export default Home
