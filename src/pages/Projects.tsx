import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'

type ProjectColor = "violet" | "pink" | "red" | "orange" | "yellow" | "lime" | "cyan"

interface Project {
  id: number
  title: string
  description: string
  image: string
  buttonText: string
  href: string
  color: ProjectColor
}

const Projects = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: "Bolt Scraper",
      description: "Advanced web scraping tools for B2B lead generation. Extract valuable business leads effortlessly with powerful scraping capabilities for Google Maps, Apollo.io, Facebook, Yellow Pages.",
      image: "/images/1.webp",
      buttonText: "Visit Bolt Scraper",
      href: "https://boltscraper.com/",
      color: "cyan"
    },
    {
      id: 2,
      title: "Bojita",
      description: "Bojita is a suite of powerfull Chrome extensions designed to boost productivity and enhance browsing. Built with beautiful design, high performance, and privacy‑first principles.",
      image: "/images/2.webp",
      buttonText: "Visit Bojita",
      href: "https://bojita.com",
      color: "lime"
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Projects Content */}
      <section className="bg-pink-200 w-full py-12 sm:py-20 px-4 sm:px-5 md:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold hero-font mb-6 text-gray-800">
              All Projects
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Explore my complete collection of web applications, Chrome extensions, and tools
              that I've built to solve real-world problems and enhance user experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {projects.map((project) => (
              <Card key={project.id} color="white" className="overflow-hidden">
                <div className="mb-4 sm:mb-6">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-50 sm:h-58 object-contain border-4 border-black rounded-lg bg-gray-50"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold hero-font mb-3 sm:mb-4">
                  {project.title}
                </h3>
                <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                  {project.description}
                </p>
                <Button
                  buttonText={project.buttonText}
                  color={project.color}
                  size="md"
                  rounded="md"
                  href={project.href}
                  className="w-full"
                />
              </Card>
            ))}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-12 sm:mt-16">
            <Link to="/">
              <Button
                buttonText="← Back to Home"
                color="violet"
                size="lg"
                rounded="md"
              />
            </Link>
          </div>
        </div>
      </section>


    </div>
  )
}

export default Projects