/**
 * Validation utilities for Mall platform
 * Handles Iranian-specific validations and common form validations
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export class ValidationUtils {
  
  // Phone number validation (Iranian format)
  static validateIranianPhone(phone: string): ValidationResult {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d]/g, '');
    
    // Iranian mobile format: 09xxxxxxxxx (11 digits)
    const iranianMobileRegex = /^09[0-9]{9}$/;
    
    if (!cleanPhone) {
      return { isValid: false, message: 'شماره تلفن الزامی است' };
    }
    
    if (!iranianMobileRegex.test(cleanPhone)) {
      return { isValid: false, message: 'شماره تلفن باید به فرمت 09xxxxxxxxx باشد' };
    }
    
    return { isValid: true };
  }

  // Email validation
  static validateEmail(email: string): ValidationResult {
    if (!email) {
      return { isValid: false, message: 'ایمیل الزامی است' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'فرمت ایمیل صحیح نیست' };
    }
    
    return { isValid: true };
  }

  // Required field validation
  static validateRequired(value: any, fieldName: string): ValidationResult {
    if (value === null || value === undefined || String(value).trim() === '') {
      return { isValid: false, message: `${fieldName} الزامی است` };
    }
    
    return { isValid: true };
  }

  // Minimum length validation
  static validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
    if (!value || value.length < minLength) {
      return { 
        isValid: false, 
        message: `${fieldName} باید حداقل ${minLength} کاراکتر باشد` 
      };
    }
    
    return { isValid: true };
  }

  // Maximum length validation
  static validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
    if (value && value.length > maxLength) {
      return { 
        isValid: false, 
        message: `${fieldName} نباید بیش از ${maxLength} کاراکتر باشد` 
      };
    }
    
    return { isValid: true };
  }

  // Numeric validation
  static validateNumeric(value: string, fieldName: string): ValidationResult {
    if (!value) {
      return { isValid: true }; // Allow empty values
    }
    
    if (isNaN(Number(value))) {
      return { isValid: false, message: `${fieldName} باید عدد باشد` };
    }
    
    return { isValid: true };
  }

  // Positive number validation
  static validatePositiveNumber(value: number | string, fieldName: string): ValidationResult {
    const numValue = Number(value);
    
    if (isNaN(numValue) || numValue < 0) {
      return { isValid: false, message: `${fieldName} باید عدد مثبت باشد` };
    }
    
    return { isValid: true };
  }

  // Price validation (Iranian Toman)
  static validatePrice(price: number | string, fieldName: string = 'قیمت'): ValidationResult {
    const numPrice = Number(price);
    
    if (isNaN(numPrice)) {
      return { isValid: false, message: `${fieldName} باید عدد باشد` };
    }
    
    if (numPrice < 0) {
      return { isValid: false, message: `${fieldName} نمی‌تواند منفی باشد` };
    }
    
    if (numPrice > 999999999) {
      return { isValid: false, message: `${fieldName} خیلی زیاد است` };
    }
    
    return { isValid: true };
  }

  // Stock quantity validation (Product requirement: warn when 3 or less)
  static validateStockQuantity(quantity: number | string): ValidationResult {
    const numQuantity = Number(quantity);
    
    if (isNaN(numQuantity)) {
      return { isValid: false, message: 'موجودی باید عدد باشد' };
    }
    
    if (numQuantity < 0) {
      return { isValid: false, message: 'موجودی نمی‌تواند منفی باشد' };
    }
    
    return { isValid: true };
  }

  // Check low stock (Product requirement)
  static checkLowStock(quantity: number): { isLow: boolean; message?: string } {
    if (quantity <= 0) {
      return { isLow: true, message: 'محصول ناموجود است' };
    }
    
    if (quantity <= 3) {
      return { isLow: true, message: `تنها ${quantity} عدد باقی مانده است` };
    }
    
    return { isLow: false };
  }

  // OTP code validation
  static validateOTPCode(code: string): ValidationResult {
    const cleanCode = code.replace(/\s+/g, '');
    
    if (!cleanCode) {
      return { isValid: false, message: 'کد تایید الزامی است' };
    }
    
    if (!/^\d{4,6}$/.test(cleanCode)) {
      return { isValid: false, message: 'کد تایید باید 4 تا 6 رقم باشد' };
    }
    
    return { isValid: true };
  }

  // Iranian postal code validation
  static validatePostalCode(postalCode: string): ValidationResult {
    const cleanCode = postalCode.replace(/\s+/g, '').replace(/-/g, '');
    
    if (!cleanCode) {
      return { isValid: false, message: 'کد پستی الزامی است' };
    }
    
    if (!/^\d{10}$/.test(cleanCode)) {
      return { isValid: false, message: 'کد پستی باید 10 رقم باشد' };
    }
    
    return { isValid: true };
  }

  // Color code validation (for color picker requirement)
  static validateColorCode(color: string): ValidationResult {
    if (!color) {
      return { isValid: false, message: 'رنگ الزامی است' };
    }
    
    // Hex color format
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    
    if (!hexColorRegex.test(color)) {
      return { isValid: false, message: 'فرمت رنگ صحیح نیست (مثال: #FF0000)' };
    }
    
    return { isValid: true };
  }

  // Subdomain validation
  static validateSubdomain(subdomain: string): ValidationResult {
    if (!subdomain) {
      return { isValid: false, message: 'زیردامنه الزامی است' };
    }
    
    // Subdomain format: alphanumeric and hyphens, no consecutive hyphens
    const subdomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,48}[a-zA-Z0-9])?$/;
    
    if (!subdomainRegex.test(subdomain)) {
      return { 
        isValid: false, 
        message: 'زیردامنه فقط می‌تواند شامل حروف انگلیسی، اعداد و خط تیره باشد' 
      };
    }
    
    // Reserved subdomains
    const reserved = ['www', 'api', 'admin', 'mail', 'ftp', 'blog', 'shop', 'store'];
    if (reserved.includes(subdomain.toLowerCase())) {
      return { isValid: false, message: 'این زیردامنه رزرو شده است' };
    }
    
    return { isValid: true };
  }

  // URL validation
  static validateURL(url: string, fieldName: string = 'آدرس'): ValidationResult {
    if (!url) {
      return { isValid: true }; // Allow empty URLs
    }
    
    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return { isValid: false, message: `${fieldName} معتبر نیست` };
    }
  }

  // File validation
  static validateFile(
    file: File, 
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'],
    maxSizeMB: number = 5
  ): ValidationResult {
    if (!file) {
      return { isValid: false, message: 'فایل انتخاب نشده است' };
    }
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      const allowedExtensions = allowedTypes.map(type => type.split('/')[1]).join(', ');
      return { 
        isValid: false, 
        message: `نوع فایل مجاز نیست. فرمت‌های مجاز: ${allowedExtensions}` 
      };
    }
    
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { 
        isValid: false, 
        message: `حجم فایل نباید بیش از ${maxSizeMB} مگابایت باشد` 
      };
    }
    
    return { isValid: true };
  }

  // Form validation helper
  static validateForm(values: Record<string, any>, rules: Record<string, any[]>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};
    
    for (const [fieldName, fieldRules] of Object.entries(rules)) {
      const value = values[fieldName];
      
      for (const rule of fieldRules) {
        const result = rule(value);
        if (!result.isValid) {
          errors[fieldName] = result.message || 'مقدار نامعتبر';
          break; // Stop at first error for this field
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Persian text validation
  static validatePersianText(text: string, fieldName: string): ValidationResult {
    if (!text) {
      return { isValid: false, message: `${fieldName} الزامی است` };
    }
    
    // Allow Persian, Arabic, and common punctuation
    const persianRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\d\.\,\!\?\-\(\)]+$/;
    
    if (!persianRegex.test(text)) {
      return { 
        isValid: false, 
        message: `${fieldName} باید به زبان فارسی باشد` 
      };
    }
    
    return { isValid: true };
  }

  // Store name validation
  static validateStoreName(name: string): ValidationResult {
    const requiredResult = this.validateRequired(name, 'نام فروشگاه');
    if (!requiredResult.isValid) return requiredResult;
    
    const lengthResult = this.validateMinLength(name, 2, 'نام فروشگاه');
    if (!lengthResult.isValid) return lengthResult;
    
    const maxLengthResult = this.validateMaxLength(name, 100, 'نام فروشگاه');
    if (!maxLengthResult.isValid) return maxLengthResult;
    
    return { isValid: true };
  }

  // Product name validation
  static validateProductName(name: string): ValidationResult {
    const requiredResult = this.validateRequired(name, 'نام محصول');
    if (!requiredResult.isValid) return requiredResult;
    
    const lengthResult = this.validateMinLength(name, 3, 'نام محصول');
    if (!lengthResult.isValid) return lengthResult;
    
    const maxLengthResult = this.validateMaxLength(name, 200, 'نام محصول');
    if (!maxLengthResult.isValid) return maxLengthResult;
    
    return { isValid: true };
  }
}

// Helper functions for common validations
export const isValidIranianPhone = (phone: string): boolean => {
  return ValidationUtils.validateIranianPhone(phone).isValid;
};

export const isValidEmail = (email: string): boolean => {
  return ValidationUtils.validateEmail(email).isValid;
};

export const isLowStock = (quantity: number): boolean => {
  return ValidationUtils.checkLowStock(quantity).isLow;
};

export const formatIranianPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('09')) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  return phone;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
};

export default ValidationUtils;