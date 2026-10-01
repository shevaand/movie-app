import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loader from '../../components/Loader/Loader'
import './MovieDetail.css'

interface Genre {
	id: number
	name: string
}

interface Actor {
	id: number
	name: string
	character: string
	profile_path: string | null
}

interface Video {
	key: string
	site: string
	type: string
}

interface MovieDetailState {
	title: string
	overview: string
	poster_path: string | null
	budget: number
	backdrop_path: string | null
	release_date: string
	vote_average: number
	runtime: number
	genres: Genre[]
	credits: {
		cast: Actor[]
	}
	videos: {
		results: Video[]
	}
}

const MovieDetail = () => {
	const { id } = useParams<{ id: string }>()
	const [movie, setMovie] = useState<MovieDetailState | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const controller = new AbortController()

		const fetchMovieData = async () => {
			try {
				setMovie(null)
				setError(null)

				const response = await fetch(
					`https://api.themoviedb.org/3/movie/${id}?api_key=${
						import.meta.env.VITE_TMDB_API_KEY
					}&append_to_response=credits,videos`,
					{ signal: controller.signal }
				)

				if (!response.ok) {
					throw new Error(`Request failed with status ${response.status}`)
				}

				const data = await response.json()
				setMovie(data)
			} catch (err) {
				if (err instanceof DOMException && err.name === 'AbortError') return
				console.error('Failed to load movie:', err)
				setError('Could not load this movie. Please try again later.')
			}
		}

		fetchMovieData()

		return () => controller.abort()
	}, [id])

	if (error) {
		return (
			<div className='detail_container'>
				<Link to='/' className='back_btn'>
					← Back to Home
				</Link>
				<p className='error_message'>{error}</p>
			</div>
		)
	}

	if (!movie) return <Loader text='Loading Movie...' minHeight='100vh' />

	const hours = Math.floor(movie.runtime / 60)
	const minutes = movie.runtime % 60

	const trailer = movie.videos?.results?.find(
		video => video.type === 'Trailer' && video.site === 'YouTube'
	)

	return (
		<div
			className='movie_detail_page'
			style={{
				backgroundImage: movie.backdrop_path
					? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
					: 'none',
			}}
		>
			<div className='backdrop_overlay'>
				<div className='detail_container'>
					<Link to='/' className='back_btn'>
						← Back to Home
					</Link>

					<div className='detail_content'>
						<div className='detail_poster_wrapper'>
							{movie.poster_path ? (
								<img
									className='detail_poster'
									src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
									alt={movie.title}
								/>
							) : (
								<div className='detail_poster no_poster'>No poster</div>
							)}
						</div>

						<div className='detail_info'>
							<h1 className='detail_title'>{movie.title}</h1>

							<div className='detail_meta'>
								<span className='detail_badge release_year'>
									{movie.release_date
										? movie.release_date.substring(0, 4)
										: 'N/A'}
								</span>
								<span className='detail_badge rating'>
									★ {movie.vote_average.toFixed(1)}
								</span>
								{movie.runtime > 0 && (
									<span className='detail_badge runtime'>
										⏱ {hours}h {minutes}m
									</span>
								)}
								{movie.budget > 0 && (
									<p>
										<strong>Budget:</strong> ${movie.budget.toLocaleString()}
									</p>
								)}
							</div>

							<div className='detail_genres'>
								{movie.genres?.map(genre => (
									<span key={genre.id} className='genre_item'>
										<p>{genre.name}</p>
									</span>
								))}
							</div>

							<h3 className='detail_tagline'>Overview</h3>
							<p className='detail_overview'>
								{movie.overview || 'No overview available.'}
							</p>
						</div>
					</div>

					{movie.credits?.cast?.length > 0 && (
						<div className='detail_section'>
							<h3 className='section_title'>Top Cast</h3>
							<div className='cast_grid'>
								{movie.credits.cast.slice(0, 5).map(actor => (
									<div key={actor.id} className='cast_card'>
										{actor.profile_path ? (
											<img
												src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
												alt={actor.name}
												className='cast_photo'
											/>
										) : (
											<div className='cast_photo no_photo'>No photo</div>
										)}
										<p className='cast_name'>{actor.name}</p>
										<p className='cast_character'>{actor.character}</p>
									</div>
								))}
							</div>
						</div>
					)}

					{trailer && (
						<div className='detail_section'>
							<h3 className='section_title'>Official Trailer</h3>
							<div className='trailer_wrapper'>
								<iframe
									src={`https://www.youtube.com/embed/${trailer.key}`}
									title='YouTube video player'
									allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
									allowFullScreen
									className='trailer_iframe'
								></iframe>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default MovieDetail
