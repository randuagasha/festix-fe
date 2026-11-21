"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  X,
  ChevronsUpDown,
  PanelLeftClose,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface WorkspaceNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: "primary" | "amber";
  exactMatch?: boolean;
}

export interface WorkspaceNavGroup {
  label?: string;
  items: WorkspaceNavItem[];
}

export interface WorkspaceProfileMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: LucideIcon;
  destructive?: boolean;
}

export interface WorkspaceSidebarProps {
  workspaceType: "admin" | "organizer";
  brand: {
    title: string;
    subtitle: string;
    subtitleIcon?: LucideIcon;
    href: string;
    logoIcon: LucideIcon;
  };
  navGroups: WorkspaceNavGroup[];
  user: {
    name: string;
    email: string;
    subtitle: string;
    avatar?: string | null;
  } | null;
  profileMenuItems: WorkspaceProfileMenuItem[];
  className?: string;
}

export function WorkspaceSidebar({
  brand,
  navGroups,
  user,
  profileMenuItems,
  className,
}: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search input
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter groups and items based on search query
  const filteredGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return navGroups;

    const query = searchQuery.toLowerCase().trim();
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [navGroups, searchQuery]);

  const BrandIcon = brand.logoIcon;
  const SubtitleIcon = brand.subtitleIcon;

  const displayName = user?.name || "User";
  const userInitial = displayName.charAt(0).toUpperCase() || "U";
  const userSubtitle = user?.subtitle || "Workspace Member";
  const userEmail = user?.email || "";

  return (
    <Sidebar
      variant="floating"
      className={cn(
        "p-2.5 md:p-3",
        "[&>[data-slot=sidebar-inner]]:rounded-2xl",
        "[&>[data-slot=sidebar-inner]]:border",
        "[&>[data-slot=sidebar-inner]]:border-border/80",
        "[&>[data-slot=sidebar-inner]]:bg-card",
        "[&>[data-slot=sidebar-inner]]:shadow-[0_4px_24px_-4px_rgba(13,27,46,0.06),0_1px_4px_rgba(13,27,46,0.04)]",
        "[&>[data-slot=sidebar-inner]]:ring-0",
        "[&>[data-slot=sidebar-inner]]:overflow-hidden",
        className
      )}
    >
      {/* Brand Header */}
      <SidebarHeader className="flex h-16 flex-row items-center justify-between border-b border-border/50 px-3.5 py-3">
        <Link
          href={brand.href}
          className="group flex min-w-0 flex-1 items-center gap-2.5 focus:outline-none"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-primary/85 text-primary-foreground shadow-xs shadow-primary/20 ring-1 ring-primary/25 transition-transform duration-200 group-hover:scale-[1.02]">
            <BrandIcon className="size-4.5" />
          </div>
          <div className="flex min-w-0 flex-col leading-none">
            <span className="font-heading text-sm font-bold tracking-tight text-foreground">
              {brand.title}
              <span className="text-primary font-black">.</span>
            </span>
            <span className="mt-1 flex items-center gap-1 font-sans text-[10px] font-semibold tracking-wider text-muted-foreground/80 uppercase">
              {SubtitleIcon && <SubtitleIcon className="size-2.5 text-primary" />}
              {brand.subtitle}
            </span>
          </div>
        </Link>

        {/* Compact collapse button */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
          className="hidden md:flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground/60 transition-colors hover:bg-muted/70 hover:text-foreground"
        >
          <PanelLeftClose className="size-4" />
        </button>
      </SidebarHeader>

      {/* Compact Search Field */}
      <div className="px-3 pt-3 pb-1.5">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground/60" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="h-8.5 w-full rounded-xl border border-border/70 bg-secondary/35 pl-8 pr-11 font-sans text-xs text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-primary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 flex size-4 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
              title="Clear search"
            >
              <X className="size-3" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2 flex items-center gap-0.5 rounded border border-border/60 bg-card px-1.5 py-0.5 font-mono text-[9px] font-medium text-muted-foreground/60 shadow-2xs">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <SidebarContent className="px-2.5 py-2 space-y-3 overflow-y-auto scrollbar-thin">
        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="size-5 text-muted-foreground/40 mb-2" />
            <p className="font-sans text-xs font-medium text-muted-foreground">
              No matching pages
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-1.5 font-sans text-[11px] font-medium text-primary hover:underline"
            >
              Reset search
            </button>
          </div>
        ) : (
          filteredGroups.map((group, groupIdx) => (
            <SidebarGroup key={group.label ?? `group-${groupIdx}`} className="p-0">
              {group.label && (
                <SidebarGroupLabel className="px-3 pb-1 pt-1 font-sans text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 select-none">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent className="mt-0.5">
                <SidebarMenu className="gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exactMatch
                      ? pathname === item.href
                      : pathname === item.href ||
                        (item.href !== "/admin/dashboard" &&
                          item.href !== "/organizer/dashboard" &&
                          item.href !== "/organizer/events" &&
                          pathname.startsWith(item.href)) ||
                        (item.href === "/organizer/events" &&
                          pathname.startsWith("/organizer/events") &&
                          pathname !== "/organizer/events/create");

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={item.label}
                          className={cn(
                            "relative flex h-9.5 w-full items-center gap-3 rounded-xl px-3 font-sans text-xs font-medium transition-all duration-150",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15 hover:text-primary shadow-2xs"
                              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                          )}
                          render={<Link href={item.href} />}
                        >
                          {isActive && (
                            <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-primary" />
                          )}
                          <Icon
                            className={cn(
                              "size-4 shrink-0 transition-colors",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground"
                            )}
                          />
                          <span className="truncate flex-1 text-left">
                            {item.label}
                          </span>
                          {item.badge !== undefined &&
                            item.badge !== null &&
                            item.badge !== "" && (
                              <span
                                className={cn(
                                  "ml-auto flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold leading-none shadow-2xs",
                                  item.badgeVariant === "amber"
                                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                                    : "bg-primary/15 text-primary"
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>

      {/* Anchored Bottom Profile Section */}
      <SidebarFooter className="border-t border-border/50 p-2.5 mt-auto bg-card/60 backdrop-blur-2xs">
        <DropdownMenu>
          <DropdownMenuTrigger className="group flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-border/40 bg-secondary/20 p-2 text-left transition-all hover:border-border/80 hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
            <Avatar className="size-8 shrink-0 rounded-lg border border-border/60 shadow-2xs">
              {user?.avatar && <AvatarImage src={user.avatar} alt={displayName} />}
              <AvatarFallback className="rounded-lg bg-primary/10 font-heading text-xs font-bold text-primary">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate font-sans text-xs font-semibold text-foreground transition-colors group-hover:text-primary">
                {displayName}
              </span>
              <span className="truncate font-sans text-[10px] text-muted-foreground">
                {userSubtitle}
              </span>
            </div>
            <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground/60 transition-transform group-hover:text-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            side="top"
            sideOffset={10}
            className="w-56 rounded-xl border-border/80 p-1.5 shadow-lg font-sans"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2.5 py-2">
                <p className="truncate font-sans text-xs font-semibold text-foreground">
                  {displayName}
                </p>
                {userEmail && (
                  <p className="truncate font-sans text-[11px] font-normal text-muted-foreground">
                    {userEmail}
                  </p>
                )}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuGroup>
              {profileMenuItems.map((menuItem) => (
                <DropdownMenuItem
                  key={menuItem.label}
                  onClick={menuItem.onClick}
                  variant={menuItem.destructive ? "destructive" : "default"}
                  className={cn(
                    "cursor-pointer gap-2.5 rounded-lg px-2.5 py-1.5 font-sans text-xs",
                    menuItem.destructive &&
                      "text-destructive focus:bg-destructive/10 focus:text-destructive"
                  )}
                >
                  <menuItem.icon
                    className={cn(
                      "size-3.5",
                      menuItem.destructive
                        ? "text-destructive"
                        : "text-muted-foreground"
                    )}
                  />
                  <span>{menuItem.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
