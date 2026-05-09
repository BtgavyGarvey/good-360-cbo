
// app/api/members/[id]/contributions/summary/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Member from '@/lib/models/Member'
import dbConnect from '@/lib/dbConnect'
import { sessionActive } from '@/app/api/utils'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session_ = await sessionActive(req)
    
      const userId = session_?.user?.id
    
      if (!userId) {
        return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
      }
  await dbConnect()
  const {id} = await params
  const member = await Member.findById(id).select('contributions')
  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 })
  }

  // Aggregate totals per year
  const yearlyTotals: Record<string, number> = {}
  member.contributions.forEach((c:any) => {
    const year = new Date(c.month).getFullYear().toString()
    yearlyTotals[year] = (yearlyTotals[year] || 0) + c.amount
  })

  // Convert to array for charting
  const data = Object.entries(yearlyTotals).map(([year, total]) => ({ year, total }))

  return NextResponse.json({ yearlyTotals: data })
}
