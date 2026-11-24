import type { WeatherSearch } from "@prisma/client";
import { prisma } from "./prisma";
import type { SavedSearch } from "./types";

type SavedInput = Omit<SavedSearch, "id" | "searchedAt" | "createdAt" | "updatedAt" | "startDate" | "endDate"> & { startDate: Date | string; endDate: Date | string };
let memory: SavedSearch[] = [];
const useDatabase = Boolean(process.env.DATABASE_URL);

function serialize(row: WeatherSearch): SavedSearch {
  return {
    ...row,
    startDate: row.startDate.toISOString(),
    endDate: row.endDate.toISOString(),
    searchedAt: row.searchedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listSaved(): Promise<SavedSearch[]> {
  if (!useDatabase) return memory;
  return (await prisma.weatherSearch.findMany({ orderBy: { createdAt: "desc" } })).map(serialize);
}

export async function createSaved(data: SavedInput): Promise<SavedSearch> {
  if (!useDatabase) {
    const now = new Date().toISOString();
    const item: SavedSearch = { ...data, startDate: new Date(data.startDate).toISOString(), endDate: new Date(data.endDate).toISOString(), id: crypto.randomUUID(), searchedAt: now, createdAt: now, updatedAt: now };
    memory = [item, ...memory];
    return item;
  }
  return serialize(await prisma.weatherSearch.create({ data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) } }));
}

export async function updateSaved(id: string, data: Partial<SavedInput>): Promise<SavedSearch | null> {
  if (!useDatabase) {
    const index = memory.findIndex((item) => item.id === id);
    if (index < 0) return null;
    memory[index] = { ...memory[index], ...data, startDate: data.startDate ? new Date(data.startDate).toISOString() : memory[index].startDate, endDate: data.endDate ? new Date(data.endDate).toISOString() : memory[index].endDate, updatedAt: new Date().toISOString() };
    return memory[index];
  }
  try {
    return serialize(await prisma.weatherSearch.update({ where: { id }, data: { ...data, ...(data.startDate ? { startDate: new Date(data.startDate) } : {}), ...(data.endDate ? { endDate: new Date(data.endDate) } : {}) } }));
  } catch (error) {
    if (error instanceof Error && error.message.includes("Record to update not found")) return null;
    throw error;
  }
}

export async function deleteSaved(id: string): Promise<boolean> {
  if (!useDatabase) {
    const before = memory.length;
    memory = memory.filter((item) => item.id !== id);
    return memory.length !== before;
  }
  try {
    await prisma.weatherSearch.delete({ where: { id } });
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Record to delete does not exist")) return false;
    throw error;
  }
}
