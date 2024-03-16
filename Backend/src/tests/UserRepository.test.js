const { connectToPostgreSQL } = require('../config/pgConfig');
const { connectToSequelize } = require('../config/sequelizeConfig');
const { User } = require("../Models");
const UserRepository = require("../repositories/UserRepository");

describe("UserRepository", () => {
  beforeAll(async () => {
    await connectToPostgreSQL();
    console.log("connected to postgreSQL");
    await connectToSequelize();
    console.log("connected to sequelize");
  });

  describe("registerUser", () => {
    it("should register a new user", async () => {
      const user1 = {
        email: "user1@gmail.com",
        nickname: "user1",
        age: 25,
        country: "USA",
        gender: "male"
      };

      await expect(UserRepository.getUser(user1.email)).rejects.toThrow();

      const registeredUser = await UserRepository.registerUser(user1);

      await expect(registeredUser).toBeInstanceOf(User);
      await expect(registeredUser.email).toBe(user1.email);
    });

  });

  describe("authenticateUser", () => {
    it("should authenticate a user with valid email", async () => {

    });
  });

});
