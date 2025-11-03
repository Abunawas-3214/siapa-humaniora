-- AlterTable
ALTER TABLE `surat_masuk_disposisi` ADD COLUMN `emailStatus` ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `email_error_message` VARCHAR(191) NULL,
    ADD COLUMN `email_sent_at` DATETIME(3) NULL;
