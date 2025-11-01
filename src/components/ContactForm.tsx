import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://krishra-contact-form.boltscraper.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Sorry, there was an error sending your message. Please try again or email me directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border-black border-2 rounded-md shadow-brutal p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email Fields - Side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-black mb-2 hero-font">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 border-black rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-black transition-all duration-200 ${
                  errors.name ? 'border-red-500 bg-red-50' : 'hover:shadow-brutal focus:shadow-brutal'
                }`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-black mb-2 hero-font">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 border-black rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-black transition-all duration-200 ${
                  errors.email ? 'border-red-500 bg-red-50' : 'hover:shadow-brutal focus:shadow-brutal'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label htmlFor="subject" className="block text-sm font-bold text-black mb-2 hero-font">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 border-black rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-black transition-all duration-200 ${
                errors.subject ? 'border-red-500 bg-red-50' : 'hover:shadow-brutal focus:shadow-brutal'
              }`}
              placeholder="What's this about?"
            />
            {errors.subject && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.subject}</p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-bold text-black mb-2 hero-font">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 border-black rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-black transition-all duration-200 resize-none ${
                errors.message ? 'border-red-500 bg-red-50' : 'hover:shadow-brutal focus:shadow-brutal'
              }`}
              placeholder="Tell me about your project, idea, or just say hello!"
            />
            {errors.message && (
              <p className="mt-2 text-sm text-red-600 font-medium">{errors.message}</p>
            )}
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="p-4 bg-lime-200 border-2 border-black rounded-md shadow-brutal">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-black mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-black font-bold">{submitMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="p-4 bg-red-200 border-2 border-black rounded-md shadow-brutal">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-black mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-black font-bold">{submitMessage}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-4 text-lg font-bold border-2 border-black rounded-md transition-all duration-200 cursor-pointer inline-block text-center ${
                isSubmitting
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-violet-200 hover:bg-violet-300 active:bg-violet-400 hover:shadow-brutal'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;