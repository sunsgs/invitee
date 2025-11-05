DROP TABLE `invitation`;--> statement-breakpoint
DROP TABLE `member`;--> statement-breakpoint
DROP TABLE `organization`;--> statement-breakpoint
ALTER TABLE `session` ADD `impersonated_by` text;--> statement-breakpoint
ALTER TABLE `session` DROP COLUMN `active_organization_id`;--> statement-breakpoint
ALTER TABLE `user` ADD `role` text;--> statement-breakpoint
ALTER TABLE `user` ADD `banned` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ADD `ban_reason` text;--> statement-breakpoint
ALTER TABLE `user` ADD `ban_expires` integer;