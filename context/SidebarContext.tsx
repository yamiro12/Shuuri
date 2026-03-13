"use client";
import { createContext, useContext } from 'react';

export interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

/** Returns the sidebar context if provided by a parent layout, otherwise null. */
export function useSidebarContext() {
  return useContext(SidebarContext);
}
