/**
 * Next.js-Style Client-Side Image Optimizer & Processor
 * 
 * Provides:
 * - Direct image compression & conversion to high-efficiency WebP format
 * - Aspect-ratio preserving downsampling from large camera/phone resolutions
 * - Automatic stripping of heavy EXIF bloat
 * - Fallback to JPEG if browser lacks WebP canvas export
 * - Statistics on file size reduction percentage
 */

export async function optimizeImage(file, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
    outputFormat = 'image/webp',
  } = options;

  if (!file || !(file instanceof Blob)) {
    throw new Error('Valid image file is required');
  }

  // Pass through SVG files directly without rasterizing
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed reading SVG file'));
      reader.onload = () => {
        resolve({
          dataUrl: reader.result,
          file,
          originalSize: file.size,
          optimizedSize: file.size,
          format: 'svg',
          width: null,
          height: null,
          savedPercent: 0,
        });
      };
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed reading image file from disk'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid or corrupted image format'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Downsample maintaining strict aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', { willReadFrequently: false });
        if (!ctx) {
          return reject(new Error('Canvas context could not be initialized'));
        }

        // Apply high-quality bicubic downsampling filter
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        // Attempt WebP output (modern Next.js standard)
        let dataUrl = canvas.toDataURL(outputFormat, quality);
        let actualFormat = outputFormat;

        // Fallback to JPEG if WebP export is unsupported
        if (dataUrl.startsWith('data:image/png') && outputFormat === 'image/webp') {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          actualFormat = 'image/jpeg';
        }

        // Calculate size in bytes
        const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
        const optimizedSize = Math.round((base64Length * 3) / 4);
        const originalSize = file.size;
        const savedPercent = originalSize > optimizedSize
          ? Math.round(((originalSize - optimizedSize) / originalSize) * 100)
          : 0;

        resolve({
          dataUrl,
          originalSize,
          optimizedSize,
          savedPercent,
          width,
          height,
          format: actualFormat.replace('image/', ''),
        });
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Human-readable byte size formatter (e.g. 1.4 MB, 82 KB)
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
