import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';

/**
 * Account activation payment records.
 * Tracks payment attempts for account activation through SasPay.
 */
export const activationPayments = pgTable(
  'activation_payments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references('auth.users', { onDelete: 'cascade' }),
    providerReference: text('provider_reference').notNull().unique(),
    amount: text('amount').notNull(),
    currency: text('currency').notNull().default('XAF'),
    status: text('status').notNull().default('not_started'), // not_started, pending, successful, failed, cancelled
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('activation_payments_user_id_idx').on(table.userId),
    providerReferenceIdx: index('activation_payments_provider_reference_idx').on(table.providerReference),
    statusIdx: index('activation_payments_status_idx').on(table.status),
  })
);
