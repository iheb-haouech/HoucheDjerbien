import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, X, Check, AlertCircle } from 'lucide-react';

export default function ImageEditor({ 
  imageUrl, 
  onImageChange, 
  isAdminMode = false,
  size = 'large'
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(imageUrl);

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-48 h-48',
    large: 'w-full h-96',
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select a valid image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const newUrl = event.target.result;
      setPreviewUrl(newUrl);

      if (onImageChange) {
        onImageChange(newUrl);
      }

      setMessage({ type: 'success', text: 'Image updated successfully!' });

      setTimeout(() => {
        setIsEditing(false);
        setMessage(null);
      }, 1500);
      setIsLoading(false);
    };
    reader.onerror = () => {
      setMessage({ type: 'error', text: 'Failed to update image' });
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative inline-block">
      {/* Image Container */}
      <div className={`relative ${sizeClasses[size]} rounded-lg overflow-hidden group`}>
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full h-full object-cover"
        />

        {/* Admin Edit Button */}
        {isAdminMode && (
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200"
            onClick={(event) => {
              event.stopPropagation();
              setIsEditing(true);
            }}
          >
            <div className="flex flex-col items-center space-y-2">
              <Edit2 className="w-8 h-8 text-white" />
              <span className="text-white text-sm font-medium">Click to Edit</span>
            </div>
          </motion.button>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isLoading && setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Edit Image</h3>
                <button
                  onClick={() => !isLoading && setIsEditing(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview */}
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* File Input */}
              <label className="block">
                <span className="sr-only">Choose image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isLoading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-600 file:text-white
                    hover:file:bg-primary-700
                    file:cursor-pointer file:transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </label>

              {/* Status Messages */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center space-x-2 p-3 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-primary-50 text-primary-700'
                  }`}
                >
                  {message.type === 'success' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">{message.text}</span>
                </motion.div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-200" />
                </div>
              )}

              {/* Info Text */}
              <p className="text-sm text-gray-600">
                ✓ Maximum 5MB
                <br />
                ✓ JPG, PNG, WebP
                <br />
                ✓ Changes save automatically
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
