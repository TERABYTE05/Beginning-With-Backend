import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import { useEffect } from 'react'

function App() {
  const [jokes,setJokes] = useState([])
  useEffect(()=>{
    axios.get('/api/jokes')
      .then(response => {
        setJokes(response.data)
      }).catch(error => {
        console.error('Error fetching jokes:', error)
      })
  })

  return (
    <>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      <h1>Chai and Fullstack</h1>
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div> */}
      {/* <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
      <p>JOKES : {jokes.length}</p>
      {
        jokes.map((joke,index)=>(
          <div key={index}>{joke}</div>
        ))
      }
    </>
  )
}

export default App
