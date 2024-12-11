import { Heart, Search, Home, PenSquare, User } from 'lucide-react'
import { Link,usePage } from '@inertiajs/react';

export default function Navigation() {
  const user = usePage().props.auth.user;
    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <div className="max-w-lg mx-auto flex justify-between items-center p-3">
            <Link href={route('community.index')}>
            <button className="p-2">
            <Home className="w-6 h-6" />
          </button>
            </Link>
          <button className="p-2">
            <Search className="w-6 h-6" />
          </button>
          <Link href={route('community.create')}>
          <button className="p-2">
            <PenSquare className="w-6 h-6" />
          </button>
          </Link>
          <button className="p-2">
            <Heart className="w-6 h-6" />
          </button>
          <Link href={route('profile.show', user.community.slug)}>
          <button className="p-2">
            <User className="w-6 h-6" />
          </button>
          </Link>

        </div>
      </div>
    );
}
