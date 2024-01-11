import React, { Suspense } from 'react'

import '../styles/pages/Home.css'
import Hero from '../components/Hero/Hero'

const Home = ({ isMobile }) => {
  return (
    <>
      <Suspense fallback={null}>
        <Hero isMobile={isMobile} />
      </Suspense>
    </>
  )
}
export default Home
