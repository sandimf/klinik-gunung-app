import * as React from "react";
import { ChevronDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/Components/ui/sidebar";

export function TeamSwitcher({
  teams,
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  const handleTeamChange = (team) => {
    setActiveTeam(team);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-fit px-1.5 flex items-center gap-2">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-3" />
              </div>
              <span className="truncate font-semibold">{activeTeam.name}</span>
              <ChevronDown className="size-4 ml-2" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Switch Team</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => handleTeamChange(team)}
                className={`flex items-center gap-2 ${
                  team.name === activeTeam.name ? "text-blue-500 font-semibold" : ""
                }`}
              >
                <team.logo className="size-4" />
                <span>{team.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <Plus className="size-4" />
              <span>Add Team</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
