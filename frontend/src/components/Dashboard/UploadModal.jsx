import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { Upload, X, File, CheckCircle } from 'lucide-react';

const UploadModal = ({ onClose, onUpload, userId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return ['csv', 'xlsx', 'xls'].includes(ext);
    });

    if (validFiles.length !== selectedFiles.length) {
      alert('Only CSV and Excel files are supported');
    }

    setFiles(validFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadedFiles = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${userId}/${Date.now()}_${file.name}`;

        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        const { data, error } = await supabase.storage
          .from('files')
          .upload(fileName, file);

        if (error) throw error;

        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

        uploadedFiles.push({
          name: file.name,
          path: data.path,
          size: file.size,
          type: file.type,
        });
      }

      onUpload(uploadedFiles);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Upload Data Files</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* File Input */}
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
            <input
              type="file"
              multiple
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-white mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400">CSV, Excel files (XLSX, XLS)</p>
            </label>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-semibold text-white mb-3">Selected Files</h3>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg"
                >
                  <File className="w-5 h-5 text-green-400" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  {uploadProgress[file.name] !== undefined && (
                    <div className="flex items-center gap-2">
                      {uploadProgress[file.name] === 100 ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <div className="text-xs text-gray-400">
                          {uploadProgress[file.name]}%
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
