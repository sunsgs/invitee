DROP INDEX `invite_invite_code_unique`;--> statement-breakpoint
ALTER TABLE `invite` DROP COLUMN `invite_code`;--> statement-breakpoint
ALTER TABLE `invite` DROP COLUMN `reminder_sent`;