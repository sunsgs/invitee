CREATE TABLE `invite` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`invitee` text,
	`datetime` integer NOT NULL,
	`location` text NOT NULL,
	`description` text,
	`max_guests` integer,
	`creator_id` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`rsvp_required` integer DEFAULT false,
	`invite_code` text,
	`reminder_sent` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invite_invite_code_unique` ON `invite` (`invite_code`);--> statement-breakpoint
CREATE TABLE `rsvp` (
	`id` text PRIMARY KEY NOT NULL,
	`invite_id` text NOT NULL,
	`user_id` text,
	`guest_name` text,
	`guest_email` text,
	`status` text NOT NULL,
	`adults_count` integer DEFAULT 1,
	`children_count` integer DEFAULT 0,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`invite_id`) REFERENCES `invite`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
