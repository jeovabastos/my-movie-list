import { useEffect, useRef, useState } from 'react'
import './App.css'

type OMDB ={
  Title: string,
  Poster: string,
  Year: number | string,
  imdbID: string,
  Type: string
}

// const API_KEY:string = process.env.OMDB_API_KEY
const API_KEY = import.meta.env.VITE_OMDB_API_KEY  

function App() {
  const [data, setData] = useState<OMDB[] | null>(null)
  const [searchTitleData, setSearchTitleData] = useState<string>('')
  const [page, setPage] = useState(1)

  const searchTitle = useRef<HTMLInputElement>(null)

  useEffect(()=>{
    fetch(`http://www.omdbapi.com/?s=${searchTitleData || 'Avatar'}&page=${page}&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(stringResponse => JSON.stringify(stringResponse.Search))
    .then(jsResponse => setData(JSON.parse(jsResponse)))
    // .then(jsResponse => console.log(JSON.parse(jsResponse)))
  },[searchTitleData, page])

  function searchMovieTitle(){
    if(searchTitle !== null && searchTitle.current && searchTitle.current.value){
      const value: string = searchTitle.current.value
      
      return setSearchTitleData(value)
    }
  }

  return (
    <>
      <header className='header'>
        <h1>My Movie List</h1>
        
        <button>My list</button>
      </header>

      <aside className='aside'>
        <h2>My list:</h2>

        <ul>
          <li>
            Example 0
          </li>
        </ul>
      </aside>

      <main className='main'>
        <div className='main__content'>
          <div className='search__field'>
            <form className='search__input' onSubmit={event=>event.preventDefault()}>
              <input ref={searchTitle} type='text' placeholder='Avatar'/>
              <button onClick={()=>searchMovieTitle()}>Search</button>
            </form>

            <div className='search__controlls'>
              <button onClick={()=>{setPage(page=>page-1)}}>Previous page</button>
              <button onClick={()=>{setPage(page=>page+1)}}>Next page</button>
            </div>
          </div>

          {/* Search results */}
          {data && data !== null ? <div className='search__results'>
            {data !== null ? data.map(item=>{
              return <div className='result__item' key={(Math.random()).toString() + item}>
                <img src={item.Poster} alt='Poster image not found'/>
                <p>Title: {item.Title}</p>
                <p>Type: {item.Type}</p>
                <p>Year: {item.Year}</p>
                <p>IMDB ID: {item.imdbID}</p>
                <button>ADD</button>
                </div>
            }) : ''}
          </div> : 'Title not found'}
        
        </div>
      </main>
    </>
  )
}

export default App
