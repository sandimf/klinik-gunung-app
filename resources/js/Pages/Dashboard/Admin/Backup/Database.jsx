import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Database, Save, RotateCcw, Clock, HardDrive } from 'lucide-react'
import Sidebar from "@/Layouts/Dashboard/AdminSidebarLayout";
import { Head,Link } from "@inertiajs/react"

export default function DatabaseBackup() {

  const handleBackup = async () => {
    setLoading(true);
    try {
        const response = await fetch(route('database.sql'), { method: "GET" });

        if (!response.ok) {
            throw new Error("Gagal membuat backup");
        }

        // Buat file dan trigger unduhan otomatis
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "backup-database.sql"; // Nama file saat diunduh
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
    }
    setLoading(false);
};

  return (
    <Sidebar>
      <Head title="Database Backup" />
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Database Backup</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-6 w-6" />
            Create New Backup
          </CardTitle>
          <CardDescription>Create a new backup of your current database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Backup Name</Label>
              <Input id="name" placeholder="Enter backup name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input id="description" placeholder="Enter backup description" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={route('database.sql')}>
          <Button className="w-full">Buat Backup</Button>
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Existing Backups
          </CardTitle>
          <CardDescription>View and manage your existing database backups</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Weekly Backup</TableCell>
                <TableCell>2025-01-10 15:30</TableCell>
                <TableCell>2.3 GB</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Monthly Backup</TableCell>
                <TableCell>2025-01-01 00:00</TableCell>
                <TableCell>2.1 GB</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-6 w-6" />
            Restore Database
          </CardTitle>
          <CardDescription>Restore your database from an existing backup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="backup-select">Select Backup</Label>
              <Select>
                <SelectTrigger id="backup-select">
                  <SelectValue placeholder="Select a backup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly Backup (2025-01-10)</SelectItem>
                  <SelectItem value="monthly">Monthly Backup (2025-01-01)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Restore Selected Backup</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6" />
            Scheduled Backups
          </CardTitle>
          <CardDescription>Configure automatic database backups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="schedule">Backup Frequency</Label>
              <Select>
                <SelectTrigger id="schedule">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="retention">Retention Period (days)</Label>
              <Input id="retention" type="number" placeholder="30" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Save Schedule</Button>
        </CardFooter>
      </Card>
    </div>
    </Sidebar>
  )
}

