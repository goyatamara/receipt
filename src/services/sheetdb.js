// src/services/sheetdb.js

export const SHEETDB_API = 'https://sheetdb.io/api/v1/dd0cjhb34h7x0';

// Fetch list data for dropdowns
export const fetchListData = async (sheetName) => {
  const response = await fetch(`${SHEETDB_API}/search?sheet=${sheetName}`);
  const result = await response.json();
  
  if (!Array.isArray(result)) {
    return [];
  }
  
  return result;
};

// Submit form data
export const submitFormData = async (formData) => {
  const payload = {
    data: [{
      Date: formData.date,
      Project: formData.project,
      Description: formData.description,
      Category: formData.category,
      'Receipt Number': formData.receiptNumber,
      Volume: formData.volume,
      'Unit Price': formData.unitPrice,
      'Vendor/Supplier': formData.vendor,
      Location: formData.location,
      'Work Item': formData.workItem,
      'Image URL': formData.imageUrl
    }]
  };

  const response = await fetch(`${SHEETDB_API}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error('Form submission failed');
  return response.json();
};

// Upload image
export const uploadImage = async (base64Data, filename) => {
  const response = await fetch('YOUR_APPS_SCRIPT_WEBAPP_URL', {
    method: 'POST',
    body: JSON.stringify({
      image: base64Data,
      name: filename
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await response.json();
  if (!result || !result.url) throw new Error('Image upload failed');
  return result.url;
};
