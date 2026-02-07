import { NextRequest, NextResponse } from 'next/server';
import {
  getItemsByGenerationId,
  updateItemStatus,
  updateItem,
} from '@/lib/db/adapter';
import {
  ContentPlanItem,
  ContentPlanStatus,
  ContentPlanItemUpdate,
  ApiResponse,
  ApiErrorResponse,
} from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const items = await getItemsByGenerationId(id);

    return NextResponse.json<ApiResponse<ContentPlanItem[]>>({
      data: items,
    });
  } catch (error: any) {
    console.error('Error fetching generation items:', error);
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: error.message || 'Failed to fetch generation items',
          code: 'FETCH_ERROR',
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: generationId } = params;
    const body = await request.json();

    // Update item details if item is provided
    if (body.item && body.item.id) {
      const hasPublishDate = Object.prototype.hasOwnProperty.call(
        body.item,
        'publish_date'
      );

      const itemUpdate: ContentPlanItemUpdate = {
        id: body.item.id,
        format: body.item.format,
        title: body.item.title,
        pain_point: body.item.pain_point || body.item.painPoint,
        content_outline:
          body.item.content_outline || body.item.contentOutline,
        cta: body.item.cta,
        status: body.item.status,
        publish_date: hasPublishDate ? body.item.publish_date ?? null : undefined,
      };

      const updated = await updateItem(itemUpdate.id, itemUpdate);

      return NextResponse.json<ApiResponse<ContentPlanItem>>({
        data: updated,
      });
    }

    // Update single item status if itemId is provided
    if (body.itemId && body.status) {
      const status = body.status as ContentPlanStatus;

      if (!['draft', 'selected', 'generated'].includes(status)) {
        return NextResponse.json<ApiErrorResponse>(
          {
            error: {
              message: 'Invalid status. Must be one of: draft, selected, generated',
              code: 'VALIDATION_ERROR',
            },
          },
          { status: 400 }
        );
      }

      const updated = await updateItemStatus(body.itemId, status);

      return NextResponse.json<ApiResponse<ContentPlanItem>>({
        data: updated,
      });
    }

    // Batch update multiple items
    if (body.items && Array.isArray(body.items)) {
      const updates = body.items.map((item: { id: string; status: string }) =>
        updateItemStatus(item.id, item.status as ContentPlanStatus)
      );

      const updated = await Promise.all(updates);

      return NextResponse.json<ApiResponse<ContentPlanItem[]>>({
        data: updated,
      });
    }

    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: 'Invalid request body. Expected { item: ContentPlanItemUpdate } or { itemId: string, status: string } or { items: Array<{id: string, status: string}> }',
          code: 'VALIDATION_ERROR',
        },
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error updating item status:', error);

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
          message: error.message || 'Failed to update item status',
          code: 'UPDATE_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
