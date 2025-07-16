import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";
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
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { CreditCard, Printer } from "lucide-react";
import PaymentDialog from "./Payments/OfflinePayments";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

const ScreeningIndex = ({
    screenings_offline = {},
    screenings_online = {},
    medicines,
    amounts = [],
    filters = {},
}) => {
    // Inisialisasi hanya sekali dari props
    const [searchTerm, setSearchTerm] = useState(() => filters.search || "");
    const [filter, setFilter] = useState(() => filters.type || "offline");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [paymentScreening, setPaymentScreening] = useState(null);

    // Pilih data sesuai filter
    const screenings =
        filter === "offline" ? screenings_offline : screenings_online;
    const data = screenings.data || [];

    // Pagination handler
    const handlePageChange = (url) => {
        if (url) {
            router.get(
                url,
                { search: searchTerm, type: filter },
                { preserveState: true, replace: true }
            );
        }
    };

    // Search handler
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("cashier.screening"),
            { search: searchTerm, type: filter },
            { preserveState: true, replace: true }
        );
    };

    // Filter handler
    const handleFilterChange = (value) => {
        setFilter(value);
        router.get(
            route("cashier.screening"),
            { search: searchTerm, type: value },
            { preserveState: true, replace: true }
        );
    };

    const handlePayment = (screening) => {
        console.log("handlePayment called, opening dialog");
        setPaymentScreening(screening);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        console.log("handleDialogClose called, closing dialog");
        setIsDialogOpen(false);
        setPaymentScreening(null);
        // Delay reload to allow dialog to close first
        setTimeout(() => {
            router.reload({
                only: ["screenings_offline", "screenings_online"],
            });
        }, 300);
    };

    const handlePaymentSuccess = () => {
        console.log("handlePaymentSuccess called, reloading screenings data");
        router.get(
            route("cashier.screening"),
            { search: searchTerm, type: filter },
            { preserveState: true, replace: true }
        );
    };

    function ScreeningDataTable({ data, filter, onPayment }) {
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
                ...(filter === "online"
                    ? [
                          {
                              id: "pembayaran",
                              header: "Pembayaran",
                              cell: ({ row }) => (
                                  <Link
                                      href={route(
                                          "cashier.payments-online",
                                          row.original.id
                                      )}
                                  >
                                      <Button>
                                          <CreditCard className="h-4 w-4 mr-2" />
                                          Cek Pembayaran
                                      </Button>
                                  </Link>
                              ),
                          },
                      ]
                    : [
                          {
                              id: "aksi",
                              header: "Aksi/Status",
                              cell: ({ row }) => {
                                  if (
                                      row.original.screening_status ===
                                      "pending"
                                  ) {
                                      return (
                                          <span className="text-yellow-600 font-semibold">
                                              Sedang Diperiksa
                                          </span>
                                      );
                                  }
                                  if (
                                      row.original.payment_status ===
                                      "completed"
                                  ) {
                                      return (
                                          <span className="text-green-600 font-semibold">
                                              Dibayar
                                          </span>
                                      );
                                  }
                                  return (
                                      <Button
                                          onClick={() =>
                                              onPayment(row.original)
                                          }
                                          variant="ghost"
                                      >
                                          <CreditCard className="h-4 w-4 mr-2" />
                                          Bayar
                                      </Button>
                                  );
                              },
                          },
                          {
                              id: "pdf",
                              header: "PDF",
                              cell: ({ row }) =>
                                  row.original.screening_status ===
                                  "completed" ? (
                                      <a
                                          href={route(
                                              "pdf.healthcheck.cashier",
                                              row.original.uuid
                                          )}
                                      >
                                          <Button>
                                              <Printer />
                                          </Button>
                                      </a>
                                  ) : (
                                      <span>Belum Diperiksa</span>
                                  ),
                          },
                          {
                              id: "nota",
                              header: "Nota",
                              cell: ({ row }) =>
                                  row.original.payment_status ===
                                  "completed" ? (
                                      <a
                                          href={route(
                                              "generate.nota.ts",
                                              row.original.payments[0].no_transaction
                                          )}
                                      >
                                          <Button>
                                              <Printer />
                                          </Button>
                                      </a>
                                  ) : (
                                      <span>Belum Dibayar</span>
                                  ),
                          },
                      ]),
            ],
            [filter, onPayment]
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
                <div className="flex items-center py-4 gap-2">
                    <div className="flex items-center py-4 gap-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                placeholder="Cari nama pasien..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                            <Button type="submit" variant="ghost">
                                {" "}
                                <Search />{" "}
                            </Button>
                        </form>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table.getAllColumns().map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Select value={filter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="offline">Offline</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Belum ada data
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    return (
        <CashierSidebar header={"Daftar Screening"}>
            <Head title="Screening" />
            <h2 className="text-2xl font-bold tracking-tight">Screening</h2>
            <p className="text-muted-foreground">
                Daftar seluruh hasil screening pasien yang telah membayar dan
                belum.
            </p>
            <ScreeningDataTable
                data={data}
                filter={filter}
                onPayment={handlePayment}
            />

            {/* Pagination dari backend */}
            {screenings && (
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-muted-foreground text-sm">
                        Page {screenings.current_page} of {screenings.last_page}
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                handlePageChange(screenings.prev_page_url)
                            }
                            disabled={!screenings.prev_page_url}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                handlePageChange(screenings.next_page_url)
                            }
                            disabled={!screenings.next_page_url}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            <PaymentDialog
                key={paymentScreening ? paymentScreening.id : "no-screening"}
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                onPaymentSuccess={handlePaymentSuccess}
                screening={paymentScreening}
                medicines={medicines}
                amounts={amounts}
            />
        </CashierSidebar>
    );
};

export default ScreeningIndex;
