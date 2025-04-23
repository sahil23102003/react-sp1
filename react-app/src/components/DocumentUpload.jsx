import { useState } from 'react';
import { uploadDocument } from '../services/api';
import './DocumentUpload.css';

const DocumentUpload = ({ internId, onDocumentUploaded }) => {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleTypeChange = (e) => {
    setDocumentType(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!documentType) {
      setError('Please select a document type');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await uploadDocument(file, documentType);
      
      if (response.status === 200) {
        setSuccess(true);
        setFile(null);
        setDocumentType('');
        
        // Notify parent component
        if (onDocumentUploaded) {
          onDocumentUploaded(response.data);
        }
      } else {
        setError(response.message || 'Failed to upload document');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="document-upload">
      <h3>Upload Document</h3>
      
      {success && (
        <div className="upload-success">
          Document uploaded successfully!
        </div>
      )}
      
      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="upload-group">
          <label htmlFor="documentType">Document Type</label>
          <select
            id="documentType"
            value={documentType}
            onChange={handleTypeChange}
            disabled={isUploading}
          >
            <option value="">Select Document Type</option>
            <option value="ID">ID Card</option>
            <option value="Resume">Resume/CV</option>
            <option value="Certificate">Certificate</option>
            <option value="Transcript">Academic Transcript</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="upload-group">
          <label htmlFor="documentFile">File</label>
          <div className="file-input-container">
            <input
              type="file"
              id="documentFile"
              onChange={handleFileChange}
              disabled={isUploading}
              className="file-input"
            />
            <div className="file-input-label">
              {file ? file.name : 'Select a file...'}
            </div>
            <button type="button" className="browse-button">
              Browse
            </button>
          </div>
          <div className="file-info">
            {file && (
              <span>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            )}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="upload-button"
          disabled={isUploading || !file || !documentType}
        >
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  );
};

export default DocumentUpload;