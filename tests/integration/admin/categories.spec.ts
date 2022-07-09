import { clearTables } from "@tests/database";
import app from "@src/app";
import request from "supertest";
import { find } from "@src/services/categoryService";

describe.skip("Categories", () => {
  describe("GET /categories", () => {
    afterAll(async () => {
      await clearTables();
    });

    it.skip("create a categories", async () => {
      const user = request(app);
      const res = await user
        .post("/admin/categories")
        .send({ name: "Qualquer" })
        .expect(404);

      const [category] = await find();

      expect(category.name).toBe("Qualquer");
    });
  });
});
