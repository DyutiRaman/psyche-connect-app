import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  name: string;
  email: string;
  preferredTime: string;
  callType: string;
  meetingLink?: string;
  type: 'confirmation' | 'reminder';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, preferredTime, callType, meetingLink, type }: BookingEmailRequest = await req.json();

    const isConfirmation = type === 'confirmation';
    const subject = isConfirmation 
      ? "Booking Confirmation - Saathi Mindcare" 
      : "Appointment Reminder - Saathi Mindcare";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fef7f2;">
        <div style="background: linear-gradient(135deg, #d97706, #ea580c); padding: 30px; border-radius: 15px; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; text-align: center; font-size: 28px;">Saathi Mindcare</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; text-align: center; font-size: 16px;">
            Dr. Nidhi Raman - Licensed Clinical Psychologist
          </p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 15px; border: 1px solid #fed7aa; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #ea580c; margin-top: 0;">
            ${isConfirmation ? 'Your Appointment is Confirmed!' : 'Upcoming Appointment Reminder'}
          </h2>
          
          <p style="color: #78716c; font-size: 16px; line-height: 1.6;">
            Dear ${name},
          </p>
          
          <p style="color: #78716c; font-size: 16px; line-height: 1.6;">
            ${isConfirmation 
              ? 'Thank you for booking your session with Dr. Nidhi Raman. Your appointment has been confirmed for:'
              : 'This is a friendly reminder about your upcoming appointment with Dr. Nidhi Raman:'
            }
          </p>
          
          <div style="background: #fef7f2; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ea580c;">
            <p style="margin: 0; color: #78716c;"><strong>Date & Time:</strong> ${new Date(preferredTime).toLocaleString()}</p>
            <p style="margin: 10px 0 0 0; color: #78716c;"><strong>Session Type:</strong> ${callType.charAt(0).toUpperCase() + callType.slice(1)} Call</p>
            ${meetingLink ? `<p style="margin: 10px 0 0 0; color: #78716c;"><strong>Meeting Link:</strong> <a href="${meetingLink}" style="color: #ea580c;">${meetingLink}</a></p>` : ''}
          </div>
          
          ${isConfirmation ? `
            <p style="color: #78716c; font-size: 16px; line-height: 1.6;">
              We're looking forward to supporting you on your healing journey. If you need to reschedule or have any questions, please don't hesitate to reach out.
            </p>
            
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>Preparation Tips:</strong><br>
                • Find a quiet, private space for your session<br>
                • Test your internet connection and audio/video<br>
                • Have a glass of water nearby<br>
                • Take a few deep breaths before we begin
              </p>
            </div>
          ` : `
            <p style="color: #78716c; font-size: 16px; line-height: 1.6;">
              We're looking forward to seeing you soon. Please ensure you're in a quiet, private space for our session.
            </p>
          `}
          
          <p style="color: #78716c; font-size: 16px; line-height: 1.6;">
            Warm regards,<br>
            <strong>Dr. Nidhi Raman</strong><br>
            <em>Saathi Mindcare</em>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #a8a29e; font-size: 12px;">
          <p>This email was sent from Saathi Mindcare. If you have any questions, please contact us.</p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Dr. Nidhi Raman - Saathi Mindcare <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);