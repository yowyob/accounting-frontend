"use client";

import React from 'react';
import { useCompose } from '@/hooks/use-compose-store';
import { Button } from '@/components/ui/button';
import { Minimize, Maximize, X } from 'lucide-react';

export const ComposeModal: React.FC = () => {
  const { isOpen, isMinimized, isMaximized, title, content, onClose, onToggleMinimize, onToggleMaximize } = useCompose();

  if (!isOpen || isMinimized) return null;

  const modalClasses = `fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-all duration-300 ${isMaximized ? 'h-screen w-screen' : 'max-w-4xl w-full mx-auto p-4'
    }`;

  const contentClasses = `bg-white rounded-lg shadow-2xl p-6 transform transition-all duration-300 ${isMaximized ? 'h-full w-full' : 'max-h-[90vh] overflow-y-auto'
    }`;

  return (
    <div className={modalClasses}>
      <div className={contentClasses}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-blue-600">{title}</h2>
          <div className="space-x-2">
            <Button variant="ghost" size="icon" onClick={onToggleMinimize}>
              <Minimize className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onToggleMaximize}>
              <Maximize className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="mt-2">
          {content && (
            <div className="w-full">
              {content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};