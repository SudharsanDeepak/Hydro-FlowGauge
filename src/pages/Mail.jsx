import { useState } from "react";
import API from "../services/api";
import "../styles/Mail.css";

export default function Mail() {
  const [formData, setFormData] = useState({
    recipient: "admin@example.com",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: "Sending email...", type: "info" });
    try {
      await API.post("/mail/send", formData);
      setStatus({ message: "Email sent successfully!", type: "success" });
      setFormData({ recipient: "admin@example.com", subject: "", message: "" });
    } catch (err) {
      setStatus({ message: "Failed to send email. Please try again.", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus({ message: "", type: "" }), 5000);
    }
  };

  return (
    <div className="mail-pro">
      <div className="mail-header-pro">
        <h1>Mail & Notifications</h1>
        <p>Manage and send manual email notifications to administrators or users.</p>
      </div>

      <div className="mail-grid-pro">
        <div className="card-pro mail-card-pro">
          <div className="card-header-pro">
            <h2>Send a Manual Email</h2>
          </div>
          <form onSubmit={handleSubmit} className="mail-form-pro">
            <div className="form-group-pro">
              <label htmlFor="recipient">Recipient</label>
              <input type="email" id="recipient" name="recipient" value={formData.recipient} onChange={handleChange} required className="form-input-pro" />
            </div>
            <div className="form-group-pro">
              <label htmlFor="subject">Subject</label>
              <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="form-input-pro" />
            </div>
            <div className="form-group-pro">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} required className="form-textarea-pro"></textarea>
            </div>
            <button type="submit" className="btn-pro-submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Email'}
            </button>
          </form>
          {status.message && (
            <div className={`status-banner-pro ${status.type}`}>{status.message}</div>
          )}
        </div>

        <div className="card-pro notification-card-pro">
          <div className="card-header-pro">
            <h2>Automatic Notifications</h2>
            <div className="status-tag-pro active">Active</div>
          </div>
          <p className="info-text-pro">
            The system is configured to automatically send email alerts for critical events, such as a prolonged night-time water flow, ensuring timely responses to potential issues.
          </p>
        </div>
      </div>
    </div>
  );
}