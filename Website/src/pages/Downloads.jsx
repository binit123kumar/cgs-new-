import React, { useEffect, useState } from "react";
import { getDownloads, fileUrl } from "../api/cmsApi";
import { ErrorState, EmptyState, SkeletonList } from "../components/DataState";
import "../Styles/ListPage.css";

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDownloads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDownloads();
      setDownloads(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load downloads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  // Group by category so related files sit together (falls back to
  // "General" when a download has no category set).
  const grouped = downloads.reduce((acc, d) => {
    const cat = d.category || "General";
    acc[cat] = acc[cat] || [];
    acc[cat].push(d);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="list-page">
        <h1>Downloads</h1>
        <SkeletonList count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-page">
        <h1>Downloads</h1>
        <ErrorState message={error} onRetry={fetchDownloads} />
      </div>
    );
  }

  if (downloads.length === 0) {
    return (
      <div className="list-page">
        <h1>Downloads</h1>
        <EmptyState message="No downloads available yet." icon="📄" />
      </div>
    );
  }

  return (
    <div className="list-page">
      <h1>Downloads</h1>
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="list-page-group">
          <h2>{category}</h2>
          <ul className="list-page-items">
            {items.map((d) => (
              <li key={d.id} className="list-page-item">
                <div className="list-page-item-body">
                  <a
                    href={fileUrl(d.filePath)}
                    target="_blank"
                    rel="noreferrer"
                    className="list-page-link"
                  >
                    {d.title}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}