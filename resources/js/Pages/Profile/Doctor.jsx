
import DcotorSidebar from '@/Layouts/Dashboard/DoctorSidebarLayout';
import Profile from './Profile';


export default function Edit({ mustVerifyEmail, status }) {

    return (
        <DcotorSidebar header={'Profile'}>
       <Profile/>
        </DcotorSidebar>
    );
}
