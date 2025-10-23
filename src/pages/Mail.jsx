import { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/Mail.css";

export default function Mail() {
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState({ email: "", name: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ email: "", name: "" });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  // Fetch recipients on component mount
  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    try {
      const response = await API.get("/mail/recipients");
      setRecipients(response.data.recipients || []);
    } catch (err) {
      console.error("Failed to fetch recipients:", err);
      showStatus("Failed to load recipients", "error");
    }
  };

  const showStatus = (message, type) => {
    setStatus({ message, type });
    setTimeout(() => setStatus({ message: "", type: "" }), 5000);
  };

  const handleAddRecipient = async (e) => {
    e.preventDefault();
    if (!newRecipient.email || !newRecipient.name) {
      showStatus("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/mail/recipients", newRecipient);
      setRecipients([response.data.recipient, ...recipients]);
      setNewRecipient({ email: "", name: "" });
      showStatus("Recipient added successfully!", "success");
    } catch (err) {
      showStatus(err.response?.data?.message || "Failed to add recipient", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecipient = async (id) => {
    if (!editData.email || !editData.name) {
      showStatus("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await API.put(`/mail/recipients/${id}`, editData);
      setRecipients(recipients.map(r => r.id === id ? response.data.recipient : r));
      setEditingId(null);
      setEditData({ email: "", name: "" });
      showStatus("Recipient updated successfully!", "success");
    } catch (err) {
      showStatus(err.response?.data?.message || "Failed to update recipient", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipient = async (id) => {
    if (!confirm("Are you sure you want to delete this recipient?")) return;

    setLoading(true);
    try {
      await API.delete(`/mail/recipients/${id}`);
      setRecipients(recipients.filter(r => r.id !== id));
      showStatus("Recipient deleted successfully!", "success");
    } catch (err) {
      showStatus(err.response?.data?.message || "Failed to delete recipient", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    setLoading(true);
    try {
      const response = await API.put(`/mail/recipients/${id}`, { isActive: !currentStatus });
      setRecipients(recipients.map(r => r.id === id ? response.data.recipient : r));
      showStatus(`Recipient ${!currentStatus ? 'activated' : 'deactivated'}!`, "success");
    } catch (err) {
      showStatus("Failed to update recipient status", "error");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (recipient) => {
    setEditingId(recipient.id);
    setEditData({ email: recipient.email, name: recipient.name });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ email: "", name: "" });
  };

  return (
    <div className="mail-pro">
      <div className="mail-header-pro">
        <h1>Email Notifications</h1>
        <p>Manage email recipients for automatic valve closure alerts</p>
      </div>

      {status.message && (
        <div className={`status-banner-pro ${status.type}`} style={{ marginBottom: '1.5rem' }}>
          {status.message}
        </div>
      )}

      <div className="mail-grid-pro">
        {/* Add New Recipient Card */}
        <div className="card-pro mail-card-pro">
          <div className="card-header-pro">
            <h2>Add Email Recipient</h2>
          </div>
          <form onSubmit={handleAddRecipient} className="mail-form-pro">
            <div className="form-group-pro">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={newRecipient.name}
                onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                placeholder="John Doe"
                required
                className="form-input-pro"
              />
            </div>
            <div className="form-group-pro">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={newRecipient.email}
                onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                placeholder="john@example.com"
                required
                className="form-input-pro"
              />
            </div>
            <button type="submit" className="btn-pro-submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Recipient'}
            </button>
          </form>
        </div>

        {/* Automatic Notifications Info Card */}
        <div className="card-pro notification-card-pro">
          <div className="card-header-pro">
            <h2>Automatic Notifications</h2>
            <div className="status-tag-pro active">Active</div>
          </div>
          <p className="info-text-pro">
            The system automatically sends email alerts to you and all active recipients when the water valve closes due to continuous flow for more than 5 minutes.
          </p>
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#DBEAFE', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: '#1E40AF', margin: 0 }}>
              <strong>Recipients:</strong> {recipients.filter(r => r.isActive).length} active
            </p>
          </div>
        </div>
      </div>

      {/* Recipients List */}
      <div className="card-pro" style={{ marginTop: '2rem' }}>
        <div className="card-header-pro">
          <h2>Email Recipients ({recipients.length})</h2>
        </div>
        
        {recipients.length === 0 ? (
          <p className="info-text-pro" style={{ textAlign: 'center', padding: '2rem 0' }}>
            No recipients added yet. Add your first recipient above.
          </p>
        ) : (
          <div style={{ marginTop: '1.5rem' }}>
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  backgroundColor: recipient.isActive ? '#fff' : '#F9FAFB',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                {editingId === recipient.id ? (
                  // Edit Mode
                  <div style={{ flex: 1, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="form-input-pro"
                      style={{ flex: '1', minWidth: '150px' }}
                      placeholder="Name"
                    />
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="form-input-pro"
                      style={{ flex: '1', minWidth: '200px' }}
                      placeholder="Email"
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleUpdateRecipient(recipient.id)}
                        className="btn-pro-submit"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        disabled={loading}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          backgroundColor: '#6B7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.125rem', color: '#111827' }}>
                        {recipient.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#6B7280' }}>
                        {recipient.email}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: recipient.isActive ? '#D1FAE5' : '#FEE2E2',
                          color: recipient.isActive ? '#065F46' : '#991B1B'
                        }}
                      >
                        {recipient.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleToggleActive(recipient.id, recipient.isActive)}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          backgroundColor: recipient.isActive ? '#F59E0B' : '#10B981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        disabled={loading}
                      >
                        {recipient.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => startEdit(recipient)}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRecipient(recipient.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          backgroundColor: '#EF4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}