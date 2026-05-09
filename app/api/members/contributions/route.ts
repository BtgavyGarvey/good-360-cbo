
// app/api/members/[id]/contributions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Member from '@/lib/models/Member'
import dbConnect from '@/lib/dbConnect'
import { sessionActive } from '../../utils'

export async function GET(req: NextRequest) {
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

  // Otherwise → all members mode
  const totalMembers = await Member.countDocuments()
  const pages = Math.ceil(totalMembers / limit)

  const members = await Member.find()
    .select('contributions fullName memberNumber church')
    .skip((page - 1) * limit)
    .limit(limit)

  if (!members || members.length === 0) {
    return NextResponse.json({ error: 'No members found' }, { status: 404 })
  }

  // For each member, filter + sort contributions by year
  const results = members.map((m:any) => {
    const contributions = m.contributions
      .filter((c:any) => new Date(c.month).getFullYear().toString() === year)
      .sort((a:any, b:any) => new Date(a.month).getTime() - new Date(b.month).getTime())

    return {
      _id: m._id,
      fullName: m.fullName,
      memberNumber: m.memberNumber,
      church: m.church,
      contributions,
      total: contributions.reduce((sum:number, c:any) => sum + c.amount, 0),
    }
  })

  return NextResponse.json({ members: results, total: totalMembers, page, pages, year })
}
