import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Database } from 'lucide-react'
import Sidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head} from "@inertiajs/react"

export default function DatabaseBackup() {
  return (
    <Sidebar>
      <Head title="Database Backup" />
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Airtable Sync Status</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Weekly Backup</TableCell>
                <TableCell>2025-01-10 15:30</TableCell>
                <TableCell>2.3 GB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Monthly Backup</TableCell>
                <TableCell>2025-01-01 00:00</TableCell>
                <TableCell>2.1 GB</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </Sidebar>
  )
}

