import { useState } from 'react'
import { BookingForm } from '@/components/BookingForm'
import { AdminLogin } from '@/components/AdminLogin'
import { AdminDashboard } from '@/components/AdminDashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Shield, Heart, Star } from 'lucide-react'

import NidhiPhoto from '@/assets/nidhi-raman.jpg'
import warmForestLights from '@/assets/warm-forest-lights.jpg'

const Index = () => {
  const [view, setView] = useState<'home' | 'booking' | 'admin-login' | 'admin-dashboard'>('home')
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminToken') === 'true'
  })

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    setView('home')
  }

  if (view === 'booking') return <BookingForm />
  if (view === 'admin-login') return <AdminLogin onLogin={() => { setIsAuthenticated(true); setView('admin-dashboard') }} />
  if (view === 'admin-dashboard' && isAuthenticated) return <AdminDashboard onLogout={handleLogout} />

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{ backgroundImage: `url(${warmForestLights})`, filter: 'sepia(30%) saturate(120%) hue-rotate(-10deg)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/95"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/50 border border-primary/20 mb-4">
                  <Heart className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">Saathi Mindcare</span>
                </div>
                <h2 className="text-2xl font-semibold text-primary mb-2">Nidhi Raman</h2>
                <p className="text-muted-foreground">Consulting Psychologist, MSc in Clinical Psychology • 3+ Years Experience</p>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
                A Safe Space for
                <span className="block bg-gradient-to-r from-primary via-primary to-accent-foreground bg-clip-text text-transparent">
                  Your Healing Journey
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
                Experience gentle, evidence-based therapy in a warm and welcoming environment. Together, we'll navigate life's challenges and unlock your inner strength.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <button onClick={() => setView('booking')} className="inline-flex items-center justify-center text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all duration-500 group rounded-md font-medium text-primary-foreground" style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-warm)' }}>
                  <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Begin Your Journey
                </button>
                <button onClick={() => setView('admin-login')} className="inline-flex items-center justify-center text-lg px-10 py-6 border-2 border-primary/30 hover:border-primary/50 bg-background/60 backdrop-blur-sm transition-all duration-500 rounded-md font-medium">
                  <Shield className="mr-2 h-5 w-5" />
                  Admin Portal
                </button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: 'var(--shadow-cozy)' }}>
                  <img src={NidhiPhoto} alt="Nidhi Raman - Licensed Clinical Psychologist" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-primary/10 backdrop-blur-sm rounded-2xl p-4 border border-primary/20">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-primary font-medium mt-1">Trusted by 100+ clients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How We Support Your Journey</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Discover personalized approaches designed to meet you exactly where you are</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 hover:shadow-xl transition-all duration-500 bg-card/70 backdrop-blur-sm group" style={{ boxShadow: 'var(--shadow-soft)' }}>
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110" style={{ background: 'var(--gradient-soft)' }}>
                  <Calendar className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">Flexible Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">Choose between in-person, video, or phone sessions that work with your schedule. Your comfort and convenience are always prioritized.</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-0 hover:shadow-xl transition-all duration-500 bg-card/70 backdrop-blur-sm group" style={{ boxShadow: 'var(--shadow-soft)' }}>
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110" style={{ background: 'var(--gradient-soft)' }}>
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">Compassionate Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">Experience therapy rooted in empathy, understanding, and genuine care. Every session is a judgment-free space for authentic healing.</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-0 hover:shadow-xl transition-all duration-500 bg-card/70 backdrop-blur-sm group" style={{ boxShadow: 'var(--shadow-soft)' }}>
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110" style={{ background: 'var(--gradient-soft)' }}>
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">Complete Confidentiality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">Your privacy is sacred. All communications are protected by strict confidentiality standards and secure, HIPAA-compliant technology.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-8" style={{ backgroundImage: `url(${warmForestLights})`, filter: 'sepia(50%) saturate(130%) hue-rotate(-15deg) brightness(1.1)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background/90 to-primary/10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Take the First Step Today</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">Your journey toward healing and growth begins with a single step. Let's walk this path together, at your pace, with compassion and understanding.</p>
          <button onClick={() => setView('booking')} className="inline-flex items-center justify-center text-lg px-12 py-6 hover:shadow-2xl transition-all duration-500 group rounded-md font-medium text-primary-foreground" style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-warm)' }}>
            <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Schedule Your First Session
          </button>
        </div>
      </section>
    </div>
  )
}

export default Index;
