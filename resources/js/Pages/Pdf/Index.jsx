import React from "react";
import { Head } from "@inertiajs/react";
import { Separator } from "@/Components/ui/separator";
export default function HealthScreeningForm() {
    return (
        <>
            <Head title="Health Screening Form" />
            <div className="p-6">
                <div
                    id="health-form"
                    className="bg-white w-[230mm]  p-9"
                >
                    {/* Header */}
                    <div className="bg-[#25418e] text-white p-6 relative w-full">
                        {/* <img
                            src={`${window.location.origin}/images/mountain-bg.png`}
                            alt="Mountain Background"
                            className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
                        /> */}
                        <h1 className="text-4xl font-bold mb-4">
                            KLINIK GUNUNG
                        </h1>
                        <div className="p-2 bg-white text-[#5f73ad] mb-4 max-w-[450px]">
                            <p>No. </p>
                        </div>

                        <h2 className="text-xl bold">
                            SURAT PEMERIKSAAN KESEHATAN PENDAKIAN
                        </h2>
                        <p className="italic text-xl">
                            TREKKING HEALTH SCREENING CERTIFICATE
                        </p>
                    </div>

                    <div className="mt-6 space-y-6">
                        <p className="mb-4 text-[#5f73ad]">
                            Saya yang bertanda tangan di bawah ini menerangkan
                            bahwa:
                            <br />
                            <em>I hereby state that:</em>
                        </p>

                        <div className="space-y-4">
                            <div>
                                <div className="flex flex-col items-start">
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-[#5f73ad]">Nama</p>
                                        <p className="text-center text-[#5f73ad] w-full">
                                            Sandi Maulana Fuazan
                                        </p>
                                    </div>
                                    <Separator className="bg-[#5f73ad]" />
                                    <p className="italic text-[#5f73ad]">
                                        Name
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col items-start">
                                    <div className="flex justify-between items-center w-full ">
                                        <p className="text-[#5f73ad]">Umur</p>
                                        <p className="text-center text-[#5f73ad] w-full">
                                            12
                                        </p>
                                    </div>
                                    <Separator className="bg-[#5f73ad] max-w-[300px]" />
                                    <p className="italic text-[#5f73ad]">Age</p>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-[#5f73ad]">
                                            Pekerjaan
                                        </p>
                                        <p className="text-center text-[#5f73ad] w-full">
                                            12
                                        </p>
                                    </div>
                                    <Separator className="bg-[#5f73ad]" />
                                    <p className="italic text-[#5f73ad]">
                                        Oppcupation
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="flex flex-col items-start">
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-[#5f73ad]">Alamat</p>
                                        <p className="text-center text-[#5f73ad] w-full">
                                            Sandi Maulana Fauzan
                                        </p>
                                    </div>
                                    <Separator className="bg-[#5f73ad]" />
                                    <p className="text-[#5f73ad] italic">
                                        Address
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-xl text-[#2a4089] font-bold">
                                Direkomendasi dengan catatan khusus
                            </h3>
                            <p className="italic mb-4 text-[#5f73ad]">
                                Untuk aktivitas pendakian gunung. / For trekking
                                activity
                            </p>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="flex flex-col items-start">
                                        <div className="flex justify-between items-center ">
                                            <p className="text-[#5f73ad]">
                                                Berat Badan
                                            </p>
                                            <p className="text-center text-[#5f73ad] w-full">
                                                20
                                            </p>
                                        </div>
                                        <Separator className="bg-[#5f73ad]" />
                                        <p className="text-[#5f73ad] italic">
                                            Body Weight
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex flex-col items-start">
                                        <div className="flex justify-between items-center w-full">
                                            <p className="text-[#5f73ad]">
                                                Tekanan Darah
                                            </p>
                                            <p className="text-center text-[#5f73ad] w-full">
                                                20
                                            </p>
                                        </div>
                                        <Separator className="bg-[#5f73ad]" />
                                        <p className="text-[#5f73ad] italic">
                                            Blood Pressure
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start mb-7">
                                    <div className="flex justify-between items-center w-full">
                                        <p className="text-[#5f73ad]">
                                            Tinggi Badan
                                        </p>
                                        <p className="text-center text-[#5f73ad] w-full">
                                            20
                                        </p>
                                    </div>
                                    <Separator className="bg-[#5f73ad]" />
                                    <p className="text-[#5f73ad] italic">
                                        Body Height
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-start">
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-[#5f73ad]">Keterangan</p>
                                    <p className="text-center text-[#5f73ad] w-full">
                                        20
                                    </p>
                                </div>
                                <Separator className="bg-[#5f73ad]" />
                                <p className="text-[#5f73ad] italic">Note</p>
                            </div>
                        </div>

                        <p className="mt-8 text-[#5f73ad] mb-4">
                            Surat keterangan ini dikeluarkan untuk dipergunakan
                            sebagaimana mestinya.
                            <br />
                            <em>
                                This letter is for use of specified person only
                            </em>
                        </p>

                        {/* Footer */}
                        <div className="mt-8 flex justify-between items-end ">
                            <div>
                                <img
                                    src="/storage/pdf/qr.png"
                                    alt="QR Code"
                                    className="w-32 h-32"
                                />
                                <div className="mt-4 text-sm text-[#5f73ad]">
                                    <p>contact@klinikgunung.id</p>
                                    <p>www.klinikgunung.id</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p>_________________, 20___</p>
                                <div className="mt-16">
                                    _______________________
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
