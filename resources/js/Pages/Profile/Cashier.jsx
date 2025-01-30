
import CashierSidebar from '@/Layouts/Dashboard/CashierSidebarLayout';
import Profile from './Profile';

export default function Edit({ mustVerifyEmail, status }) {

    return (
        <CashierSidebar header={'Profile'}>
        <Profile/>
        </CashierSidebar>
    );
}
