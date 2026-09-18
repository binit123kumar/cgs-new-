import React, { useEffect, useState } from "react";
import "../Styles/Staff.css";

import {
  FaBriefcase,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

import { getStaff, getGuestFaculty, fileUrl } from "../api/cmsApi";
import { LoadingSpinner, ErrorState, EmptyState } from "../components/DataState";

function Staff() {
  const [cmsStaff, setCmsStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const [staff, guestFaculty] = await Promise.all([getStaff(), getGuestFaculty()]);
      const byId = new Map([...guestFaculty, ...staff].map((member) => [member.id, member]));
      setCmsStaff([...byId.values()]);
    } catch (err) {
      setError(err.message || 'Failed to load guest faculty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  if (loading) {
    return (
      <section className="faculty-section">
        <h2 className="section-title">Our Guest Faculty</h2>
        <LoadingSpinner size="lg" message="Loading guest faculty..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="faculty-section">
        <h2 className="section-title">Our Guest Faculty</h2>
        <ErrorState message={error} onRetry={fetchStaff} />
      </section>
    );
  }

  if (cmsStaff && cmsStaff.length > 0) {
    return (
      <section className="faculty-section">
        <h2 className="section-title">Our Guest Faculty</h2>
        <div className="faculty-wrapper">
          {cmsStaff.map((member) => (
            <div className="faculty-card" key={member.id}>
              <div className="card-header">
                <img src={fileUrl(member.photoPath) || '/uploads/default-avatar.png'} alt={member.name} />
              </div>
              <div className="card-body">
                <h3>{member.name}</h3>
                {member.designation && (
                  <p className="designation">
                    <FaBriefcase className="title-icon" />
                    {member.designation}
                  </p>
                )}
                <table className="info-table">
                  <tbody>
                    {member.email && (
                      <tr>
                        <td>
                          <FaEnvelope className="icon" />
                          <a href={`mailto:${member.email}`}>{member.email}</a>
                        </td>
                      </tr>
                    )}
                    {member.phone && (
                      <tr>
                        <td>
                          <FaPhoneAlt className="icon" />
                          <a href={`tel:${member.phone}`}>{member.phone}</a>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="faculty-section">
      <h2 className="section-title">Our Guest Faculty</h2>
      <EmptyState message="No guest faculty members added yet." />
    </section>
  );
}

export default Staff;