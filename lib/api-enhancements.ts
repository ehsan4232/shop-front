/**
 * API Enhancements for Mall Platform
 * Additional endpoints and helpers for new backend features
 */

import { apiClient, endpoints } from './api';
import type {
  ProductClass,
  AttributeType,
  Product,
  SocialMediaImportPreview,
  ProductAnalytics,
  AttributeInheritance
} from '../types';

// Enhanced endpoints for new backend features
export const enhancedEndpoints = {
  ...endpoints,
  
  // Enhanced product endpoints
  products: {
    ...endpoints.products,
    validateClass: (classId: string) => `/api/products/validate-class/${classId}/`,
    inheritancePreview: (classId: string) => `/api/products/inheritance-preview/${classId}/`,
    priceCalculation: (classId: string) => `/api/products/price-calculation/${classId}/`,
    bulkUpdate: '/api/products/bulk-update/',
    duplicateCheck: '/api/products/duplicate-check/',
  },

  // Enhanced product class endpoints
  productClasses: {
    ...endpoints.productClasses,
    validateHierarchy: '/api/product-classes/validate-hierarchy/',
    moveNode: (id: string) => `/api/product-classes/${id}/move/`,
    getDescendants: (id: string) => `/api/product-classes/${id}/descendants/`,
    getAncestors: (id: string) => `/api/product-classes/${id}/ancestors/`,
    bulkOperations: '/api/product-classes/bulk-operations/',
  },

  // Enhanced analytics endpoints
  analytics: {
    ...endpoints.analytics,
    productPerformance: '/api/analytics/product-performance/',
    classPerformance: '/api/analytics/class-performance/',
    attributeUsage: '/api/analytics/attribute-usage/',
    priceDistribution: '/api/analytics/price-distribution/',
    inheritanceImpact: '/api/analytics/inheritance-impact/',
  },

  // Enhanced social media endpoints
  socialMedia: {
    ...endpoints.socialMedia,
    importPreview: '/api/social-media/import-preview/',
    batchImport: '/api/social-media/batch-import/',
    importHistory: '/api/social-media/import-history/',
    mediaOptimization: '/api/social-media/media-optimization/',
  },

  // New validation endpoints
  validation: {
    productData: '/api/validation/product-data/',
    classHierarchy: '/api/validation/class-hierarchy/',
    attributeValues: '/api/validation/attribute-values/',
    priceConsistency: '/api/validation/price-consistency/',
  },
};

// Enhanced API helpers
export const enhancedApi = {
  // Product class validation and management
  productClasses: {
    validateForProductCreation: (classId: string) =>
      apiClient.get(enhancedEndpoints.products.validateClass(classId)),
    
    getInheritancePreview: (classId: string) =>
      apiClient.get(enhancedEndpoints.products.inheritancePreview(classId)),
    
    getPriceCalculation: (classId: string, overrides?: any) =>
      apiClient.post(enhancedEndpoints.products.priceCalculation(classId), overrides),
    
    validateHierarchy: (hierarchyData: any) =>
      apiClient.post(enhancedEndpoints.productClasses.validateHierarchy, hierarchyData),
    
    moveNode: (id: string, newParentId: string, position?: number) =>
      apiClient.post(enhancedEndpoints.productClasses.moveNode(id), {
        new_parent: newParentId,
        position
      }),
    
    getDescendants: (id: string, includeProducts = false) =>
      apiClient.get(enhancedEndpoints.productClasses.getDescendants(id), {
        include_products: includeProducts
      }),
    
    getAncestors: (id: string, includeRoot = true) =>
      apiClient.get(enhancedEndpoints.productClasses.getAncestors(id), {
        include_root: includeRoot
      }),
  },

  // Enhanced product operations
  products: {
    bulkUpdate: (updates: Array<{ id: string; data: Partial<Product> }>) =>
      apiClient.post(enhancedEndpoints.products.bulkUpdate, { updates }),
    
    checkDuplicates: (productData: Partial<Product>) =>
      apiClient.post(enhancedEndpoints.products.duplicateCheck, productData),
    
    getInheritedAttributes: (productId: string) =>
      apiClient.get(`/api/products/${productId}/inherited-attributes/`),
    
    resolveAttributeConflicts: (productId: string, resolutions: any) =>
      apiClient.post(`/api/products/${productId}/resolve-conflicts/`, resolutions),
  },

  // Advanced analytics
  analytics: {
    getProductPerformance: (filters: any) =>
      apiClient.get(enhancedEndpoints.analytics.productPerformance, filters),
    
    getClassPerformance: (classId?: string) =>
      apiClient.get(enhancedEndpoints.analytics.classPerformance, {
        class_id: classId
      }),
    
    getAttributeUsage: (storeId: string) =>
      apiClient.get(enhancedEndpoints.analytics.attributeUsage, {
        store: storeId
      }),
    
    getPriceDistribution: (filters: any) =>
      apiClient.get(enhancedEndpoints.analytics.priceDistribution, filters),
    
    getInheritanceImpact: (classId: string) =>
      apiClient.get(enhancedEndpoints.analytics.inheritanceImpact, {
        class_id: classId
      }),
  },

  // Enhanced social media integration
  socialMedia: {
    getImportPreview: (postUrl: string, platform: 'telegram' | 'instagram') =>
      apiClient.post(enhancedEndpoints.socialMedia.importPreview, {
        post_url: postUrl,
        platform
      }),
    
    batchImport: (imports: Array<{
      post_url: string;
      product_class_id: string;
      category_id: string;
      additional_data?: any;
    }>) =>
      apiClient.post(enhancedEndpoints.socialMedia.batchImport, { imports }),
    
    getImportHistory: (filters?: any) =>
      apiClient.get(enhancedEndpoints.socialMedia.importHistory, filters),
    
    optimizeMedia: (mediaUrls: string[], quality = 'medium') =>
      apiClient.post(enhancedEndpoints.socialMedia.mediaOptimization, {
        media_urls: mediaUrls,
        quality
      }),
  },

  // Data validation helpers
  validation: {
    validateProductData: (productData: Partial<Product>) =>
      apiClient.post(enhancedEndpoints.validation.productData, productData),
    
    validateClassHierarchy: (hierarchyChanges: any) =>
      apiClient.post(enhancedEndpoints.validation.classHierarchy, hierarchyChanges),
    
    validateAttributeValues: (attributeValues: any[]) =>
      apiClient.post(enhancedEndpoints.validation.attributeValues, {
        attribute_values: attributeValues
      }),
    
    checkPriceConsistency: (storeId: string) =>
      apiClient.get(enhancedEndpoints.validation.priceConsistency, {
        store: storeId
      }),
  },
};

