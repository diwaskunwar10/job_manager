/**
 * Process List Component
 *
 * Displays a list of available processes with their descriptions and schemas.
 * Allows viewing schema details in a popover.
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Settings, ExternalLink, Check, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { SchemaViewer } from '@/components/ui/schema-viewer';
import { SchemaForm } from '@/components/ui/schema-form';

interface ProcessSchema {
  [key: string]: {
    type: string;
    description: string;
    items?: {
      type: string;
      format?: string;
    };
    default?: string;
  };
}

interface Process {
  name: string;
  description: string;
  schema: ProcessSchema;
}

interface ProcessListProps {
  processes: Record<string, Process>;
  onSelectProcess: (processName: string) => void;
  selectedProcess?: string;
  isLoading: boolean;
}

const ProcessList: React.FC<ProcessListProps> = ({
  processes,
  onSelectProcess,
  selectedProcess,
  isLoading,
}) => {
  const [viewSchemaProcess, setViewSchemaProcess] = useState<string | null>(null);
  const [showParameters, setShowParameters] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="w-8 h-8 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        <p className="ml-3">Loading processes...</p>
      </div>
    );
  }

  if (!processes || Object.keys(processes).length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">No processes available</p>
      </div>
    );
  }

  // We'll use the SchemaViewer component instead of custom rendering

  return (
    <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto p-2">
      {Object.entries(processes).map(([processName, process]) => (
        <Card
          key={processName}
          className={`cursor-pointer transition-colors ${
            selectedProcess === processName ? 'border-blue-500 bg-gray-50' : ''
          }`}
          onClick={() => {
            // Toggle selection - if already selected, unselect it
            if (selectedProcess === processName) {
              onSelectProcess('');
            } else {
              onSelectProcess(processName);
            }
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{process.name}</CardTitle>
                <CardDescription className="text-sm">
                  {process.description}
                </CardDescription>
              </div>
              <div className="flex space-x-1">
                {/* Toggle Parameters Button */}
                <Button
                  variant={showParameters[processName] ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0 relative group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowParameters(prev => ({
                      ...prev,
                      [processName]: !prev[processName]
                    }));
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">Toggle parameters</span>
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {showParameters[processName] ? "Hide parameters" : "Show parameters"}
                  </span>
                </Button>

                {/* Selection indicator */}
                {selectedProcess === processName && (
                  <div className="h-8 w-8 flex items-center justify-center">
                    <Check className="h-4 w-4 text-blue-500" />
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default ProcessList;
