// src/services/sheetdb.js

export const SHEETDB_API = 'https://sheetdb.io/api/v1/dd0cjhb34h7x0';

// ✅ Fetch data from specific sheet for dropdowns
export const fetchListData = async (sheetName) => {
  const response = await fetch(`${SHEETDB_API}/sheet/${encodeURIComponent(sheetName)}`);
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Invalid data received from SheetDB');
  }
  return data;
};

// ✅ Submit form data
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

// ✅ Upload base64 image to Google Apps Script
export const uploadImage = async (base64Data, filename) => {
  const response = await fetch('https://script.google.com/macros/s/AKfycbwiTSXkAc5NWWQUUEYLxE1EL2Rzg8bnXEYNET23jcnBLhgqvbnIXJMejYXyTHm9noOJeA/exec', { 
    method: 'POST',
    body: JSON.stringify({ image: base64Data, name: filename }),
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await response.json();
  if (!result || !result.url) throw new Error('Image upload failed');
  return result.url;
};
