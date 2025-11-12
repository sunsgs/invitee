ALTER TABLE `invite` RENAME COLUMN "date" TO "datetime";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `invite` ALTER COLUMN "datetime" TO "datetime" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);