// Utility functions for complex operations
export const apiUtils = {
  // Calculate effective price with inheritance
  calculateEffectivePrice: async (productData: Partial<Product>) => {
    if (productData.base_price) {
      return productData.base_price;
    }
    
    if (productData.product_class) {
      const response = await enhancedApi.productClasses.getPriceCalculation(
        productData.product_class
      );
      return response.data?.effective_price || 0;
    }
    
    return 0;
  },

  // Get complete attribute inheritance chain
  getCompleteAttributeChain: async (productClassId: string) => {
    const [ancestorsResponse, inheritanceResponse] = await Promise.all([
      enhancedApi.productClasses.getAncestors(productClassId),
      enhancedApi.productClasses.getInheritancePreview(productClassId)
    ]);
    
    return {
      ancestors: ancestorsResponse.data || [],
      inheritance: inheritanceResponse.data || [],
    };
  },

  // Validate complete product before creation
  validateProductForCreation: async (productData: Partial<Product>) => {
    const validations = await Promise.all([
      enhancedApi.products.checkDuplicates(productData),
      enhancedApi.productClasses.validateForProductCreation(productData.product_class!),
      enhancedApi.validation.validateProductData(productData)
    ]);
    
    return {
      duplicates: validations[0].data || [],
      classValidation: validations[1].data || {},
      dataValidation: validations[2].data || {},
      isValid: validations.every(v => !v.error)
    };
  },

  // Optimize social media import workflow
  optimizedSocialImport: async ({
    postUrl,
    platform,
    productClassId,
    categoryId
  }: {
    postUrl: string;
    platform: 'telegram' | 'instagram';
    productClassId: string;
    categoryId: string;
  }) => {
    // Get import preview
    const previewResponse = await enhancedApi.socialMedia.getImportPreview(postUrl, platform);
    
    if (previewResponse.error) {
      throw new Error(previewResponse.error);
    }
    
    const preview = previewResponse.data as SocialMediaImportPreview;
    
    // Optimize media if needed
    if (preview.extracted_images.length > 0) {
      const optimizedResponse = await enhancedApi.socialMedia.optimizeMedia(
        preview.extracted_images
      );
      
      if (optimizedResponse.data) {
        preview.extracted_images = optimizedResponse.data.optimized_urls;
      }
    }
    
    // Create product with optimized data
    const productData = {
      name: preview.suggested_name || 'Imported Product',
      name_fa: preview.suggested_name || 'محصول وارداتی',
      description: preview.suggested_description || '',
      product_class: productClassId,
      category: categoryId,
      base_price: preview.suggested_price,
      imported_from_social: true,
      social_media_source: platform,
      social_media_post_id: postUrl,
    };
    
    return apiClient.post(endpoints.products.create, productData);
  },
};

export default enhancedApi;
