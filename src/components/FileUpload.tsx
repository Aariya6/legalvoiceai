import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelected: (file: Blob) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && (file.type.startsWith('audio/') || file.type === 'video/mp4')) {
      setSelectedFile(file);
      onFileSelected(file);
    } else {
      alert('Please select a valid audio file (MP3, WAV, M4A, etc.)');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-blue-400 bg-blue-500/10'
            : 'border-white/30 hover:border-white/50 hover:bg-white/5'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div className="text-left">
                <p className="text-white font-medium">{selectedFile.name}</p>
                <p className="text-blue-200 text-sm">{formatFileSize(selectedFile.size)}</p>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200"
              >
                <X className="h-5 w-5 text-red-400" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-blue-400 mx-auto" />
            <div>
              <p className="text-white font-medium mb-2">Drop your audio file here</p>
              <p className="text-blue-200 text-sm mb-4">or click to browse files</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg 
                         font-medium transition-all duration-200"
              >
                Select File
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp4"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
        <h3 className="text-white font-medium mb-2">Supported Formats:</h3>
        <div className="text-yellow-200 text-sm space-y-1">
          <p>• Audio: MP3, WAV, M4A, AAC, OGG</p>
          <p>• Video: MP4 (audio will be extracted)</p>
          <p>• Maximum file size: 50MB</p>
          <p>• Maximum duration: 10 minutes</p>
        </div>
      </div>
    </div>
  );
};