import React, { useEffect, useState } from "react";
import { getPublications, fileUrl } from "../api/cmsApi";
import { ErrorState, EmptyState, SkeletonList } from "../components/DataState";
import "../Styles/ListPage.css";

export default function Publications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPublications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublications();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Failed to load publications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  if (loading) {
    return (
      <div className="list-page">
        <h1>Publications</h1>
        <SkeletonList count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-page">
        <h1>Publications</h1>
        <ErrorState message={error} onRetry={fetchPublications} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="list-page">
        <h1>Publications</h1>
        <EmptyState message="No publications listed yet." />
      </div>
    );
  }

  return (
    <div className="list-page">
      <h1>Publications</h1>
      <ul className="list-page-items">
        {items.map((p) => (
          <li key={p.id} className="list-page-item">
            <div className="list-page-item-body">
              <h3>
                {p.filePath ? (
                  <a
                    href={fileUrl(p.filePath)}
                    target="_blank"
                    rel="noreferrer"
                    className="list-page-link"
                  >
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
              </h3>
              <p>
                {p.author}
                {p.author && p.publishYear ? " — " : ""}
                {p.publishYear}
              </p>
              {p.description && <p>{p.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}