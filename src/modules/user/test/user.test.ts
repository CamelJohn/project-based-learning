import supertest from "supertest";
import { Server } from "../../../server";

describe("[User]", () => {
  let webServer: Awaited<ReturnType<typeof Server>>;
  let http: ReturnType<typeof supertest>;

  beforeAll(async () => {
    webServer = await Server({ test: true });
    http = supertest(webServer);
  });

  afterEach(() => {
    webServer.close();
  });

  describe('{current-user}', () => {
    // it("should throw a Bad Request Error with status 400, for malformed request", async () => {
    //     const response = await http
    //       .get("/api/v1/user")
    //       .set("Accept", "application/json")
    //       .set("Content-Type", "application/json");
  
    //     expect(response.statusCode).toBe(400);
    //   });
  })
});
