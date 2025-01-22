import ManagerSidebar from '@/Layouts/Dashboard/ManagerSidebarLayout';
import Profile from './Profile';

export default function Edit({ mustVerifyEmail, status }) {

    return (
        <ManagerSidebar header={'Profile'}>
        <Profile/>
        </ManagerSidebar>
    );
}
