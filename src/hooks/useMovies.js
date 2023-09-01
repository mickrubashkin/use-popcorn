import { useEffect, useState } from 'react'
import { KEY } from '../constants'

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(
    function () {
      callback?.()

      const controller = new AbortController()

      async function fetchMovies() {
        try {
          setIsLoading(true)
          setError('')
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          )

          if (!res.ok) {
            throw new Error('something went wrong with fetching movies')
          }

          const data = await res.json()

          if (data.Response === 'False') {
            throw new Error('Movie not found')
          }

          setMovies(data.Search)
          setError('')
          setIsLoading(false)
        } catch (error) {
          if (error.name !== 'AbortError') {
            setError(error.message)
          }
        } finally {
          setIsLoading(false)
        }
      }

      if (query.length < 3) {
        setMovies([])
        setError('')
        return
      }

      fetchMovies()

      return function () {
        controller.abort()
      }
    },
    [query]
  )

  return { movies, isLoading, error }
}
