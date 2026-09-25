import { Link } from 'react-router-dom'
import Fire from '../../assets/fire.png'
import Star from '../../assets/glowing-star.png'
import Party from '../../assets/partying-face.png'
import DarkMode from '../DarkMode/DarkMode'
import './Navbar.css'

interface NavbarProps {
	activeTab: 'popular' | 'top_rated' | 'upcoming'
	setActiveTab: (tab: 'popular' | 'top_rated' | 'upcoming') => void
}

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
	return (
		<nav className='navbar align_center'>
			<Link to='/' className='navbar_logo'>
				<h1>MovieApp</h1>
			</Link>
			<div className='navbar_links align_center'>
				<DarkMode />
				<a
					href='#popular'
					className={activeTab === 'popular' ? 'active' : ''}
					onClick={() => setActiveTab('popular')}
				>
					Popular <img src={Fire} className='navbar_emoji' alt='fire' />
				</a>

				<a
					href='#top_rated'
					className={activeTab === 'top_rated' ? 'active' : ''}
					onClick={() => setActiveTab('top_rated')}
				>
					Top Rated <img src={Star} className='navbar_emoji' alt='star' />
				</a>

				<a
					href='#upcoming'
					className={activeTab === 'upcoming' ? 'active' : ''}
					onClick={() => setActiveTab('upcoming')}
				>
					Upcoming <img src={Party} className='navbar_emoji' alt='party' />
				</a>
			</div>
		</nav>
	)
}

export default Navbar
