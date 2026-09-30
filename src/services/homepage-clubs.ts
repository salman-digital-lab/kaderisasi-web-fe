import { getPublishedClubs } from "./club.cache";
import type { Club } from "@/types/model/club";

export async function getHomepageClubs(): Promise<Club[]> {
  const clubs = [...(await getPublishedClubs())];
  const count = Math.min(4, clubs.length);

  for (let index = 0; index < count; index += 1) {
    const randomIndex =
      index + Math.floor(Math.random() * (clubs.length - index));
    [clubs[index], clubs[randomIndex]] = [clubs[randomIndex]!, clubs[index]!];
  }

  return clubs.slice(0, count);
}
