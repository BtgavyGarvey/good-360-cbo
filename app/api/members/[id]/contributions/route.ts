
// app/api/members/[id]/contributions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Member from '@/lib/models/Member'
import dbConnect from '@/lib/dbConnect'
import AuditLog from '@/lib/models/AuditLog'
import { sessionActive } from '@/app/api/utils'


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const session_ = await sessionActive(req)
    
      const userId = session_?.user?.id
    
      if (!userId) {
        return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
      }
  await dbConnect()
  try {
    const { id } = await params
    const body = await req.json() // { month: "2026-05", amount: 500 }

    const member = await Member.findById(id)
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Check if month already exists
    const existingIndex = member.contributions.findIndex((c:any) => c.month === body.month)

    if (existingIndex >= 0) {
      // Update existing month
      member.contributions[existingIndex].amount = body.amount
    } else {
      // Add new month
      member.contributions.push({ month: body.month, amount: body.amount })
    }

    await member.save()

    // Capture admin identity (example: from session or headers)
    const performedBy = session_?.user?.email || 'system'

    // Create audit log entry
    await AuditLog.create({
      action: existingIndex >= 0 ? 'UPDATE' : 'CREATE',
      entity: 'Contribution',
      entityId: member._id.toString(),
      performedBy,
      changes: body, // snapshot of the contribution change
    })

    return NextResponse.json(member)
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

// GET single member
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const session_ = await sessionActive(req)
    
      const userId = session_?.user?.id
    
      if (!userId) {
        return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
      }
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const year = searchParams.get('year') || new Date().getFullYear().toString()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '12', 10)

  const { id } = await params

  const member = await Member.findById(id).select('contributions fullName memberNumber')
  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  // Filter by year
  let contributions = member.contributions.sort((a:any, b:any) => {
        const dateA = new Date(a.month)
        const dateB = new Date(b.month)
        return dateA.getTime() - dateB.getTime()
    })

  contributions = contributions.filter((c:any) => {
    const date = new Date(c.month)
    return date.getFullYear().toString() === year
  })

  // Pagination
  const total = contributions.length
  const pages = Math.ceil(total / limit)
  const paginated = contributions.slice((page - 1) * limit, page * limit)

  return NextResponse.json({ contributions: paginated, total, page, pages, year, member })
}