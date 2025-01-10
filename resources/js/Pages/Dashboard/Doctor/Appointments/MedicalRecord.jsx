import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Button } from "@/Components/ui/button"
import { Label } from "@/Components/ui/label"
import { Calendar } from "@/Components/ui/calendar"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover"
import DoctorSidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";
import { BodyMap } from '../_components/BodyMap/Index'
import { Head } from '@inertiajs/react'
export default function MedicalRecordForm() {
  const [specialNotes, setSpecialNotes] = useState('')
  const [prescription, setPrescription] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [imagePath, setImagePath] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
  }
  return (
    <DoctorSidebar header={'Medical Record'}>
      <Head title='Medical Record' />
    <Card className="">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Medical Record</CardTitle>
      </CardHeader>
      <BodyMap />
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="special-notes">Special Notes</Label>
            <Textarea
              id="special-notes"
              placeholder="Enter any special notes"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prescription">Prescription</Label>
            <Textarea
              id="prescription"
              placeholder="Enter prescription details"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="follow-up">Follow-up Schedule</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !followUpDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {followUpDate ? format(followUpDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={followUpDate}
                  onSelect={setFollowUpDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setImagePath(URL.createObjectURL(file))
                }
              }}
            />
            {imagePath && (
              <div className="mt-2">
                <img src={imagePath} alt="Uploaded" className="max-w-full h-auto rounded-md" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit Medical Record</Button>
        </CardFooter>
      </form>
    </Card>
    </DoctorSidebar>
  )
}

