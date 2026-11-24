CREATE TABLE "WeatherSearch" (
  "id" TEXT NOT NULL,
  "locationName" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION NOT NULL,
  "longitude" DOUBLE PRECISION NOT NULL,
  "country" TEXT,
  "weatherCondition" TEXT NOT NULL,
  "temperature" DOUBLE PRECISION NOT NULL,
  "humidity" INTEGER NOT NULL,
  "windSpeed" DOUBLE PRECISION NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "searchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WeatherSearch_pkey" PRIMARY KEY ("id")
);
