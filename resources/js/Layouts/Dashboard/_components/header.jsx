export default function Header() {
    return (
        <>
            <div className="flex items-center space-x-4">
                <ModeToggle />
                <NotificationButton />
                <ProfileButton />
            </div>
        </>
    );
}
