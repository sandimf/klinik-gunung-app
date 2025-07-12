import React, { useState, useEffect } from "react";
import { Head, usePage, Link, router } from "@inertiajs/react";
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";
import { useRealtimeScreenings } from "@/hooks/useRealtimeScreenings";
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
import { ChevronDown, Search } from "lucide-react";
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

const ScreeningOfflineIndex = ({ screenings_offline, filters = {} }) => {
  const { errors } = usePage().props;
  const [searchTerm, setSearchTerm] = useState(() => filters.search || "");
  const [filter, setFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [examiningScreening, setExaminingScreening] = useState(null);

  // Use realtime screenings hook
  const {
    screenings,
    isLoading: isRealtimeLoading,
    lastUpdate,
    refreshData
  } = useRealtimeScreenings(screenings_offline?.data || []);

  // Show last update time
  const formatLastUpdate = (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

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

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('paramedis.screenings'), { search: searchTerm }, { preserveState: true, replace: true });
  };

  // Pagination handler
  const handlePageChange = (url) => {
    if (url) {
      router.get(url, { search: searchTerm }, { preserveState: true, replace: true });
    }
  };

  return (
    <ParamedisSidebar header={"Screening"}>
      <Head title="Daftar Screening" />

      {/* Judul utama dengan realtime indicator */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Screening</h1>
        <div className="flex items-center gap-4">
          {isRealtimeLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Memperbarui data...</span>
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            Terakhir diperbarui: {formatLastUpdate(lastUpdate)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRealtimeLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistik Section */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, i) => (
                    <StatisticCard key={i} {...stat} />
                ))}
            </div> */}

      <div className="flex items-center py-4 gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Cari nama pasien..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="ghost" type="submit">
            <Search />
          </Button>
        </form>
      </div>

      <ScreeningDataTable data={filtered} onHealthCheck={handleExamine} />

      {/* Pagination sederhana ala shadcn/ui */}
      {screenings_offline && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-muted-foreground text-sm">
            Page {screenings_offline.current_page} of {screenings_offline.last_page}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(screenings_offline.prev_page_url)}
              disabled={!screenings_offline.prev_page_url}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(screenings_offline.next_page_url)}
              disabled={!screenings_offline.next_page_url}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ScreeningDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSuccess={() => {
          handleDialogSuccess();
          refreshData(); // <-- langsung refresh data setelah sukses
        }}
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