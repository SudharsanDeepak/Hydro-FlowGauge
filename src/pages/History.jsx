import { useEffect, useState, useMemo } from "react";
import API from "../services/api";
import "../styles/History.css";

const ITEMS_PER_PAGE = 10;

export default function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get("/data/history");
        // Handle both array response and object with history property
        const historyData = Array.isArray(res.data) ? res.data : res.data.history || [];
        setHistory(historyData);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError(err?.response?.data?.message || "Failed to fetch history data.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const sortedAndFilteredHistory = useMemo(() => {
    let sorted = [...history];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    if (filter !== 'all') {
      return sorted.filter(item => item.event === filter);
    }
    return sorted;
  }, [history, sortConfig, filter]);

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAndFilteredHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedAndFilteredHistory, currentPage]);

  const totalPages = Math.ceil(sortedAndFilteredHistory.length / ITEMS_PER_PAGE);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (timestamp) => new Date(timestamp).toLocaleString("en-IN", { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="history-pro">
      <div className="history-header-pro">
        <h1>Event History</h1>
        <p>A detailed log of all significant flow events and valve status changes.</p>
      </div>

      {error && <div className="error-banner-pro">{error}</div>}

      <div className="card-pro history-card-pro">
        <div className="history-controls-pro">
          <select onChange={(e) => setFilter(e.target.value)} value={filter} className="filter-select-pro">
            <option value="all">All Events</option>
            <option value="VALVE_CLOSED">Valve Closed</option>
            <option value="VALVE_OPEN">Valve Open</option>
            <option value="LEAK_DETECTED">Leak Detected</option>
          </select>
        </div>

        <div className="table-container-pro">
          <table className="table-pro">
            <thead>
              <tr>
                <th onClick={() => requestSort('timestamp')}>Date & Time</th>
                <th onClick={() => requestSort('flowRate')}>Flow Rate (L/min)</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="3" className="loading-cell">Loading history...</td></tr>
              ) : paginatedHistory.length > 0 ? (
                paginatedHistory.map((log) => (
                  <tr key={log.id}>
                    <td>{formatDate(log.timestamp)}</td>
                    <td>{Number(log.flowRate).toFixed(3)}</td>
                    <td>
                      <span className={`event-tag-pro ${log.event?.toLowerCase()}`}>
                        {log.event?.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="no-data-cell">No history data available for the selected filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination-pro">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}