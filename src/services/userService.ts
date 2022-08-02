import { database } from "./../adapters/database";
import logger from "./../adapters/logger";

const findOne = async (productId: string) => {
  logger.info({ productId });

  const product = await database.product.findUnique({
    where: {
      slug: productId,
    },
  });

  return product;
};

export interface ProductProps {
  name: string;
  categoryId: string;
  price?: number;
  priceWithDiscount?: number;
  description?: string;
  headline?: string;
}

const create = async (props: ProductProps) => {
  const { name, categoryId, price, priceWithDiscount, description, headline } =
    props;

  const slug = name.replace(" ", "-").toLowerCase();

  const data = {
    name,
    slug,
    categoryId,
    price,
    priceWithDiscount,
    description,
    headline,
  };

  return database.product.create({ data });
};
export default { findOne, create };
