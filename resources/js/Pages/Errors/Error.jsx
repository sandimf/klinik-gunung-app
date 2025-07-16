import { Button } from '@/Components/ui/button'
import { Head } from '@inertiajs/react'
import { router } from '@inertiajs/react'

export default function Error({ status }) {
    const title = {
        503: 'Layanan Tidak Tersedia',
        502: 'Gateway Bermasalah',
        501: 'Belum Diimplementasikan',
        400: 'Permintaan Tidak Valid',
        405: 'Metode Tidak Diizinkan',
        500: 'Kesalahan Server',
        404: 'Halaman Tidak Ditemukan',
        403: 'Akses Ditolak',
    }[status];


    const description = {
        400: 'Permintaan tidak valid. Silakan periksa kembali data atau tautan yang Anda akses.',
        401: 'Akses tidak diizinkan. Silakan masuk untuk melanjutkan.',
        403: 'Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.',
        404: 'Halaman tidak ditemukan. Periksa kembali URL yang Anda tuju.',
        405: 'Metode tidak diperbolehkan. Cara akses yang digunakan tidak didukung.',
        500: 'Terjadi kesalahan pada server. Kami sedang menyelidikinya.',
        501: 'Fitur belum tersedia. Server tidak mendukung permintaan ini.',
        502: 'Kesalahan gateway. Server menerima respons yang tidak valid.',
        503: 'Layanan tidak tersedia. Kami sedang melakukan pemeliharaan sistem.',
    }[status]

    return (
        <>
        <Head title={title} />
        <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">{status} {title}</h1>
          <p className="text-gray-500">{description}</p>
        </div>
        <Button onClick={() => router.visit('/')}>
          Kembali
        </Button>
      </div>
    </div>
    </>
    )
}