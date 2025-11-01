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
      // Send email to ikrishra@gmail.com
      const adminEmailResponse = await fetch('https://api.maildiver.com/v1/email/send', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer v1_SN4M5tmp14jTFKQkO6PYPTFiT0KFj2hqtuL7zEvo',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'noreply@mail.krishra.com',
          to: 'ikrishra@gmail.com',
          subject: `New Contact Form Submission: ${formData.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Subject:</strong> ${formData.subject}</p>
              </div>
              <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
                <h3 style="color: #495057; margin-top: 0;">Message:</h3>
                <p style="line-height: 1.6; color: #6c757d;">${formData.message.replace(/\n/g, '<br>')}</p>
              </div>
              <div style="margin-top: 20px; padding: 15px; background-color: #e7f3ff; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #0066cc;">
                  <strong>Reply to:</strong> ${formData.email}
                </p>
              </div>
            </div>
          `,
          reply_to: formData.email
        })
      })

      if (!adminEmailResponse.ok) {
        throw new Error('Failed to send admin notification')
      }

      // Send confirmation email to user
      const userEmailResponse = await fetch('https://api.maildiver.com/v1/email/send', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer v1_SN4M5tmp14jTFKQkO6PYPTFiT0KFj2hqtuL7zEvo',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Krishna Rathore <noreply@mail.krishra.com>',
          to: formData.email,
          subject: 'Thank you for contacting me!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
                Thank You for Reaching Out!
              </h2>
              <p style="font-size: 16px; line-height: 1.6; color: #495057;">
                Hi ${formData.name},
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #495057;">
                Thank you for contacting me through my portfolio website. I've received your message about "<strong>${formData.subject}</strong>" and I'll get back to you as soon as possible.
              </p>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #495057; margin-top: 0;">Your Message:</h3>
                <p style="line-height: 1.6; color: #6c757d; font-style: italic;">"${formData.message}"</p>
              </div>
              <p style="font-size: 16px; line-height: 1.6; color: #495057;">
                I typically respond within 24-48 hours. In the meantime, feel free to check out my other projects and connect with me on social media.
              </p>
              <div style="margin-top: 30px; padding: 20px; background-color: #e7f3ff; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #0066cc;">
                  <strong>Best regards,</strong><br>
                  Krishna Rathore<br>
                  <a href="mailto:ikrishra@gmail.com" style="color: #0066cc;">ikrishra@gmail.com</a>
                </p>
              </div>
            </div>
          `
        })
      })

      if (!userEmailResponse.ok) {
        console.warn('Failed to send user confirmation email')
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