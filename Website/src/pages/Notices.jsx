import React, { useEffect, useState } from "react";
import { getNotices, fileUrl } from "../api/cmsApi";
import { ErrorState, EmptyState, SkeletonList } from "../components/DataState";
import "../Styles/ListPage.css";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotices();
      setNotices(data);
    } catch (err) {
      setError(err.message || 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="list-page">
        <h1>Notices</h1>
        <SkeletonList count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-page">
        <h1>Notices</h1>
        <ErrorState message={error} onRetry={fetchNotices} />
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="list-page">
        <h1>Notices</h1>
        <EmptyState message="No notices published yet." />
      </div>
    );
  }

  return (
    <div className="list-page">
      <h1>Notices</h1>
      <ul className="list-page-items">
        {notices.map((n) => (
          <li key={n.id} className="list-page-item">
            <div className="list-page-item-date">
              {new Date(n.noticeDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="list-page-item-body">
              <h3>{n.title}</h3>
              {n.description && <p>{n.description}</p>}
              {n.filePath && (
                <a
                  href={fileUrl(n.filePath)}
                  target="_blank"
                  rel="noreferrer"
                  className="list-page-link"
                >
                  View / Download PDF
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}