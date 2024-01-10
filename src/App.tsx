import { useEffect, useRef, useState } from 'react'
import './App.css'

type OMDB ={
  Title: string,
  Poster: string,
  Year: number | string,
  imdbID: string,
  Type: string
}

const API_KEY = import.meta.env.VITE_OMDB_API_KEY  

function App() {
  const [data, setData] = useState<OMDB[] | null>(null)
  const [searchTitleData, setSearchTitleData] = useState<string>('')
  const [page, setPage] = useState(1)
  const [movieList, setMovieList] = useState<OMDB[] | null>(null)

  const searchTitle = useRef<HTMLInputElement>(null)

  useEffect(()=>{
    fetch(`http://www.omdbapi.com/?s=${searchTitleData || 'Avatar'}&page=${page}&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(stringResponse => JSON.stringify(stringResponse.Search))
    .then(jsResponse => setData(JSON.parse(jsResponse)))
    // .then(jsResponse => console.log(JSON.parse(jsResponse)))

    const movieData = localStorage.getItem('myMovieList')
    if(movieData){
      const list: string | null = localStorage.getItem('myMovieList')
      console.log('list: ', list)
      
      if(list && list !== null){
        const parsedList = JSON.parse(list)
        console.log('parsedList: ', parsedList)
  
        setMovieList(parsedList)
      }
    }

  },[searchTitleData, page])
  
  function searchMovieTitle(){
    if(searchTitle !== null && searchTitle.current && searchTitle.current.value){
      const value: string = searchTitle.current.value
      
      return setSearchTitleData(value)
    }
  }

  function toFavorite(item: OMDB){
    if(
      localStorage.getItem('myMovieList') && 
      localStorage.getItem('myMovieList') !== null && 
      typeof localStorage.getItem('myMovieList') === 'string'
      ){

      const listFromLocalStorage: string | null = localStorage.getItem('myMovieList')
      if(listFromLocalStorage){
        const parsedListFromLocalStorage = JSON.parse(listFromLocalStorage)
        parsedListFromLocalStorage.push(item)

        setMovieList(parsedListFromLocalStorage)

        const parsedListFromLocalStorageJSON = JSON.stringify(parsedListFromLocalStorage)
        localStorage.setItem('myMovieList', parsedListFromLocalStorageJSON)
      }
    }else{
      const itemArray = new Array(item)
      setMovieList(itemArray)

      const itemArrayJSON = JSON.stringify(itemArray)

      localStorage.setItem('myMovieList', itemArrayJSON)      
    }
  }

  function toggleAside(){
    const asideElement: HTMLElement | null = document.getElementById('asideBox')
    
    if(asideElement && asideElement !== null){
      asideElement.classList.contains('hidden') ? asideElement.classList.remove('hidden') : asideElement.classList.add('hidden')
    }
  }

  return (
    <>
      <header className='header'>
        <h1>My Movie List</h1>

        <button onClick={()=>toggleAside()}>My list</button>
      </header>

      <aside id='asideBox' className='aside hidden'>
        <h2>My list:</h2>

        {movieList && movieList !== null ? <div className='aside__items'>{movieList.map(item => {
          return <div key={item.imdbID + Math.random()}>
              <img src={item.Poster}/>
              <p>{item.Title}</p>
              <p>{item.Type}</p>
            </div>})
          }</div> : 'ainda não fez a função toFavorite né?????'}
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
                <button onClick={()=>{toFavorite(item)}}>ADD</button>
                </div>
            }) : ''}
          </div> : 'Title not found'}
        
        </div>
      </main>
    </>
  )
}

export default App
