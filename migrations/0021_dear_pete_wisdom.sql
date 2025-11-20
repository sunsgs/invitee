ALTER TABLE `rsvp` RENAME COLUMN "user_id" TO "guest_phone";--> statement-breakpoint
ALTER TABLE `rsvp` RENAME COLUMN "children_count" TO "babies_count";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `rsvp` ALTER COLUMN "guest_name" TO "guest_name" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `rsvp` ALTER COLUMN "status" TO "status" text NOT NULL DEFAULT 'attending';--> statement-breakpoint
ALTER TABLE `rsvp` ALTER COLUMN "adults_count" TO "adults_count" integer NOT NULL DEFAULT 1;--> statement-breakpoint
ALTER TABLE `rsvp` ALTER COLUMN "babies_count" TO "babies_count" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `rsvp` ADD `dietary_restrictions` text;--> statement-breakpoint
ALTER TABLE `rsvp` ADD `notes` text;