// ==============================
// AuditPage.tsx
// ==============================

'use client'


import { useEffect, useState } from 'react'

export default function AuditPage() {
  const [data, setData] = useState<any>(null)
  const [page, setPage] = useState(1)

  async function fetchLogs(pageNum = page) {
    const res = await fetch(
      `/api/admin/audit?page=${pageNum}&limit=10`
    )

    const json = await res.json()
    setData(json)
  }

  useEffect(() => {
    fetchLogs(page)
  }, [page])

  if (!data)
    return (
      <p>Loading audit logs...</p>
    )

  const { logs, pages } = data

  return (
    <div className="page-container">
      {/* Header */}
      <h1 className="page-title">
        Audit Logs
      </h1>

      {/* Table Card */}
      <div className="table-card">
        <table className="data-table">
          <thead className="table-head">
            <tr>
              <th>Action</th>
              <th>Entity</th>
              <th>Entity ID</th>
              <th>Performed By</th>
              <th>Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log: any) => (
              <tr
                key={log._id}
                className="table-row"
              >
                <td className="table-cell">
                  {log.action}
                </td>

                <td className="table-cell">
                  {log.entity}
                </td>

                <td className="table-cell">
                  {log.entityId}
                </td>

                <td className="table-cell">
                  {log.performedBy}
                </td>

                <td className="table-cell">
                  {new Date(
                    log.createdAt
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() =>
            setPage(page - 1)
          }
          className="pagination-btn"
        >
          Prev
        </button>

        <span className="pagination-text">
          Page {page} of {pages}
        </span>

        <button
          disabled={page >= pages}
          onClick={() =>
            setPage(page + 1)
          }
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  )
}