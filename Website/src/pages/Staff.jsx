import React, { useEffect, useState } from "react";
import "../Styles/Staff.css";

import dayanand from "../images/dayanand.png";
import angad from "../images/angad.png";
import rabindra from "../images/rabindra.png";

import {
  FaUserGraduate,
  FaUniversity,
  FaAward,
  FaMedal,
  FaBriefcase,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

import { getStaff, fileUrl } from "../api/cmsApi";

const facultyData = [
  {
    name: "Dr. Dayanand Kumar",
    image: dayanand,
    designation: "Assistant Professor",
    email: "dayanandkumar73@gmail.com",
    phone: "+91 9386606720",

    qualifications: [
      {
        icon: <FaUserGraduate />,
        text: "B.A. (Hons.) Geography, B.H.U. Varanasi",
      },
      {
        icon: <FaUniversity />,
        text: "M.A. Geography, B.H.U. Varanasi",
      },
      {
        icon: <FaAward />,
        text: "JRF / SRF (UGC)",
      },
      {
        icon: <FaMedal />,
        text: "Ph.D. Veer Kunwar Singh University, Ara",
      },
      {
        icon: <FaMedal />,
        text: "Social Scientist in IERARD, Patna",
      },
    ],
  },

  {
    name: "Dr. Angad Yadav",
    image: angad,
    designation: "Assistant Professor",
    email: "2angadyadav@gmail.com",
    phone: "+91 9386606720",

    qualifications: [
      {
        icon: <FaUserGraduate />,
        text: "B.A. (Hons.) Geography, Patna College, Patna",
      },
      {
        icon: <FaUniversity />,
        text: "M.A. Geography, Patna University",
      },
      {
        icon: <FaAward />,
        text: "NET (UGC)",
      },
      {
        icon: <FaMedal />,
        text: "Ph.D. Veer Kunwar Singh University, Ara",
      },
    ],
  },

  {
    name: "Dr. Rabindra Paswan",
    image: rabindra,
    designation: "Assistant Professor",
    email: "georabindrapaswanrgu@gmail.com",
    phone: "+91 9386313455",

    qualifications: [
      {
        icon: <FaUserGraduate />,
        text: "B.A. (Hons.) Geography, B.V.U. Hazaribag",
      },
      {
        icon: <FaUniversity />,
        text: "M.A. Geography, M.G.U. Meghalaya",
      },
      {
        icon: <FaAward />,
        text: "JRF (UGC)",
      },
      {
        icon: <FaMedal />,
        text: "Ph.D. Geography, Magadh University",
      },
    ],
  },
];

function Staff() {
  const [cmsStaff, setCmsStaff] = useState(null); // null = loading

  useEffect(() => {
    getStaff().then(setCmsStaff);
  }, []);

  // Backend "Staff" entries don't carry a qualifications list (that field
  // only exists on Faculty), so CMS-managed cards show name/designation/
  // contact only. The rich static cards (with qualifications) remain the
  // fallback until staff are added in the CMS.
  if (cmsStaff && cmsStaff.length > 0) {
    return (
      <section className="faculty-section">
        <h2 className="section-title">Our Guest Faculty</h2>
        <div className="faculty-wrapper">
          {cmsStaff.map((member) => (
            <div className="faculty-card" key={member.id}>
              <div className="card-header">
                <img src={fileUrl(member.photoPath) || dayanand} alt={member.name} />
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

      <div className="faculty-wrapper">
        {facultyData.map((member, index) => (
          <div className="faculty-card" key={index}>
            {/* Header */}
            <div className="card-header">
              <img src={member.image} alt={member.name} />
            </div>

            {/* Body */}
            <div className="card-body">
              <h3>{member.name}</h3>

              <p className="designation">
                <FaBriefcase className="title-icon" />
                {member.designation}
              </p>

              <table className="info-table">
                <tbody>
                  {member.qualifications.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <span className="icon">{item.icon}</span>
                        <span>{item.text}</span>
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td>
                      <FaEnvelope className="icon" />
                      <a href={`mailto:${member.email}`}>
                        {member.email}
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <FaPhoneAlt className="icon" />
                      <a href={`tel:${member.phone}`}>
                        {member.phone}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Staff;