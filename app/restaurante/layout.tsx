"use client";
import React, { useState, useEffect } from 'react';
import { SidebarContext } from '@/context/SidebarContext';

const LS_KEY = 'shuuri-sidebar-collapsed';

export default function RestauranteLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LS_KEY) === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, String(collapsed));
    document.documentElement.style.setProperty('--sidebar-w', collapsed ? '64px' : '256px');
  }, [collapsed]);

  function toggle() {
    setCollapsed(c => !c);
  }

  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}
