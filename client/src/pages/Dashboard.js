import React, { useEffect } from 'react'
// import { Logo } from '../components/Logo'
import Error from './Error'

const Dashboard = () => {
  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1')
      // const res = await fetch('http://localhost:5000/')
      // const res = await fetch('/data.json')
      const data = await res.json()
      console.log("%c Line:9 🍰 data", "color:#6ec1c2", data);
    } catch (error) {
      console.log("%c Line:12 🍐 error", "color:#4fff4B", error);      
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <Error/>
      {/* <Logo/> */}
      Dashboard
    </div>
  )
}

export default Dashboard