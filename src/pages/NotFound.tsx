import { Link } from 'react-router-dom'
import Button from '../components/Button'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-lime-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold hero-font text-gray-800 mb-4">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold hero-font text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Oops! The page you're looking for seems to have wandered off. 
            Let's get you back on track.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button
              buttonText="← Go Home"
              color="violet"
              size="lg"
              rounded="md"
            />
          </Link>
          <Link to="/projects">
            <Button
              buttonText="View Projects"
              color="lime"
              size="lg"
              rounded="md"
            />
          </Link>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            If you believe this is an error, feel free to reach out.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound