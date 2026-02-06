import { getValidatedConfig } from '../config';
import {
  Generation,
  GenerationInput,
  GenerationWithItems,
  ContentPlanItem,
  ContentPlanItemInput,
  ContentPlanStatus,
  ContentPlanItemUpdate,
} from '../types';

// Import direct access functions
import * as directAccess from './direct-access';

// Import NocoDB client functions
import * as nocodbAccess from './nocodb-client';

// Import PocketBase client functions
import * as pocketbaseAccess from './pocketbase-access';

export interface DatabaseAdapter {
  createGeneration(data: GenerationInput, items: ContentPlanItemInput[]): Promise<GenerationWithItems>;
  getGenerationById(id: string): Promise<Generation | null>;
  getAllGenerations(): Promise<Generation[]>;
  updateGeneration(id: string, data: Partial<GenerationInput>): Promise<Generation>;
  deleteGeneration(id: string): Promise<void>;
  getItemsByGenerationId(generationId: string): Promise<ContentPlanItem[]>;
  updateItemStatus(itemId: string, status: ContentPlanStatus): Promise<ContentPlanItem>;
  updateItem(itemId: string, data: ContentPlanItemUpdate): Promise<ContentPlanItem>;
}

class DirectAccessAdapter implements DatabaseAdapter {
  async createGeneration(
    data: GenerationInput,
    items: ContentPlanItemInput[]
  ): Promise<GenerationWithItems> {
    return directAccess.createGeneration(data, items);
  }

  async getGenerationById(id: string): Promise<Generation | null> {
    return directAccess.getGenerationById(id);
  }

  async getAllGenerations(): Promise<Generation[]> {
    return directAccess.getAllGenerations();
  }

  async updateGeneration(
    id: string,
    data: Partial<GenerationInput>
  ): Promise<Generation> {
    return directAccess.updateGeneration(id, data);
  }

  async deleteGeneration(id: string): Promise<void> {
    return directAccess.deleteGeneration(id);
  }

  async getItemsByGenerationId(generationId: string): Promise<ContentPlanItem[]> {
    return directAccess.getItemsByGenerationId(generationId);
  }

  async updateItemStatus(
    itemId: string,
    status: ContentPlanStatus
  ): Promise<ContentPlanItem> {
    return directAccess.updateItemStatus(itemId, status);
  }

  async updateItem(
    itemId: string,
    data: ContentPlanItemUpdate
  ): Promise<ContentPlanItem> {
    return directAccess.updateItem(itemId, data);
  }
}

class NocoDBAdapter implements DatabaseAdapter {
  async createGeneration(
    data: GenerationInput,
    items: ContentPlanItemInput[]
  ): Promise<GenerationWithItems> {
    return nocodbAccess.createGeneration(data, items);
  }

  async getGenerationById(id: string): Promise<Generation | null> {
    return nocodbAccess.getGenerationById(id);
  }

  async getAllGenerations(): Promise<Generation[]> {
    return nocodbAccess.getAllGenerations();
  }

  async updateGeneration(
    id: string,
    data: Partial<GenerationInput>
  ): Promise<Generation> {
    return nocodbAccess.updateGeneration(id, data);
  }

  async deleteGeneration(id: string): Promise<void> {
    return nocodbAccess.deleteGeneration(id);
  }

  async getItemsByGenerationId(generationId: string): Promise<ContentPlanItem[]> {
    return nocodbAccess.getItemsByGenerationId(generationId);
  }

  async updateItemStatus(
    itemId: string,
    status: ContentPlanStatus
  ): Promise<ContentPlanItem> {
    return nocodbAccess.updateItemStatus(itemId, status);
  }

  async updateItem(
    itemId: string,
    data: ContentPlanItemUpdate
  ): Promise<ContentPlanItem> {
    return nocodbAccess.updateItem(itemId, data);
  }
}

class PocketBaseAdapter implements DatabaseAdapter {
  async createGeneration(
    data: GenerationInput,
    items: ContentPlanItemInput[]
  ): Promise<GenerationWithItems> {
    return pocketbaseAccess.createGeneration(data, items);
  }

  async getGenerationById(id: string): Promise<Generation | null> {
    return pocketbaseAccess.getGenerationById(id);
  }

  async getAllGenerations(): Promise<Generation[]> {
    return pocketbaseAccess.getAllGenerations();
  }

  async updateGeneration(
    id: string,
    data: Partial<GenerationInput>
  ): Promise<Generation> {
    return pocketbaseAccess.updateGeneration(id, data);
  }

  async deleteGeneration(id: string): Promise<void> {
    return pocketbaseAccess.deleteGeneration(id);
  }

  async getItemsByGenerationId(generationId: string): Promise<ContentPlanItem[]> {
    return pocketbaseAccess.getItemsByGenerationId(generationId);
  }

  async updateItemStatus(
    itemId: string,
    status: ContentPlanStatus
  ): Promise<ContentPlanItem> {
    return pocketbaseAccess.updateItemStatus(itemId, status);
  }

  async updateItem(
    itemId: string,
    data: ContentPlanItemUpdate
  ): Promise<ContentPlanItem> {
    return pocketbaseAccess.updateItem(itemId, data);
  }
}

// Singleton adapter instance
let adapter: DatabaseAdapter | null = null;

export function getDatabaseAdapter(): DatabaseAdapter {
  if (!adapter) {
    const config = getValidatedConfig();

    if (config.provider === 'nocodb') {
      adapter = new NocoDBAdapter();
    } else if (config.provider === 'pocketbase') {
      adapter = new PocketBaseAdapter();
    } else {
      adapter = new DirectAccessAdapter();
    }
  }

  return adapter;
}

// Convenience functions that use the adapter
export async function createGeneration(
  data: GenerationInput,
  items: ContentPlanItemInput[]
): Promise<GenerationWithItems> {
  return getDatabaseAdapter().createGeneration(data, items);
}

export async function getGenerationById(id: string): Promise<Generation | null> {
  return getDatabaseAdapter().getGenerationById(id);
}

export async function getAllGenerations(): Promise<Generation[]> {
  return getDatabaseAdapter().getAllGenerations();
}

export async function updateGeneration(
  id: string,
  data: Partial<GenerationInput>
): Promise<Generation> {
  return getDatabaseAdapter().updateGeneration(id, data);
}

export async function deleteGeneration(id: string): Promise<void> {
  return getDatabaseAdapter().deleteGeneration(id);
}

export async function getItemsByGenerationId(generationId: string): Promise<ContentPlanItem[]> {
  return getDatabaseAdapter().getItemsByGenerationId(generationId);
}

export async function updateItemStatus(
  itemId: string,
  status: ContentPlanStatus
): Promise<ContentPlanItem> {
  return getDatabaseAdapter().updateItemStatus(itemId, status);
}

export async function updateItem(
  itemId: string,
  data: ContentPlanItemUpdate
): Promise<ContentPlanItem> {
  return getDatabaseAdapter().updateItem(itemId, data);
}
