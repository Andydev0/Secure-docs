-- Adiciona a coluna createdAt com valor padrão
ALTER TABLE `User` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- Adiciona a coluna updatedAt com valor padrão
ALTER TABLE `User` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
