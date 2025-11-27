ALTER TABLE `invite` RENAME COLUMN "emoji" TO "iconId";--> statement-breakpoint
ALTER TABLE `invite` DROP COLUMN `emoji_density`;