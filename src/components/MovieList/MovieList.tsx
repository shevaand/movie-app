import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import type { Movie } from '../../types'
import Loader from '../Loader/Loader'
import FilterGroup from './FilterGroup'
import MovieCard from './MovieCard/MovieCard'
import './MovieList.css'

interface MovieListProps {
	type: 'popular' | 'top_rated' | 'upcoming'
	title: string
	emoji: string
}

interface SortState {
	by: 'default' | 'vote_average' | 'release_date'
	order: 'asc' | 'desc'
}

const MovieList = ({ type, title, emoji }: MovieListProps) => {
	const [movies, setMovies] = useState<Movie[]>([])
	const [minRating, setMinRating] = useState<number>(0)
	const [sort, setSort] = useState<SortState>({
		by: 'default',
		order: 'asc',
	})

	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const controller = new AbortController()

		const fetchMovies = async () => {
			try {
				setIsLoading(true)
				setError(null)

				const response = await fetch(
					`https://api.themoviedb.org/3/movie/${type}?api_key=${
						import.meta.env.VITE_TMDB_API_KEY
					}`,
					{ signal: controller.signal }
				)

				if (!response.ok) {
					throw new Error(`Request failed with status ${response.status}`)
				}

				const data = await response.json()
				setMovies((data.results ?? []) as Movie[])
			} catch (err) {
				if (err instanceof DOMException && err.name === 'AbortError') return
				console.error('Failed to load movies:', err)
				setError('Could not load movies. Please try again later.')
			} finally {
				if (!controller.signal.aborted) setIsLoading(false)
			}
		}

		fetchMovies()

		return () => controller.abort()
	}, [type])

	const sortedAndFilteredMovies = useMemo(() => {
		const result = movies.filter(movie => movie.vote_average >= minRating)

		if (sort.by === 'default') return result

		const direction = sort.order === 'asc' ? 1 : -1

		return result.sort((a, b) => {
			if (sort.by === 'vote_average') {
				return (a.vote_average - b.vote_average) * direction
			}
			return (
				(a.release_date ?? '').localeCompare(b.release_date ?? '') * direction
			)
		})
	}, [movies, minRating, sort])

	const handleFilter = (rate: number) => {
		setMinRating(prev => (prev === rate ? 0 : rate))
	}

	const handleSort = (e: ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target
		setSort(prev => ({
			...prev,
			[name]: value,
		}))
	}

	return (
		<section className='movie_list' id={type}>
			<header className='align_center movie_list_header'>
				<h2 className='align_center movie_list_heading'>
					{title} <img src={emoji} alt='emoji' className='navbar_emoji' />
				</h2>
				<div className='align_center movie_list_fs'>
					<FilterGroup
						minRating={minRating}
						onRatingClick={handleFilter}
						ratings={[8, 7, 6]}
					/>

					<select
						name='by'
						value={sort.by}
						onChange={handleSort}
						className='movie_sorting'
					>
						<option value='default'>SortBy</option>
						<option value='release_date'>Date</option>
						<option value='vote_average'>Rating</option>
					</select>

					<select
						name='order'
						value={sort.order}
						onChange={handleSort}
						className='movie_sorting'
					>
						<option value='asc'>Ascending</option>
						<option value='desc'>Descending</option>
					</select>
				</div>
			</header>

			{error ? (
				<p className='error_message'>{error}</p>
			) : isLoading ? (
				<Loader text='Loading Movies...' minHeight='50vh' />
			) : (
				<div className='movie_cards'>
					{sortedAndFilteredMovies.map(movie => (
						<MovieCard key={movie.id} movie={movie} />
					))}
				</div>
			)}
		</section>
	)
}

export default MovieList
