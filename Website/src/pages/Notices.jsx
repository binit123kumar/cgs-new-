import React, { useEffect, useState } from "react";
import { getNotices, fileUrl } from "../api/cmsApi";
import "../Styles/ListPage.css";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotices().then((data) => {
      setNotices(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="list-page">
      <h1>Notices</h1>

      {loading && <p>Loading…</p>}

      {!loading && notices.length === 0 && (
        <p>No notices published yet.</p>
      )}

      {!loading && notices.length > 0 && (
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
      )}
    </div>
  );
}