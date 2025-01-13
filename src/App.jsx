import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Route, Routes } from 'react-router-dom';
import axios from "axios";
import apiKey from "./config";

import Search from './components/Search';
import Nav from './components/Nav';
import PhotoList from './components/PhotoList';
import NotFound from './components/NotFound';

function App() {
  const [dogPhotos, setDogPhotos] = useState([]);
  const [catPhotos, setCatPhotos] = useState([]);
  const [compPhotos, setCompPhotos] = useState([]);
  const [searchPhotos, setSearchPhotos] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); 
  let location = useLocation()

  useEffect(() => {
    async function getInitialPhotos() {
      setLoading(true);
      try {
        const dogData = await fetchData('dog')
        setDogPhotos(dogData.data.photos.photo);
        const catData = await fetchData('cat')
        setCatPhotos(catData.data.photos.photo);
        const compData = await fetchData('comp')
        setCompPhotos(compData.data.photos.photo);
      } catch (error) {
        console.log("Error fetching and parsing data", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    getInitialPhotos()
    
  }, []);

  useEffect(() => {
    async function getSearchPhotos() {
      setLoading(true);
      try {
        const pathIndex = location.pathname.lastIndexOf('/')
        const pathLength = location.pathname.length
        const query = location.pathname.substring(pathIndex + 1, pathLength)
        const searchData = await fetchData(query)
        setSearchPhotos(searchData.data.photos.photo);
        setSearchTitle(query)
      } catch (error) {
        console.log("Error fetching and parsing data", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    if (location.pathname.includes('/search') && !searching) {
      getSearchPhotos()
    }
  }, [location])

  const fetchData = query => {
    const apiUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${query}&per_page=24&format=json&nojsoncallback=1`;

    return axios.get(`${apiUrl}`);
  }

  const handleQueryChange = data => {
    setSearchPhotos(data);
  }

  const handleTitleChange = title => {
    setSearchTitle(title)
  }

  const handleLoading = isLoading => {
    setLoading(isLoading)
  }

  const handleSearching = isSearching => {
    setSearching(isSearching)
  }

  const handleError = error => {
    setError(error)
  }
  
  return (
    <div className="container">
      <Search queryChange={handleQueryChange} changeTitle={handleTitleChange} loading={handleLoading} searching={handleSearching} handleError={handleError} fetch={fetchData} />
      <Nav />
      {loading ? (<p>Loading...</p>) : (
      <Routes>
        <Route path="/" element={<PhotoList data={dogPhotos} title='Dogs' />} />
        <Route path="cats" element={<PhotoList data={catPhotos} title='Cats' />} />
        <Route path="dogs" element={<PhotoList data={dogPhotos} title='Dogs' />} />
        <Route path="computers" element={<PhotoList data={compPhotos} title='Computers' />} />
        <Route path="search/:query" element={<PhotoList data={searchPhotos} title={searchTitle} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>)}
    </div>
    
  )
}

export default App
