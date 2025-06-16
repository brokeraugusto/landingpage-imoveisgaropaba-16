
import { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface LogoUploadProps {
  logo: string;
  onLogoChange: (logo: string) => void;
  label: string;
  isDark?: boolean;
}

const LogoUpload = ({ logo, onLogoChange, label, isDark = false }: LogoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    setUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onLogoChange(e.target.result as string);
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    onLogoChange('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          {uploading ? 'Enviando...' : 'Selecionar Logo'}
        </Button>
        
        {logo && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={removeLogo}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview */}
      {logo ? (
        <div className={`p-4 border rounded-lg ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
          <img
            src={logo}
            alt="Logo preview"
            className="max-h-16 max-w-48 object-contain"
          />
        </div>
      ) : (
        <div className={`border-2 border-dashed rounded-lg p-8 text-center ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300'}`}>
          <Image size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Nenhum logo selecionado</p>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;
