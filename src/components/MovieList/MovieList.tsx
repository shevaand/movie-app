import _ from 'lodash'
import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import Loader from '../Loader/Loader'
import FilterGroup from './FilterGroup'
import MovieCard from './MovieCard/MovieCard'
import './MovieList.css'

interface Movie {
	id: number
	title: string
	poster_path: string
	vote_average: number
	release_date: string
	overview: string
}

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

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				setIsLoading(true)
				const response = await fetch(
					`https://api.themoviedb.org/3/movie/${type}?api_key=${
						import.meta.env.VITE_TMDB_API_KEY
					}`
				)
				const data = await response.json()
				const results = data.results as Movie[]

				setMovies(results)
			} catch (error) {
				console.error('Error to upload', error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchMovies()
	}, [type])

	const sortedAndFilteredMovies = useMemo(() => {
		let result = movies.filter(movie => movie.vote_average >= minRating)

		if (sort.by !== 'default') {
			result = _.orderBy(result, [sort.by], [sort.order])
		}

		return result
	}, [movies, minRating, sort])

	const handleFilter = (rate: number) => {
		if (rate === minRating) {
			setMinRating(0)
		} else {
			setMinRating(rate)
		}
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

			{isLoading ? (
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
