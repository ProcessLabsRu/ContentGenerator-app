-- Content Plan Generator Database Schema
-- PostgreSQL 13+ uses gen_random_uuid() (no extension needed)
-- For PostgreSQL 12 and earlier, uncomment the line below and change gen_random_uuid() to uuid_generate_v4()
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: generations
-- Stores content plan generation metadata
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  specialization VARCHAR(255) NOT NULL,
  purpose VARCHAR(255) NOT NULL,
  content_type VARCHAR(255) NOT NULL,
  number_of_publications INTEGER NOT NULL,
  context TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

COMMENT ON TABLE generations IS 'Stores content plan generation requests and metadata';
COMMENT ON COLUMN generations.id IS 'Unique identifier for the generation';
COMMENT ON COLUMN generations.created_at IS 'Timestamp when the generation was created';
COMMENT ON COLUMN generations.specialization IS 'Industry/specialization for the content plan';
COMMENT ON COLUMN generations.purpose IS 'Purpose of publication (lead generation, brand awareness, etc.)';
COMMENT ON COLUMN generations.content_type IS 'Type of content (educational, promotional, etc.)';
COMMENT ON COLUMN generations.number_of_publications IS 'Number of publications requested (max 15)';
COMMENT ON COLUMN generations.context IS 'Additional context or wishes from the user';
COMMENT ON COLUMN generations.metadata IS 'Additional metadata stored as JSON';

-- Table: content_plan_items
-- Stores individual content plan items (posts) for each generation
CREATE TABLE IF NOT EXISTS content_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
  format VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  pain_point TEXT,
  content_outline TEXT,
  cta TEXT,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'selected', 'generated')),
  publish_date DATE,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE content_plan_items
  ADD COLUMN IF NOT EXISTS publish_date DATE;
ALTER TABLE content_plan_items
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON TABLE content_plan_items IS 'Stores individual content plan items (posts) for each generation';
COMMENT ON COLUMN content_plan_items.id IS 'Unique identifier for the content plan item';
COMMENT ON COLUMN content_plan_items.generation_id IS 'Foreign key to the parent generation';
COMMENT ON COLUMN content_plan_items.format IS 'Format of the content (Blog Post, Video, etc.)';
COMMENT ON COLUMN content_plan_items.title IS 'Title of the content piece';
COMMENT ON COLUMN content_plan_items.pain_point IS 'Target pain point for this content';
COMMENT ON COLUMN content_plan_items.content_outline IS 'Outline/structure of the content';
COMMENT ON COLUMN content_plan_items.cta IS 'Call-to-action for the content';
COMMENT ON COLUMN content_plan_items.status IS 'Status of the item: draft, selected, or generated';
COMMENT ON COLUMN content_plan_items.publish_date IS 'Planned publication date for the item';
COMMENT ON COLUMN content_plan_items.is_approved IS 'Whether the item is approved for publishing';

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_content_plan_items_generation_id ON content_plan_items(generation_id);
CREATE INDEX IF NOT EXISTS idx_content_plan_items_status ON content_plan_items(status);
CREATE INDEX IF NOT EXISTS idx_content_plan_items_publish_date ON content_plan_items(publish_date);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on content_plan_items
DROP TRIGGER IF EXISTS update_content_plan_items_updated_at ON content_plan_items;
CREATE TRIGGER update_content_plan_items_updated_at 
    BEFORE UPDATE ON content_plan_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Instructions:
-- 1. Connect to PostgreSQL: psql -U your_user -d your_database
-- 2. Run this script: \i scripts/setup-db.sql
-- OR
-- 1. Create database: CREATE DATABASE content_generator;
-- 2. Run: psql -U your_user -d content_generator -f scripts/setup-db.sql
