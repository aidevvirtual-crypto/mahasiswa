import { mysqlTable, varchar, text, timestamp, int, boolean, json } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  picture: varchar('picture', { length: 500 }),
  role: varchar('role', { length: 20 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const registrations = mysqlTable('registrations', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id),
  nik: varchar('nik', { length: 20 }),
  dateOfBirth: varchar('date_of_birth', { length: 10 }),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  registrationType: varchar('registration_type', { length: 20 }).notNull(),
  institutionName: varchar('institution_name', { length: 255 }),
  institutionAddress: text('institution_address'),
  businessName: varchar('business_name', { length: 255 }),
  businessAddress: text('business_address'),
  proposalPath: varchar('proposal_path', { length: 500 }),
  step: int('step').notNull().default(1),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export const portfolioAssets = mysqlTable('portfolio_assets', {
  id: varchar('id', { length: 36 }).primaryKey(),
  registrationId: varchar('registration_id', { length: 36 }).notNull().references(() => registrations.id),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id),
  type: varchar('type', { length: 20 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSize: int('file_size').notNull(),
  magicBytes: varchar('magic_bytes', { length: 50 }),
  uploadStatus: varchar('upload_status', { length: 20 }).notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id),
  token: varchar('token', { length: 500 }).notNull(),
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