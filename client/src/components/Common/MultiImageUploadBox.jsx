import React, { useState, useRef } from 'react';
import {
  FiUploadCloud,
  FiTrash2,
  FiStar,
  FiArrowLeft,
  FiArrowRight,
  FiPlus,
  FiLink,
  FiZap,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { optimizeImage, formatBytes } from '../../utils/imageOptimizer';

export default function MultiImageUploadBox({
  images = [],
  onChange,
  maxImages = 8,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82,
}) {
  const [optimizing, setOptimizing] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Normalize images array to list of objects: [{ id, url, isPrimary }]
  const normalizedList = (Array.isArray(images) ? images : [])
    .map((item, idx) => {
      if (typeof item === 'string') {
        return { id: `img-${idx}-${Date.now()}`, url: item, isPrimary: idx === 0 };
      }
      return {
        id: item.id || `img-${idx}-${Date.now()}`,
        url: item.image_url || item.url || item.src || '',
        isPrimary: Boolean(item.is_primary || idx === 0),
      };
    })
    .filter((img) => Boolean(img.url));

  const notifyChange = (newList) => {
    // Notify parent with list of image objects and keep is_primary flag updated
    const updated = newList.map((item, idx) => ({
      ...item,
      is_primary: idx === 0,
      image_url: item.url,
    }));
    onChange?.(updated);
  };

  const handleProcessFiles = async (files) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - normalizedList.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum limit of ${maxImages} images reached.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    setOptimizing(true);

    try {
      let totalOriginalBytes = 0;
      let totalOptimizedBytes = 0;
      const newItems = [];

      for (const file of filesToProcess) {
        if (!file.type.startsWith('image/')) continue;
        const res = await optimizeImage(file, {
          maxWidth,
          maxHeight,
          quality,
          outputFormat: 'image/webp',
        });

        totalOriginalBytes += res.originalSize;
        totalOptimizedBytes += res.optimizedSize;

        newItems.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          url: res.dataUrl,
          isPrimary: normalizedList.length === 0 && newItems.length === 0,
        });
      }

      if (newItems.length > 0) {
        const combined = [...normalizedList, ...newItems];
        notifyChange(combined);

        const savedPercent = totalOriginalBytes > totalOptimizedBytes
          ? Math.round(((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100)
          : 0;

        toast.success(
          `Added ${newItems.length} image(s)! Optimized with WebP (${savedPercent}% smaller: ${formatBytes(totalOriginalBytes)} → ${formatBytes(totalOptimizedBytes)})`,
          { icon: '⚡' }
        );
      }
    } catch (err) {
      toast.error(err.message || 'Image optimization failed');
    } finally {
      setOptimizing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e) => {
    handleProcessFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleProcessFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (normalizedList.length >= maxImages) {
      toast.error(`Maximum limit of ${maxImages} images reached.`);
      return;
    }

    const newItem = {
      id: `url-${Date.now()}`,
      url: urlInput.trim(),
      isPrimary: normalizedList.length === 0,
    };

    const combined = [...normalizedList, newItem];
    notifyChange(combined);
    setUrlInput('');
    setShowUrlInput(false);
    toast.success('Image link added to gallery');
  };

  const handleSetPrimary = (index) => {
    if (index === 0) return;
    const target = normalizedList[index];
    const rest = normalizedList.filter((_, i) => i !== index);
    const reordered = [target, ...rest];
    notifyChange(reordered);
    toast.success('Set as primary cover image');
  };

  const handleMove = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= normalizedList.length) return;
    const list = [...normalizedList];
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    notifyChange(list);
  };

  const handleRemove = (index) => {
    const list = normalizedList.filter((_, i) => i !== index);
    notifyChange(list);
    toast.success('Image removed from product gallery');
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-200">
        <div>
          <label className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <span>Product Gallery Images</span>
            <span className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-600 font-mono">
              {normalizedList.length} / {maxImages}
            </span>
          </label>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            The first image is the primary cover image. You can reorder, upload multiple photos at once, or set any photo as primary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600 hover:text-black hover:bg-neutral-100 border border-neutral-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FiLink className="w-3 h-3" />
            {showUrlInput ? 'Hide URL Input' : 'Add via URL'}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={optimizing || normalizedList.length >= maxImages}
            className="px-3 py-1 bg-black hover:bg-neutral-800 text-white text-[11px] font-bold uppercase tracking-wider transition-colors disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
          >
            <FiPlus className="w-3.5 h-3.5" />
            Add Images
          </button>
        </div>
      </div>

      {/* Hidden Multi-File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* URL Input Drawer */}
      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="flex gap-2 p-3 bg-neutral-50 border border-neutral-200 animate-fadeIn">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste Cloudinary / CDN / Unsplash image link..."
            className="flex-1 text-xs px-3 py-2 bg-white border border-neutral-300 focus:border-black outline-none font-mono text-[11px]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Add Link
          </button>
        </form>
      )}

      {/* Multiple Images Grid / Gallery Cards */}
      {normalizedList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {normalizedList.map((item, index) => (
            <div
              key={item.id}
              className={`relative group aspect-square border overflow-hidden bg-neutral-100 transition-all ${
                index === 0
                  ? 'border-2 border-black ring-2 ring-black/10'
                  : 'border-neutral-200 hover:border-black'
              }`}
            >
              {/* Image Preview */}
              <img
                src={item.url}
                alt={`Product frame ${index + 1}`}
                className="w-full h-full object-contain p-2 bg-white"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/hero_banner_1.png';
                }}
              />

              {/* Primary Image Badge */}
              {index === 0 ? (
                <div className="absolute top-1.5 left-1.5 z-10">
                  <span className="px-1.5 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-xs">
                    <FiStar className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    Cover
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(index)}
                  className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 bg-white/90 hover:bg-black hover:text-white text-neutral-700 text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-xs border border-neutral-200"
                  title="Make this the primary cover image"
                >
                  Set Cover
                </button>
              )}

              {/* Order Indicator */}
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-mono font-bold">
                #{index + 1}
              </span>

              {/* Action Buttons Overlay */}
              <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1">
                {/* Move Left */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMove(index, -1)}
                    className="p-1 bg-white/95 hover:bg-black hover:text-white text-neutral-700 transition-colors shadow-xs cursor-pointer"
                    title="Move earlier"
                  >
                    <FiArrowLeft className="w-3 h-3" />
                  </button>
                )}
                {/* Move Right */}
                {index < normalizedList.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleMove(index, 1)}
                    className="p-1 bg-white/95 hover:bg-black hover:text-white text-neutral-700 transition-colors shadow-xs cursor-pointer"
                    title="Move later"
                  >
                    <FiArrowRight className="w-3 h-3" />
                  </button>
                )}
                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1 bg-white/95 hover:bg-red-600 hover:text-white text-red-500 transition-colors shadow-xs cursor-pointer"
                  title="Remove image"
                >
                  <FiTrash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* Add More Tile if under limit */}
          {normalizedList.length < maxImages && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-square border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-black bg-neutral-100'
                  : 'border-neutral-300 hover:border-black bg-neutral-50 hover:bg-white'
              } ${optimizing ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="w-8 h-8 bg-neutral-200 text-neutral-700 flex items-center justify-center mb-1.5">
                <FiPlus className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-black uppercase tracking-wider">
                {optimizing ? 'Optimizing...' : 'Upload More'}
              </span>
              <span className="text-[9px] text-neutral-400 mt-0.5">Drop files here</span>
            </div>
          )}
        </div>
      ) : (
        /* Empty Dropzone for First Batch */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-black bg-neutral-100'
              : 'border-neutral-300 hover:border-black bg-neutral-50 hover:bg-white'
          } ${optimizing ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="max-w-sm mx-auto space-y-2">
            <div className="w-12 h-12 mx-auto bg-black text-white flex items-center justify-center shadow-xs">
              <FiUploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-black uppercase tracking-wider">
                {optimizing ? 'Optimizing & Compressing Images to WebP...' : 'Click to Upload Multiple Product Images'}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                Select multiple frame angles (front, side, angle, on-model). Drag & drop files directly.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono pt-1">
              <FiZap className="w-3.5 h-3.5 text-amber-500" />
              <span>Next.js-style automatic WebP compression & responsive scaling</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
