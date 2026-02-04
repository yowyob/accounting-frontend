// components/accounting/operation-comptable-detail-view.tsx
"use client";

import React, { useState } from 'react';
import { OperationComptableDto } from '@/src/lib2/models/OperationComptableDto';
import { OperationComptableReadView } from './operation-comptable-read-view';
import { OperationForm } from './settings/operation-form';
import { Button } from '@/components/ui/button';
import { Edit, ArrowLeft, Trash2 } from 'lucide-react';

interface OperationComptableDetailViewProps {
  operation: OperationComptableDto;
  onSave: (data: OperationComptableDto) => Promise<void>;
  onDelete: (operation: OperationComptableDto) => void;
  onBack: () => void;
}

export const OperationComptableDetailView: React.FC<OperationComptableDetailViewProps> = ({
  operation,
  onSave,
  onDelete,
  onBack,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour à la vue lecture
        </Button>
        <OperationForm
          initialData={operation}
          onSave={async (data) => {
            await onSave(data);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
          >
            <Edit className="h-4 w-4 mr-2" /> Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(operation)}
            className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Supprimer
          </Button>
        </div>
      </div>

      <OperationComptableReadView operation={operation} />
    </div>
  );
};