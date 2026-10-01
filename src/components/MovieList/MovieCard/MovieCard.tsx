import { Link } from 'react-router-dom'
import Star from '../../../assets/star.png'
import type { Movie } from '../../../types'
import './MovieCard.css'

interface MovieCardProps {
	movie: Movie
}

const MovieCard = ({ movie }: MovieCardProps) => {
	const overview = movie.overview ?? ''

	return (
		<Link to={`/movie/${movie.id}`} className='movie_card'>
			{movie.poster_path ? (
				<img
					src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
					alt={movie.title}
					className='movie_poster'
				/>
			) : (
				<div className='movie_poster no_poster'>No poster</div>
			)}

			<div className='movie_details'>
				<h3 className='movie_details_heading'>{movie.title}</h3>
				<div className='align_center movie_date_rate'>
					<p>{movie.release_date}</p>
					<p>
						{movie.vote_average.toFixed(1)}{' '}
						<img src={Star} alt='rating icon' className='card_emoji' />
					</p>
				</div>
				<p className='movie_description'>
					{overview.length > 100 ? overview.slice(0, 100) + '...' : overview}
				</p>
			</div>
		</Link>
	)
}

export default MovieCard
