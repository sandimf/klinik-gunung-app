import { Link } from '@inertiajs/react';
import { Activity } from 'lucide-react';

const Header = () => {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link href='/' className="flex items-center justify-center" prefetch={false}>
        <Activity className="h-6 w-6" />
        <span className="sr-only">Klinik Gunung</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;
