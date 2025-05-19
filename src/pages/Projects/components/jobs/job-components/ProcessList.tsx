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
        <div key={processName} className="space-y-2">
          <Card
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
                <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                  {/* View Parameters Button with Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 relative group"
                        onClick={(e) => {
                          // This is crucial to prevent the card's onClick from firing
                          e.stopPropagation();
                          // Prevent any parent click handlers from firing
                          e.preventDefault();
                        }}
                        onMouseDown={(e) => {
                          // Also prevent mousedown events from propagating
                          e.stopPropagation();
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View parameters</span>
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          View parameters
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{process.name} Parameters</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <SchemaViewer
                          schema={{
                            type: 'object',
                            properties: process.schema,
                            required: ['urls'] // Assuming urls is always required
                          }}
                          maxHeight="400px"
                          showTitle={false}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>

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

          {/* Schema is now shown in the popover */}
        </div>
      ))}
    </div>
  );
};

export default ProcessList;
