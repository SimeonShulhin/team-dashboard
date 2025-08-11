import { NextResponse } from 'next/server';
import mockData from '../../_data/mockData.json';
import { Task } from '../../_types';

export const dynamic = 'force-dynamic';

export async function GET() {
  // For server-side requests, return mock data
  return NextResponse.json(mockData.tasks as Task[]);
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json();

    // For server-side requests, just return the updates
    // The actual storage update will happen on the client side
    return NextResponse.json({
      ...mockData.tasks.find((t) => t.id === updates.id),
      ...updates,
    });
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
