// src/components/ReceiptForm.js
import React, { useState, useEffect } from 'react';
import { fetchListData, submitFormData, uploadImage } from '../services/sheetdb';
import './ReceiptForm.css'; // (Create this simple css file)

const ReceiptForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    project: '',
    description: '',
    category: '',
    receiptNumber: '',
    volume: '',
    unitPrice: '',
    vendor: '',
    location: '',
    workItem: '',
    imageFile: null,
    imageUrl: ''
  });

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [workItems, setWorkItems] = useState([]);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    async function loadDropdowns() {
      try {
        const projects = await fetchListData('Project Lists');
        const categories = await fetchListData('Categories');
        const vendors = await fetchListData('Vendors');
        const locations = await fetchListData('Locations');
        const workItems = await fetchListData('Work Items');

        setProjects(projects.map(item => item.Name || item.name));
        setCategories(categories.map(item => item.Name || item.name));
        setVendors(vendors.map(item => item.Name || item.name));
        setLocations(locations.map(item => item.Name || item.name));
        setWorkItems(workItems.map(item => item.Name || item.name));
      } catch (error) {
        console.error('Failed to load dropdowns:', error);
      }
    }

    loadDropdowns();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      const file = files[0];
      setFormData(prev => ({ ...prev, imageFile: file }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      if (file) reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.imageUrl;

      if (formData.imageFile) {
        const base64 = await toBase64(formData.imageFile);
        imageUrl = await uploadImage(base64, formData.imageFile.name);
      }

      const finalData = { ...formData, imageUrl };
      await submitFormData(finalData);
      alert('Receipt submitted!');
      setFormData({
        date: '',
        project: '',
        description: '',
        category: '',
        receiptNumber: '',
        volume: '',
        unitPrice: '',
        vendor: '',
        location: '',
        workItem: '',
        imageFile: null,
        imageUrl: ''
      });
      setImagePreview('');
    } catch (error) {
      console.error(error);
      alert('Submission failed!');
    }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  return (
    <form className="receipt-form" onSubmit={handleSubmit}>
      <h2>📋 Receipt Tracker</h2>

      <label>Date</label>
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />

      <label>Project Name</label>
      <input list="project-options" name="project" value={formData.project} onChange={handleChange} required />
      <datalist id="project-options">
        {projects.map((p, i) => <option key={i} value={p} />)}
      </datalist>

      <label>Description</label>
      <input type="text" name="description" value={formData.description} onChange={handleChange} required />

      <label>Category</label>
      <input list="category-options" name="category" value={formData.category} onChange={handleChange} />
      <datalist id="category-options">
        {categories.map((c, i) => <option key={i} value={c} />)}
      </datalist>

      <label>Receipt Number</label>
      <input type="text" name="receiptNumber" value={formData.receiptNumber} onChange={handleChange} />

      <label>Volume</label>
      <input type="number" name="volume" value={formData.volume} onChange={handleChange} />

      <label>Unit Price</label>
      <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} />

      <label>Vendor/Supplier</label>
      <input list="vendor-options" name="vendor" value={formData.vendor} onChange={handleChange} />
      <datalist id="vendor-options">
        {vendors.map((v, i) => <option key={i} value={v} />)}
      </datalist>

      <label>Location</label>
      <input list="location-options" name="location" value={formData.location} onChange={handleChange} />
      <datalist id="location-options">
        {locations.map((l, i) => <option key={i} value={l} />)}
      </datalist>

      <label>Work Item</label>
      <input list="workitem-options" name="workItem" value={formData.workItem} onChange={handleChange} />
      <datalist id="workitem-options">
        {workItems.map((w, i) => <option key={i} value={w} />)}
      </datalist>

      <label>Upload Receipt Image</label>
      <input type="file" name="imageFile" accept="image/*" capture="environment" onChange={handleChange} />

      {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

      <button type="submit">Submit</button>
    </form>
  );
};

export default ReceiptForm;

