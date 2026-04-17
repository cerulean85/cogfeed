import { prisma } from "./prisma";

export async function getSiteConfig(key: string): Promise<string | null> {
  const record = await prisma.siteConfig.findUnique({ where: { key } });
  return record?.value ?? null;
}
