
import PatientsSidebar from '@/Layouts/Dashboard/PatientsSidebarLayout';
import Profile from './Profile';
export default function Edit() {

    return (
        <PatientsSidebar header={'Profile'}>
        <Profile/>
        </PatientsSidebar>
    );
}
