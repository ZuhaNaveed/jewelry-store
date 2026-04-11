import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import User from '../../../models/user_model';

export async function DELETE() {
  try {
    await connectDB();
    const result = await User.deleteMany({});
    return NextResponse.json({
      message: 'All users deleted successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
