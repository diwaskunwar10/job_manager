import React, { useState, useRef } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { httpBase } from '@/utils/httpBase';
import { JOBS } from '@/constants/apiEndpoints';
import { Link, Loader2, Plus, X, Image, File, Video, Music, Upload, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Form validation schema
const mediaFormSchema = z.object({
  media_uris: z.array(
    z.object({
      url: z.string().url({ message: 'Please enter a valid URL' })
    })
  ).optional().default([]),
  media_files: z.any().optional(),
}).refine(data =>
  (data.media_uris && data.media_uris.length > 0 && data.media_uris.some(item => item.url.trim() !== '')) ||
  data.media_files,
{
  message: 'At least one URL or file must be provided',
  path: ['media_uris']
});

type MediaFormValues = z.infer<typeof mediaFormSchema>;

interface AddMediaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  onMediaAdded?: () => void;
}

const AddMediaDialog: React.FC<AddMediaDialogProps> = ({
  isOpen,
  onOpenChange,
  jobId,
  onMediaAdded,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Initialize form
  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      media_uris: [{ url: '' }],
      media_files: undefined,
    },
  });

  // Setup field array for dynamic URL inputs
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "media_uris",
  });

  const onSubmit = async (values: MediaFormValues) => {
    if (!jobId) {
      toast({
        title: 'Error',
        description: 'Job ID is required to add media.',
        variant: 'destructive',
      });
      return;
    }

    // Check if we have at least one valid URL or file
    const hasValidUrls = values.media_uris && values.media_uris.some(item => item.url.trim() !== '');
    const hasFiles = fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0;

    if (!hasValidUrls && !hasFiles) {
      toast({
        title: 'Error',
        description: 'Please provide at least one URL or file.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Add URLs if provided
      if (hasValidUrls) {
        // Filter out empty URLs and join with commas
        const validUrls = values.media_uris
          .filter(item => item.url.trim() !== '')
          .map(item => item.url.trim());

        // Add each URL as a separate entry
        validUrls.forEach(url => {
          formData.append('media_uris', url);
        });
      }

      // Add files if provided
      const fileInput = fileInputRef.current;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        for (let i = 0; i < fileInput.files.length; i++) {
          formData.append('media_files', fileInput.files[i]);
        }
      }

      // Send the request
      await httpBase.post(
        JOBS.ADD_MEDIA(jobId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast({
        title: 'Media Added',
        description: 'The files and/or URLs have been successfully added to the job.',
      });

      if (onMediaAdded) {
        onMediaAdded();
      }

      // Reset form and close dialog
      form.reset({
        media_uris: [{ url: '' }],
        media_files: undefined,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Clean up any remaining object URLs
      selectedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          // This is a safety measure to ensure we don't leave any memory leaks
          // from thumbnails that might have been created
          URL.revokeObjectURL(URL.createObjectURL(file));
        }
      });
      setSelectedFiles([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding media to job:', error);
      toast({
        title: 'Error',
        description: 'Failed to add media to job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // State for file preview and drag-and-drop
  const [previewFile, setPreviewFile] = useState<{ file: File, url: string, index: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Update form value
      form.setValue('media_files', e.target.files);

      // Update selected files display
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
    }
  };

  // Remove a file from the selected files
  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prevFiles => {
      const newFiles = [...prevFiles];

      // If the removed file is being previewed, clear the preview
      if (previewFile && previewFile.file === newFiles[indexToRemove]) {
        setPreviewFile(null);
      }

      newFiles.splice(indexToRemove, 1);

      // If all files are removed, clear the form value
      if (newFiles.length === 0) {
        form.setValue('media_files', undefined);
      } else {
        // Create a new FileList-like object with the remaining files
        const dataTransfer = new DataTransfer();
        newFiles.forEach(file => {
          dataTransfer.items.add(file);
        });
        form.setValue('media_files', dataTransfer.files);

        // Also update the file input element if it exists
        if (fileInputRef.current) {
          fileInputRef.current.files = dataTransfer.files;
        }
      }

      return newFiles;
    });
  };

  // Clear all selected files
  const clearAllFiles = () => {
    setSelectedFiles([]);
    setPreviewFile(null);
    form.setValue('media_files', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Update form value
      form.setValue('media_files', e.dataTransfer.files);

      // Update selected files display
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...filesArray]);
    }
  };

  // Preview a file
  const handlePreviewFile = (file: File, index: number) => {
    // Create URLs for all files for navigation
    const url = URL.createObjectURL(file);
    setPreviewFile({ file, url, index });
  };

  // Navigate between files in preview
  const navigatePreview = (direction: 'prev' | 'next') => {
    if (!previewFile || selectedFiles.length <= 1) return;

    let newIndex = previewFile.index;
    if (direction === 'prev') {
      newIndex = (newIndex - 1 + selectedFiles.length) % selectedFiles.length;
    } else {
      newIndex = (newIndex + 1) % selectedFiles.length;
    }

    // Clean up previous URL
    URL.revokeObjectURL(previewFile.url);

    // Create new preview
    const newFile = selectedFiles[newIndex];
    const newUrl = URL.createObjectURL(newFile);
    setPreviewFile({ file: newFile, url: newUrl, index: newIndex });
  };

  // Close preview
  const closePreview = () => {
    if (previewFile) {
      URL.revokeObjectURL(previewFile.url);
      setPreviewFile(null);
    }
  };

  // Get file icon based on type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="h-4 w-4" />;
    } else if (file.type.startsWith('audio/')) {
      return <Music className="h-4 w-4" />;
    } else {
      return <File className="h-4 w-4" />;
    }
  };

  // Get file type color
  const getFileTypeClass = (file: File) => {
    if (file.type.startsWith('image/')) {
      return "text-green-500";
    } else if (file.type.startsWith('video/')) {
      return "text-blue-500";
    } else if (file.type.startsWith('audio/')) {
      return "text-purple-500";
    } else if (file.type.includes('pdf')) {
      return "text-red-500";
    } else if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      return "text-blue-600";
    } else {
      return "text-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Media to Job</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* File Upload Section - Now at the top */}
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <FormLabel className="text-base font-medium">Upload Files</FormLabel>
                  {selectedFiles.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAllFiles}
                      className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                <FormItem>
                  <FormControl>
                    <div
                      ref={dropAreaRef}
                      className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}`}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        <Upload className="h-10 w-10 text-gray-400" />
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium text-gray-700">Drag & drop files here</p>
                          <p className="text-xs text-gray-500">or click to browse</p>
                        </div>
                      </div>
                      <Input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
                        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500 mt-2">
                    Upload multiple files (images, audio, video, documents) to be processed by this job.
                  </FormDescription>
                  <FormMessage />
                </FormItem>

                {/* Selected Files Display as Cards */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Selected Files ({selectedFiles.length})</p>
                    </div>

                    {/* File Preview Modal */}
                    {previewFile && (
                      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] w-full flex flex-col">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium truncate max-w-[80%]">{previewFile.file.name}</h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">
                                {previewFile.index + 1} of {selectedFiles.length}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={closePreview}
                                className="h-8 w-8"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="relative flex-1 overflow-hidden flex items-center justify-center bg-gray-100 rounded">
                            {/* Navigation buttons */}
                            {selectedFiles.length > 1 && (
                              <>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  onClick={() => navigatePreview('prev')}
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 z-10"
                                >
                                  <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  onClick={() => navigatePreview('next')}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 z-10"
                                >
                                  <ChevronRight className="h-6 w-6" />
                                </Button>
                              </>
                            )}

                            {/* Preview content */}
                            <div className="max-w-full max-h-[70vh] flex items-center justify-center p-4">
                              {previewFile.file.type.startsWith('image/') && (
                                <img
                                  src={previewFile.url}
                                  alt={previewFile.file.name}
                                  className="max-w-full max-h-[70vh] object-contain shadow-lg"
                                />
                              )}
                              {previewFile.file.type.startsWith('video/') && (
                                <video
                                  src={previewFile.url}
                                  controls
                                  className="max-w-full max-h-[70vh] shadow-lg"
                                />
                              )}
                              {previewFile.file.type.startsWith('audio/') && (
                                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                                  <div className="flex items-center justify-center mb-4">
                                    <Music className="h-16 w-16 text-primary/70" />
                                  </div>
                                  <audio
                                    src={previewFile.url}
                                    controls
                                    className="w-full"
                                  />
                                </div>
                              )}
                              {!previewFile.file.type.startsWith('image/') &&
                               !previewFile.file.type.startsWith('video/') &&
                               !previewFile.file.type.startsWith('audio/') && (
                                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
                                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                                  <p className="text-lg font-medium text-center">{previewFile.file.name}</p>
                                  <p className="text-sm text-gray-500 mt-2">Preview not available for this file type</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              {previewFile.file.type} · {(previewFile.file.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Card Grid for Files */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2">
                      {selectedFiles.map((file, index) => {
                        // Get file icon and color
                        const fileIcon = getFileIcon(file);
                        const fileTypeClass = getFileTypeClass(file);

                        // Create thumbnail URL for images
                        let thumbnailUrl = null;
                        if (file.type.startsWith('image/')) {
                          thumbnailUrl = URL.createObjectURL(file);
                        }

                        return (
                          <Card
                            key={index}
                            className="overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => handlePreviewFile(file, index)}
                          >
                            <div className="relative">
                              {/* Thumbnail or File Type Indicator */}
                              {thumbnailUrl ? (
                                <div className="h-32 bg-gray-100 overflow-hidden">
                                  <img
                                    src={thumbnailUrl}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                    onLoad={() => {
                                      // Revoke the URL when the image is loaded to free memory
                                      // But keep it visible as it's already rendered
                                      URL.revokeObjectURL(thumbnailUrl!);
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className={`h-32 flex items-center justify-center ${fileTypeClass.replace('text-', 'bg-').replace('500', '100').replace('600', '100')}`}>
                                  <span className={fileTypeClass}>
                                    {fileIcon}
                                  </span>
                                </div>
                              )}

                              {/* File Type Badge */}
                              <div className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded-full ${fileTypeClass.replace('text-', 'bg-').replace('500', '50')} ${fileTypeClass}`}>
                                {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                              </div>

                              {/* Delete Button */}
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent triggering the card click
                                  removeFile(index);
                                }}
                                className="absolute top-2 right-2 h-6 w-6 bg-white bg-opacity-80 hover:bg-opacity-100 text-red-500 hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>

                            <CardContent className="p-2">
                              <div className="truncate text-xs font-medium">{file.name}</div>
                              <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* URL Inputs Section - Now below file upload */}
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <FormLabel className="text-base font-medium">Add URLs</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ url: '' })}
                    className="h-8 px-2"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add URL
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-3">
                    <FormField
                      control={form.control}
                      name={`media_uris.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-1 mb-0">
                          <FormControl>
                            <div className="relative">
                              <div className="absolute left-2 top-2.5 text-gray-500">
                                <Link size={16} />
                              </div>
                              <Input
                                placeholder="Enter file URL"
                                className="pl-8"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <FormDescription className="text-xs text-gray-500 mt-2">
                  Enter URLs to files (images, audio, video, documents) to be processed by this job.
                </FormDescription>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Media'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMediaDialog;
