import React, { useEffect, useState } from "react";
import { getPublications, fileUrl } from "../api/cmsApi";
import "../Styles/ListPage.css";

export default function Publications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublications().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="list-page">
      <h1>Publications</h1>

      {loading && <p>Loading…</p>}

      {!loading && items.length === 0 && (
        <p>No publications listed yet.</p>
      )}

      {!loading && items.length > 0 && (
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
      )}
    </div>
  );
}