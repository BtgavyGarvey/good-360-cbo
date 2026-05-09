

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import AuditLog from '@/lib/models/AuditLog'
import { sessionActive } from '../../utils'

export async function GET(req: NextRequest) {

  const session_ = await sessionActive(req)

  const userId = session_?.user?.id

  if (!userId) {
    return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
  }
  await dbConnect()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)

  const total = await AuditLog.countDocuments()
  const pages = Math.ceil(total / limit)

  const logs = await AuditLog.find()
    .sort({ createdAt: -1 }) // newest first
    .skip((page - 1) * limit)
    .limit(limit)

  return NextResponse.json({ logs, total, page, pages })
}
