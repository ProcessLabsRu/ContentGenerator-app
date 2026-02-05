/**
 * PocketBase Collection Types
 * These types represent the structure of data stored in PocketBase
 */

/**
 * Base record type with PocketBase system fields
 */
export interface PocketBaseRecord {
    id: string;
    created: string;
    updated: string;
    collectionId: string;
    collectionName: string;
}

/**
 * Generation record in PocketBase
 * Represents a content plan generation
 */
export interface PBGeneration extends PocketBaseRecord {
    // User/Organization info
    userId?: string;
    organizationId?: string;

    // Generation metadata
    specialization: string;
    purpose?: string;
    contentType?: string;
    numberOfPublications: number;
    context?: string;

    // Medical-specific fields
    month?: string;
    goals?: string[]; // JSON array of goals
    formatCounts?: string; // JSON object with format counts
    useHealthCalendar?: boolean;

    // Status
    status: 'draft' | 'generated' | 'completed';

    // Timestamps
    generatedAt?: string;
}

/**
 * Content Plan Item record in PocketBase
 * Represents individual posts in a content plan
 */
export interface PBContentPlanItem extends PocketBaseRecord {
    // Reference to generation
    generationId: string;

    // Content details
    title: string;
    format: string;
    status: 'draft' | 'selected' | 'generated';
    publishDate?: string;
    approved: boolean;

    // Content structure
    painPoint?: string;
    cta?: string;
    contentOutline?: string;

    // Additional metadata
    metadata?: string; // JSON object for additional data
}

/**
 * User record in PocketBase
 */
export interface PBUser extends PocketBaseRecord {
    email: string;
    name?: string;
    avatar?: string;
    verified: boolean;
}

/**
 * Collection names as constants
 */
export const COLLECTIONS = {
    GENERATIONS: 'generations',
    CONTENT_PLAN_ITEMS: 'content_plan_items',
    USERS: 'users',
} as const;

/**
 * Helper type for collection names
 */
export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
