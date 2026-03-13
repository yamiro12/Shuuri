"use client";
import { createContext, useContext } from 'react';

export interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebarContext() {
  return useContext(SidebarContext);
}
