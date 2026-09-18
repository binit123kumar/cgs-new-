import React from 'react';
import '../Styles/DataState.css';

export function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
  };

  return (
    <div className="data-state loading-state" role="status" aria-live="polite">
      <div className={`spinner ${sizeClasses[size]}`} />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong', onRetry, retryLabel = 'Try Again' }) {
  return (
    <div className="data-state error-state" role="alert">
      <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button type="button" className="retry-button" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = 'No data available', icon, action }) {
  return (
    <div className="data-state empty-state">
      {icon && <div className="empty-icon">{icon}</div>}
      <p className="empty-message">{message}</p>
      {action && (
        <button type="button" className="empty-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-image" />
      <div className="skeleton-content">
        <div className="skeleton skeleton-title" />
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className="skeleton skeleton-text" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4, lines = 3 }) {
  return (
    <div className="skeleton-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} lines={lines} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="skeleton-list" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton skeleton-list-item">
          <div className="skeleton skeleton-avatar" />
          <div className="skeleton-content">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-text" />
          </div>
        </div>
      ))}
    </div>
  );
}