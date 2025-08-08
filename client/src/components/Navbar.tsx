import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Heart } from 'lucide-react'

interface NavbarProps {
  isAuthenticated?: boolean
  onLogout?: () => void
}

export const Navbar = ({ isAuthenticated, onLogout }: NavbarProps) => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    onLogout?.()
  }

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Book Appointment', path: '/booking' },
    { name: 'Contact', path: '/contact' },
    ...(!isAuthenticated ? [{ name: 'Admin Login', path: '/admin-login' }] : []),
    ...(isAuthenticated ? [{ name: 'Admin Dashboard', path: '/admin' }] : [])
  ]

  const NavLink = ({ item, onClick }: { item: { name: string; path: string }, onClick?: () => void }) => (
    <Link
      to={item.path}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
        location.pathname === item.path
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground'
      }`}
    >
      {item.name}
    </Link>
  )

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Saathi Mindcare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
            {isAuthenticated && (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <NavLink key={item.path} item={item} onClick={() => setIsOpen(false)} />
                  ))}
                  {isAuthenticated && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="w-full"
                    >
                      Logout
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
