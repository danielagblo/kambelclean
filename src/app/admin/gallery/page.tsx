'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Trash2, Eye, Smartphone, Monitor } from 'lucide-react';

interface ImageData {
  id: number;
  filename: string;
  url: string;
  uploadedAt: string;
  type: 'carousel' | 'logo' | 'other';
}

export default function GalleryPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Load images from API
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', files[0]);
    formData.append('type', 'carousel');

    try {
      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await loadImages();
        alert('App screenshot uploaded successfully!');
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number, filename: string) => {
    if (!confirm('Are you sure you want to delete this screenshot?')) return;

    try {
      const response = await fetch(`/api/gallery/${id}?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadImages();
        alert('Screenshot deleted successfully!');
      } else {
        alert('Failed to delete screenshot');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting screenshot');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Smartphone className="h-6 w-6 mr-2 text-indigo-600" />
              Landing Page Screenshots
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Upload and manage app screenshots for the About page carousel
            </p>
          </div>
          <label className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Upload Screenshot
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Monitor className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Upload Guidelines</h4>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Upload mobile app screenshots (preferably 375x812px or similar mobile dimensions)</li>
                  <li>Images will appear in the carousel on the About page</li>
                  <li>Supported formats: JPG, PNG, WebP</li>
                  <li>Maximum file size: 5MB</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <Smartphone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No screenshots uploaded</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload app screenshots to display in the About page carousel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.filename}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSelectedImage(image.url)}
                    className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-2 transition-opacity"
                  >
                    <Eye className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id, image.filename)}
                    className="opacity-0 group-hover:opacity-100 bg-red-500 rounded-full p-2 transition-opacity"
                  >
                    <Trash2 className="h-5 w-5 text-white" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-2">
                  <p className="truncate">{image.filename}</p>
                  <p className="text-gray-400 text-xs">{new Date(image.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Section */}
      {images.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h4>
          <p className="text-sm text-gray-500 mb-4">
            These screenshots will appear in the carousel on the About page
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image) => (
                <div key={image.id} className="flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="w-20 h-36 object-cover rounded border"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full p-4">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

