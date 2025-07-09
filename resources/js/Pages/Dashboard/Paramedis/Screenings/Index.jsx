import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";
import { Input } from "@/Components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Stethoscope, Book } from "lucide-react";
import ScreeningDialog from "./_components/PhysicalExamination";
import { Badge } from "@/Components/ui/badge";

const StatisticCard = ({ icon: Icon, title, value, description, color }) => (
  <Card className="flex-1">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`w-6 h-6 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const ScreeningOfflineIndex = ({ screenings_offline }) => {
  const { errors } = usePage().props;
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [examiningScreening, setExaminingScreening] = useState(null);

  // Ambil data dari Laravel pagination
  const screenings = screenings_offline?.data || [];

  // Filter dan search
  const filtered = screenings.filter((screening) => {
    if (filter === "all") return true;
    if (filter === "online") {
      return screening.answers?.[0]?.isOnline === 1;
    }
    if (filter === "offline") {
      return screening.answers?.[0]?.isOnline === 0 || screening.answers?.[0]?.isOnline === undefined;
    }
    return true;
  }).filter((screening) =>
    screening.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExamine = (screening) => {
    setExaminingScreening(screening);
    setIsDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    setIsDialogOpen(false);
    setExaminingScreening(null);
  };


  return (
    <ParamedisSidebar header={"Screening"}>
      <Head title="Daftar Screening" />

      {/* Judul utama */}
      <h1 className="text-2xl font-bold">Screening</h1>

      {/* Statistik Section */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, i) => (
                    <StatisticCard key={i} {...stat} />
                ))}
            </div> */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        {/* <div className="w-48">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter Screening" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                    </Select>
                </div> */}
        {/* <Input
                    placeholder="Cari nama pasien..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                /> */}
      </div>

      <ScreeningDataTable data={filtered} onHealthCheck={handleExamine} />

      {/* Pagination yang diperbaiki */}
      {screenings_offline && screenings_offline.links && screenings_offline.links.length > 3 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              {screenings_offline.prev_page_url ? (
                <PaginationPrevious
                  href={screenings_offline.prev_page_url}
                  className="cursor-pointer"
                />
              ) : (
                <PaginationPrevious className="cursor-not-allowed opacity-50" />
              )}
            </PaginationItem>

            {/* Page Numbers */}
            {(() => {
              const currentPage = screenings_offline.current_page;
              const lastPage = screenings_offline.last_page;
              const links = screenings_offline.links;
              const pageNumbers = [];

              // Always show first page
              if (lastPage > 0) {
                pageNumbers.push(
                  <PaginationItem key={1}>
                    <PaginationLink
                      href={links[1]?.url || '#'}
                      isActive={currentPage === 1}
                      disabled={currentPage === 1}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                );
              }

              // Show dots if current page is far from first page
              if (currentPage > 4) {
                pageNumbers.push(
                  <PaginationItem key="dots1">
                    <span className="px-3 py-2">...</span>
                  </PaginationItem>
                );
              }

              // Show pages around current page
              const startPage = Math.max(2, currentPage - 1);
              const endPage = Math.min(lastPage - 1, currentPage + 1);

              for (let i = startPage; i <= endPage; i++) {
                if (i !== 1 && i !== lastPage) {
                  pageNumbers.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        href={links[i]?.url}
                        isActive={currentPage === i}
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              }

              if (currentPage < lastPage - 3) {
                pageNumbers.push(
                  <PaginationItem key="dots2">
                    <span className="px-3 py-2">...</span>
                  </PaginationItem>
                );
              }

              if (lastPage > 1) {
                pageNumbers.push(
                  <PaginationItem key={lastPage}>
                    <PaginationLink
                      href={links[links.length - 2]?.url || '#'}
                      isActive={currentPage === lastPage}
                      disabled={currentPage === lastPage}
                    >
                      {lastPage}
                    </PaginationLink>
                  </PaginationItem>
                );
              }

              return pageNumbers;
            })()}

            <PaginationItem>
              {screenings_offline.next_page_url ? (
                <PaginationNext
                  href={screenings_offline.next_page_url}
                  className="cursor-pointer"
                />
              ) : (
                <PaginationNext className="cursor-not-allowed opacity-50" />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <ScreeningDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSuccess={handleDialogSuccess}
        examiningScreening={examiningScreening}
        errors={errors}
      />
    </ParamedisSidebar>
  );
};

// DataTable shadcn/ui
function ScreeningDataTable({ data, onHealthCheck }) {
  const columns = React.useMemo(
    () => [
      {
        id: "no",
        header: "No.",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Nama Pasien",
      },
      {
        accessorKey: "jenis_screening",
        header: "Jenis Screening",
        cell: ({ row }) => (
          <Badge variant={row.original.answers?.[0]?.isOnline === 1 ? "default" : "secondary"}>
            {row.original.answers?.[0]?.isOnline === 1 ? "Screening Online" : "Screening Offline"}
          </Badge>
        ),
      },
      {
        id: "kuesioner",
        header: "Kuesioner",
        cell: ({ row }) => (
          <Link
            href={route("paramedis.detail", {
              uuid: row.original.uuid,
            })}
          >
            <Button variant="outline" className="mb-4">
              <Book className="mr-2 w-4 h-4" /> Kuesioner
            </Button>
          </Link>
        ),
      },
      {
        id: "aksi",
        header: "Aksi",
        cell: ({ row }) => (
          row.original.screening_status === "completed" ? (
            <Badge>{row.original.screening_status}</Badge>
          ) : (
            <Button variant="outline" className="mb-4" onClick={() => onHealthCheck(row.original)}>
              <Stethoscope className="mr-2 w-4 h-4" /> Pemeriksaan Fisik
            </Button>
          )
        ),
      },
    ],
    [onHealthCheck]
  );

  const [globalFilter, setGlobalFilter] = React.useState("");
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari nama pasien..."
          value={globalFilter ?? ""}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().map(column => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={value => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Belum ada data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Anda bisa menambahkan pagination custom di sini jika ingin */}
    </div>
  );
}

export default ScreeningOfflineIndex;