import './Loader.css'

interface LoaderProps {
	text?: string
	minHeight?: string
}

const Loader = ({ text = 'Loading...', minHeight = '100vh' }: LoaderProps) => {
	return (
		<div className='loader_container' style={{ minHeight }}>
			<div className='loading_spinner'></div>
			<p className='loader_text'>{text}</p>
		</div>
	)
}

export default Loader
