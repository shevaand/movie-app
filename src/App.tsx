import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Fire from './assets/fire.png'
import Star from './assets/glowing-star.png'
import Party from './assets/partying-face.png'
import MovieList from './components/MovieList/MovieList'
import Navbar from './components/Navbar/Navbar'
import MovieDetail from './pages/MovieDetail/MovieDetail'

type TabType = 'popular' | 'top_rated' | 'upcoming'

const App = () => {
	const [activeTab, setActiveTab] = useState<TabType>('popular')

	const getTabData = () => {
		switch (activeTab) {
			case 'popular':
				return { title: 'Popular', emoji: Fire }
			case 'top_rated':
				return { title: 'Top Rated', emoji: Star }
			case 'upcoming':
				return { title: 'Upcoming', emoji: Party }
		}
	}

	const { title, emoji } = getTabData()
	return (
		<BrowserRouter>
			<div className='app'>
				<Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

				<main>
					<Routes>
						<Route
							path='/'
							element={
								<MovieList type={activeTab} title={title} emoji={emoji} />
							}
						/>

						<Route path='/movie/:id' element={<MovieDetail />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	)
}

export default App
