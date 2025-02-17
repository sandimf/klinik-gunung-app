import React from "react";
import { ScrollArea } from "@/Components/ui/scroll-area";

export default function PageContainer({
    children,
    scrollable = false,
}) {
    return (
        <>
            {scrollable ? (
                <ScrollArea>
                    <div className="h-full  p-4 md:px-8">{children}</div>
                </ScrollArea>
            ) : (
                <div className="h-full  p-4 md:px-8">{children}</div>
            )}
        </>
    );
}
