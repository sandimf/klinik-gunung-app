import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import SideBar from "@/Layouts/Dashboard/PatientsSidebarLayout"
import { Head } from "@inertiajs/react"
import { User, Calendar, Phone, Clipboard, Activity, HelpCircle } from "lucide-react"
import MedicalHeader from '../_components/header';

export default function ScreeningDetails({ screening }) {
  const screeningDetails = [
    { label: "Nama", value: screening.name, icon: <User className="h-4 w-4" /> },
    { label: "Umur", value: screening.age, icon: <User className="h-4 w-4" /> },
    { label: "Jenis Kelamin", value: screening.gender, icon: <User className="h-4 w-4" /> },
    { label: "Nomor Kontak", value: screening.contact, icon: <Phone className="h-4 w-4" /> },
    { label: "Tanggal Rencana Pendakian", value: screening.planned_hiking_date, icon: <Calendar className="h-4 w-4" /> },
    { label: "Jumlah Pendakian Sebelumnya (di atas 2.000 meter)", value: screening.previous_hikes_count, icon: <Activity className="h-4 w-4" /> },
  ]

  return (
    <SideBar header={`Detail Screening ${screening.name}`}>
      <Head title={`${screening.name}`} />
      <MedicalHeader title="Screening Detail"/>
            <Tabs defaultValue="personal-info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal-info">Informasi Pribadi</TabsTrigger>
                <TabsTrigger value="questionnaire">Kuesioner</TabsTrigger>
                <TabsTrigger value="result">Result</TabsTrigger>
              </TabsList>
              <TabsContent value="personal-info" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informasi Pribadi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {screeningDetails.map((detail, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
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
              <TabsContent value="questionnaire" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hasil Kuesioner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                    {screening.answers.length > 0 ? (
                    <ul>
                        {screening.answers.map((answer) => (
                            <li key={answer.id} className="screening-answer">
                                <p>
                                    <strong>{answer.question.question_text}</strong>
                                </p>
                                <p>
                                    {typeof answer.answer_text === 'object'
                                        ? JSON.stringify(answer.answer_text)
                                        : answer.answer_text}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No answers available.</p>
                )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="result" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hasil Pemeriksaan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                    {screening.answers.length > 0 ? (
                    <ul>
                        {screening.answers.map((answer) => (
                            <li key={answer.id} className="screening-answer">
                                <p>
                                    <strong>{answer.question.question_text}</strong>
                                </p>
                                <p>
                                    {typeof answer.answer_text === 'object'
                                        ? JSON.stringify(answer.answer_text)
                                        : answer.answer_text}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No answers available.</p>
                )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

    </SideBar>
  )
}
