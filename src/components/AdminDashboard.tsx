import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { supabase } from '@/integrations/supabase/client'

type Booking = {
  id?: string
  name: string
  email: string
  phone: string
  preferred_time: string
  call_type: 'video' | 'voice'
  status: 'pending' | 'confirmed' | 'cancelled'
  case_sheet_url?: string | null
  created_at?: string
}
import { useToast } from '@/hooks/use-toast'
import { LogOut, Calendar, Phone, Video, Users, Mail, Link, Upload, FileText, Download, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface AdminDashboardProps {
  onLogout: () => void
}

export const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [meetingLink, setMeetingLink] = useState('')
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data as Booking[] || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      setBookings(prev => 
        prev.map(booking => 
          booking.id === id ? { ...booking, status } : booking
        )
      )

      toast({
        title: "Success!",
        description: `Booking ${status} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive"
      })
    }
  }

  const uploadCaseSheet = async (bookingId: string, file: File) => {
    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${bookingId}_${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('case-sheets')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('case-sheets')
        .getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from('bookings')
        .update({ case_sheet_url: publicUrl } as any)
        .eq('id', bookingId)

      if (updateError) throw updateError

      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, case_sheet_url: publicUrl } : booking
        )
      )

      toast({
        title: "Success!",
        description: "Case sheet uploaded successfully",
      })

      setIsUploadDialogOpen(false)
      setSelectedFile(null)
      setSelectedBooking(null)
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Failed to upload case sheet. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const deleteCaseSheet = async (bookingId: string, caseSheetUrl: string) => {
    try {
      // Extract filename from URL
      const fileName = caseSheetUrl.split('/').pop()
      if (fileName) {
        await supabase.storage
          .from('case-sheets')
          .remove([fileName])
      }

      const { error } = await supabase
        .from('bookings')
        .update({ case_sheet_url: null } as any)
        .eq('id', bookingId)

      if (error) throw error

      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, case_sheet_url: null } : booking
        )
      )

      toast({
        title: "Success!",
        description: "Case sheet deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete case sheet",
        variant: "destructive"
      })
    }
  }

  const sendBookingEmail = async (booking: Booking, type: 'confirmation' | 'reminder') => {
    setIsSendingEmail(true)
    try {
      const { error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          name: booking.name,
          email: booking.email,
          preferredTime: booking.preferred_time,
          callType: booking.call_type,
          meetingLink: meetingLink || undefined,
          type: type
        }
      })

      if (error) throw error

      toast({
        title: "Email Sent!",
        description: `${type === 'confirmation' ? 'Confirmation' : 'Reminder'} email sent to ${booking.name}`,
      })
      
      setIsEmailDialogOpen(false)
      setMeetingLink('')
      setSelectedBooking(null)
    } catch (error) {
      console.error('Email error:', error)
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      confirmed: 'default',
      cancelled: 'destructive'
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Saathi Mindcare - Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cancelled}</div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>
              Manage patient appointments and update their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No bookings found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Case Sheet / Prescription</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{booking.email}</div>
                          <div className="text-sm text-muted-foreground">{booking.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(booking.preferred_time), 'PPP p')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {booking.call_type === 'video' ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <Phone className="h-4 w-4" />
                          )}
                          {booking.call_type}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {booking.case_sheet_url ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(booking.case_sheet_url!, '_blank')}
                                title="View/Download"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteCaseSheet(booking.id!, booking.case_sheet_url!)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking)
                                setIsUploadDialogOpen(true)
                              }}
                              title="Upload Case Sheet"
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setIsEmailDialogOpen(true)
                            }}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={booking.status}
                          onValueChange={(value) => updateBookingStatus(booking.id!, value as any)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Email to {selectedBooking?.name}</DialogTitle>
            <DialogDescription>
              Send a booking confirmation or reminder email with optional meeting link.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="meeting-link">Meeting Link (Optional)</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Link className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="meeting-link"
                  placeholder="https://meet.google.com/xxx-xxx-xxx"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => selectedBooking && sendBookingEmail(selectedBooking, 'confirmation')}
                disabled={isSendingEmail}
                className="flex-1"
              >
                {isSendingEmail ? 'Sending...' : 'Send Confirmation'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => selectedBooking && sendBookingEmail(selectedBooking, 'reminder')}
                disabled={isSendingEmail}
                className="flex-1"
              >
                {isSendingEmail ? 'Sending...' : 'Send Reminder'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Case Sheet Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Case Sheet for {selectedBooking?.name}</DialogTitle>
            <DialogDescription>
              Upload a PDF file containing case notes or prescription.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="case-sheet-file">Select PDF File</Label>
              <Input
                id="case-sheet-file"
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-accent/20 rounded-lg">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm">{selectedFile.name}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={() => selectedBooking && selectedFile && uploadCaseSheet(selectedBooking.id!, selectedFile)}
                disabled={!selectedFile || isUploading}
                className="flex-1"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setIsUploadDialogOpen(false)
                  setSelectedFile(null)
                  setSelectedBooking(null)
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}