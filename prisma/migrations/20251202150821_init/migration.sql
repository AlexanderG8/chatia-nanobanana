-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_games" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "turnNumber" INTEGER NOT NULL DEFAULT 0,
    "survivalTime" INTEGER NOT NULL DEFAULT 0,
    "thumbnail" TEXT,
    "isAutoSave" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_messages" (
    "id" TEXT NOT NULL,
    "savedGameId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "items" JSONB,
    "order" INTEGER NOT NULL,

    CONSTRAINT "game_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventories" (
    "id" TEXT NOT NULL,
    "savedGameId" TEXT NOT NULL,
    "items" JSONB NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_statistics" (
    "id" TEXT NOT NULL,
    "savedGameId" TEXT NOT NULL,
    "decisionsCount" INTEGER NOT NULL DEFAULT 0,
    "combatActions" INTEGER NOT NULL DEFAULT 0,
    "explorationActions" INTEGER NOT NULL DEFAULT 0,
    "socialActions" INTEGER NOT NULL DEFAULT 0,
    "itemsUsed" INTEGER NOT NULL DEFAULT 0,
    "turnsPlayed" INTEGER NOT NULL DEFAULT 0,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "survivalTime" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "game_statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unlocked_endings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endingId" TEXT NOT NULL,
    "achievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unlocked_endings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "saved_games_userId_idx" ON "saved_games"("userId");

-- CreateIndex
CREATE INDEX "saved_games_userId_isAutoSave_idx" ON "saved_games"("userId", "isAutoSave");

-- CreateIndex
CREATE INDEX "game_messages_savedGameId_idx" ON "game_messages"("savedGameId");

-- CreateIndex
CREATE INDEX "game_messages_savedGameId_order_idx" ON "game_messages"("savedGameId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_savedGameId_key" ON "inventories"("savedGameId");

-- CreateIndex
CREATE UNIQUE INDEX "game_statistics_savedGameId_key" ON "game_statistics"("savedGameId");

-- CreateIndex
CREATE INDEX "unlocked_endings_userId_idx" ON "unlocked_endings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "unlocked_endings_userId_endingId_key" ON "unlocked_endings"("userId", "endingId");

-- AddForeignKey
ALTER TABLE "saved_games" ADD CONSTRAINT "saved_games_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_messages" ADD CONSTRAINT "game_messages_savedGameId_fkey" FOREIGN KEY ("savedGameId") REFERENCES "saved_games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_savedGameId_fkey" FOREIGN KEY ("savedGameId") REFERENCES "saved_games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_statistics" ADD CONSTRAINT "game_statistics_savedGameId_fkey" FOREIGN KEY ("savedGameId") REFERENCES "saved_games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unlocked_endings" ADD CONSTRAINT "unlocked_endings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
