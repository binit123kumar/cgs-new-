import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getFaculty,
  getStaff,
  getEvents,
  getNotices,
  getCourses,
  getDownloads,
  getPublications,
  getAbout,
  fileUrl,
} from "../api/cmsApi";
import "../Styles/Search.css";

// Case-insensitive "does any of these fields contain the query" check.
function matches(item, fields, query) {
  return fields.some((f) =>
    (item[f] || "").toString().toLowerCase().includes(query)
  );
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const queryLower = query.toLowerCase();

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({
    faculty: [],
    staff: [],
    events: [],
    notices: [],
    courses: [],
    downloads: [],
    publications: [],
    about: [],
  });

  useEffect(() => {
    if (!queryLower) {
      setLoading(false);
      return;
    }

    setLoading(true);

    Promise.all([
      getFaculty(),
      getStaff(),
      getEvents(),
      getNotices(),
      getCourses(),
      getDownloads(),
      getPublications(),
      getAbout(),
    ]).then(
      ([
        faculty,
        staff,
        events,
        notices,
        courses,
        downloads,
        publications,
        about,
      ]) => {
        setResults({
          faculty: faculty.filter((x) =>
            matches(x, ["name", "designation", "bio", "qualification"], queryLower)
          ),
          staff: staff.filter((x) =>
            matches(x, ["name", "designation"], queryLower)
          ),
          events: events.filter((x) =>
            matches(x, ["title", "description", "venue"], queryLower)
          ),
          notices: notices.filter((x) =>
            matches(x, ["title", "description"], queryLower)
          ),
          courses: courses.filter((x) =>
            matches(x, ["name", "description", "eligibility"], queryLower)
          ),
          downloads: downloads.filter((x) =>
            matches(x, ["title", "category"], queryLower)
          ),
          publications: publications.filter((x) =>
            matches(x, ["title", "author", "description"], queryLower)
          ),
          about: about.filter((x) =>
            matches(x, ["title", "description"], queryLower)
          ),
        });
        setLoading(false);
      }
    );
  }, [queryLower]);

  const totalCount = Object.values(results).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <div className="search-page">
      <h1>Search Results</h1>

      {query ? (
        <p className="search-query-line">
          Showing results for <strong>&quot;{query}&quot;</strong>
        </p>
      ) : (
        <p className="search-query-line">
          Type something in the search box above to search the site.
        </p>
      )}

      {loading && query && <p>Searching…</p>}

      {!loading && query && totalCount === 0 && (
        <p>No results found. Try a different keyword.</p>
      )}

      {!loading && results.faculty.length > 0 && (
        <section className="search-section">
          <h2>Faculty ({results.faculty.length})</h2>
          <ul>
            {results.faculty.map((f) => (
              <li key={f.id}>
                <Link to="/faculty">
                  {f.name}
                  {f.designation ? ` — ${f.designation}` : ""}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!loading && results.staff.length > 0 && (
        <section className="search-section">
          <h2>Staff ({results.staff.length})</h2>
          <ul>
            {results.staff.map((s) => (
              <li key={s.id}>
                <Link to="/staff">
                  {s.name}
                  {s.designation ? ` — ${s.designation}` : ""}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!loading && results.events.length > 0 && (
        <section className="search-section">
          <h2>Events ({results.events.length})</h2>
          <ul>
            {results.events.map((e) => (
              <li key={e.id}>
                <Link to="/events">{e.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!loading && results.about.length > 0 && (
        <section className="search-section">
          <h2>About ({results.about.length})</h2>
          <ul>
            {results.about.map((a) => (
              <li key={a.id}>
                <Link to="/about">{a.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!loading && results.courses.length > 0 && (
        <section className="search-section">
          <h2>Academic Programmes ({results.courses.length})</h2>
          <ul>
            {results.courses.map((c) => (
              <li key={c.id}>
                <Link to={`/academic-program/${c.id}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!loading && results.notices.length > 0 && (
        <section className="search-section">
          <h2>Notices ({results.notices.length})</h2>
          <ul>
            {results.notices.map((n) => (
              <li key={n.id}>
                {n.filePath ? (
                  <a href={fileUrl(n.filePath)} target="_blank" rel="noreferrer">
                    {n.title}
                  </a>
                ) : (
                  n.title
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!loading && results.downloads.length > 0 && (
        <section className="search-section">
          <h2>Downloads ({results.downloads.length})</h2>
          <ul>
            {results.downloads.map((d) => (
              <li key={d.id}>
                <a href={fileUrl(d.filePath)} target="_blank" rel="noreferrer">
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!loading && results.publications.length > 0 && (
        <section className="search-section">
          <h2>Publications ({results.publications.length})</h2>
          <ul>
            {results.publications.map((p) => (
              <li key={p.id}>
                {p.filePath ? (
                  <a href={fileUrl(p.filePath)} target="_blank" rel="noreferrer">
                    {p.title}
                  </a>
                ) : (
                  p.title
                )}
                {p.author ? ` — ${p.author}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}