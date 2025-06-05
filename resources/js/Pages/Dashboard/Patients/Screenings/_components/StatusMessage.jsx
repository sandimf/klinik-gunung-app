const StatusMessage = ({ status, isOnline = false }) => {
    const messages = {
        completed: isOnline
            ? "Your online screening has been completed."
            : "Your screening has been completed. You can view your results below.",
        pending: isOnline
            ? "Pemeriksaan online Anda sedang diproses."
            : "Your screeaning is being processed.",
        cancelled: isOnline
            ? "This online screening has been cancelled. Please contact support for assistance."
            : "This screening has been cancelled. Please contact support if you need assistance.",
    };
    return <p className="text-muted-foreground">{messages[status]}</p>;
};

export default StatusMessage;
