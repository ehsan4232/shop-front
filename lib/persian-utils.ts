/**
 * Persian/Farsi utilities for number formatting, date handling, and text processing
 * Comprehensive support for Iranian e-commerce platform requirements
 */

// Persian digit mapping
const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Convert English numbers to Persian numbers
 */
export function toPersianNumber(input: string | number): string {
  if (typeof input === 'number') {
    input = input.toString();
  }
  
  return input.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

/**
 * Convert Persian/Arabic numbers to English numbers
 */
export function toEnglishNumber(input: string): string {
  let result = input;
  
  // Convert Persian digits
  persianDigits.forEach((persianDigit, index) => {
    result = result.replace(new RegExp(persianDigit, 'g'), englishDigits[index]);
  });
  
  // Convert Arabic digits
  arabicDigits.forEach((arabicDigit, index) => {
    result = result.replace(new RegExp(arabicDigit, 'g'), englishDigits[index]);
  });
  
  return result;
}

/**
 * Format price in Persian with proper separators
 */
export function formatPersianPrice(
  price: number | string,
  options: {
    currency?: string;
    showCurrency?: boolean;
    persianDigits?: boolean;
  } = {}
): string {
  const {
    currency = 'تومان',
    showCurrency = true,
    persianDigits = true,
  } = options;
  
  const numPrice = typeof price === 'string' ? parseFloat(toEnglishNumber(price)) : price;
  
  if (isNaN(numPrice)) return '';
  
  // Format with thousands separator
  const formatted = numPrice.toLocaleString('en-US');
  
  // Convert to Persian digits if requested
  const finalNumber = persianDigits ? toPersianNumber(formatted) : formatted;
  
  // Add currency
  return showCurrency ? `${finalNumber} ${currency}` : finalNumber;
}

/**
 * Format large numbers with Persian units (هزار، میلیون، میلیارد)
 */
export function formatPersianNumberUnit(num: number): string {
  if (num >= 1000000000) {
    const billions = (num / 1000000000).toFixed(1);
    return `${toPersianNumber(billions)} میلیارد`;
  } else if (num >= 1000000) {
    const millions = (num / 1000000).toFixed(1);
    return `${toPersianNumber(millions)} میلیون`;
  } else if (num >= 1000) {
    const thousands = (num / 1000).toFixed(1);
    return `${toPersianNumber(thousands)} هزار`;
  }
  return toPersianNumber(num.toString());
}

/**
 * Persian date formatting
 */
export function formatPersianDate(
  date: Date | string,
  options: {
    includeTime?: boolean;
    longFormat?: boolean;
  } = {}
): string {
  const { includeTime = false, longFormat = false } = options;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Persian month names
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
    'مرداد', 'شهریور', 'مهر', 'آبان',
    'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  
  // Persian day names
  const persianDays = [
    'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه',
    'پنج‌شنبه', 'جمعه', 'شنبه'
  ];
  
  // Convert to Persian calendar (simplified - for production use a proper library)
  // This is a basic implementation
  const persianYear = dateObj.getFullYear() - 621;
  const persianMonth = persianMonths[dateObj.getMonth()];
  const persianDay = toPersianNumber(dateObj.getDate().toString());
  const dayName = persianDays[dateObj.getDay()];
  
  let formatted = longFormat 
    ? `${dayName}، ${persianDay} ${persianMonth} ${toPersianNumber(persianYear.toString())}`
    : `${persianDay} ${persianMonth} ${toPersianNumber(persianYear.toString())}`;
  
  if (includeTime) {
    const hours = toPersianNumber(dateObj.getHours().toString().padStart(2, '0'));
    const minutes = toPersianNumber(dateObj.getMinutes().toString().padStart(2, '0'));
    formatted += ` - ${hours}:${minutes}`;
  }
  
  return formatted;
}

/**
 * Format relative time in Persian (e.g., "2 ساعت پیش")
 */
export function formatPersianRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffYears > 0) {
    return `${toPersianNumber(diffYears.toString())} سال پیش`;
  } else if (diffMonths > 0) {
    return `${toPersianNumber(diffMonths.toString())} ماه پیش`;
  } else if (diffWeeks > 0) {
    return `${toPersianNumber(diffWeeks.toString())} هفته پیش`;
  } else if (diffDays > 0) {
    return `${toPersianNumber(diffDays.toString())} روز پیش`;
  } else if (diffHours > 0) {
    return `${toPersianNumber(diffHours.toString())} ساعت پیش`;
  } else if (diffMinutes > 0) {
    return `${toPersianNumber(diffMinutes.toString())} دقیقه پیش`;
  } else {
    return 'همین الان';
  }
}

