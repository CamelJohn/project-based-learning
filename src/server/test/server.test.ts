import supertest from "supertest";
import { Server } from "../index";

describe("Server Base Middleware", () => {
  let webServer: Awaited<ReturnType<typeof Server>>;
  let http: ReturnType<typeof supertest>;
  const headers = {
    Authorization: 'Bearer <token_goes_here'
  }

  beforeAll(async () => {
    webServer = await Server({ test: true });
    http = supertest(webServer);
  });

  afterEach(() => webServer.close());

  describe("Health Check Middleware", () => {
    it("should return status 200 & Ok text", async () => {
      const response = await http.get("/health");
      expect(response.body).toEqual("Ok");
      expect(response.statusCode).toEqual(200);
    });
  });

  describe("Catch All Middleware", () => {
    it("should return status 404 & Not-Found Error message", async () => {
      const response = await http.get("/lies");
      expect(response.body.message).toEqual(
        "the route you are looking for does not exist."
      );
      expect(response.statusCode).toEqual(404);
    });
  });
});
