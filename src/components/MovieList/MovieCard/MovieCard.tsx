import { Link } from 'react-router-dom'
import Star from '../../../assets/star.png'
import './MovieCard.css'

interface Movie {
	id: number
	title: string
	poster_path: string
	vote_average: number
	release_date: string
	overview: string
}

interface MovieCardProps {
	movie: Movie
}

const MovieCard = ({ movie }: MovieCardProps) => {
	return (
		<Link to={`/movie/${movie.id}`} className='movie_card'>
			<img
				src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
				alt={movie.title}
				className='movie_poster'
			/>

			<div className='movie_details'>
				<h3 className='movie_details_heading'>{movie.title}</h3>
				<div className='align_center movie_date_rate'>
					<p>{movie.release_date}</p>
					<p>
						{movie.vote_average}{' '}
						<img src={Star} alt='rating icon' className='card_emoji' />
					</p>
				</div>
				<p className='movie_description'>
					{movie.overview.length > 100
						? movie.overview.slice(0, 100) + '...'
						: movie.overview}
				</p>
			</div>
		</Link>
	)
}

export default MovieCard
