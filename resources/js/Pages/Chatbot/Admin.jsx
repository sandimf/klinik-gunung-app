import AI from "./Ai";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";

export default function Index() {
    return (
        <AdminSidebar header={"Chat AI"}>
            <AI />
        </AdminSidebar>
    );
}
