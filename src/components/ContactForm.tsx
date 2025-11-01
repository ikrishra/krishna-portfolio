import { useState } from 'react'
import Button from './Button'
import Card from './Card'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Use absolute URL for production, relative for development
      const apiUrl = window.location.hostname === 'localhost' 
        ? '/functions/send-email' 
        : 'https://krishra.com/functions/send-email';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      console.error('Error sending email:', error)
      setSubmitStatus('error')
      setErrorMessage('Failed to send message. Please try again or contact me directly at ikrishra@gmail.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card color="white" className="max-w-2xl mx-auto">
      <h3 className="text-2xl sm:text-3xl font-bold hero-font mb-6 text-center">
        Send Me a Message
      </h3>
      
      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg">
          <p className="text-green-800 font-medium text-center">
            ✅ Message sent successfully! I'll get back to you soon.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg">
          <p className="text-red-800 font-medium text-center">
            ❌ {errorMessage}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-bold mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="your.email@example.com"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-bold mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
            placeholder="What's this about?"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-bold mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            className="w-full px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300 resize-vertical"
            placeholder="Tell me about your project, question, or just say hello!"
          />
        </div>
        
        <div className="pt-4">
          <Button
            buttonText={isSubmitting ? "Sending..." : "Send Message"}
            color="cyan"
            size="lg"
            rounded="md"
            disabled={isSubmitting}
            className="w-full"
          />
        </div>
      </form>
    </Card>
  )
}

export default ContactForm