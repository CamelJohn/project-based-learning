import supertest from "supertest";
import { database } from "../../../database";
import { Server } from "../../../server";

describe("[Profile]", () => {
  let webServer: Awaited<ReturnType<typeof Server>>;
  let http: ReturnType<typeof supertest>;

  beforeEach(async () => {
    webServer = await Server({ test: true });
    http = supertest(webServer);
  });

  afterEach(() => {
    webServer.close();
  });

  describe.skip("{get profile}", () => {
    it("should throw an Unprocessable Error with status 422, for malformed request", async () => {
      const response = await http
        .get("/api/v1/profile]")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      expect(response.statusCode).toBe(422);
    });
  });
});
