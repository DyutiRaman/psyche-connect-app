import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { LogOut, Calendar, Phone, Video, Users, Mail, Link, Upload, FileText, Download, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  preferred_time: string
  call_type: 'video' | 'voice'
  status: 'pending' | 'confirmed' | 'cancelled'
  case_sheet_url?: string | null
  created_at?: string
}


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
      const response = await fetch("http://localhost:5000/api/bookings")
      if (!response.ok) throw new Error("Failed to fetch bookings")
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch bookings", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!response.ok) throw new Error()
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
      toast({ title: 'Success!', description: `Booking ${status} successfully` })
    } catch {
      toast({ title: 'Error', description: 'Failed to update booking status', variant: 'destructive' })
    }
  }

  const uploadCaseSheet = async (bookingId: string, file: File) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/casesheet`, {
        method: "POST",
        body: formData
      })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, case_sheet_url: data.case_sheet_url } : b))
      setIsUploadDialogOpen(false)
      setSelectedFile(null)
      setSelectedBooking(null)
      toast({ title: 'Success!', description: 'File uploaded successfully' })
    } catch {
      toast({ title: 'Error', description: 'Upload failed', variant: 'destructive' })
    } finally {
      setIsUploading(false)
    }
  }



  const sendBookingEmail = async (booking: Booking, type: 'confirmation' | 'reminder') => {
    setIsSendingEmail(true)
    try {
      const res = await fetch('http://localhost:5000/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: booking.name,
          email: booking.email,
          preferredTime: booking.preferred_time,
          callType: booking.call_type,
          meetingLink: meetingLink || undefined,
          type
        })
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Email Sent!', description: `${type} email sent to ${booking.name}` })
      setIsEmailDialogOpen(false)
      setMeetingLink('')
      setSelectedBooking(null)
    } catch {
      toast({ title: 'Error', description: 'Failed to send email', variant: 'destructive' })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const getStatusBadge = (status: Booking['status']) => {
    const variants = { pending: 'secondary', confirmed: 'default', cancelled: 'destructive' } as const
    return <Badge variant={variants[status] || 'secondary'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  }

  

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Saathi Mindcare - Admin Dashboard</h1>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardHeader><CardTitle>Total</CardTitle></CardHeader><CardContent>{stats.total}</CardContent></Card>
        <Card><CardHeader><CardTitle>Pending</CardTitle></CardHeader><CardContent>{stats.pending}</CardContent></Card>
        <Card><CardHeader><CardTitle>Confirmed</CardTitle></CardHeader><CardContent>{stats.confirmed}</CardContent></Card>
        <Card><CardHeader><CardTitle>Cancelled</CardTitle></CardHeader><CardContent>{stats.cancelled}</CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>Manage all appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Case Sheet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map(b => (
                <TableRow key={b.id}>
                  <TableCell>{b.name}</TableCell>
                  <TableCell>
                    <div>{b.email}</div>
                    <div className="text-muted-foreground text-sm">{b.phone}</div>
                  </TableCell>
                  <TableCell>{format(new Date(b.preferred_time), 'PPP p')}</TableCell>
                  <TableCell className="capitalize">{b.call_type}</TableCell>
                  <TableCell>{getStatusBadge(b.status)}</TableCell>
                  <TableCell>
                    {b.case_sheet_url ? (
                      <Button size="sm" variant="outline" onClick={() => window.open(b.case_sheet_url!, '_blank')}>
                        <Download className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => {
                        setSelectedBooking(b)
                        setIsUploadDialogOpen(true)
                      }}>
                        <Upload className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => {
                      setSelectedBooking(b)
                      setIsEmailDialogOpen(true)
                    }}>
                      <Mail className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Select value={b.status} onValueChange={(val) => updateBookingStatus(b.id, val as any)}>
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
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Case Sheet</DialogTitle>
            <DialogDescription>Upload a PDF for the selected patient</DialogDescription>
          </DialogHeader>
          <Input type="file" accept="application/pdf" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
          <Button onClick={() => selectedBooking && selectedFile && uploadCaseSheet(selectedBooking.id, selectedFile)} disabled={!selectedFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>Send confirmation or reminder email</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Meeting Link</Label>
            <Input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://meet.link" />
            <div className="flex gap-2">
              <Button onClick={() => selectedBooking && sendBookingEmail(selectedBooking, 'confirmation')} disabled={isSendingEmail}>Send Confirmation</Button>
              <Button variant="outline" onClick={() => selectedBooking && sendBookingEmail(selectedBooking, 'reminder')} disabled={isSendingEmail}>Send Reminder</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
