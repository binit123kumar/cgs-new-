import React, { useEffect, useState } from "react";
import { getGallery, fileUrl } from "../api/cmsApi";
import "../Styles/ListPage.css";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null); // lightbox

  useEffect(() => {
    getGallery().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="list-page">
      <h1>Photo Gallery</h1>

      {loading && <p>Loading…</p>}

      {!loading && items.length === 0 && (
        <p>No photos uploaded yet.</p>
      )}

      {!loading && items.length > 0 && (
        <div className="gallery-grid">
          {items.map((g) => (
            <button
              key={g.id}
              className="gallery-grid-item"
              onClick={() => setActive(g)}
              type="button"
            >
              <img src={fileUrl(g.imagePath)} alt={g.title || "Gallery"} />
            </button>
          ))}
        </div>
      )}

      {active && (
        <div className="gallery-lightbox" onClick={() => setActive(null)}>
          <img src={fileUrl(active.imagePath)} alt={active.title || "Gallery"} />
          {active.title && <p>{active.title}</p>}
        </div>
      )}
    </div>
  );
}