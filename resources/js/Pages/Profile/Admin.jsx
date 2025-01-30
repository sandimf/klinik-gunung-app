import Profile from "./Profile";
import AdminSidebar from "@/Layouts/Dashboard/AdminSidebarLayout";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AdminSidebar header={"Profile"}>
            <Profile />
        </AdminSidebar>
    );
}
