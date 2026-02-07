import {
  Generation,
  GenerationInput,
  GenerationWithItems,
  ContentPlanItem,
  ContentPlanItemInput,
  ContentPlanStatus,
  ContentPlanItemUpdate,
  ApiResult,
  ApiErrorResponse,
} from './types';

const API_BASE = '/api';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || `API error: ${response.statusText}`,
          code: data.error?.code || 'API_ERROR',
          details: data.error?.details,
        },
      };
    }

    return {
      data: data.data || data,
    };
  } catch (error: any) {
    return {
      error: {
        message: error.message || 'Network error',
        code: 'NETWORK_ERROR',
        details: error,
      },
    };
  }
}

export async function fetchGenerations(): Promise<ApiResult<Generation[]>> {
  return apiRequest<Generation[]>('/generations');
}

export async function fetchGenerationById(id: string): Promise<ApiResult<Generation>> {
  return apiRequest<Generation>(`/generations/${id}`);
}

export async function createGeneration(
  generation: GenerationInput,
  items: ContentPlanItemInput[]
): Promise<ApiResult<GenerationWithItems>> {
  // Transform GenerationInput to match API expected format
  const generationData = {
    specialization: generation.specialization,
    purpose: generation.purpose,
    contentType: generation.content_type,
    numberOfPublications: generation.number_of_publications,
    context: generation.context,
    metadata: generation.metadata,
  };

  return apiRequest<GenerationWithItems>('/generations', {
    method: 'POST',
    body: JSON.stringify({
      generation: generationData,
      items,
    }),
  });
}

export async function updateGeneration(
  id: string,
  data: Partial<GenerationInput>
): Promise<ApiResult<Generation>> {
  // Transform to match API format
  const updateData: any = {};
  if (data.specialization !== undefined) updateData.specialization = data.specialization;
  if (data.purpose !== undefined) updateData.purpose = data.purpose;
  if (data.content_type !== undefined) updateData.contentType = data.content_type;
  if (data.number_of_publications !== undefined) updateData.numberOfPublications = data.number_of_publications;
  if (data.context !== undefined) updateData.context = data.context;
  if (data.metadata !== undefined) updateData.metadata = data.metadata;

  return apiRequest<Generation>(`/generations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
}

export async function deleteGeneration(id: string): Promise<ApiResult<void>> {
  const result = await apiRequest<void>(`/generations/${id}`, {
    method: 'DELETE',
  });

  return result;
}

export async function fetchGenerationItems(
  generationId: string
): Promise<ApiResult<ContentPlanItem[]>> {
  return apiRequest<ContentPlanItem[]>(`/generations/${generationId}/items`);
}

export async function updateItemStatus(
  generationId: string,
  itemId: string,
  status: ContentPlanStatus
): Promise<ApiResult<ContentPlanItem>> {
  return apiRequest<ContentPlanItem>(`/generations/${generationId}/items`, {
    method: 'PUT',
    body: JSON.stringify({
      itemId,
      status,
    }),
  });
}

export async function updateItem(
  generationId: string,
  item: ContentPlanItemUpdate
): Promise<ApiResult<ContentPlanItem>> {
  return apiRequest<ContentPlanItem>(`/generations/${generationId}/items`, {
    method: 'PUT',
    body: JSON.stringify({
      item,
    }),
  });
}

export async function deleteItem(
  generationId: string,
  itemId: string
): Promise<ApiResult<void>> {
  return apiRequest<void>(`/generations/${generationId}/items/${itemId}`, {
    method: 'DELETE',
  });
}

export async function fetchAllContentItems(
  page = 1,
  perPage = 100
): Promise<ApiResult<{ items: ContentPlanItem[]; totalItems: number }>> {
  try {
    const response = await fetch(
      `/api/items?page=${page}&perPage=${perPage}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return data as ApiErrorResponse;
    }

    return { data };
  } catch (error: any) {
    return {
      error: {
        message: error.message || "Network error",
        code: "NETWORK_ERROR",
      },
    };
  }
}

// Helper function to check if result is an error
export function isApiError<T>(result: ApiResult<T>): result is { error: { message: string; code?: string; details?: unknown } } {
  return 'error' in result;
}

// Helper function to extract data or throw error
export function getApiDataOrThrow<T>(result: ApiResult<T>): T {
  if (isApiError(result)) {
    throw new Error(result.error.message);
  }
  return result.data;
}