/**
 * Validate Persian text input
 */
export function validatePersianText(text: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check for Persian characters
  const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  if (!persianRegex.test(text)) {
    errors.push('متن باید شامل حروف فارسی باشد');
  }
  
  // Check for minimum length
  if (text.trim().length < 2) {
    errors.push('متن باید حداقل ۲ کاراکتر باشد');
  }
  
  // Check for excessive special characters
  const specialCharCount = (text.match(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\d]/g) || []).length;
  if (specialCharCount > text.length * 0.3) {
    errors.push('متن شامل کاراکترهای نامعتبر زیادی است');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate Persian slug from text
 */
export function createPersianSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    // Convert Persian/Arabic digits to English
    .replace(/[۰-۹]/g, (digit) => englishDigits[persianDigits.indexOf(digit)])
    .replace(/[٠-٩]/g, (digit) => englishDigits[arabicDigits.indexOf(digit)])
    // Replace spaces and special characters with dashes
    .replace(/[\s\u200c\u200d]+/g, '-') // Include zero-width characters
    .replace(/[^\u0600-\u06FF\u0750-\u077Fa-zA-Z0-9\-]/g, '')
    // Remove multiple consecutive dashes
    .replace(/-+/g, '-')
    // Remove leading/trailing dashes
    .replace(/^-|-$/g, '');
}

/**
 * Format Persian phone number
 */
export function formatPersianPhoneNumber(phone: string): string {
  const cleaned = toEnglishNumber(phone).replace(/\D/g, '');
  
  if (cleaned.length === 11 && cleaned.startsWith('09')) {
    const formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    return toPersianNumber(formatted);
  } else if (cleaned.length === 10) {
    const formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    return toPersianNumber(formatted);
  }
  
  return toPersianNumber(phone);
}

/**
 * Format Persian postal code
 */
export function formatPersianPostalCode(postalCode: string): string {
  const cleaned = toEnglishNumber(postalCode).replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    const formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    return toPersianNumber(formatted);
  }
  
  return toPersianNumber(postalCode);
}

/**
 * Sort Persian text array correctly
 */
export function sortPersianText(items: string[]): string[] {
  return items.sort((a, b) => {
    return a.localeCompare(b, 'fa', { 
      numeric: true,
      ignorePunctuation: true,
      sensitivity: 'base'
    });
  });
}

/**
 * Persian pluralization helper
 */
export function persianPlural(
  count: number,
  singular: string,
  plural?: string
): string {
  const persianCount = toPersianNumber(count.toString());
  
  if (count === 0) {
    return `هیچ ${singular}`;
  } else if (count === 1) {
    return `${persianCount} ${singular}`;
  } else {
    return `${persianCount} ${plural || singular}`;
  }
}

/**
 * Persian search helper - normalize text for better search
 */
export function normalizePersianForSearch(text: string): string {
  return text
    // Convert Arabic characters to Persian equivalents
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ء/g, '')
    // Remove diacritics
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Check if text contains Persian content
 */
export function containsPersian(text: string): boolean {
  const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return persianRegex.test(text);
}

/**
 * Persian text direction helper
 */
export function getTextDirection(text: string): 'rtl' | 'ltr' {
  // Check for Persian/Arabic characters
  const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const ltrRegex = /[A-Za-z]/;
  
  const rtlCount = (text.match(rtlRegex) || []).length;
  const ltrCount = (text.match(ltrRegex) || []).length;
  
  return rtlCount > ltrCount ? 'rtl' : 'ltr';
}

/**
 * Clean and format user input for Persian text
 */
export function cleanPersianInput(input: string): string {
  return input
    // Convert Arabic characters to Persian
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}
