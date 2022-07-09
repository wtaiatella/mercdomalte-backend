import { createCategory, createProduct } from "@tests/factories";
import { clearTables } from "@tests/database";
import app from "@src/app";
import request from "supertest";

describe("Products", () => {
  describe("GET /categories/:id/products", () => {
    let product1;
    let product2;
    let categoryId: string;

    beforeEach(async () => {
      await clearTables();
      const category = await createCategory({ name: "Periféricos" });
      categoryId = category.id;
      product1 = await createProduct({
        name: "Mouse",
        categoryId: category.id,
      });
      product2 = await createProduct({
        name: "Teclado",
        categoryId: category.id,
      });
    });

    afterAll(async () => {
      await clearTables();
    });

    it("returns a list of products of that category in JSON ", async () => {
      const res = await request(app)
        .get(`/categories/${categoryId}/products`)
        .expect(200);

      const [item1, item2] = res.body;

      expect(item1.name).toBe("Mouse");
      expect(item2.name).toBe("Teclado");
    });
  });

  describe("GET /products/:id", () => {});
  let productId: string;

  beforeEach(async () => {
    await clearTables();
    const category = await createCategory({ name: "Periféricos" });
    const product = await createProduct({
      name: "Mouse",
      categoryId: category.id,
    });

    productId = product.id;
  });

  afterAll(async () => {
    await clearTables();
  });

  it("returns a product based on that ID", async () => {
    const client = request(app);
    const res = await client.get(`/products/${productId}`).expect(200);

    const item = res.body;
    expect(item.name).toBe("Mouse");
  });
});
