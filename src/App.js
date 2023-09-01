import { useState } from 'react'
import { useMovies } from './hooks/useMovies'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import Search from './components/Search'
import MovieList from './components/MovieList'
import { MovieDetails } from './components/MovieDetails'
import { WatchedSummary } from './components/WatchedSummary'
import { WatchedMoviesList } from './components/WatchedMoviesList'
import { Loader } from './components/Loader'
import { ErrorMessage } from './components/ErrorMessage'
import { Logo } from './components/Logo'
import { NavBar } from './components/NavBar'
import { NumResults } from './components/NumResults'
import { Box } from './components/Box'
import { Main } from './components/Main'

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

export default function App() {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie)

  const [watched, setWatched] = useLocalStorageState([], 'watched')

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id))
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie])
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id))
  }

  return (
    <>
      <NavBar movies={movies}>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  )
}
