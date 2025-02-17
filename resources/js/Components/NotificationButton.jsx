import React from "react";
import { Bell } from 'lucide-react';
import { Button } from "@/Components/ui/button";

export function NotificationButton() {
  return (
    <Button variant="outline" size="icon">
      <Bell className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Notifications</span>
    </Button>
  );
}

