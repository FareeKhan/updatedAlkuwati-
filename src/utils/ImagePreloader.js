import FastImage from 'react-native-fast-image';
import { Platform } from 'react-native';

const preloadedImagesCache = new Set();

const MAX_CONCURRENT_PRELOADS = Platform.OS === 'ios' ? 10 : 8;

export const PRIORITY = {
  LOW: FastImage.priority.low,
  NORMAL: FastImage.priority.normal,
  HIGH: FastImage.priority.high
};

export const CACHE = {
  IMMUTABLE: FastImage.cacheControl.immutable,
  WEB: FastImage.cacheControl.web,
  CACHEONLY: FastImage.cacheControl.cacheOnly
};

export const isImagePreloaded = (imageUri) => {
  if (!imageUri) return false;
  return preloadedImagesCache.has(imageUri);
};


export const markImagesAsPreloaded = (images) => {
  if (!images || !images.length) return;
  
  images.forEach(img => {
    if (img && typeof img === 'string') {
      preloadedImagesCache.add(img);
    }
  });
};


export const preloadImages = (images, options = {}) => {
  const {
    priority = PRIORITY.HIGH,
    cache = CACHE.IMMUTABLE,
    skipCache = false
  } = options;

  const uriImages = images
    .filter(img => img && typeof img === 'string')
    .filter(img => skipCache || !preloadedImagesCache.has(img))
    .map(imageUri => ({ 
      uri: imageUri, 
      priority: priority,
      cache: cache
    }));
  
  images.forEach(img => {
    if (img && typeof img === 'string') {
      preloadedImagesCache.add(img);
    }
  });
  
  if (uriImages.length > 0) {
    console.log(`Preloading ${uriImages.length} new images`);
    return FastImage.preload(uriImages);
  }
  
  return Promise.resolve();
};


export const preloadImagesInBatches = async (
  images, 
  batchSize = 5, 
  onProgress = null, 
  options = {}
) => {
  if (!images || !images.length) return Promise.resolve();
  
  const actualBatchSize = Math.min(batchSize, MAX_CONCURRENT_PRELOADS);
  
  const skipCache = options.skipCache || false;
  const filteredImages = images
    .filter(img => img && typeof img === 'string')
    .filter(img => skipCache || !preloadedImagesCache.has(img));
  
  const totalImages = filteredImages.length;
  
  if (totalImages === 0) {
    if (onProgress && typeof onProgress === 'function') {
      onProgress(images.length, images.length);
    }
    return Promise.resolve();
  }
  
  const batches = [];
  let completedImages = 0;
  
  if (onProgress && typeof onProgress === 'function') {
    const alreadyPreloaded = images.length - filteredImages.length;
    completedImages = alreadyPreloaded;
    onProgress(completedImages, images.length);
  }
  
  for (let i = 0; i < filteredImages.length; i += actualBatchSize) {
    const batch = filteredImages.slice(i, i + actualBatchSize);
    batches.push(batch);
  }
  
  const updateProgress = (count) => {
    completedImages += count;
    if (onProgress && typeof onProgress === 'function') {
      onProgress(Math.min(completedImages, images.length), images.length);
    }
  };
  
  try {
    for (let i = 0; i < batches.length; i++) {
      const currentBatch = batches[i];
      await preloadImages(currentBatch, options);
      updateProgress(currentBatch.length);
      
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 30));
      }
    }
    
    if (onProgress && typeof onProgress === 'function') {
      onProgress(images.length, images.length);
    }
    
    return Promise.resolve();
  } catch (error) {
    console.log('Error preloading images:', error);
    return Promise.reject(error);
  }
};

export const extractProductImages = (products) => {
  if (!products || !products.length) return [];
  
  const images = [];
  
  products.forEach(product => {
    if (product.image) {
      images.push(product.image);
    }
    
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (img && typeof img === 'string') {
          images.push(img);
        }
      });
    }
  });
  
  return images;
};


export const createThumbnailUrl = (originalUrl, width = 100, quality = 30) => {
  if (!originalUrl) return null;
  
  const separator = originalUrl.includes('?') ? '&' : '?';
  
  if (originalUrl.includes('http')) {
    return `${originalUrl}${separator}width=${width}&quality=${quality}`;
  }
  
  return originalUrl;
}; 