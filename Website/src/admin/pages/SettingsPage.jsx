import { useEffect, useState } from 'react';
import client, { fileUrl } from '../api/client';


// =========================================================
// DEFAULT FORM
// =========================================================

const emptyForm = {
  siteName: '',
  address: '',
  phone: '',
  email: '',
  facebook: '',
  twitter: '',
  instagram: '',
  youTube: '',
  metaTitle: '',
  metaDescription: '',
};


export default function SettingsPage() {

  // =========================================================
  // FORM STATE
  // =========================================================

  const [form, setForm] = useState(emptyForm);

  // School of Geography Logo
  const [logoPath, setLogoPath] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  // AKU / University Logo
  const [universityLogoPath, setUniversityLogoPath] = useState(null);
  const [universityLogoFile, setUniversityLogoFile] = useState(null);

  // Page state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');


  // =========================================================
  // LOAD SETTINGS
  // =========================================================

  useEffect(() => {

    (async () => {

      try {

        const res = await client.get('/settings');

        const data = res.data.data;


        // ---------------------------------------------------
        // General settings
        // ---------------------------------------------------

        setForm({

          siteName: data.siteName || '',

          address: data.address || '',

          phone: data.phone || '',

          email: data.email || '',

          facebook: data.facebook || '',

          twitter: data.twitter || '',

          instagram: data.instagram || '',

          youTube: data.youTube || '',

          metaTitle: data.metaTitle || '',

          metaDescription:
            data.metaDescription || '',

        });


        // ---------------------------------------------------
        // School of Geography Logo
        // ---------------------------------------------------

        setLogoPath(
          data.logoPath || null
        );


        // ---------------------------------------------------
        // AKU / University Logo
        // ---------------------------------------------------

        setUniversityLogoPath(
          data.universityLogoPath ||
          data.UniversityLogoPath ||
          null
        );


      } catch (error) {

        console.error(
          'Settings loading error:',
          error
        );

        setMessage(
          'Could not load settings. Is the backend running?'
        );

      } finally {

        setLoading(false);

      }

    })();

  }, []);


  // =========================================================
  // FORM CHANGE
  // =========================================================

  function change(field, value) {

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

  }


  // =========================================================
  // SAVE SETTINGS
  // =========================================================

  async function handleSubmit(e) {

    e.preventDefault();

    setSaving(true);

    setMessage('');


    try {

      const fd = new FormData();


      // ---------------------------------------------------
      // General settings
      // ---------------------------------------------------

      Object.entries(form).forEach(
        ([key, value]) => {

          fd.append(
            key,
            value ?? ''
          );

        }
      );


      // ---------------------------------------------------
      // School of Geography Logo
      // API field: logo
      // ---------------------------------------------------

      if (logoFile) {

        fd.append(
          'logo',
          logoFile
        );

      }


      // ---------------------------------------------------
      // AKU / University Logo
      // API field: universityLogo
      // ---------------------------------------------------

      if (universityLogoFile) {

        fd.append(
          'universityLogo',
          universityLogoFile
        );

      }


      // ---------------------------------------------------
      // API Request
      // ---------------------------------------------------

      const res = await client.put(
        '/settings',
        fd,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );


      const savedData =
        res.data.data;


      // ---------------------------------------------------
      // Update Geography Logo
      // ---------------------------------------------------

      setLogoPath(
        savedData.logoPath ||
        null
      );


      // ---------------------------------------------------
      // Update AKU Logo
      // ---------------------------------------------------

      setUniversityLogoPath(
        savedData.universityLogoPath ||
        savedData.UniversityLogoPath ||
        null
      );


      setMessage(
        'Settings saved successfully.'
      );


      // Clear selected files
      setLogoFile(null);
      setUniversityLogoFile(null);


    } catch (err) {

      console.error(
        'Settings save error:',
        err
      );

      setMessage(
        err?.response?.data?.message ||
        'Save failed.'
      );

    } finally {

      setSaving(false);

    }

  }


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="empty-state">

        <i className="bi bi-hourglass-split" />

        Loading...

      </div>

    );

  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <>

      {/* =====================================================
          PAGE TITLE
          ===================================================== */}

      <div className="page-title-row">

        <h1>
          Settings
        </h1>

      </div>


      {/* =====================================================
          SETTINGS CARD
          ===================================================== */}

      <div className="card-panel">

        <form
          onSubmit={handleSubmit}
        >

          <div
            className="modal-body"
            style={{
              maxHeight: 'none'
            }}
          >


            {/* =================================================
                MESSAGE
                ================================================= */}

            {message && (

              <div
                className="login-error"
                style={{
                  background:
                    message.includes(
                      'success'
                    )
                      ? 'var(--success-bg)'
                      : undefined,

                  color:
                    message.includes(
                      'success'
                    )
                      ? 'var(--success)'
                      : undefined,
                }}
              >

                {message}

              </div>

            )}


            <div className="form-grid">


              {/* =================================================
                  SCHOOL OF GEOGRAPHY LOGO
                  ================================================= */}

              <div className="form-group full">

                <label>
                  School of Geography Logo
                </label>


                {logoPath && (

                  <div
                    style={{
                      marginBottom: '10px'
                    }}
                  >

                    <img
                      src={fileUrl(logoPath)}
                      alt="School of Geography Logo"
                      className="img-preview"
                    />

                  </div>

                )}


                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {

                    const file =
                      e.target.files?.[0] ||
                      null;

                    setLogoFile(file);

                  }}
                />

              </div>


              {/* =================================================
                  AKU / UNIVERSITY LOGO
                  ================================================= */}

              <div className="form-group full">

                <label>
                  AKU / University Logo
                </label>


                {universityLogoPath && (

                  <div
                    style={{
                      marginBottom: '10px'
                    }}
                  >

                    <img
                      src={fileUrl(
                        universityLogoPath
                      )}
                      alt="Aryabhatta Knowledge University Logo"
                      className="img-preview"
                    />

                  </div>

                )}


                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {

                    const file =
                      e.target.files?.[0] ||
                      null;

                    setUniversityLogoFile(
                      file
                    );

                  }}
                />

              </div>


              {/* =================================================
                  SITE NAME
                  ================================================= */}

              <div className="form-group">

                <label>

                  Site Name

                  <span className="req">
                    *
                  </span>

                </label>


                <input
                  type="text"
                  value={form.siteName}
                  onChange={(e) =>
                    change(
                      'siteName',
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              {/* =================================================
                  EMAIL
                  ================================================= */}

              <div className="form-group">

                <label>
                  Email
                </label>

                <input
                  type="text"
                  value={form.email}
                  onChange={(e) =>
                    change(
                      'email',
                      e.target.value
                    )
                  }
                />

              </div>


              {/* =================================================
                  PHONE
                  ================================================= */}

              <div className="form-group">

                <label>
                  Phone
                </label>

                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) =>
                    change(
                      'phone',
                      e.target.value
                    )
                  }
                />

              </div>


              {/* =================================================
                  ADDRESS
                  ================================================= */}

              <div className="form-group">

                <label>
                  Address
                </label>

                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    change(
                      'address',
                      e.target.value
                    )
                  }
                />

              </div>


              {/* =================================================
                  FACEBOOK
                  ================================================= */}

              <div className="form-group">

                <label>
                  Facebook URL
                </label>

                <input
                  type="text"
                  value={form.facebook}
                  onChange={(e) =>
                    change(
                      'facebook',
                      e.target.value
                    )
                  }
                />

              </div>


              {/* =================================================
                  TWITTER
                  ================================================= */}

              <div className="form-group">

                <label>
                  Twitter / X URL
                </label>

                <input
                  type="text"
                  value={form.twitter}
                  onChange={(e) =>
                    change(
                      'twitter',
                      e.target.value
                    )
                  }
                />

              </div>


              {/* =================================================
                  INSTAGRAM
                  ================================================= */}

              <div className="form-group">

                <label>
                  Instagram URL
                </label>

                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) =>
                    change(
                      'instagram',
                      e.target.value
                    )
                  }
                />

              </div>


              {/* =================================================
                  YOUTUBE
                  ================================================= */}

              <div className="form-group">

                <label>
                  YouTube URL
                </label>

                <input
                  type="text"
                  value={form.youTube}
                  onChange={(e) =>
                    change(
                      'youTube',
                      e.target.value
                    )
                  }
                />

              </div>


              {/* =================================================
                  META TITLE
                  ================================================= */}

              <div className="form-group full">

                <label>
                  Meta Title (SEO)
                </label>

                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) =>
                    change(
                      'metaTitle',
                      e.target.value
                    )
                  }
                />

              </div>


              {/* =================================================
                  META DESCRIPTION
                  ================================================= */}

              <div className="form-group full">

                <label>
                  Meta Description (SEO)
                </label>

                <textarea
                  value={
                    form.metaDescription
                  }
                  onChange={(e) =>
                    change(
                      'metaDescription',
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>


          {/* =====================================================
              SAVE BUTTON
              ===================================================== */}

          <div className="modal-footer">

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >

              {saving
                ? 'Saving...'
                : 'Save Settings'}

            </button>

          </div>

        </form>

      </div>

    </>

  );

}