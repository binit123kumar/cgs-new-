import React, { useEffect, useState } from 'react';
import { getNews, fileUrl } from '../api/cmsApi';
import { ErrorState, EmptyState, SkeletonGrid } from '../components/DataState';
import '../Styles/ListPage.css';

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNews();
      setItems(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="list-page">
        <h1>News</h1>
        <SkeletonGrid count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-page">
        <h1>News</h1>
        <ErrorState message={error} onRetry={fetchNews} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="list-page">
        <h1>News</h1>
        <EmptyState message="No news published yet." icon="📰" />
      </div>
    );
  }

  return (
    <div className="list-page">
      <h1>News</h1>
      <div className="gallery-category-list">
        {items.map((item) => (
          <section className="gallery-category" key={item.id}>
            <article className="news-item">
              {item.imagePath && (
                <img src={fileUrl(item.imagePath)} alt={item.title} className="news-image" loading="lazy" />
              )}
              <div className="news-content">
                <h2>{item.title}</h2>
                {item.publishDate && <p className="news-date">{new Date(item.publishDate).toLocaleDateString('en-IN')}</p>}
                {item.description && <p className="news-description">{item.description}</p>}
                {item.linkUrl && (
                  <a href={item.linkUrl} target="_blank" rel="noreferrer" className="news-link">
                    Read More
                  </a>
                )}
              </div>
            </article>
          </section>
        ))}
      </div>
    </div>
  );
}