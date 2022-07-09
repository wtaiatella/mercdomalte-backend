import categoryService from "@src/services/categoryService";
import { createCategory } from "@tests/factories";
import { clearTables } from "@tests/database";

import app from "@src/app";
import request from "supertest";

describe.skip("Admin: categories", () => {
  describe("GET /admin/categories", () => {
    afterAll(async () => {
      await clearTables();
    });

    it("creates a category", async () => {
      const user = request(app);
      await user
        .post("/admin/categories")
        .send({ name: "Qualquer Coisa" })
        .expect(200);

      const [category] = await categoryService.find();

      expect(category.name).toBe("Qualquer Coisa");
    });

    it("does not create a category with duplicated name", async () => {
      const user = request(app);

      await createCategory({ name: "Qualquer Coisa" });

      await user
        .post("/admin/categories")
        .send({ name: "Qualquer Coisa" })
        .expect(400);

      const categories = await categoryService.find();

      expect(categories.length).toBe(1);
    });
  });
});
