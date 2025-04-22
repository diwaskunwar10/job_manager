/**
 * Schema Viewer Component
 * 
 * A reusable component that visualizes JSON schema as a form-like interface.
 * Can be used to display schema information in a structured, readable format.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SchemaProperty {
  type: string;
  description?: string;
  format?: string;
  default?: any;
  enum?: any[];
  items?: SchemaProperty;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  [key: string]: any;
}

interface JsonSchema {
  type?: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  description?: string;
  [key: string]: any;
}

interface SchemaViewerProps {
  schema: JsonSchema;
  className?: string;
  maxHeight?: string | number;
  showTitle?: boolean;
  title?: string;
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({
  schema,
  className,
  maxHeight = '400px',
  showTitle = true,
  title = 'Schema'
}) => {
  // Function to render a property based on its type
  const renderProperty = (
    name: string,
    property: SchemaProperty,
    required: boolean = false,
    level: number = 0
  ) => {
    const isRequired = required;
    const indent = level * 16; // 16px indentation per level

    // Handle nested objects
    if (property.type === 'object' && property.properties) {
      return (
        <Collapsible key={name} className="w-full">
          <div className="flex items-center mb-1" style={{ marginLeft: `${indent}px` }}>
            <CollapsibleTrigger className="flex items-center hover:text-blue-600 transition-colors">
              <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90" />
              <span className="font-medium">{name}</span>
            </CollapsibleTrigger>
            <Badge variant="outline" className="ml-2">object</Badge>
            {isRequired && (
              <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
            )}
          </div>
          {property.description && (
            <p className="text-sm text-gray-500 mb-2" style={{ marginLeft: `${indent + 20}px` }}>
              {property.description}
            </p>
          )}
          <CollapsibleContent>
            <div className="border-l-2 border-gray-200 pl-4 ml-2 mt-1 mb-2">
              {Object.entries(property.properties).map(([propName, propSchema]) => 
                renderProperty(
                  propName, 
                  propSchema, 
                  property.required?.includes(propName) || false,
                  level + 1
                )
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    // Handle arrays
    if (property.type === 'array' && property.items) {
      return (
        <Collapsible key={name} className="w-full">
          <div className="flex items-center mb-1" style={{ marginLeft: `${indent}px` }}>
            <CollapsibleTrigger className="flex items-center hover:text-blue-600 transition-colors">
              <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90" />
              <span className="font-medium">{name}</span>
            </CollapsibleTrigger>
            <Badge variant="outline" className="ml-2">array</Badge>
            {isRequired && (
              <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
            )}
          </div>
          {property.description && (
            <p className="text-sm text-gray-500 mb-2" style={{ marginLeft: `${indent + 20}px` }}>
              {property.description}
            </p>
          )}
          <CollapsibleContent>
            <div className="border-l-2 border-gray-200 pl-4 ml-2 mt-1 mb-2">
              <div className="flex items-center mb-1" style={{ marginLeft: `${indent + 16}px` }}>
                <span className="font-medium text-sm">Items</span>
                <Badge variant="outline" className="ml-2">{property.items.type}</Badge>
              </div>
              {property.items.description && (
                <p className="text-sm text-gray-500 mb-2" style={{ marginLeft: `${indent + 36}px` }}>
                  {property.items.description}
                </p>
              )}
              {property.items.type === 'object' && property.items.properties && (
                <div className="pl-4">
                  {Object.entries(property.items.properties).map(([propName, propSchema]) => 
                    renderProperty(
                      propName, 
                      propSchema, 
                      property.items?.required?.includes(propName) || false,
                      level + 2
                    )
                  )}
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    // Handle primitive types
    return (
      <div key={name} className="mb-3" style={{ marginLeft: `${indent}px` }}>
        <div className="flex items-center">
          <span className="font-medium">{name}</span>
          <Badge variant="outline" className="ml-2">{property.type}</Badge>
          {property.format && (
            <Badge variant="outline" className="ml-1 text-xs">{property.format}</Badge>
          )}
          {isRequired && (
            <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
          )}
        </div>
        {property.description && (
          <p className="text-sm text-gray-500 mt-1">{property.description}</p>
        )}
        <div className="text-xs text-gray-400 mt-1 space-y-1">
          {property.default !== undefined && (
            <div>Default: <code className="bg-gray-100 px-1 py-0.5 rounded">{JSON.stringify(property.default)}</code></div>
          )}
          {property.enum && (
            <div>
              Allowed values: 
              <div className="flex flex-wrap gap-1 mt-1">
                {property.enum.map((value: any, index: number) => (
                  <code key={index} className="bg-gray-100 px-1 py-0.5 rounded">{JSON.stringify(value)}</code>
                ))}
              </div>
            </div>
          )}
          {(property.minimum !== undefined || property.maximum !== undefined) && (
            <div>
              Range: 
              {property.minimum !== undefined && <span> min: {property.minimum}</span>}
              {property.maximum !== undefined && <span> max: {property.maximum}</span>}
            </div>
          )}
          {(property.minLength !== undefined || property.maxLength !== undefined) && (
            <div>
              Length: 
              {property.minLength !== undefined && <span> min: {property.minLength}</span>}
              {property.maxLength !== undefined && <span> max: {property.maxLength}</span>}
            </div>
          )}
          {property.pattern && (
            <div>Pattern: <code className="bg-gray-100 px-1 py-0.5 rounded">{property.pattern}</code></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        {showTitle && <h3 className="text-lg font-medium mb-4">{title}</h3>}
        <ScrollArea className="pr-4" style={{ maxHeight }}>
          <div className="space-y-4">
            {schema.description && (
              <p className="text-sm text-gray-500 mb-4">{schema.description}</p>
            )}
            {schema.properties && Object.entries(schema.properties).map(([name, property]) => 
              renderProperty(name, property, schema.required?.includes(name) || false)
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export { SchemaViewer };
export type { JsonSchema, SchemaProperty };
