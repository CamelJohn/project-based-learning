import supertest from "supertest";
import { Server } from "../index";

describe("Server", () => {
  let webServer: Awaited<ReturnType<typeof Server>>;

  beforeAll(async () => {
    webServer = await Server({ test: true });
  });
  afterEach(() => webServer.close());

  describe("GET => /health", () => {
    it("should return status 200", async () => {
      const response = await supertest(webServer).get("/health");
      expect(response.statusCode).toEqual(200);
      webServer.close();
    });

    it("should return text Ok", async () => {
      const response = await supertest(webServer).get("/health");
      expect(response.body).toEqual("Ok");
      webServer.close();
    });
  });

  describe("any METHOD => 'unknown_route'", () => {
    it("should return status 404", async () => {
      const response = await supertest(webServer).get("/smuckini");
      expect(response.statusCode).toEqual(404);
      webServer.close();
    });

    it("should return a Not-Found Error", async () => {
      const response = await supertest(webServer).get("/smuckini");
      expect(response.body.message).toEqual(
        "the route you are looking for does not exist."
      );
      webServer.close();
    });
  });
});
