import React, { useEffect, useState } from "react";
import { getGallery, fileUrl } from "../api/cmsApi";
import { ErrorState, EmptyState, SkeletonGrid } from "../components/DataState";
import "../Styles/ListPage.css";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null); // lightbox

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGallery();
      setItems(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const valueOf = (item, lowerName, upperName) => item?.[lowerName] ?? item?.[upperName];

  const categories = items.reduce((groups, item) => {
    const name = valueOf(item, 'category', 'Category')?.trim() || 'Gallery';
    groups[name] = groups[name] || [];
    groups[name].push(item);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="list-page">
        <h1>Photo Gallery</h1>
        <SkeletonGrid count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-page">
        <h1>Photo Gallery</h1>
        <ErrorState message={error} onRetry={fetchGallery} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="list-page">
        <h1>Photo Gallery</h1>
        <EmptyState message="No photos uploaded yet." icon="🖼️" />
      </div>
    );
  }

  return (
    <div className="list-page">
      <h1>Photo Gallery</h1>
      <div className="gallery-category-list">
        {Object.entries(categories).map(([category, photos]) => {
          const coverIndex = photos.findIndex((photo) => valueOf(photo, 'isPrimary', 'IsPrimary') === true || valueOf(photo, 'isPrimary', 'IsPrimary') === 'true');
          const cover = photos[coverIndex >= 0 ? coverIndex : 0];
          return (
            <section className="gallery-category" key={category}>
              <button className="gallery-category-cover" type="button" onClick={() => setActive({ photos, index: coverIndex >= 0 ? coverIndex : 0, category })}>
                <img src={fileUrl(valueOf(cover, 'imagePath', 'ImagePath'))} alt={category} />
                <span><strong>{category}</strong><small>{photos.length} photo{photos.length === 1 ? '' : 's'}</small></span>
              </button>
            </section>
          );
        })}
      </div>

      {active && (
        <div className="gallery-lightbox" onClick={() => setActive(null)}>
          <button className="gallery-lightbox-close" type="button" aria-label="Close gallery">×</button>
          <div className="gallery-lightbox-content" onClick={(event) => event.stopPropagation()}>
            <img src={fileUrl(valueOf(active.photos ? active.photos[active.index] : active, 'imagePath', 'ImagePath'))} alt={active.category || active.Category || active.title || active.Title || "Gallery"} />
            {active.photos && active.photos.length > 1 && (
              <div className="gallery-lightbox-actions">
                <button type="button" onClick={() => setActive({ ...active, index: (active.index - 1 + active.photos.length) % active.photos.length })}>Previous</button>
                <span>{active.index + 1} / {active.photos.length}</span>
                <button type="button" onClick={() => setActive({ ...active, index: (active.index + 1) % active.photos.length })}>Next</button>
              </div>
            )}
            <p>{active.category || active.Category || active.title || active.Title}</p>
          </div>
        </div>
      )}
    </div>
  );
}