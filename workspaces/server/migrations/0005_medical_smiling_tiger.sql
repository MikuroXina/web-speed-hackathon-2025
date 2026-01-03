CREATE INDEX `moduleIdOrderIndex` ON `recommendedItem` (`moduleId`,`order`);--> statement-breakpoint
CREATE INDEX `referenceIdOrderIndex` ON `recommendedModule` (`referenceId`,`order`);