// src/components/ReceiptForm.js

import React, { useState, useEffect } from 'react';
import { fetchListData, submitFormData, uploadImage } from '../services/sheetdb';
import './ReceiptForm.css'; // Import the CSS file

const ReceiptForm = () => {
  const [date, setDate] = useState('');
  const [project, setProject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [volume, setVolume] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [vendor, setVendor] = useState('');
  const [location, setLocation] = useState('');
  const [workItem, setWorkItem] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [projectsList, setProjectsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [vendorsList, setVendorsList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [workItemsList, setWorkItemsList] = useState([]);

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const projects = await fetchListData('Project Lists');
      const categories = await fetchListData('Categories');
      const vendors = await fetchListData('Vendors');
      const locations = await fetchListData('Locations');
      const workItems = await fetchListData('Work Items');

      setProjectsList(projects.map(p => p.Name));
      setCategoriesList(categories.map(c => c.Name));
      setVendorsList(vendors.map(v => v.Name));
      setLocationsList(locations.map(l => l.Name));
      setWorkItemsList(workItems.map(w => w.Name));
    } catch (error) {
      console.error('Error loading dropdowns', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = imageUrl;
      if (image) {
        setIsUploading(true);
        finalImageUrl = await uploadImage(image, `receipt_${Date.now()}`);
        setIsUploading(false);
      }

      await submitFormData({
        date,
        project,
        description,
        category,
        receiptNumber,
        volume,
        unitPrice,
        vendor,
        location,
        workItem,
        imageUrl: finalImageUrl
      });

      alert('Receipt submitted successfully!');

      // Reset the form
      setDate('');
      setProject('');
      setDescription('');
      setCategory('');
      setReceiptNumber('');
      setVolume('');
      setUnitPrice('');
      setVendor('');
      setLocation('');
      setWorkItem('');
      setImage(null);
      setImageUrl('');
    } catch (error) {
      console.error('Error submitting receipt:', error);
      alert('Failed to submit receipt!');
    }
  };

  return (
    <div className="receipt-form">
      <h2>🧾 Receipt Manager</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <input list="projects" value={project} onChange={(e) => setProject(e.target.value)} placeholder="Project Name" required />
        <datalist id="projects">
          {projectsList.map((p, index) => <option key={index} value={p} />)}
        </datalist>

        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />

        <input list="categories" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
        <datalist id="categories">
          {categoriesList.map((c, index) => <option key={index} value={c} />)}
        </datalist>

        <input type="text" value={receiptNumber} onChange={(e) => setReceiptNumber(e.target.value)} placeholder="Receipt Number" />

        <input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="Volume" required />
        <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="Unit Price" required />

        <input list="vendors" value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Vendor/Supplier" required />
        <datalist id="vendors">
          {vendorsList.map((v, index) => <option key={index} value={v} />)}
        </datalist>

        <input list="locations" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" required />
        <datalist id="locations">
          {locationsList.map((l, index) => <option key={index} value={l} />)}
        </datalist>

        <input list="workitems" value={workItem} onChange={(e) => setWorkItem(e.target.value)} placeholder="Work Item" required />
        <datalist id="workitems">
          {workItemsList.map((w, index) => <option key={index} value={w} />)}
        </datalist>

        <label>Upload New Image (optional):</label>
        <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} />

        <label>Or Existing Image URL:</label>
        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL" />

        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading Image...' : 'Submit Receipt'}
        </button>
      </form>
    </div>
  );
};

export default ReceiptForm;
