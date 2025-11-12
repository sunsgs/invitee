ALTER TABLE `invite` RENAME COLUMN "status" TO "startTime";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `invite` ALTER COLUMN "startTime" TO "startTime" text;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `invite` ADD `endTime` text;