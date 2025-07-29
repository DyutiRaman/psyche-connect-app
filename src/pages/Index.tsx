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
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 relative">
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-lg font-medium text-primary mb-2">Dr. Nidhi Raman</h2>
              <p className="text-sm text-muted-foreground">Licensed Clinical Psychologist</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
              Transform Your Mind,
              <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Transform Your Life
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Professional psychological support through secure video and voice sessions. 
              Take the first step towards better mental health in a safe, confidential environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => setView('booking')}
                className="text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ 
                  background: 'var(--gradient-primary)',
                  boxShadow: 'var(--shadow-elegant)' 
                }}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Session
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setView('admin-login')}
                className="text-lg px-10 py-6 border-2 border-primary/20 hover:border-primary/40 bg-background/50 backdrop-blur-sm transition-all duration-300"
              >
                <Shield className="mr-2 h-5 w-5" />
                Admin Portal
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Dr. Nidhi Raman?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience compassionate, evidence-based therapy tailored to your unique needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-soft)' }}>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Flexible Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Book appointments that fit your schedule with our intuitive online system. 
                  Choose between video or voice sessions based on your comfort level.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-soft)' }}>
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Expert Care</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Dr. Nidhi Raman brings years of experience in clinical psychology, 
                  specializing in evidence-based therapeutic approaches.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-soft)' }}>
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Complete Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Your confidentiality is paramount. All sessions are conducted 
                  through secure, HIPAA-compliant platforms ensuring your privacy.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-soft)' }}></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Taking the first step is often the hardest. Let Dr. Nidhi Raman guide you towards 
            improved mental wellness and personal growth.
          </p>
          <Button 
            size="lg" 
            onClick={() => setView('booking')}
            className="text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ 
              background: 'var(--gradient-primary)',
              boxShadow: 'var(--shadow-elegant)' 
            }}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book Your First Session
          </Button>
        </div>
      </section>
    </div>
  )
};

export default Index;
