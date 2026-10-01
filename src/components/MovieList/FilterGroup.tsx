interface FilterGroupProps {
	minRating: number
	onRatingClick: (rate: number) => void
	ratings: number[]
}

const FilterGroup = ({
	minRating,
	onRatingClick,
	ratings,
}: FilterGroupProps) => {
	return (
		<ul className='align_center movie_filter'>
			{ratings.map(rate => (
				<li
					key={rate}
					role='button'
					tabIndex={0}
					aria-pressed={minRating === rate}
					className={
						minRating === rate
							? 'movie_filter_item active'
							: 'movie_filter_item'
					}
					onClick={() => onRatingClick(rate)}
					onKeyDown={e => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault()
							onRatingClick(rate)
						}
					}}
				>
					{rate}+ Star
				</li>
			))}
		</ul>
	)
}

export default FilterGroup
