// src/components/ReceiptForm.js
import React, { useState, useEffect } from 'react';
import { fetchListData, submitFormData, uploadImage } from '../services/sheetdb';
import './ReceiptForm.css'; // assuming you create a css file

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
    imageUrl: '',
    imageFile: null
  });

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [workItems, setWorkItems] = useState([]);

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const projectData = await fetchListData('Project Lists');
      const categoryData = await fetchListData('Categories');
      const vendorData = await fetchListData('Vendors');
      const locationData = await fetchListData('Locations');
      const workItemData = await fetchListData('Work Items');

      setProjects(projectData.map(item => item.Project));
      setCategories(categoryData.map(item => item.Category));
      setVendors(vendorData.map(item => item.Vendor));
      setLocations(locationData.map(item => item.Location));
      setWorkItems(workItemData.map(item => item['Work Item']));
    } catch (error) {
      console.error('Error loading dropdowns', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      setFormData({ ...formData, imageFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;

      if (formData.imageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = reader.result.split(',')[1];
          imageUrl = await uploadImage(base64, formData.imageFile.name);

          await submitFormData({ ...formData, imageUrl });
          alert('Receipt submitted successfully!');
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
            imageUrl: '',
            imageFile: null
          });
        };
        reader.readAsDataURL(formData.imageFile);
      } else {
        await submitFormData({ ...formData, imageUrl });
        alert('Receipt submitted successfully!');
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
          imageUrl: '',
          imageFile: null
        });
      }
    } catch (error) {
      console.error('Error submitting form', error);
      alert('Failed to submit receipt.');
    }
  };

  return (
    <form className="receipt-form" onSubmit={handleSubmit}>
      <h2>📄 Receipt Tracker</h2>

      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      
      <input list="project-list" name="project" value={formData.project} onChange={handleChange} placeholder="Project Name" required />
      <datalist id="project-list">
        {projects.map((proj, idx) => <option key={idx} value={proj} />)}
      </datalist>

      <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />

      <input list="category-list" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
      <datalist id="category-list">
        {categories.map((cat, idx) => <option key={idx} value={cat} />)}
      </datalist>

      <input type="text" name="receiptNumber" value={formData.receiptNumber} onChange={handleChange} placeholder="Receipt Number" />

      <input type="number" name="volume" value={formData.volume} onChange={handleChange} placeholder="Volume" />

      <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleChange} placeholder="Unit Price" />

      <input list="vendor-list" name="vendor" value={formData.vendor} onChange={handleChange} placeholder="Vendor/Supplier" />
      <datalist id="vendor-list">
        {vendors.map((vendor, idx) => <option key={idx} value={vendor} />)}
      </datalist>

      <input list="location-list" name="location" value={formData.location} onChange={handleChange} placeholder="Location" />
      <datalist id="location-list">
        {locations.map((loc, idx) => <option key={idx} value={loc} />)}
      </datalist>

      <input list="workitem-list" name="workItem" value={formData.workItem} onChange={handleChange} placeholder="Work Item" />
      <datalist id="workitem-list">
        {workItems.map((work, idx) => <option key={idx} value={work} />)}
      </datalist>

      <input type="file" name="imageFile" accept="image/*" onChange={handleChange} />
      <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Or paste existing Image URL" />

      <button type="submit">Submit Receipt</button>
    </form>
  );
};

export default ReceiptForm;

