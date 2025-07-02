import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { User, Calendar, Phone, HelpCircle, FileText, Info } from 'lucide-react'
import Sidebar from "@/Layouts/Dashboard/PatientsSidebarLayout"
import { Head } from "@inertiajs/react"
import ButtonBack from "@/Components/button-back"
export default function ScreeningDetails({ screening }) {
  const screeningDetails = [
    { label: "Nama", value: screening.name, icon: <User className="h-4 w-4" /> },
    { label: "Umur", value: screening.age, icon: <Calendar className="h-4 w-4" /> },
    { label: "Jenis Kelamin", value: screening.gender, icon: <User className="h-4 w-4" /> },
    { label: "Nomor Kontak", value: screening.contact, icon: <Phone className="h-4 w-4" /> },
    { label: "NIK", value: screening.nik, icon: <Info className="h-4 w-4" /> },
    { label: "Tanggal Lahir", value: screening.date_of_birth, icon: <Calendar className="h-4 w-4" /> },
  ]

  return (
    <Sidebar header={`Detail Screening ${screening.name}`}>
      <Head title="Screening Detail" />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Detail Screening {screening.name}</h1>
        <Tabs defaultValue="personal-info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="personal-info">Informasi Pribadi</TabsTrigger>
            <TabsTrigger value="questionnaire">Kuesioner</TabsTrigger>
          </TabsList>

          <TabsContent value="personal-info">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Informasi Pribadi Pasien
                </CardTitle>
                <CardDescription>Detail informasi pribadi pasien</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {screeningDetails.map((detail, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {detail.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{detail.label}</p>
                        <p className="font-medium">{detail.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questionnaire">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Jawaban Kuesioner
                </CardTitle>
                <CardDescription>Jawaban {screening.name} kuesioner screening</CardDescription>
              </CardHeader>
              <CardContent>
                {screening.answers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pertanyaan</TableHead>
                        <TableHead>Jawaban</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {screening.answers.map((answer) => (
                        <TableRow key={answer.id}>
                          <TableCell className="font-medium">{answer.question.question_text}</TableCell>
                          <TableCell>
                            {typeof answer.answer_text === 'object'
                              ? JSON.stringify(answer.answer_text)
                              : answer.answer_text}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center h-32 bg-muted rounded-md">
                    <p className="text-muted-foreground flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Tidak ada jawaban tersedia.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <ButtonBack />
      </div>
    </Sidebar>
  )
}

