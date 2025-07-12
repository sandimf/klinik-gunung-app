import AI from "./Ai";
import DoctorSidebar from "@/Layouts/Dashboard/DoctorSidebarLayout";

export default function Index() {
    return (
        <DoctorSidebar header={"Chat AI"}>
            <AI />
        </DoctorSidebar>
    );
}
