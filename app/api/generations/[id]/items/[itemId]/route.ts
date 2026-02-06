import { NextRequest, NextResponse } from 'next/server';
import { deleteContentPlanItem } from '@/lib/db/adapter';
import { ApiErrorResponse } from '@/lib/types';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const { itemId } = params;
    await deleteContentPlanItem(itemId);

    return NextResponse.json(
      { message: 'Item deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting content plan item:', error);
    
    if (error.message?.includes('not found')) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: {
            message: error.message,
            code: 'NOT_FOUND',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: error.message || 'Failed to delete item',
          code: 'DELETE_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
