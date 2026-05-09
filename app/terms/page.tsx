'use client'

import '../admin-layout.css'

export default function TermsPage() {
  return (
    <div className="legal-page">

      <header className="legal-header">
        <h1 className="legal-title">
          GOOD 360 CBO
        </h1>

        <p className="legal-subtitle">
          Terms and Conditions
        </p>

        <p className="legal-meta">
          Effective governance and responsible system use policy
        </p>
      </header>

      <div className="legal-container">

        <section className="legal-card">
          <h2 className="legal-section-title">Introduction</h2>
          <p className="legal-text">
            These Terms and Conditions govern access and use of the GOOD 360 CBO digital management system. By using this platform, you agree to comply with all stated policies and responsibilities.
          </p>
        </section>

        <section className="legal-card">
          <h2 className="legal-section-title">User Responsibilities</h2>
          <ul className="legal-list">
            <li>Maintain confidentiality of login credentials.</li>
            <li>Ensure all submitted data is accurate and truthful.</li>
            <li>Use the system in compliance with applicable laws and organizational policies.</li>
          </ul>
        </section>

        <section className="legal-card">
          <h2 className="legal-section-title">Administrative Rights</h2>
          <ul className="legal-list">
            <li>System administrators may suspend access in case of misuse.</li>
            <li>Data records may be updated for accuracy and governance purposes.</li>
          </ul>
        </section>

        <section className="legal-card">
          <h2 className="legal-section-title">Limitations of Liability</h2>
          <p className="legal-text">
            GOOD 360 CBO is not liable for indirect loss, unauthorized access, or disruptions beyond reasonable system control.
          </p>
        </section>

        <section className="legal-card">
          <h2 className="legal-section-title">Updates to Terms</h2>
          <p className="legal-text">
            These terms may be updated periodically. Continued use of the system implies acceptance of any revisions.
          </p>
        </section>

        <footer className="legal-footer">
          For support or clarification, contact the GOOD 360 CBO administration office.
        </footer>

      </div>
    </div>
  )
}