
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Member from '@/lib/models/Member'
import AuditLog from '@/lib/models/AuditLog'
import User from '@/lib/models/Users'
import { sessionActive } from '../../utils'

export async function GET(req: NextRequest) {
    const session_ = await sessionActive(req)

  const userId = session_?.user?.id

  if (!userId) {
    return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
  }
  await dbConnect()

  const totalMembers = await Member.countDocuments()
  const totalUsers = await User.countDocuments()
  const totalLogs = await AuditLog.countDocuments()

  const year = new Date().getFullYear().toString()
  const members = await Member.find().select('fullName contributions')

  let totalContributions = 0
  const topMembers = members.map((m:any) => {
    const yearly = m.contributions.filter(
      (c:any) => new Date(c.month).getFullYear().toString() === year
    )
    const total = yearly.reduce((sum:number, c:any) => sum + c.amount, 0)
    totalContributions += total
    return { fullName: m.fullName, total }
  })
    .sort((a:any, b:any) => b.total - a.total)
    .slice(0, 5)

  // Monthly trend (Jan–Dec)
  const monthlyTrend = Array.from({ length: 12 }).map((_, idx) => {
    const monthStr = `${year}-${String(idx + 1).padStart(2, '0')}`
    const total = members.reduce((sum:number, m:any) => {
      const entry = m.contributions.find((c:any) => c.month === monthStr)
      return sum + (entry ? entry.amount : 0)
    }, 0)
    return { month: monthStr, total }
  })

  return NextResponse.json({
    totalMembers,
    totalUsers,
    totalLogs,
    totalContributions,
    topMembers,
    monthlyTrend,
    year,
  })
}
