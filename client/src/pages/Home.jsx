import React from 'react'

const Home = () => {
  const val = import.meta.env.VITE_APP
  return (
    <div>Home {val}</div>
  )
}

export default Home