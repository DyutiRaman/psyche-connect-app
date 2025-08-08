import { useState, useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { Navbar } from "@/components/Navbar"
import Index from "./pages/Index"
import Booking from "./pages/Booking"
import Contact from "./pages/Contact"
import AdminLoginPage from "./pages/AdminLogin"
import AdminDashboardPage from "./pages/AdminDashboard"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    setIsAuthenticated(!!token)  // Checks if a token string exists
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)  // Do NOT set localStorage here
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    setIsAuthenticated(false)
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/admin-login"
                element={<AdminLoginPage onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              />
              <Route
                path="/admin"
                element={
                  isAuthenticated ? (
                    <AdminDashboardPage onLogout={handleLogout} isAuthenticated={isAuthenticated} />
                  ) : (
                    <AdminLoginPage onLogin={handleLogin} isAuthenticated={isAuthenticated} />
                  )
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
