// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }

    // Send email to admin
    const adminEmailResponse = await fetch('https://api.maildiver.com/v1/email/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.MAIL_DIVER_API}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `noreply@${env.MAIL_DIVER_DOMAIN}`,
        to: 'ikrishra@gmail.com',
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
              <h3 style="color: #495057; margin-top: 0;">Message:</h3>
              <p style="line-height: 1.6; color: #6c757d;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background-color: #e7f3ff; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #0066cc;">
                <strong>Reply to:</strong> ${email}
              </p>
            </div>
          </div>
        `,
        reply_to: email
      })
    });

    if (!adminEmailResponse.ok) {
      throw new Error('Failed to send admin notification');
    }

    // Send confirmation email to user
    const userEmailResponse = await fetch('https://api.maildiver.com/v1/email/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.MAIL_DIVER_API}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Krishna Rathore <noreply@${env.MAIL_DIVER_DOMAIN}>`,
        to: email,
        subject: 'Thank you for contacting me!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
              Thank You for Reaching Out!
            </h2>
            <p style="font-size: 16px; line-height: 1.6; color: #495057;">
              Hi ${name},
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #495057;">
              Thank you for contacting me through my portfolio website. I've received your message about "<strong>${subject}</strong>" and I'll get back to you as soon as possible.
            </p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #495057; margin-top: 0;">Your Message:</h3>
              <p style="line-height: 1.6; color: #6c757d; font-style: italic;">"${message}"</p>
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
    });

    if (!userEmailResponse.ok) {
      console.warn('Failed to send user confirmation email');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
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