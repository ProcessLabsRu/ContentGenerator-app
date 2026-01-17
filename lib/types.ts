export type ContentPlanStatus = "draft" | "selected" | "generated";

export interface ContentPlanItem {
  id: string;
  generation_id?: string; // Optional for backward compatibility
  format: string;
  title: string;
  pain_point: string;
  content_outline: string;
  cta: string;
  status: ContentPlanStatus;
  publish_date?: string | null;
  is_approved?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Input type for creating content plan items (without id, timestamps)
export interface ContentPlanItemInput {
  format: string;
  title: string;
  pain_point: string;
  content_outline: string;
  cta: string;
  status?: ContentPlanStatus;
  publish_date?: string | null;
  is_approved?: boolean;
}

export interface ContentPlanItemUpdate {
  id: string;
  format?: string;
  title?: string;
  pain_point?: string;
  content_outline?: string;
  cta?: string;
  status?: ContentPlanStatus;
  publish_date?: string | null;
  is_approved?: boolean;
}

export interface GenerationFormData {
  specialization: string;
  purpose: string;
  contentType: string;
  numberOfPublications: number;
  context: string;
}

export type SpecializationOption =
  | "Digital Marketing"
  | "SaaS"
  | "E-commerce"
  | "Healthcare"
  | "Education"
  | "Finance"
  | "Technology"
  | "Real Estate";

export type PurposeOption =
  | "Lead Generation"
  | "Brand Awareness"
  | "Thought Leadership"
  | "Customer Education"
  | "Product Launch"
  | "Customer Retention"
  | "Community Building";

export type ContentTypeOption =
  | "Educational"
  | "Promotional"
  | "Entertainment"
  | "Case Study"
  | "How-to Guide"
  | "News & Updates"
  | "Comparison"
  | "Review";

// Database types
export interface Generation {
  id: string;
  created_at: string;
  specialization: string;
  purpose: string;
  content_type: string;
  number_of_publications: number;
  context: string | null;
  metadata?: Record<string, unknown>;
  items?: ContentPlanItem[]; // Optional: items can be loaded separately
}

// Input type for creating a generation (without id, created_at)
export interface GenerationInput {
  specialization: string;
  purpose: string;
  content_type: string;
  number_of_publications: number;
  context?: string | null;
  metadata?: Record<string, unknown>;
}

// Complete generation with items for API responses
export interface GenerationWithItems extends Generation {
  items: ContentPlanItem[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: never;
}

export interface ApiErrorResponse {
  data?: never;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;
