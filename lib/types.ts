export type ContentPlanStatus = "draft" | "selected" | "generated";

export interface ContentPlanItem {
  id: string;
  format: string;
  title: string;
  pain_point: string;
  content_outline: string;
  cta: string;
  status: ContentPlanStatus;
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

