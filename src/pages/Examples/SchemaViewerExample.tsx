/**
 * Schema Viewer Example Page
 * 
 * This page demonstrates how to use the SchemaViewer component globally
 * with different JSON schemas.
 */

import React, { useState } from 'react';
import { SchemaViewer, JsonSchema } from '@/components/ui/schema-viewer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

// Example schemas
const exampleSchemas = {
  simple: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'The name of the user',
        minLength: 3,
        maxLength: 50
      },
      email: {
        type: 'string',
        description: 'Email address',
        format: 'email'
      },
      age: {
        type: 'integer',
        description: 'Age in years',
        minimum: 0,
        maximum: 120
      },
      isActive: {
        type: 'boolean',
        description: 'Whether the user is active',
        default: true
      }
    },
    required: ['name', 'email']
  },
  nested: {
    type: 'object',
    properties: {
      user: {
        type: 'object',
        description: 'User information',
        properties: {
          name: {
            type: 'string',
            description: 'Full name'
          },
          contact: {
            type: 'object',
            description: 'Contact information',
            properties: {
              email: {
                type: 'string',
                description: 'Email address',
                format: 'email'
              },
              phone: {
                type: 'string',
                description: 'Phone number',
                pattern: '^[0-9]{10}$'
              }
            },
            required: ['email']
          }
        },
        required: ['name']
      },
      preferences: {
        type: 'object',
        description: 'User preferences',
        properties: {
          theme: {
            type: 'string',
            description: 'UI theme',
            enum: ['light', 'dark', 'system']
          },
          notifications: {
            type: 'boolean',
            description: 'Enable notifications',
            default: true
          }
        }
      }
    },
    required: ['user']
  },
  array: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        description: 'List of items',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier'
            },
            name: {
              type: 'string',
              description: 'Item name'
            },
            price: {
              type: 'number',
              description: 'Item price',
              minimum: 0
            },
            tags: {
              type: 'array',
              description: 'Item tags',
              items: {
                type: 'string'
              }
            }
          },
          required: ['id', 'name', 'price']
        }
      },
      totalCount: {
        type: 'integer',
        description: 'Total number of items',
        minimum: 0
      }
    },
    required: ['items']
  }
};

const SchemaViewerExample: React.FC = () => {
  const [customSchema, setCustomSchema] = useState<string>('');
  const [parsedSchema, setParsedSchema] = useState<JsonSchema | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleCustomSchemaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomSchema(e.target.value);
    try {
      if (e.target.value.trim()) {
        const parsed = JSON.parse(e.target.value);
        setParsedSchema(parsed);
        setParseError(null);
      } else {
        setParsedSchema(null);
        setParseError(null);
      }
    } catch (error) {
      setParsedSchema(null);
      setParseError('Invalid JSON: ' + (error as Error).message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Schema Viewer Component</h1>
      <p className="text-gray-600 mb-8">
        This page demonstrates how to use the SchemaViewer component to visualize JSON schemas
        in a form-like interface. You can use this component anywhere in your application.
      </p>

      <Tabs defaultValue="examples">
        <TabsList className="mb-4">
          <TabsTrigger value="examples">Example Schemas</TabsTrigger>
          <TabsTrigger value="custom">Custom Schema</TabsTrigger>
          <TabsTrigger value="usage">Usage Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="examples">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Simple Schema</CardTitle>
                <CardDescription>Basic user information schema</CardDescription>
              </CardHeader>
              <CardContent>
                <SchemaViewer schema={exampleSchemas.simple} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nested Schema</CardTitle>
                <CardDescription>Schema with nested objects</CardDescription>
              </CardHeader>
              <CardContent>
                <SchemaViewer schema={exampleSchemas.nested} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Array Schema</CardTitle>
                <CardDescription>Schema with array of objects</CardDescription>
              </CardHeader>
              <CardContent>
                <SchemaViewer schema={exampleSchemas.array} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom JSON Schema</CardTitle>
                <CardDescription>Enter your own JSON schema</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your JSON schema here..."
                  className="min-h-[300px] font-mono"
                  value={customSchema}
                  onChange={handleCustomSchemaChange}
                />
                {parseError && (
                  <p className="text-red-500 mt-2 text-sm">{parseError}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Visualization of your schema</CardDescription>
              </CardHeader>
              <CardContent>
                {parsedSchema ? (
                  <SchemaViewer schema={parsedSchema} />
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-400">
                    {parseError ? 'Fix JSON errors to see preview' : 'Enter a valid JSON schema to see preview'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>How to Use the SchemaViewer Component</CardTitle>
              <CardDescription>Import and use in any component</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Import</h3>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    {`import { SchemaViewer } from '@/components/ui/schema-viewer';`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Basic Usage</h3>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    {`<SchemaViewer 
  schema={yourJsonSchema} 
  maxHeight="400px"
  showTitle={true}
  title="Schema Title"
/>`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Props</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">schema</code>: The JSON schema object to display</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">className</code>: Optional CSS class names</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">maxHeight</code>: Maximum height of the schema viewer (default: '400px')</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">showTitle</code>: Whether to show the title (default: true)</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">title</code>: Title to display (default: 'Schema')</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchemaViewerExample;
