import { pgTable, varchar, text, timestamp, integer, boolean, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  picture: varchar('picture', { length: 500 }),
  role: varchar('role', { length: 20 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const registrations = pgTable('registrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  nik: varchar('nik', { length: 20 }),
  dateOfBirth: varchar('date_of_birth', { length: 10 }),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  registrationType: varchar('registration_type', { length: 20 }).notNull(),
  institutionName: varchar('institution_name', { length: 255 }),
  institutionAddress: text('institution_address'),
  businessName: varchar('business_name', { length: 255 }),
  businessAddress: text('business_address'),
  proposalPath: varchar('proposal_path', { length: 500 }),
  step: integer('step').notNull().default(1),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const portfolioAssets = pgTable('portfolio_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  registrationId: uuid('registration_id').notNull().references(() => registrations.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: varchar('type', { length: 20 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSize: integer('file_size').notNull(),
  magicBytes: varchar('magic_bytes', { length: 50 }),
  uploadStatus: varchar('upload_status', { length: 20 }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;
export type PortfolioAsset = typeof portfolioAssets.$inferSelect;
export type NewPortfolioAsset = typeof portfolioAssets.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;