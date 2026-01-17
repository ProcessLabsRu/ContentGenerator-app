import { NextRequest, NextResponse } from 'next/server';
import {
  getGenerationById,
  updateGeneration,
  deleteGeneration,
} from '@/lib/db/adapter';
import {
  GenerationInput,
  ApiResponse,
  ApiErrorResponse,
} from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const generation = await getGenerationById(id);

    if (!generation) {
      return NextResponse.json<ApiErrorResponse>(
        {
          error: {
            message: `Generation with id ${id} not found`,
            code: 'NOT_FOUND',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<typeof generation>>({
      data: generation,
    });
  } catch (error: any) {
    console.error('Error fetching generation:', error);
    return NextResponse.json<ApiErrorResponse>(
      {
        error: {
          message: error.message || 'Failed to fetch generation',
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
    const { id } = params;
    const body = await request.json();

    const updateData: Partial<GenerationInput> = {};

    if (body.specialization !== undefined) updateData.specialization = body.specialization;
    if (body.purpose !== undefined) updateData.purpose = body.purpose;
    if (body.content_type !== undefined) updateData.content_type = body.content_type;
    if (body.contentType !== undefined) updateData.content_type = body.contentType;
    if (body.number_of_publications !== undefined) updateData.number_of_publications = body.number_of_publications;
    if (body.numberOfPublications !== undefined) updateData.number_of_publications = body.numberOfPublications;
    if (body.context !== undefined) updateData.context = body.context;
    if (body.metadata !== undefined) updateData.metadata = body.metadata;

    const updated = await updateGeneration(id, updateData);

    return NextResponse.json<ApiResponse<typeof updated>>({
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating generation:', error);
    
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
          message: error.message || 'Failed to update generation',
          code: 'UPDATE_ERROR',
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await deleteGeneration(id);

    return NextResponse.json(
      { message: 'Generation deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting generation:', error);
    
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
          message: error.message || 'Failed to delete generation',
          code: 'DELETE_ERROR',
        },
      },
      { status: 500 }
    );
  }
}

