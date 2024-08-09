import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  await prisma.category.create({
    data: {
      name: "Monitores",
      products: {
        create: [
          {
            name: "Monitor 22pol",
            price: 100.0,
            slug: "monitor_22pol",
            priceWithDiscount: 95.0,
            headline: "Melhor periférico",
            description: "Dados do Periférico",
          },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: "Periféricos",
      products: {
        create: [
          {
            name: "Periferico 1",
            price: 100.0,
            slug: "periferico_1",
            priceWithDiscount: 95.0,
            headline: "Melhor periférico",
            description: "Dados do Periférico",
          },
        ],
      },
    },
  });
};

main().finally(async () => {
  await prisma.$disconnect();
});
