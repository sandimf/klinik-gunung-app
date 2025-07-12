import AI from "./Ai";
import ParamedisSidebar from "@/Layouts/Dashboard/ParamedisSidebarLayout";

export default function Index() {
    return (
        <ParamedisSidebar header={"Chat AI"}>
            <AI />
        </ParamedisSidebar>
    );
}
