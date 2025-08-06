import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Phone, Instagram, MapPin, Clock } from 'lucide-react'

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to take the first step? Reach out to us through any of the following channels. 
            We're here to support you on your journey to better mental health.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Reach out to us directly for appointments and inquiries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <a 
                    href="mailto:psychnidhi@gmail.com" 
                    className="text-primary hover:underline"
                  >
                    psychnidhi@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a 
                    href="tel:+918355817895" 
                    className="text-primary hover:underline"
                  >
                    +918355817895
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
                <Instagram className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Instagram</p>
                  <a 
                    href="https://instagram.com/saathi_mindcarebynidhi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @saathi_mindcarebynidhi
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Office Hours & Location */}
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Office Hours
              </CardTitle>
              <CardDescription>
                When you can reach us for consultations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-accent/20">
                  <span className="font-medium">Monday - Friday</span>
                  <span className="text-primary">9:00 AM - 6:00 PM</span>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg bg-accent/20">
                  <span className="font-medium">Saturday</span>
                  <span className="text-primary">10:00 AM - 4:00 PM</span>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg bg-accent/20">
                  <span className="font-medium">Sunday</span>
                  <span className="text-muted-foreground">Closed</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/20">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    Online consultations available<br />
                    Serving clients nationwide
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-semibold mb-4">Ready to start your journey?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Book an appointment with Nidhi Raman and take the first step towards better mental health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <a href="/booking" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Book Appointment
                </a>
              </Button>
              <Button variant="outline" size="lg">
                <a href="mailto:psychnidhi@gmail.com" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Contact