import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, ExternalLink, Loader2 } from 'lucide-react';
import { mediaService, isImageUrl, isVideoUrl, isAudioUrl } from '@/services/mediaService';

interface OutputItemProps {
  output: {
    output_id: string;
    source_media_id: string;
    object_name: string;
    process_type: string;
    result: any;
  };
}

const OutputItem: React.FC<OutputItemProps> = ({ output }) => {
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);

  // Fetch presigned URL for the object
  useEffect(() => {
    if (output.object_name) {
      mediaService.getPresignedUrl(output.object_name)
        .then(response => {
          if (response && response.presigned_url) {
            setPresignedUrl(response.presigned_url);
          } else {
            console.error('Invalid response format for presigned URL');
          }
        })
        .catch(error => {
          console.error('Error fetching presigned URL:', error);
        });
    }
  }, [output.object_name]);
  // Helper function to render different result types
  const renderResult = (result: any) => {
    if (!result) return <div>No result data available</div>;

    // Handle different result types based on process_type
    if (output.process_type === 'extract-image-data') {
      return (
        <div className="space-y-4">
          {/* Main text */}
          {result.main_text && (
            <div>
              <h4 className="text-md font-medium mb-2">Main Text:</h4>
              <div className="p-3 bg-gray-50 rounded border text-sm">
                {result.main_text}
              </div>
            </div>
          )}

          {/* Sub questions */}
          {result.sub_questions && result.sub_questions.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-2">Questions:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {result.sub_questions.map((question: string, index: number) => (
                  <li key={index} className="text-sm">{question}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Diagrams */}
          {result.diagrams && result.diagrams.length > 0 && (
            <div>
              <h4 className="text-md font-medium mb-2">Diagrams:</h4>
              <div className="space-y-3">
                {result.diagrams.map((diagram: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-3">
                      {diagram.image_obj_name && (
                        <div className="mb-2">
                          <MediaRenderer
                            objectName={diagram.image_obj_name}
                            altText={`Diagram ${index + 1}`}
                          />
                        </div>
                      )}
                      {diagram.description && (
                        <p className="text-sm text-gray-600 italic">{diagram.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default JSON view for other process types
    return (
      <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[400px]">
        {JSON.stringify(result, null, 2)}
      </pre>
    );
  };

  const [isMetadataOpen, setIsMetadataOpen] = React.useState(false);

  // Media renderer component
  const MediaRenderer = ({ objectName, altText }: { objectName: string, altText: string }) => {
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | 'other'>('other');

    useEffect(() => {
      if (objectName) {
        setIsLoading(true);
        mediaService.getPresignedUrl(objectName)
          .then(response => {
            if (response && response.presigned_url) {
              setMediaUrl(response.presigned_url);

              // Determine media type
              if (isImageUrl(objectName)) {
                setMediaType('image');
              } else if (isVideoUrl(objectName)) {
                setMediaType('video');
              } else if (isAudioUrl(objectName)) {
                setMediaType('audio');
              } else {
                setMediaType('other');
              }
            } else {
              console.error('Invalid response format for presigned URL');
            }
          })
          .catch(error => {
            console.error('Error fetching presigned URL:', error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, [objectName]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-40 bg-gray-50 rounded border">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-500">Loading media...</span>
        </div>
      );
    }

    if (!mediaUrl) {
      return (
        <div className="flex items-center justify-center h-40 bg-gray-50 rounded border">
          <span className="text-sm text-gray-500">Failed to load media</span>
        </div>
      );
    }

    switch (mediaType) {
      case 'image':
        return (
          <img
            src={mediaUrl}
            alt={altText}
            className="max-h-60 object-contain mx-auto rounded border"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
            }}
          />
        );
      case 'video':
        return (
          <video
            src={mediaUrl}
            controls
            className="max-h-60 w-full rounded border"
          />
        );
      case 'audio':
        return (
          <audio
            src={mediaUrl}
            controls
            className="w-full rounded border"
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded border">
            <span className="text-sm text-gray-500 mb-2">File: {objectName.split('/').pop()}</span>
            <Button size="sm" variant="outline" asChild>
              <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                Download <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="px-2 py-1">
            {output.process_type}
          </Badge>
          <span className="text-xs text-gray-500">ID: {output.output_id.substring(0, 8)}...</span>
        </div>

        <Collapsible open={isMetadataOpen} onOpenChange={setIsMetadataOpen} className="w-full">
          <CollapsibleTrigger className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors">
            {isMetadataOpen ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" /> Hide metadata
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" /> Show metadata
              </>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-1 text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <div>
              <span className="font-medium">Output ID:</span> {output.output_id}
            </div>
            <div>
              <span className="font-medium">Source Media ID:</span> {output.source_media_id}
            </div>
            <div>
              <span className="font-medium">Object Name:</span> {output.object_name}
            </div>
            {presignedUrl && (
              <div className="mt-2">
                <Button size="sm" variant="outline" asChild className="text-xs h-6 px-2">
                  <a href={presignedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    View Raw Data <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="border-t pt-3">
        {renderResult(output.result)}
      </div>
    </div>
  );
};

export default OutputItem;
