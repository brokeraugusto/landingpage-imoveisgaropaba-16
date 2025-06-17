
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface PropertyImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const PropertyImageUpload = ({ 
  images, 
  onImagesChange, 
  maxImages = 10 
}: PropertyImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { uploadImage, deleteImage, uploading } = useImageUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    const uploadPromises = filesToUpload.map(async (file) => {
      const url = await uploadImage(file);
      return url;
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter(url => url !== null) as string[];
    
    onImagesChange([...images, ...validUrls]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    await deleteImage(imageUrl);
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="relative">
            <CardContent className="p-2">
              <img
                src={image}
                alt={`Imagem ${index + 1}`}
                className="w-full h-32 object-cover rounded"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}

        {images.length < maxImages && (
          <Card 
            className={`border-2 border-dashed cursor-pointer hover:border-blue-500 transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <CardContent className="p-4 h-32 flex flex-col items-center justify-center text-gray-500">
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 mb-2" />
                  <span className="text-sm text-center">
                    Clique ou arraste para adicionar
                  </span>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <p className="text-sm text-gray-500">
        {images.length}/{maxImages} imagens adicionadas
      </p>
    </div>
  );
};

export default PropertyImageUpload;
