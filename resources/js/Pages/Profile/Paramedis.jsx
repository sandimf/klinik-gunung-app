import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";
import Profile from "./Profile";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <ParamedisSidebar header={"Profile"}>
            <Profile />
        </ParamedisSidebar>
    );
}
