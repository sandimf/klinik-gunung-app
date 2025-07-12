import AI from "./Ai";
import CashierSidebar from "@/Layouts/Dashboard/CashierSidebarLayout";

export default function Index() {
    return (
        <CashierSidebar header={"Chat AI"}>
            <AI />
        </CashierSidebar>
    );
}
