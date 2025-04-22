/**
 * Schema Form Component
 * 
 * A reusable component that generates a form based on a JSON schema.
 * Supports different input types based on schema property types.
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

interface SchemaFormProps {
  schema: JsonSchema;
  className?: string;
  onSubmit?: (data: any) => void;
  initialValues?: Record<string, any>;
  submitButtonText?: string;
  showSubmitButton?: boolean;
  onChange?: (data: any) => void;
}

const SchemaForm: React.FC<SchemaFormProps> = ({
  schema,
  className,
  onSubmit,
  initialValues = {},
  submitButtonText = 'Submit',
  showSubmitButton = true,
  onChange
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data with default values from schema
  useEffect(() => {
    if (schema.properties) {
      const defaultValues: Record<string, any> = {};
      
      Object.entries(schema.properties).forEach(([key, property]) => {
        // If there's an initial value, use it
        if (initialValues && initialValues[key] !== undefined) {
          defaultValues[key] = initialValues[key];
        } 
        // Otherwise use the default from schema if available
        else if (property.default !== undefined) {
          defaultValues[key] = property.default;
        } 
        // Or initialize with appropriate empty value based on type
        else {
          switch (property.type) {
            case 'string':
              defaultValues[key] = '';
              break;
            case 'number':
            case 'integer':
              defaultValues[key] = null;
              break;
            case 'boolean':
              defaultValues[key] = false;
              break;
            case 'array':
              defaultValues[key] = [];
              break;
            case 'object':
              defaultValues[key] = {};
              break;
            default:
              defaultValues[key] = null;
          }
        }
      });
      
      setFormData(prev => ({ ...prev, ...defaultValues }));
    }
  }, [schema, initialValues]);

  // Notify parent component when form data changes
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleArrayItemChange = (name: string, index: number, value: any) => {
    setFormData(prev => {
      const array = [...(prev[name] || [])];
      array[index] = value;
      return { ...prev, [name]: array };
    });
  };

  const addArrayItem = (name: string) => {
    setFormData(prev => {
      const array = [...(prev[name] || [])];
      const itemType = schema.properties?.[name]?.items?.type || 'string';
      
      // Add appropriate empty value based on item type
      switch (itemType) {
        case 'string':
          array.push('');
          break;
        case 'number':
        case 'integer':
          array.push(null);
          break;
        case 'boolean':
          array.push(false);
          break;
        case 'object':
          array.push({});
          break;
        default:
          array.push('');
      }
      
      return { ...prev, [name]: array };
    });
  };

  const removeArrayItem = (name: string, index: number) => {
    setFormData(prev => {
      const array = [...(prev[name] || [])];
      array.splice(index, 1);
      return { ...prev, [name]: array };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (schema.properties) {
      Object.entries(schema.properties).forEach(([key, property]) => {
        const value = formData[key];
        const isRequired = schema.required?.includes(key);

        // Check required fields
        if (isRequired && (value === undefined || value === null || value === '')) {
          newErrors[key] = 'This field is required';
          isValid = false;
          return;
        }

        // Skip further validation if field is empty and not required
        if (value === undefined || value === null || value === '') {
          return;
        }

        // Type validation
        switch (property.type) {
          case 'string':
            if (typeof value !== 'string') {
              newErrors[key] = 'Must be a string';
              isValid = false;
            } else {
              // String-specific validations
              if (property.minLength !== undefined && value.length < property.minLength) {
                newErrors[key] = `Must be at least ${property.minLength} characters`;
                isValid = false;
              }
              if (property.maxLength !== undefined && value.length > property.maxLength) {
                newErrors[key] = `Must be at most ${property.maxLength} characters`;
                isValid = false;
              }
              if (property.pattern && !new RegExp(property.pattern).test(value)) {
                newErrors[key] = 'Invalid format';
                isValid = false;
              }
              if (property.format === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                newErrors[key] = 'Invalid email format';
                isValid = false;
              }
              if (property.format === 'uri' && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value)) {
                newErrors[key] = 'Invalid URL format';
                isValid = false;
              }
            }
            break;
          case 'number':
          case 'integer':
            if (typeof value !== 'number') {
              newErrors[key] = `Must be a ${property.type}`;
              isValid = false;
            } else {
              // Number-specific validations
              if (property.minimum !== undefined && value < property.minimum) {
                newErrors[key] = `Must be at least ${property.minimum}`;
                isValid = false;
              }
              if (property.maximum !== undefined && value > property.maximum) {
                newErrors[key] = `Must be at most ${property.maximum}`;
                isValid = false;
              }
              if (property.type === 'integer' && !Number.isInteger(value)) {
                newErrors[key] = 'Must be an integer';
                isValid = false;
              }
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              newErrors[key] = 'Must be a boolean';
              isValid = false;
            }
            break;
          case 'array':
            if (!Array.isArray(value)) {
              newErrors[key] = 'Must be an array';
              isValid = false;
            } else if (property.minItems !== undefined && value.length < property.minItems) {
              newErrors[key] = `Must have at least ${property.minItems} items`;
              isValid = false;
            } else if (property.maxItems !== undefined && value.length > property.maxItems) {
              newErrors[key] = `Must have at most ${property.maxItems} items`;
              isValid = false;
            }
            break;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && onSubmit) {
      onSubmit(formData);
    }
  };

  const renderField = (name: string, property: SchemaProperty, required: boolean = false) => {
    const value = formData[name];
    const error = errors[name];
    const isRequired = required;

    switch (property.type) {
      case 'string':
        // Handle enum as select
        if (property.enum) {
          return (
            <div className="mb-4" key={name}>
              <div className="flex items-center mb-1">
                <Label htmlFor={name} className="font-medium">
                  {name}
                </Label>
                {isRequired && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
                {property.type && <Badge variant="outline" className="ml-2">{property.type}</Badge>}
              </div>
              {property.description && (
                <p className="text-sm text-gray-500 mb-2">{property.description}</p>
              )}
              <Select
                value={value || ''}
                onValueChange={(val) => handleChange(name, val)}
              >
                <SelectTrigger id={name} className={error ? 'border-red-500' : ''}>
                  <SelectValue placeholder={`Select ${name}`} />
                </SelectTrigger>
                <SelectContent>
                  {property.enum.map((option: any) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              {property.default !== undefined && (
                <p className="text-xs text-gray-400 mt-1">Default: {property.default}</p>
              )}
            </div>
          );
        }
        
        // Handle long text with textarea
        if (property.format === 'textarea' || (property.maxLength && property.maxLength > 100)) {
          return (
            <div className="mb-4" key={name}>
              <div className="flex items-center mb-1">
                <Label htmlFor={name} className="font-medium">
                  {name}
                </Label>
                {isRequired && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
                {property.type && <Badge variant="outline" className="ml-2">{property.type}</Badge>}
              </div>
              {property.description && (
                <p className="text-sm text-gray-500 mb-2">{property.description}</p>
              )}
              <Textarea
                id={name}
                value={value || ''}
                onChange={(e) => handleChange(name, e.target.value)}
                placeholder={`Enter ${name}`}
                className={error ? 'border-red-500' : ''}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              {property.default !== undefined && (
                <p className="text-xs text-gray-400 mt-1">Default: {property.default}</p>
              )}
            </div>
          );
        }
        
        // Default to input for strings
        return (
          <div className="mb-4" key={name}>
            <div className="flex items-center mb-1">
              <Label htmlFor={name} className="font-medium">
                {name}
              </Label>
              {isRequired && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
              {property.type && <Badge variant="outline" className="ml-2">{property.type}</Badge>}
              {property.format && <Badge variant="outline" className="ml-1 text-xs">{property.format}</Badge>}
            </div>
            {property.description && (
              <p className="text-sm text-gray-500 mb-2">{property.description}</p>
            )}
            <Input
              id={name}
              type={property.format === 'email' ? 'email' : property.format === 'uri' ? 'url' : 'text'}
              value={value || ''}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder={`Enter ${name}`}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            {property.default !== undefined && (
              <p className="text-xs text-gray-400 mt-1">Default: {property.default}</p>
            )}
          </div>
        );
        
      case 'number':
      case 'integer':
        return (
          <div className="mb-4" key={name}>
            <div className="flex items-center mb-1">
              <Label htmlFor={name} className="font-medium">
                {name}
              </Label>
              {isRequired && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
              {property.type && <Badge variant="outline" className="ml-2">{property.type}</Badge>}
            </div>
            {property.description && (
              <p className="text-sm text-gray-500 mb-2">{property.description}</p>
            )}
            <Input
              id={name}
              type="number"
              value={value === null ? '' : value}
              onChange={(e) => {
                const val = e.target.value === '' ? null : Number(e.target.value);
                handleChange(name, val);
              }}
              placeholder={`Enter ${name}`}
              className={error ? 'border-red-500' : ''}
              min={property.minimum}
              max={property.maximum}
              step={property.type === 'integer' ? 1 : 'any'}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            {property.default !== undefined && (
              <p className="text-xs text-gray-400 mt-1">Default: {property.default}</p>
            )}
          </div>
        );
        
      case 'boolean':
        return (
          <div className="mb-4" key={name}>
            <div className="flex items-center mb-1">
              <Label htmlFor={name} className="font-medium">
                {name}
              </Label>
              {isRequired && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
              {property.type && <Badge variant="outline" className="ml-2">{property.type}</Badge>}
            </div>
            {property.description && (
              <p className="text-sm text-gray-500 mb-2">{property.description}</p>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id={name}
                checked={!!value}
                onCheckedChange={(checked) => handleChange(name, !!checked)}
              />
              <Label htmlFor={name} className="text-sm">
                {value ? 'Yes' : 'No'}
              </Label>
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            {property.default !== undefined && (
              <p className="text-xs text-gray-400 mt-1">Default: {property.default.toString()}</p>
            )}
          </div>
        );
        
      case 'array':
        return (
          <div className="mb-4" key={name}>
            <div className="flex items-center mb-1">
              <Label htmlFor={name} className="font-medium">
                {name}
              </Label>
              {isRequired && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
              {property.type && <Badge variant="outline" className="ml-2">{property.type}</Badge>}
            </div>
            {property.description && (
              <p className="text-sm text-gray-500 mb-2">{property.description}</p>
            )}
            
            <div className="space-y-2 mb-2">
              {Array.isArray(value) && value.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={item || ''}
                    onChange={(e) => handleArrayItemChange(name, index, e.target.value)}
                    placeholder={`Enter item ${index + 1}`}
                    className={error ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem(name, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(name)}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
            
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        );
        
      case 'object':
        // For objects, we could recursively render nested forms,
        // but for simplicity, we'll just show a message
        return (
          <div className="mb-4" key={name}>
            <div className="flex items-center mb-1">
              <Label htmlFor={name} className="font-medium">
                {name}
              </Label>
              {isRequired && <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>}
              {property.type && <Badge variant="outline" className="ml-2">{property.type}</Badge>}
            </div>
            {property.description && (
              <p className="text-sm text-gray-500 mb-2">{property.description}</p>
            )}
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">
                  Object properties are not supported in this form.
                </p>
              </CardContent>
            </Card>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      {schema.properties && Object.entries(schema.properties).map(([name, property]) => 
        renderField(name, property, schema.required?.includes(name) || false)
      )}
      
      {showSubmitButton && (
        <div className="mt-6">
          <Button type="submit">{submitButtonText}</Button>
        </div>
      )}
    </form>
  );
};

export { SchemaForm };
export type { JsonSchema, SchemaProperty };
