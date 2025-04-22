/**
 * Schema Form Example Page
 * 
 * This page demonstrates how to use the SchemaForm component to generate
 * forms based on JSON schemas.
 */

import React, { useState } from 'react';
import { SchemaForm, JsonSchema } from '@/components/ui/schema-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Example schemas
const exampleSchemas = {
  imageExtraction: {
    type: 'object',
    properties: {
      urls: {
        type: 'array',
        description: 'List of image URLs to process',
        items: {
          type: 'string',
          format: 'uri'
        }
      },
      project_name: {
        type: 'string',
        description: 'Optional project name',
        default: 'Image Extraction Project'
      },
      job_name: {
        type: 'string',
        description: 'Optional job name',
        default: 'Image Extraction Job'
      }
    },
    required: ['urls']
  },
  audioAnalysis: {
    type: 'object',
    properties: {
      urls: {
        type: 'array',
        description: 'List of audio URLs to process',
        items: {
          type: 'string',
          format: 'uri'
        }
      },
      project_name: {
        type: 'string',
        description: 'Optional project name',
        default: 'Audio Analysis Project'
      },
      job_name: {
        type: 'string',
        description: 'Optional job name',
        default: 'Audio Analysis Job'
      }
    },
    required: ['urls']
  },
  userProfile: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Full name of the user',
        minLength: 2,
        maxLength: 100
      },
      email: {
        type: 'string',
        description: 'Email address',
        format: 'email'
      },
      age: {
        type: 'integer',
        description: 'Age in years',
        minimum: 18,
        maximum: 120
      },
      bio: {
        type: 'string',
        description: 'Short biography',
        format: 'textarea',
        maxLength: 500
      },
      notifications: {
        type: 'boolean',
        description: 'Receive email notifications',
        default: true
      },
      interests: {
        type: 'array',
        description: 'List of interests',
        items: {
          type: 'string'
        }
      },
      theme: {
        type: 'string',
        description: 'UI theme preference',
        enum: ['light', 'dark', 'system'],
        default: 'system'
      }
    },
    required: ['name', 'email']
  }
};

const SchemaFormExample: React.FC = () => {
  const [activeSchema, setActiveSchema] = useState<keyof typeof exampleSchemas>('imageExtraction');
  const [customSchema, setCustomSchema] = useState<string>('');
  const [parsedSchema, setParsedSchema] = useState<JsonSchema | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submittedData, setSubmittedData] = useState<Record<string, any> | null>(null);

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

  const handleFormSubmit = (data: any) => {
    setSubmittedData(data);
  };

  const handleFormChange = (data: any) => {
    setFormData(data);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Schema Form Component</h1>
      <p className="text-gray-600 mb-8">
        This page demonstrates how to use the SchemaForm component to generate forms
        based on JSON schemas. The component automatically creates appropriate form fields
        based on the schema property types.
      </p>

      <Tabs defaultValue="examples" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="examples">Example Forms</TabsTrigger>
          <TabsTrigger value="custom">Custom Schema</TabsTrigger>
          <TabsTrigger value="usage">Usage Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="examples">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className={activeSchema === 'imageExtraction' ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Image Extraction</CardTitle>
                <CardDescription>Process images and extract data</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setActiveSchema('imageExtraction')}
                  variant={activeSchema === 'imageExtraction' ? 'default' : 'outline'}
                  className="w-full"
                >
                  Select
                </Button>
              </CardContent>
            </Card>

            <Card className={activeSchema === 'audioAnalysis' ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Audio Analysis</CardTitle>
                <CardDescription>Process audio files for analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setActiveSchema('audioAnalysis')}
                  variant={activeSchema === 'audioAnalysis' ? 'default' : 'outline'}
                  className="w-full"
                >
                  Select
                </Button>
              </CardContent>
            </Card>

            <Card className={activeSchema === 'userProfile' ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">User Profile</CardTitle>
                <CardDescription>User registration form</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setActiveSchema('userProfile')}
                  variant={activeSchema === 'userProfile' ? 'default' : 'outline'}
                  className="w-full"
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Form</CardTitle>
                <CardDescription>Generated from schema</CardDescription>
              </CardHeader>
              <CardContent>
                <SchemaForm 
                  schema={exampleSchemas[activeSchema]}
                  onSubmit={handleFormSubmit}
                  onChange={handleFormChange}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Data</CardTitle>
                <CardDescription>Current values and submitted data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Current Values:</h3>
                    <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs">
                      {JSON.stringify(formData, null, 2)}
                    </pre>
                  </div>
                  
                  {submittedData && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Submitted Data:</h3>
                      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-xs">
                        {JSON.stringify(submittedData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
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
                <CardTitle>Generated Form</CardTitle>
                <CardDescription>Based on your custom schema</CardDescription>
              </CardHeader>
              <CardContent>
                {parsedSchema ? (
                  <SchemaForm 
                    schema={parsedSchema}
                    onSubmit={handleFormSubmit}
                    onChange={handleFormChange}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-400">
                    {parseError ? 'Fix JSON errors to see form' : 'Enter a valid JSON schema to see form'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>How to Use the SchemaForm Component</CardTitle>
              <CardDescription>Import and use in any component</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Import</h3>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    {`import { SchemaForm } from '@/components/ui/schema-form';`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Basic Usage</h3>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                    {`// Define your schema
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Your name'
    },
    email: {
      type: 'string',
      description: 'Email address',
      format: 'email'
    }
  },
  required: ['name', 'email']
};

// Use the component
<SchemaForm 
  schema={schema}
  onSubmit={(data) => console.log('Form submitted:', data)}
  onChange={(data) => console.log('Form changed:', data)}
  initialValues={{ name: 'John Doe' }}
  submitButtonText="Save"
/>`}
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Props</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">schema</code>: The JSON schema object that defines the form</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">onSubmit</code>: Optional callback function called when the form is submitted</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">onChange</code>: Optional callback function called when any form value changes</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">initialValues</code>: Optional object with initial form values</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">submitButtonText</code>: Optional text for the submit button (default: "Submit")</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">showSubmitButton</code>: Optional boolean to show/hide the submit button (default: true)</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">className</code>: Optional CSS class names</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Supported Schema Properties</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">type</code>: string, number, integer, boolean, array</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">description</code>: Displayed as help text</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">default</code>: Default value</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">enum</code>: Array of allowed values (creates a dropdown)</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">format</code>: email, uri, textarea</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">minimum/maximum</code>: For number/integer types</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">minLength/maxLength</code>: For string types</li>
                    <li><code className="bg-gray-100 px-1 py-0.5 rounded">pattern</code>: Regex pattern for validation</li>
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

export default SchemaFormExample;
