"use client";
import { ExternalLink, LogOut } from "lucide-react";
import { ActionAnchor } from "@/components/action-link";
import { publicPath } from "@/lib/public-path";
import { logout } from "@/app/admin/login/actions";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { navigation, type Section } from "./navigation";
import type { PortfolioContent } from "@/features/content/schema";

export function AdminSidebar({
  active,
  onSelect,
  data,
  locale,
  disabled,
  hasChanges,
}: {
  active: Section;
  onSelect: (section: Section) => void;
  data: PortfolioContent;
  locale: string;
  disabled: boolean;
  hasChanges: boolean;
}) {
  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Portfolio administration"
              onClick={() => onSelect("overview")}
            >
              <img
                src="/icon.svg"
                width={32}
                height={32}
                alt=""
                className="rounded-lg"
              />
              <span className="grid text-left">
                <strong className="text-sm">Portfolio admin</strong>
                <span className="text-xs text-muted-foreground">
                  {data.profile.name}
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent role="navigation" aria-label="Administration sections">
        {["Workspace", "Content", "Configuration"].map((group) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation
                  .filter((item) => item.group === group)
                  .map(({ key, label, icon: Icon }) => {
                    const value =
                      key in data ? data[key as keyof PortfolioContent] : null;
                    return (
                      <SidebarMenuItem key={key}>
                        <SidebarMenuButton
                          type="button"
                          disabled={disabled}
                          isActive={active === key}
                          aria-current={active === key ? "page" : undefined}
                          tooltip={label}
                          onClick={() => {
                            onSelect(key);
                            setOpenMobile(false);
                          }}
                        >
                          <Icon />
                          <span>{label}</span>
                        </SidebarMenuButton>
                        {Array.isArray(value) && (
                          <SidebarMenuBadge>{value.length}</SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Open published website">
              <ActionAnchor
                href={publicPath(locale)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink />
                <span>View website</span>
              </ActionAnchor>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form
              action={logout}
              onSubmit={(event) => {
                if (
                  disabled ||
                  (hasChanges &&
                    !window.confirm(
                      "Discard unsaved workspace changes and sign out?",
                    ))
                )
                  event.preventDefault();
              }}
            >
              <SidebarMenuButton
                type="submit"
                disabled={disabled}
                tooltip="Sign out"
              >
                <LogOut />
                <span>Sign out</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
