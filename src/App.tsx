import { useEffect, useState } from 'react'
import './App.css'

type OMDB = {
  Title: string,
}

type officialData = OMDB | null

function App() {
  const [data, setData] = useState<officialData>(null)

  useEffect(()=>{
    fetch("http://www.omdbapi.com/?s&t=Avatar&apikey=a57ca117")
    .then(response => response.json())
    .then(stringResponse => JSON.stringify(stringResponse))
    .then(jsResponse => setData(JSON.parse(jsResponse)))
  },[])

  return (
    <>
      <header className='header'>
        <h1>My Movie List</h1>
      </header>

      <main className='main'>
        <div className='main__left'>
          <h2>Search a movie:</h2>

          <div className='search__field'>
            <form onSubmit={event=>event.preventDefault()}>
              <input type='text' placeholder=''/>
              <button>Search</button>
            </form>

            <h2>Search result:</h2>
            <div>
                {data && data !== null ? <div>
                  {data.Title}
                  <button>Add</button>
                </div> : 'Title not found'}
            </div>
          </div>
        </div>

{/*  */}
        <div className='main__right'>
          <h2>My list:</h2>

          <ul>
            <li>
              Example 0
            </li>
          </ul>
        </div>

      </main>
    </>
  )
}

export default App
