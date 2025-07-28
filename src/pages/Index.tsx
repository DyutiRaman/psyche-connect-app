import { useState, useEffect } from 'react'
import { BookingForm } from '@/components/BookingForm'
import { AdminLogin } from '@/components/AdminLogin'
import { AdminDashboard } from '@/components/AdminDashboard'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Shield, Users } from 'lucide-react'

const Index = () => {
  const [view, setView] = useState<'home' | 'booking' | 'admin-login' | 'admin-dashboard'>('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true)
        setView('admin-dashboard')
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
      if (!session && view === 'admin-dashboard') {
        setView('home')
      }
    })

    return () => subscription.unsubscribe()
  }, [view])

  if (view === 'booking') {
    return <BookingForm />
  }

  if (view === 'admin-login') {
    return <AdminLogin onLogin={() => setView('admin-dashboard')} />
  }

  if (view === 'admin-dashboard' && isAuthenticated) {
    return <AdminDashboard onLogout={() => setView('home')} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Professional Psychology
              <span className="block text-primary">Practice</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Book your consultation with our licensed psychologist. We offer both video and voice sessions 
              to provide you with the support you need in a comfortable environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setView('booking')}
                className="text-lg px-8 py-6"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setView('admin-login')}
                className="text-lg px-8 py-6"
              >
                <Shield className="mr-2 h-5 w-5" />
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Practice?</h2>
            <p className="text-muted-foreground text-lg">
              We're committed to providing accessible, professional mental health support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Easy Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Book appointments online with our simple scheduling system. 
                  Choose your preferred time and session type.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Licensed Professional</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Work with our experienced, licensed psychologist who is 
                  dedicated to your mental health and wellbeing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Secure & Confidential</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Your privacy is our priority. All sessions are conducted 
                  with the highest level of confidentiality and security.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Take the first step towards better mental health. Book your consultation today.
          </p>
          <Button 
            size="lg" 
            onClick={() => setView('booking')}
            className="text-lg px-8 py-6"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Schedule Your Session
          </Button>
        </div>
      </section>
    </div>
  )
};

export default Index;
