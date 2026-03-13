"use client";
import React from 'react';
import { UserRole } from '@/types/shuuri';
import { Bell } from 'lucide-react';

interface HeaderProps {
  userRole: UserRole;
  userName: string;
}

const ROLE_LABELS: Record<UserRole, string> = {
  RESTAURANTE: 'Portal Restaurante',
  TECNICO: 'Portal Técnico',
  PROVEEDOR: 'Portal Proveedor',
  SHUURI_ADMIN: 'Panel Administración',
};

export default function Header({ userRole, userName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-8">
      <p className="text-sm font-medium text-gray-500">{ROLE_LABELS[userRole]}</p>
      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#2698D1]" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2698D1] text-white text-xs font-bold">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-[#0D0D0D]">{userName}</span>
        </div>
      </div>
    </header>
  );
}