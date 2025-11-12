DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `invite` ALTER COLUMN "title" TO "title" text;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `invite` ALTER COLUMN "location" TO "location" text;--> statement-breakpoint
ALTER TABLE `invite` ALTER COLUMN "description" TO "description" text;--> statement-breakpoint
ALTER TABLE `invite` ALTER COLUMN "max_guests_baby" TO "max_guests_baby" integer;--> statement-breakpoint
ALTER TABLE `invite` ALTER COLUMN "emoji" TO "emoji" text;--> statement-breakpoint
ALTER TABLE `invite` ALTER COLUMN "emoji_density" TO "emoji_density" integer;--> statement-breakpoint
ALTER TABLE `invite` ADD `is_max_guests_count_enabled` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `invite` ADD `is_baby_count_enabled` integer DEFAULT false NOT NULL;