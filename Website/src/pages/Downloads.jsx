import React, { useEffect, useState } from "react";
import { getDownloads, fileUrl } from "../api/cmsApi";
import "../Styles/ListPage.css";

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDownloads().then((data) => {
      setDownloads(data);
      setLoading(false);
    });
  }, []);

  // Group by category so related files sit together (falls back to
  // "General" when a download has no category set).
  const grouped = downloads.reduce((acc, d) => {
    const cat = d.category || "General";
    acc[cat] = acc[cat] || [];
    acc[cat].push(d);
    return acc;
  }, {});

  return (
    <div className="list-page">
      <h1>Downloads</h1>

      {loading && <p>Loading…</p>}

      {!loading && downloads.length === 0 && (
        <p>No downloads available yet.</p>
      )}

      {!loading &&
        Object.entries(grouped).map(([category, items]) => (
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