export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Parse the form data
    const formData = await request.json();
    const { name, email, subject, message } = formData;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'All fields are required' 
        }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Please enter a valid email address' 
        }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    const apiKey = env.MAIL_DIVER_API;
    const domain = env.MAIL_DIVER_DOMAIN;

    if (!apiKey || !domain) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service configuration error' 
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Email to Krishna (notification)
    const notificationEmail = {
      from: `Portfolio Contact <noreply@${domain}>`,
      to: 'ikrishra@gmail.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #6c757d;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px;">
            <p>This email was sent from your portfolio contact form at krishra.com</p>
          </div>
        </div>
      `,
      reply_to: email
    };

    // Auto-reply email to user
    const autoReplyEmail = {
      from: `Krishna Rathore <noreply@${domain}>`,
      to: email,
      subject: `Thank you for contacting me, ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Thank You for Your Message!
          </h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #495057;">
            Hi ${name},
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #495057;">
            Thank you for reaching out through my portfolio! I've received your message about 
            "<strong>${subject}</strong>" and I appreciate you taking the time to contact me.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #495057;">
              <strong>What happens next?</strong><br>
              I'll review your message and get back to you as soon as possible, typically within 24-48 hours. 
              If your inquiry is urgent, feel free to reach out to me directly at 
              <a href="mailto:ikrishra@gmail.com" style="color: #007bff;">ikrishra@gmail.com</a>.
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #495057;">
            In the meantime, feel free to check out my latest projects and connect with me on social media:
          </p>
          
          <div style="margin: 20px 0;">
            <a href="https://instagram.com/ikrishra" style="display: inline-block; margin: 5px 10px 5px 0; padding: 8px 16px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Instagram</a>
            <a href="https://x.com/ikrishra" style="display: inline-block; margin: 5px 10px 5px 0; padding: 8px 16px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Twitter</a>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #495057;">
            Best regards,<br>
            <strong>Krishna Rathore</strong><br>
            <em>Full Stack Developer & Chrome Extension Specialist</em>
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px;">
            <p>This is an automated response. Please do not reply to this email directly.</p>
          </div>
        </div>
      `
    };

    // Send both emails
    const [notificationResponse, autoReplyResponse] = await Promise.all([
      // Send notification to Krishna
      fetch('https://api.maildiver.com/v1/email/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationEmail),
      }),
      
      // Send auto-reply to user
      fetch('https://api.maildiver.com/v1/email/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(autoReplyEmail),
      })
    ]);

    // Check if both emails were sent successfully
    if (!notificationResponse.ok || !autoReplyResponse.ok) {
      console.error('Email sending failed:', {
        notification: notificationResponse.status,
        autoReply: autoReplyResponse.status
      });
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send email. Please try again later.' 
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for your message! I\'ll get back to you soon.' 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
}

// Handle OPTIONS request for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}