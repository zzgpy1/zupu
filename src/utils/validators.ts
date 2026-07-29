import { z } from 'zod';

export const FamilySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  cover_image: z.string().url().optional(),
});

export const MemberSchema = z.object({
  family_id: z.string().min(1),
  name: z.string().min(1).max(50),
  gender: z.enum(['male', 'female', 'unknown']).default('unknown'),
  birth_year: z.number().int().min(-5000).max(2100).nullable().optional(),
  birth_place: z.string().max(200).nullable().optional(),
  death_year: z.number().int().min(-5000).max(2100).nullable().optional(),
  death_place: z.string().max(200).nullable().optional(),
  biography: z.string().max(10000).nullable().optional(),
  avatar: z.string().url().nullable().optional(),
  generation: z.number().int().min(1).default(1),
  father_id: z.string().nullable().optional(),
  mother_id: z.string().nullable().optional(),
  spouse_id: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
});

export const RelationshipSchema = z.object({
  member_id: z.string().min(1),
  related_id: z.string().min(1),
  relation_type: z.string().min(1).max(50),
});

export const GenerationWordSchema = z.object({
  family_id: z.string().min(1),
  generation: z.number().int().min(1),
  word: z.string().min(1).max(10),
});
