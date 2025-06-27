"use client";

import { useFiles } from '@/context/file-context';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function Breadcrumbs() {
  const { path, navigateTo } = useFiles();

  return (
    <nav className="flex items-center text-sm font-medium text-muted-foreground">
      {path.map((p, index) => (
        <div key={p.id} className="flex items-center">
          <button
            onClick={() => navigateTo(p.id)}
            className="hover:text-primary disabled:cursor-not-allowed disabled:text-foreground disabled:hover:text-foreground"
            disabled={index === path.length - 1}
          >
            {p.name}
          </button>
          {index < path.length - 1 && <ChevronRight className="h-4 w-4" />}
        </div>
      ))}
    </nav>
  );
}
