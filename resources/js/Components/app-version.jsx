export default function AppVersion({ appVersion }) {
    return (
        <span style={{
            position: 'fixed',
            bottom: 8,
            right: 16,
            fontSize: '0.85rem',
            color: '#888',
            zIndex: 100,
        }}>
            v{appVersion}
        </span>
    );
}