import supertest from "supertest";
import { Server } from "../../../server";
import {
  aMalformedUserRequest,
  aValidLoginUserRequest,
  aValidRegisterUserRequest,
} from "./generators";

describe("[Auth]", () => {
  let webServer: Awaited<ReturnType<typeof Server>>;
  let http: ReturnType<typeof supertest>;

  beforeAll(async () => {
    webServer = await Server({ test: true });
    http = supertest(webServer);
  });

  afterEach(() => webServer.close());

  describe("{Login}", () => {
    it("should throw a Bad Request Error with status 400, for malformed request", async () => {
      const response = await http
        .post("/api/v1/auth/login")
        .send(aMalformedUserRequest({}))
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      expect(response.statusCode).toBe(400);
    });

    it("should return status 200, for valid request", async () => {
      const response = await http
        .post("/api/v1/auth/login")
        .send(aValidLoginUserRequest({}))
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      const [cookies] = response.headers["set-cookie"];

      expect(response.statusCode).toBe(200);
      expect(cookies.split("=; ")).toContain("auth-token");
    });

    it.todo(
      "should retrun an Unauthorized Error with status 401 for invalid credentials"
    );
  });

  describe("{Regiter}", () => {
    it("should throw a Bad Request Error with status 400, for malformed request", async () => {
      const response = await http
        .post("/api/v1/auth/register")
        .send(aMalformedUserRequest({}))
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      expect(response.statusCode).toBe(400);
    });

    it("should return status 201, for valid request & 409 for duplicate user", async () => {
      const response = await http
        .post("/api/v1/auth/register")
        .send(aValidRegisterUserRequest({}))
        .set("Accept", "application/json")
        .set("Content-Type", "application/json");

      if (response.statusCode === 201) {
        const cookies = response.headers["set-cookie"];
        expect(response.statusCode).toBe(201);
        expect(cookies.split("=; ")).toContain("auth-token");
      } else {
        expect(response.statusCode).toBe(409);
      }
    });
  });
});
