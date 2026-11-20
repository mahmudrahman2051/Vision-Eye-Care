import React, { useState, useRef } from 'react';
import {
  FiUploadCloud,
  FiLink,
  FiTrash2,
  FiCheck,
  FiZap,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { optimizeImage, formatBytes } from '../../utils/imageOptimizer';

export default function ImageUploadBox({
  value = '',
  onChange,
  label = 'Image',
  helpText = 'Upload a high-resolution photo or paste an image URL.',
  aspectRatio = 'square', // 'square', 'banner', 'video', 'auto'
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82,
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url'
  const [optimizing, setOptimizing] = useState(false);
  const [stats, setStats] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleProcessFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP, SVG).');
      return;
    }

    try {
      setOptimizing(true);
      const result = await optimizeImage(file, {
        maxWidth,
        maxHeight,
        quality,
        outputFormat: 'image/webp',
      });

      setStats({
        originalSize: formatBytes(result.originalSize),
        optimizedSize: formatBytes(result.optimizedSize),
        savedPercent: result.savedPercent,
        format: result.format.toUpperCase(),
        dimensions: result.width ? `${result.width}×${result.height}` : null,
      });

      onChange?.(result.dataUrl);

      if (result.savedPercent > 0) {
        toast.success(
          `Optimized: ${formatBytes(result.originalSize)} → ${formatBytes(result.optimizedSize)} (${result.savedPercent}% smaller, WebP)`,
          { icon: '⚡' }
        );
      } else {
        toast.success('Image loaded successfully');
      }
    } catch (err) {
      toast.error(err.message || 'Image processing failed');
    } finally {
      setOptimizing(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onChange?.('');
    setStats(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Image removed');
  };

  const aspectClass =
    aspectRatio === 'banner'
      ? 'aspect-[21/9]'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : 'aspect-auto max-h-56';

  return (
    <div className="space-y-2.5">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-neutral-100 p-0.5 border border-neutral-200">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-black text-white shadow-xs'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Direct Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'url'
                ? 'bg-black text-white shadow-xs'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            Image Link URL
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Area */}
      <div className="space-y-3">
        {activeTab === 'upload' ? (
          <div>
            {value ? (
              /* Preview with replacement options */
              <div className="border border-neutral-200 bg-neutral-50 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  {/* Thumbnail */}
                  <div
                    className={`w-36 ${aspectClass} overflow-hidden bg-white border border-neutral-200 flex-shrink-0 flex items-center justify-center relative group`}
                  >
                    <img
                      src={value}
                      alt="Uploaded Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/hero_banner_1.png';
                      }}
                    />
                  </div>

                  {/* Optimization Badges & Details */}
                  <div className="flex-1 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest">
                        <FiZap className="w-3 h-3 text-amber-400" />
                        Next.js Optimized
                      </span>
                      {stats?.format && (
                        <span className="px-1.5 py-0.5 border border-neutral-300 text-neutral-700 text-[10px] font-bold uppercase font-mono">
                          {stats.format}
                        </span>
                      )}
                      {stats?.dimensions && (
                        <span className="px-1.5 py-0.5 border border-neutral-300 text-neutral-600 text-[10px] font-mono">
                          {stats.dimensions}
                        </span>
                      )}
                    </div>

                    {stats ? (
                      <p className="text-[11px] text-neutral-600">
                        Compressed from <strong className="text-black">{stats.originalSize}</strong> down to{' '}
                        <strong className="text-emerald-600">{stats.optimizedSize}</strong> ({stats.savedPercent}% size reduction)
                      </p>
                    ) : (
                      <p className="text-[11px] text-neutral-500 truncate max-w-md font-mono">
                        {value.startsWith('data:') ? 'Embedded optimized WebP data' : value}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={optimizing}
                        className="px-3 py-1 bg-black hover:bg-neutral-800 text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <FiUploadCloud className="w-3.5 h-3.5" />
                        Replace Image
                      </button>
                      <button
                        type="button"
                        onClick={handleRemove}
                        className="px-3 py-1 border border-neutral-300 hover:border-red-500 hover:text-red-600 text-neutral-600 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Drag & Drop Upload Zone */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                  dragOver
                    ? 'border-black bg-neutral-100'
                    : 'border-neutral-300 hover:border-black bg-neutral-50 hover:bg-white'
                } ${optimizing ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="max-w-sm mx-auto space-y-2">
                  <div className="w-10 h-10 mx-auto bg-black text-white flex items-center justify-center">
                    <FiUploadCloud className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-black uppercase tracking-wider">
                      {optimizing ? 'Optimizing Image with WebP Compression...' : 'Click to Browse or Drag Image Here'}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Supports JPG, PNG, WebP, SVG. Automatically optimized & compressed client-side.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[10px] text-neutral-400 font-mono pt-1">
                    <FiZap className="w-3 h-3 text-amber-500" />
                    <span>Auto-resizes to max {maxWidth}px • WebP conversion</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* URL Input Mode */
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type="url"
                  value={value}
                  onChange={(e) => onChange?.(e.target.value)}
                  placeholder="https://images.unsplash.com/... or Cloudinary URL"
                  className="w-full text-xs p-3 border border-neutral-300 focus:border-black bg-white focus:outline-none font-mono text-[11px]"
                />
              </div>
              {value && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-3 border border-neutral-300 hover:border-red-500 hover:text-red-600 text-neutral-500 transition-colors cursor-pointer"
                  title="Clear URL"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {value && (
              <div className="flex items-center gap-3 p-2 bg-neutral-50 border border-neutral-200">
                <img
                  src={value}
                  alt="URL Preview"
                  className="w-10 h-10 object-cover border border-neutral-200 flex-shrink-0"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/hero_banner_1.png';
                  }}
                />
                <span className="text-[11px] text-neutral-600 truncate font-mono">
                  {value}
                </span>
              </div>
            )}
          </div>
        )}

        {helpText && <p className="text-[10px] text-neutral-500 leading-normal">{helpText}</p>}
      </div>
    </div>
  );
}
