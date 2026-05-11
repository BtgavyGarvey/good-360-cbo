
import { NextRequest, NextResponse } from 'next/server'
import Member from '@/lib/models/Member'
import dbConnect from '@/lib/dbConnect'
import AuditLog from '@/lib/models/AuditLog'
import { sessionActive } from '../utils'

// GET all members
export async function GET(req: NextRequest) {
  const session_ = await sessionActive(req)
  const userId = session_?.user?.id

  if (!userId) {
    return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
  }

  await dbConnect()
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const sortField = searchParams.get('sort') || 'memberNumber'
  const sortOrder = searchParams.get('order') === 'desc' ? -1 : 1

  const regex = new RegExp(query, 'i')
  const filter = query
    ? {
        $or: [
          { memberNumber: regex },
          { fullName: regex },
          { nationalId: regex },
          { contact: regex },
          { church: regex },
        ],
      }
    : {}

  const total = await Member.countDocuments(filter)
  const members = await Member.find(filter)
    .sort({ [sortField]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit)

  return NextResponse.json({
    members,
    total,
    page,
    pages: Math.ceil(total / limit),
    })
}

export async function POST(req: NextRequest) {
  const session_ = await sessionActive(req)
  
    const userId = session_?.user?.id
  
    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
    }
  await dbConnect()
  try {

    const body = await req.json()
    const member = await Member.create({ ...body, addedBy: userId })

    // Capture admin identity (example: from session or headers)
    const performedBy = session_?.user?.email || 'system'

    // Create audit log entry
    await AuditLog.create({
      action: 'CREATE',
      entity: 'Member',
      entityId: member._id.toString(),
      performedBy,
      changes: body, // snapshot of submitted data
    })

    return NextResponse.json(member)
  } catch (error: any) {
    // Handle MongoDB duplicate key error (unique constraint)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: `Duplicate field value: ${JSON.stringify(error.keyValue)}` },
        { status: 400 }
      )
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: `Validation failed: ${messages.join(', ')}` },
        { status: 400 }
      )
    }

    // Generic error fallback
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}


