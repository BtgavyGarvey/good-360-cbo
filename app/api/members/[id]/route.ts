
import { NextRequest, NextResponse } from 'next/server'
import Member from '@/lib/models/Member'
import dbConnect from '@/lib/dbConnect'
import AuditLog from '@/lib/models/AuditLog'
import { sessionActive } from '../../utils'

// GET single member
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const session_ = await sessionActive(req)
  
    const userId = session_?.user?.id
  
    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
    }
  await dbConnect()
  
  const { id } = await params
  const member = await Member.findById(id).select('-__v -contributions') // exclude __v and contributions for this endpoint
  return NextResponse.json(member)
}

// PUT update member
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session_ = await sessionActive(req)

  const userId = session_?.user?.id

  if (!userId) {
    return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
  }
    await dbConnect()
    const body = await req.json()
    const { id } = await params

    const member = await Member.findByIdAndUpdate(id, body, { returnDocument: 'after' }).select('-__v -contributions')

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Capture admin identity (example: from session or headers)
    const performedBy = session_?.user?.email || 'system'

    // Create audit log entry
    await AuditLog.create({
      action: 'UPDATE',
      entity: 'Member',
      entityId: id,
      performedBy,
      changes: body, // snapshot of submitted changes
    })

    return NextResponse.json(member)
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: `Duplicate field value: ${JSON.stringify(error.keyValue)}` },
        { status: 400 }
      )
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: `Validation failed: ${messages.join(', ')}` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

// DELETE member
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session_ = await sessionActive(req)
  const userId = session_?.user?.id

  if (!userId) {
    return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
  }

  await dbConnect()
  const { id } = await params

  const member = await Member.findByIdAndDelete(id)

  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  // Capture admin identity
  const performedBy = session_?.user?.email || 'system'

  // Create audit log entry
  await AuditLog.create({
    action: 'DELETE',
    entity: 'Member',
    entityId: id,
    performedBy,
    changes: member.toObject(), // snapshot of deleted member
  })

  return NextResponse.json({ success: true })
}