ALTER TABLE `invite` RENAME COLUMN "invitee" TO "name";--> statement-breakpoint
DROP INDEX "invite_invite_code_unique";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `invite` ALTER COLUMN "name" TO "name" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `invite_invite_code_unique` ON `invite` (`invite_code`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `invite` ALTER COLUMN "description" TO "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE `invite` ALTER COLUMN "max_guests" TO "max_guests" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `invite` ALTER COLUMN "rsvp_required" TO "rsvp_required" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `invite` ADD `max_guests_baby` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `invite` ADD `bg_color` text NOT NULL;--> statement-breakpoint
ALTER TABLE `invite` ADD `font_value` text NOT NULL;--> statement-breakpoint
ALTER TABLE `invite` ADD `text_color` text NOT NULL;--> statement-breakpoint
ALTER TABLE `invite` ADD `emoji` text NOT NULL;--> statement-breakpoint
ALTER TABLE `invite` ADD `emoji_density` integer NOT NULL;