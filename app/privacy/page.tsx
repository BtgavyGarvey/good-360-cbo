'use client'

import '../admin-layout.css'

export default function PrivacyPage() {
  return (
    <div className="legal-page">

      <header className="legal-header">
        <h1 className="legal-title">
          GOOD 360 CBO
        </h1>

        <p className="legal-subtitle">
          Privacy Policy
        </p>

        <p className="legal-meta">
          Data protection, transparency, and user trust policy
        </p>
      </header>

      <div className="legal-container">

        <section className="legal-card">
          <h2 className="legal-section-title">Introduction</h2>
          <p className="legal-text">
            This Privacy Policy explains how GOOD 360 CBO collects, uses, stores, and protects user information within the system.
          </p>
        </section>

        <section className="legal-card">
          <h2 className="legal-section-title">Information We Collect</h2>
          <ul className="legal-list">
            <li>Personal details such as names, contacts, and identifiers.</li>
            <li>System activity including contributions and usage logs.</li>
          </ul>
        </section>

        <section className="legal-card">
          <h2 className="legal-section-title">How We Use Data</h2>
          <ul className="legal-list">
            <li>To manage membership and contributions effectively.</li>
            <li>To ensure system security and prevent unauthorized access.</li>
            <li>To improve operational reporting and analytics.</li>
          </ul>
        </section>

        <section className="legal-card">
          <h2 className="legal-section-title">Data Sharing</h2>
          <p className="legal-text">
            We do not sell personal data. Information is only shared with authorized personnel for operational and compliance purposes.
          </p>
        </section>

        <section className="legal-card">
          <h2 className="legal-section-title">Data Retention</h2>
          <p className="legal-text">
            Data is retained only for as long as necessary for administrative, legal, and operational requirements.
          </p>
        </section>

        <section className="legal-card">
          <h2 className="legal-section-title">User Rights</h2>
          <p className="legal-text">
            Users may request access, correction, or deletion of their personal data through official administration channels.
          </p>
        </section>

        <section className="legal-card">
          <h2 className="legal-section-title">Policy Updates</h2>
          <p className="legal-text">
            This policy may be updated periodically. Continued use of the system indicates acceptance of any changes.
          </p>
        </section>

        <footer className="legal-footer">
          For privacy concerns, contact the GOOD 360 CBO administration office.
        </footer>

      </div>
    </div>
  )
}