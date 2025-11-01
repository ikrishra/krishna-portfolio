import { useState, useEffect, useRef } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isScrolling, setIsScrolling] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Loading effect
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    // Scroll detection
    let scrollTimeout: number
    
    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = window.setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  useEffect(() => {
    // Mouse movement effect for image - only on desktop and when not scrolling
    const handleMouseMove = (e: MouseEvent) => {
      if (imageRef.current && !isMobile && !isScrolling) {
        const rect = imageRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const deltaX = (e.clientX - centerX) / 20
        const deltaY = (e.clientY - centerY) / 20
        setMousePosition({ x: deltaX, y: deltaY })
      }
    }

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove)
    }
    
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, isScrolling])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-cyan-200 w-full min-h-screen flex items-center justify-center px-4 sm:px-5 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            {/* Profile Image with cursor effect */}
            <div className="mb-6 sm:mb-8 flex justify-center">
              <div 
                ref={imageRef}
                className={`w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 border-6 sm:border-8 border-black shadow-brutal bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                  isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{
                  transform: `translate(${isMobile || isScrolling ? 0 : mousePosition.x}px, ${isMobile || isScrolling ? 0 : mousePosition.y}px) scale(${isLoaded ? 1 : 0.95})`,
                  transition: isLoaded ? (isMobile || isScrolling ? 'transform 0.3s ease-out' : 'transform 0.1s ease-out') : 'all 0.5s ease-out'
                }}
              >
                <img 
                  src="/images/krishna.png" 
                  alt="Krishna Rathore" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className={`text-4xl sm:text-6xl md:text-8xl font-black tracking-tight hero-font mb-4 sm:mb-6 text-black transition-all duration-700 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Krishna Rathore
            </h1>
            <p className={`text-lg sm:text-2xl md:text-3xl hero-font text-black mb-6 sm:mb-8 px-4 transition-all duration-700 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Developer & Creator
              <br />
              I build cool stuff :)
            </p>
            <div className={`flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-4 transition-all duration-700 delay-600 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
               <Button
                buttonText="View Projects"
                color="lime"
                size="lg"
                rounded="md"
                onClick={() => {
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
              <Button
                buttonText="Contact Me"
                color="yellow"
                size="lg"
                rounded="md"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              />
             
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-lime-100 w-full py-12 sm:py-20 px-4 sm:px-5 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold hero-font mb-8 sm:mb-12 text-center">
            About Me
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card
              title="Who I Am"
              description="I'm Krishna Rathore, a passionate developer who loves creating innovative digital solutions. I enjoy working with modern technologies and building user-friendly applications."
              color="white"
            />
            <Card
              title="What I Do"
              description="I specialize in web development, creating beautiful and functional websites and applications. Currently building exciting projects that I'll be sharing soon!"
              color="yellow"
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="bg-pink-200 w-full py-12 sm:py-20 px-4 sm:px-5 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold hero-font mb-8 sm:mb-12 text-center">
            Projects
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Bolt Scraper Project */}
            <Card color="white" className="overflow-hidden">
              <div className="mb-4 sm:mb-6">
                <img 
                  src="/images/boltscraper.svg" 
                  alt="Bolt Scraper" 
                  className="w-full h-40 sm:h-48 object-contain border-4 border-black rounded-lg bg-gray-50"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold hero-font mb-3 sm:mb-4">Bolt Scraper</h3>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Advanced web scraping tools for B2B lead generation. Extract valuable business leads effortlessly with powerful scraping capabilities for Google Maps, Apollo.io, Facebook, Yellow Pages and more.
              </p>
              <Button
                buttonText="Visit Bolt Scraper"
                color="cyan"
                size="md"
                rounded="md"
                href="https://boltscraper.com/"
                className="w-full"
              />
            </Card>

            {/* Bojita Project */}
            <Card color="white" className="overflow-hidden">
              <div className="mb-4 sm:mb-6 flex justify-center">
                <img 
                  src="/images/bojita.svg" 
                  alt="Bojita" 
                  className="w-full h-40 sm:h-48 object-contain border-4 border-black rounded-lg bg-gray-50"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold hero-font mb-3 sm:mb-4">Bojita</h3>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Building Bojita - an innovative Mac app that's currently in development. Focused on creating powerful tools for Mac users with a beautiful, native experience.
              </p>
              <Button
                buttonText="Visit Bojita"
                color="lime"
                size="md"
                rounded="md"
                href="https://bojita.com"
                className="w-full"
              />
            </Card>

            {/* Responsive Viewer Chrome Extension */}
            <Card color="white" className="overflow-hidden">
              <div className="mb-4 sm:mb-6 flex justify-center">
                <img 
                  src="/images/Responsive.svg" 
                  alt="Responsive Viewer" 
                  className="w-full h-40 sm:h-48 object-contain border-4 border-black rounded-lg bg-gray-50"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold hero-font mb-3 sm:mb-4">Responsive Viewer</h3>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                A Chrome extension that helps developers and designers test webpage responsiveness across multiple device sizes with pre-configured presets and custom dimensions.
              </p>
              <Button
                buttonText="Get Extension"
                color="violet"
                size="md"
                rounded="md"
                href="https://chromewebstore.google.com/detail/responsive-viewer/idkjhjlkhcoagockknjpbkkakbcegifk"
                className="w-full"
              />
            </Card>

            {/* TransliDict Chrome Extension */}
            <Card color="white" className="overflow-hidden">
              <div className="mb-4 sm:mb-6 flex justify-center">
                <img 
                  src="/images/TransliDict.svg" 
                  alt="TransliDict" 
                  className="w-full h-40 sm:h-48 object-contain border-4 border-black rounded-lg bg-gray-50"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold hero-font mb-3 sm:mb-4">TransliDict</h3>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Instant word lookup and translation Chrome extension with multi-language support, transliteration detection, and native script display for 100+ languages.
              </p>
              <Button
                buttonText="Get Extension"
                color="orange"
                size="md"
                rounded="md"
                href="https://chromewebstore.google.com/detail/translidict-instant-word/ogdgpogickedbncjjbildpmjpdlbgfcd?authuser=0&hl=en"
                className="w-full"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Contact & Social Links Section */}
      <section id="contact" className="bg-violet-200 w-full py-12 sm:py-20 px-4 sm:px-5 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold hero-font mb-8 sm:mb-12 text-center">
            Let's Connect
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card color="white" className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 hero-font">Email</h3>
              <Button
                buttonText="ikrishra@gmail.com"
                color="cyan"
                size="md"
                rounded="md"
                href="mailto:ikrishra@gmail.com"
                className="w-full"
              />
            </Card>
            
            <Card color="white" className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 hero-font">Instagram</h3>
              <Button
                buttonText="@ikrishra"
                color="pink"
                size="md"
                rounded="md"
                href="https://instagram.com/ikrishra"
                className="w-full"
              />
            </Card>
            
            <Card color="white" className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 hero-font">X (Twitter)</h3>
              <Button
                buttonText="@ikrishra"
                color="red"
                size="md"
                rounded="md"
                href="https://x.com/ikrishra"
                className="w-full"
              />
            </Card>
            
            <Card color="white" className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-2 hero-font">YouTube</h3>
              <Button
                buttonText="@ikrishra"
                color="orange"
                size="md"
                rounded="md"
                href="https://youtube.com/@ikrishra"
                className="w-full"
              />
            </Card>
            
            <Card color="white" className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 hero-font">LinkedIn</h3>
              <Button
                buttonText="ikrishra"
                color="lime"
                size="md"
                rounded="md"
                href="https://linkedin.com/in/ikrishra"
                className="w-full"
              />
            </Card>
            
            <Card color="white" className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 hero-font">Get in Touch</h3>
              <Button
                buttonText="Say Hello!"
                color="yellow"
                size="md"
                rounded="md"
                href="mailto:hi@krishra.com"
                className="w-full"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-6 sm:py-8 px-2 sm:px-4">
        <div className="w-full text-center">
          <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] xl:text-[14rem] font-black tracking-tight hero-font text-white leading-none">
            Krishna Rathore
          </h1>
        </div>
      </footer>
    </div>
  )
}

export default Home