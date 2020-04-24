const request = require("supertest");
const server = require("./server.js");

require("dotenv").config();

describe("server", function () {
   let token = "";
   let username = "";
   describe("POST /api/auth/register", function () {
      it("Should register account", async function () {
         username = "testuser" + Math.random() * 1000;
         await request(server)
            .post("/api/auth/register")
            .send({ username, password: "password" })
            .then((res) => {
               expect(res.status).toBe(201);
               expect(res.body.message).toBe("User created!");
               expect(res.body.user.id).toBeDefined();
            });
      });

      it("Should not register account without password", async function () {
         let generatedUsername = "testuser" + Math.random() * 1000;
         await request(server)
            .post("/api/auth/register")
            .send({ username: generatedUsername })
            .then((res) => {
               expect(res.status).toBe(400);
            });
      });
   });

   describe("POST /api/auth/login", function () {
      it("Should log in account with correct credentials", async function () {
         await request(server)
            .post("/api/auth/login")
            .send({ username, password: "password" })
            .then((res) => {
               expect(res.body.message).toBe(
                  "Password approved, logging you in."
               );
               expect(res.body.token).toBeDefined();
               token = res.body.token;
            });
      });

      it("Should not log in account with incorrect credentials", async function () {
         await request(server)
            .post("/api/auth/login")
            .send({ username, password: "wrongpassword" })
            .then((res) => {
               expect(res.status).toBe(401);
            });
      });
   });

   describe("GET /api/jokes", function () {
      it("should return 401 when accessing jokes without token", function () {
         return request(server)
            .get("/api/jokes")
            .then((res) => {
               expect(res.status).toBe(401);
            });
      });
      it("should return 200 and list of jokes when accessing jokes with token", function () {
         return request(server)
            .get("/api/jokes")
            .set("Authorization", token)
            .then((res) => {
               expect(res.status).toBe(200);
               expect(res.body.length).toBeGreaterThan(0);
            });
      });
   });
});
