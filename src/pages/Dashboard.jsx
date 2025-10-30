import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Dashboard.css";

function MeterGauge({ value = 0, max = 30 }) {
    const safeValue = Math.max(0, Math.min(value, max));
    const percentage = (safeValue / max) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="gauge-container-pro">
            <svg className="gauge-svg" viewBox="0 0 100 100">
                <circle className="gauge-background" cx="50" cy="50" r="45" />
                <circle 
                    className="gauge-foreground" 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                />
            </svg>
            <div className="gauge-text">
                <div className="gauge-value-pro">{safeValue.toFixed(2)}</div>
                <div className="gauge-label-pro">Liters / Minute</div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [flow, setFlow] = useState({ flowRate: 0, valveStatus: 'OPEN' });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const isMountedRef = useRef(true);

    // Memoize fetchData to prevent recreation on every render
    const fetchData = useCallback(async () => {
        if (!isMountedRef.current) return;
        
        try {
            const res = await API.get("/data/flow");
            if (isMountedRef.current) {
                setFlow(res.data);
                // Clear error on successful fetch
                if (error) setError("");
            }
        } catch (err) {
            if (!isMountedRef.current) return;
            
            // Don't navigate on error - just show error message
            // This prevents interrupting the user's current page
            const errorMsg = err?.response?.data?.message || "Connection error";
            if (error !== errorMsg) {
                setError(errorMsg);
            }
            
            // Only log 401 errors, don't redirect
            if (err?.response?.status === 401) {
                console.warn("Authentication error - please refresh and login again");
            }
        }
    }, [error]);

    useEffect(() => {
        isMountedRef.current = true;
        
        // Initial fetch
        fetchData();
        
        // Set up polling interval
        const timerId = setInterval(fetchData, 5000);

        return () => {
            isMountedRef.current = false;
            clearInterval(timerId);
        };
    }, [fetchData]);

    const handleOpenValve = useCallback(async () => {
        if (!isMountedRef.current) return;
        
        setLoading(true);
        setError("");
        setSuccess("");
        
        try {
            const res = await API.post("/data/valve", { action: "open" });
            if (isMountedRef.current) {
                setSuccess("✅ Valve OPEN command sent! ESP32 will process within 10-15 seconds.");
                
                // Clear success message after 15 seconds
                setTimeout(() => {
                    if (isMountedRef.current) {
                        setSuccess("");
                    }
                }, 15000);
            }
        } catch (err) {
            if (isMountedRef.current) {
                setError(err?.response?.data?.message || "Failed to open valve");
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="dashboard-pro">
            <div className="dashboard-header-pro">
                <h1>Dashboard</h1>
                <p>Real-time monitoring of your water flow.</p>
            </div>

            {error && <div className="error-banner-pro">{error}</div>}
            {success && <div className="success-banner-pro" style={{backgroundColor: '#10b981', color: 'white', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>{success}</div>}

            <div className="dashboard-grid-pro">
                <div className="card-pro gauge-card-pro">
                    <div className="card-header-pro">
                        <h2>Current Flow Rate</h2>
                        <span className="live-indicator">Live</span>
                    </div>
                    <MeterGauge value={Number(flow.flowRate) || 0} max={30} />
                </div>

                <div className="card-pro status-card-pro">
                    <div className="card-header-pro">
                        <h2>Valve Control</h2>
                        <div className={`status-tag-pro ${flow.valveStatus === 'OPEN' ? 'open' : 'closed'}`}>
                            {flow.valveStatus}
                        </div>
                    </div>
                    <p className="status-description-pro">
                        The main water valve is currently <strong>{flow.valveStatus}</strong>.
                        {flow.valveStatus === 'CLOSED' && (
                            <span style={{display: 'block', marginTop: '0.5rem', color: '#ef4444', fontSize: '0.9rem'}}>
                                ⚠️ Valve closed automatically due to continuous flow
                            </span>
                        )}
                    </p>
                    <div className="valve-control-pro">
                        <p style={{marginBottom: '0.5rem'}}>The valve closes automatically after 5 minutes of continuous flow.</p>
                        <p style={{fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem'}}>Use this button to reopen the valve manually.</p>
                        <button 
                            className="btn-pro-toggle" 
                            onClick={handleOpenValve}
                            disabled={loading || flow.valveStatus === 'OPEN'}
                            style={{
                                backgroundColor: flow.valveStatus === 'OPEN' ? '#6b7280' : '#10b981',
                                cursor: loading || flow.valveStatus === 'OPEN' ? 'not-allowed' : 'pointer',
                                opacity: loading || flow.valveStatus === 'OPEN' ? 0.6 : 1,
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}
                        >
                            {loading ? '⏳ Sending Command...' : flow.valveStatus === 'OPEN' ? '✓ Valve is Open' : '🔓 Open Valve'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}