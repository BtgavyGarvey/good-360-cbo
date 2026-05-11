// ==============================
// MembersPage.tsx
// ==============================

'use client'


import { useEffect, useState } from 'react'
import { Pencil, Trash } from 'lucide-react'
import Link from 'next/link'

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sort, setSort] = useState('fullName')
  const [order, setOrder] = useState<'asc' | 'desc'>(
    'asc'
  )

  async function fetchMembers(
    query = '',
    pageNum = 1,
    pageSize = 10,
    sortField = 'fullName',
    sortOrder = 'asc'
  ) {
    const res = await fetch(
      `/api/members?search=${query}&page=${pageNum}&limit=${pageSize}&sort=${sortField}&order=${sortOrder}`
    )

    const data = await res.json()

    setMembers(data.members)
    setPages(data.pages)
    setPage(data.page)
  }

  useEffect(() => {
    fetchMembers(
      search,
      page,
      limit,
      sort,
      order
    )
  }, [search, page, limit, sort, order])

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          Members
        </h1>

        <Link
          href="/admin/members/new"
          className="primary-btn"
        >
          Add Member
        </Link>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="search-input"
        />

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value))
            setPage(1)
          }}
          className="form-select"
        >
          <option value={5}>
            5 per page
          </option>

          <option value={10}>
            10 per page
          </option>

          <option value={25}>
            25 per page
          </option>

          <option value={50}>
            50 per page
          </option>

          <option value={75}>
            75 per page
          </option>

          <option value={100}>
            100 per page
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
          className="form-select"
        >
         <option value="memberNumber">
            Sort by Member Number
          </option>
          <option value="fullName">
            Sort by Name
          </option>

          <option value="church">
            Sort by Church
          </option>
        </select>

        <select
          value={order}
          onChange={(e) =>
            setOrder(
              e.target.value as
                | 'asc'
                | 'desc'
            )
          }
          className="form-select"
        >
          <option value="asc">
            Ascending
          </option>

          <option value="desc">
            Descending
          </option>
        </select>
      </div>

      {/* Members Table */}
      <div className="table-card table-shadow">
        <table className="data-table">
          <thead className="table-head">
            <tr>
              <th>Member #</th>
              <th>Full Name</th>
              <th>National ID</th>
              <th>Contact</th>
              <th>Church</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m: any) => (
              <tr
                key={m._id}
                className="table-row"
              >
                <td className="table-cell">
                  <Link
                    href={`/admin/members/${m._id}/contributions`}
                    className="link-primary"
                  >
                    {m.memberNumber}
                  </Link>
                </td>

                <td className="table-cell">
                  {m.fullName}
                </td>

                <td className="table-cell">
                  {m.nationalId}
                </td>

                <td className="table-cell">
                  {m.contact}
                </td>

                <td className="table-cell">
                  {m.church}
                </td>

                <td className="actions-cell">
                  <Link
                    href={`/admin/members/${m._id}`}
                    className="icon-btn edit-btn"
                  >
                    <Pencil size={18} />
                  </Link>

                  <button
                    onClick={async () => {
                      const answer =
                        confirm(
                          'Are you sure you want to delete this member?'
                        )

                      if (!answer) return

                      await fetch(
                        `/api/members/${m._id}`,
                        {
                          method: 'DELETE',
                        }
                      )

                      fetchMembers(
                        search,
                        page,
                        limit,
                        sort,
                        order
                      )
                    }}
                    className="icon-btn delete-btn"
                  >
                    <Trash size={18} />
                  </button>
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