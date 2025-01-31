import { jest } from "@jest/globals";
import { UserService } from "../services/users/userService.js";
import DatabaseConnection from "../models/DatabaseConnection.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

jest.mock("../models/DatabaseConnection.js");
jest.mock("bcrypt");

describe("UserService", () => {
    let mockConnection;

    beforeEach(() => {
        mockConnection = {
            query: jest.fn(),
        };
        DatabaseConnection.getInstance.mockResolvedValue(mockConnection);
    });

    test("createUser should insert a new user and return the user with an ID", async () => {
        const mockUser = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "hashedPassword",
        };

        bcrypt.hash.mockResolvedValueOnce("hashedPassword");
        mockConnection.query
            .mockResolvedValueOnce([{ insertId: 1 }]) // Simulate the INSERT query
            .mockResolvedValueOnce([[{ id: 1 }]]); // Simulate the SELECT LAST_INSERT_ID() query

        const newUser = await UserService.createUser(
            mockUser.firstName,
            mockUser.lastName,
            mockUser.email,
            "password123"
        );

        expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
        expect(mockConnection.query).toHaveBeenCalledWith(
            "INSERT INTO user (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
            [mockUser.firstName, mockUser.lastName, mockUser.email, "hashedPassword"]
        );
        expect(mockConnection.query).toHaveBeenCalledWith("SELECT LAST_INSERT_ID() as id");
        expect(newUser).toEqual({
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "hashedPassword",
        });
    });

    test("loginUser should return a user if email and password match", async () => {
        const mockUser = {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "hashedPassword",
        };

        mockConnection.query.mockResolvedValueOnce([[mockUser]]);
        bcrypt.compare.mockResolvedValueOnce(true);
        jest.spyOn(User, "fromDatabase").mockReturnValue(mockUser);

        const user = await UserService.loginUser("john.doe@example.com", "password123");

        expect(mockConnection.query).toHaveBeenCalledWith(
            "SELECT * FROM user WHERE email = ?",
            ["john.doe@example.com"]
        );
        expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
        expect(user).toEqual(mockUser);
    });

    test("loginUser should return null if email or password does not match", async () => {
        mockConnection.query.mockResolvedValueOnce([[]]); // No user found
        bcrypt.compare.mockResolvedValueOnce(false);

        const user = await UserService.loginUser("john.doe@example.com", "wrongPassword");

        expect(mockConnection.query).toHaveBeenCalledWith(
            "SELECT * FROM user WHERE email = ?",
            ["john.doe@example.com"]
        );
        expect(user).toBeNull();
    });

    test("deleteUser should remove a user and return true if deleted", async () => {
        mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const result = await UserService.deleteUser(1);

        expect(mockConnection.query).toHaveBeenCalledWith(
            "DELETE FROM user WHERE id = ?",
            [1]
        );
        expect(result).toBe(true);
    });

    test("deleteUser should return false if no user was deleted", async () => {
        mockConnection.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        const result = await UserService.deleteUser(1);

        expect(mockConnection.query).toHaveBeenCalledWith(
            "DELETE FROM user WHERE id = ?",
            [1]
        );
        expect(result).toBe(false);
    });

    test("getUserById should return a user if found", async () => {
        const mockUser = {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "hashedPassword",
        };

        mockConnection.query.mockResolvedValueOnce([[mockUser]]);
        jest.spyOn(User, "fromDatabase").mockReturnValue(mockUser);

        const user = await UserService.getUserById(1);

        expect(mockConnection.query).toHaveBeenCalledWith(
            "SELECT * FROM user WHERE id = ?",
            [1]
        );
        expect(user).toEqual(mockUser);
    });

    test("getUserById should return null if no user is found", async () => {
        mockConnection.query.mockResolvedValueOnce([[]]);

        const user = await UserService.getUserById(1);

        expect(mockConnection.query).toHaveBeenCalledWith(
            "SELECT * FROM user WHERE id = ?",
            [1]
        );
        expect(user).toBeNull();
    });
});