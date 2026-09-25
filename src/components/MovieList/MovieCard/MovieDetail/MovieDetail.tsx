import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loader from '../../../Loader/Loader'
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
	poster_path: string
	budget: string
	backdrop_path: string
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

	useEffect(() => {
		const fetchMovieData = async () => {
			try {
				const response = await fetch(
					`https://api.themoviedb.org/3/movie/${id}?api_key=${
						import.meta.env.VITE_TMDB_API_KEY
					}&append_to_response=credits,videos`
				)
				const data = await response.json()
				setMovie(data)
				console.log(data)
			} catch (error) {
				console.error('Error to upload Film:', error)
			}
		}

		fetchMovieData()
	}, [id])

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
							<img
								className='detail_poster'
								src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
								alt={movie.title}
							/>
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
								<span className='detail_badge runtime'>
									⏱ {hours}h {minutes}m
								</span>
								<p>
									<strong>Budget:</strong> ${movie.budget.toLocaleString()}
								</p>
							</div>

							<div className='detail_genres'>
								{movie.genres?.map(genre => (
									<span key={genre.id} className='genre_item'>
										<p>{genre.name}</p>
									</span>
								))}
							</div>

							<h3 className='detail_tagline'>Overview</h3>
							<p className='detail_overview'>{movie.overview}</p>
						</div>
					</div>

					{movie.credits?.cast?.length > 0 && (
						<div className='detail_section'>
							<h3 className='section_title'>Top Cast</h3>
							<div className='cast_grid'>
								{movie.credits.cast.slice(0, 5).map(actor => (
									<div key={actor.id} className='cast_card'>
										<img
											src={
												actor.profile_path
													? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
													: 'https://via.placeholder.com/185x278?text=No+Photo'
											}
											alt={actor.name}
											className='cast_photo'
										/>
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
									frameBorder='0'
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
