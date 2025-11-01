import { useState } from 'react'
import Button from './Button'
import Card from './Card'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
}

const ContactForm = ({ isOpen, onClose }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
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

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage('Name is required')
      return false
    }
    if (!formData.email.trim()) {
      setErrorMessage('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address')
      return false
    }
    if (!formData.subject.trim()) {
      setErrorMessage('Subject is required')
      return false
    }
    if (!formData.message.trim()) {
      setErrorMessage('Message is required')
      return false
    }
    return true
  }

  const sendEmail = async () => {
    try {
      const response = await fetch('https://api.maildiver.com/v1/email/send', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer v1_SN4M5tmp14jTFKQkO6PYPTFiT0KFj2hqtuL7zEvo',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `"${formData.name}" <noreply@mail.krishra.com>`,
          to: 'ikrishra@gmail.com',
          reply_to: formData.email,
          subject: `Portfolio Contact: ${formData.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Subject:</strong> ${formData.subject}</p>
              </div>
              <div style="margin: 20px 0;">
                <h3 style="color: #333;">Message:</h3>
                <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #007bff; border-radius: 3px;">
                  ${formData.message.replace(/\n/g, '<br>')}
                </div>
              </div>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 12px;">
                This message was sent from your portfolio contact form at krishra.com
              </p>
            </div>
          `,
          text: `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}

---
This message was sent from your portfolio contact form.
          `
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Email sent successfully:', result)
      return true
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }

  const sendAutoReply = async () => {
    try {
      const response = await fetch('https://api.maildiver.com/v1/email/send', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer v1_SN4M5tmp14jTFKQkO6PYPTFiT0KFj2hqtuL7zEvo',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: '"Krishna Rathore" <noreply@mail.krishra.com>',
          to: formData.email,
          subject: 'Thank you for contacting me!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                Thank You for Your Message!
              </h2>
              <p>Hi ${formData.name},</p>
              <p>Thank you for reaching out through my portfolio contact form. I've received your message about "<strong>${formData.subject}</strong>" and I appreciate you taking the time to contact me.</p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
                <p><strong>Subject:</strong> ${formData.subject}</p>
                <p><strong>Message:</strong></p>
                <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #007bff; border-radius: 3px;">
                  ${formData.message.replace(/\n/g, '<br>')}
                </div>
              </div>

              <p>I'll review your message and get back to you as soon as possible, typically within 24-48 hours.</p>
              
              <p>In the meantime, feel free to:</p>
              <ul>
                <li>Check out my projects on my <a href="https://krishra.com" style="color: #007bff;">portfolio</a></li>
                <li>Connect with me on <a href="https://instagram.com/ikrishra" style="color: #007bff;">Instagram</a> or <a href="https://x.com/ikrishra" style="color: #007bff;">X (Twitter)</a></li>
                <li>Explore my Chrome extensions on the <a href="https://chromewebstore.google.com/search/krishna%20rathore" style="color: #007bff;">Chrome Web Store</a></li>
              </ul>

              <p>Best regards,<br>
              <strong>Krishna Rathore</strong><br>
              <em>Full Stack Developer & Chrome Extension Creator</em></p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 12px;">
                This is an automated response. Please do not reply to this email directly.
              </p>
            </div>
          `,
          text: `
Hi ${formData.name},

Thank you for reaching out through my portfolio contact form. I've received your message about "${formData.subject}" and I appreciate you taking the time to contact me.

Your Message Summary:
Subject: ${formData.subject}
Message: ${formData.message}

I'll review your message and get back to you as soon as possible, typically within 24-48 hours.

In the meantime, feel free to:
- Check out my projects on my portfolio: https://krishra.com
- Connect with me on Instagram (@ikrishra) or X (@ikrishra)
- Explore my Chrome extensions on the Chrome Web Store

Best regards,
Krishna Rathore
Full Stack Developer & Chrome Extension Creator

---
This is an automated response. Please do not reply to this email directly.
          `
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Auto-reply sent successfully:', result)
      return true
    } catch (error) {
      console.error('Error sending auto-reply:', error)
      // Don't throw here as auto-reply failure shouldn't fail the main submission
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Send main email to you
      await sendEmail()
      
      // Send auto-reply to user (don't fail if this fails)
      await sendAutoReply()
      
      setSubmitStatus('success')
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
        setSubmitStatus('idle')
        onClose()
      }, 2000)
      
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Failed to send message. Please try again or contact me directly at ikrishra@gmail.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card color="white" className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
          
          <h2 className="text-2xl sm:text-3xl font-bold hero-font mb-6">Get In Touch</h2>
          
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 border-2 border-green-300 rounded-lg">
              <p className="text-green-800 font-semibold">✅ Message sent successfully!</p>
              <p className="text-green-700 text-sm mt-1">Thank you for reaching out. I'll get back to you soon!</p>
            </div>
          )}
          
          {submitStatus === 'error' && errorMessage && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-red-300 rounded-lg">
              <p className="text-red-800 font-semibold">❌ Error</p>
              <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
                placeholder="What's this about?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full p-3 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-300 resize-vertical"
                placeholder="Tell me about your project, question, or just say hello!"
                required
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                buttonText={isSubmitting ? "Sending..." : "Send Message"}
                color="cyan"
                size="md"
                rounded="md"
                disabled={isSubmitting}
                className="flex-1"
              />
              <Button
                buttonText="Cancel"
                color="red"
                size="md"
                rounded="md"
                onClick={onClose}
                className="flex-1"
              />
            </div>
          </form>
          
          <div className="mt-6 pt-4 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Or reach me directly at{' '}
              <a href="mailto:ikrishra@gmail.com" className="text-cyan-600 hover:text-cyan-800 font-semibold">
                ikrishra@gmail.com
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ContactForm