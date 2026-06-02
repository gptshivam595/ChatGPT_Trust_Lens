import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  sidebarOpen: boolean;
  trustLens?: ReactNode;
  trustLensOpen?: boolean;
  trustLensRail?: ReactNode;
  canShowTrustLens?: boolean;
  onCloseSidebar: () => void;
  onCloseTrustLens?: () => void;
}

export function AppLayout({
  children,
  sidebar,
  sidebarOpen,
  trustLens,
  trustLensOpen = false,
  trustLensRail,
  canShowTrustLens = false,
  onCloseSidebar,
  onCloseTrustLens,
}: AppLayoutProps) {
  return (
    <div className="app-shell bg-tl-bg text-tl-text">
      <aside className="hidden w-[260px] shrink-0 border-r border-tl-sidebar-muted/60 bg-tl-sidebar text-tl-accent-ink lg:block">
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">{children}</div>

      {canShowTrustLens && trustLensOpen && trustLens ? (
        <>
          <aside className="hidden h-full w-[420px] shrink-0 border-l border-tl-border bg-tl-surface lg:block">
            {trustLens}
          </aside>
          <div
            aria-label="Trust Lens drawer"
            className="fixed inset-0 z-trust-lens lg:hidden"
          >
            <button
              aria-label="Close Trust Lens"
              className="absolute inset-0 cursor-default bg-tl-text/30"
              type="button"
              onClick={onCloseTrustLens}
            />
            <aside className="relative ml-auto h-full w-full bg-tl-surface shadow-tl-soft sm:max-w-[420px]">
              {trustLens}
            </aside>
          </div>
        </>
      ) : null}

      {canShowTrustLens && !trustLensOpen && trustLensRail ? (
        <>
          <aside className="hidden h-full w-12 shrink-0 border-l border-tl-border bg-tl-panel lg:block">
            {trustLensRail}
          </aside>
          <div className="fixed bottom-24 right-3 z-trust-lens overflow-hidden rounded-[10px] border border-tl-border bg-tl-panel shadow-tl-soft lg:hidden">
            {trustLensRail}
          </div>
        </>
      ) : null}

      {sidebarOpen ? (
        <div className="fixed inset-0 z-sidebar lg:hidden" aria-label="Sidebar drawer">
          <button
            aria-label="Close sidebar"
            className="absolute inset-0 cursor-default bg-tl-text/30"
            type="button"
            onClick={onCloseSidebar}
          />
          <aside className="relative h-full w-full max-w-[340px] bg-tl-sidebar text-tl-accent-ink shadow-tl-soft sm:max-w-[360px]">
            {sidebar}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
