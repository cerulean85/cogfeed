import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const configs = [
  { key: "coupang_iframe_src_1", value: "https://coupa.ng/cmr66l" },  // 사이드바
  { key: "coupang_iframe_src_2", value: "https://coupa.ng/cmr68w" },  // 인증 페이지
  { key: "coupang_iframe_src_3", value: "https://coupa.ng/cmr69p" },  // 대문
];

async function main() {
  for (const config of configs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
    console.log(`Seeded: ${config.key}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
