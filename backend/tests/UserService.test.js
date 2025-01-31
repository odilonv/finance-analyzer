import { jest } from "@jest/globals";
import { UserService } from "../services/users/userService.js";
import DatabaseConnection from "../models/DatabaseConnection.js";
import bcrypt from 'bcrypt';
import User from "../models/User.js";

jest.mock("../models/DatabaseConnection.js");
jest.mock("bcrypt");
jest.mock("../models/User.js");

describe("UserService", () => {
    let mockConnection;

    beforeEach(() => {
        mockConnection = {
            query: jest.fn(),
        };
        DatabaseConnection.getInstance.mockResolvedValue(mockConnection);
    });

    test("createUser should create a new user and return it", async () => {
        const hashedPassword = 'hashedPassword';
        bcrypt.hash.mockResolvedValue(hashedPassword);

        mockConnection.query
            .mockResolvedValueOnce([{ insertId: 1 }]);

        const user = await UserService.createUser("John", "Doe", "john.doe@example.com", "password");

        expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
        expect(mockConnection.query).toHaveBeenCalledWith(
            "INSERT INTO user (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
            ["John", "Doe", "john.doe@example.com", hashedPassword]
        );

        expect(mockConnection.query).toHaveBeenCalledWith("SELECT LAST_INSERT_ID() as id");
        expect(user).toEqual({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: hashedPassword,
            id: 1,
        });
    });

    test("loginUser should return user if password matches", async () => {
        const userData = {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "hashedPassword",
        };
    
        bcrypt.compare.mockResolvedValue(true);  // Mock de bcrypt.compare qui retourne 'true'
    
        mockConnection.query.mockResolvedValueOnce([userData]);
    
        const user = await UserService.loginUser("john.doe@example.com", "password");
    
        expect(mockConnection.query).toHaveBeenCalledWith("SELECT * FROM user WHERE email = ?", ["john.doe@example.com"]);
        expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");  // Vérifie que bcrypt.compare a bien été appelé
        expect(user).toEqual(User.fromDatabase(userData));
    });
    
    test("loginUser should return null if password does not match", async () => {
        const userData = {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "hashedPassword",
        };
    
        bcrypt.compare.mockResolvedValue(false);
    
        mockConnection.query.mockResolvedValueOnce([userData]);
    
        const user = await UserService.loginUser("john.doe@example.com", "wrongPassword");
    
        expect(mockConnection.query).toHaveBeenCalledWith("SELECT * FROM user WHERE email = ?", ["john.doe@example.com"]);
        expect(bcrypt.compare).toHaveBeenCalledWith("wrongPassword", "hashedPassword");
        expect(user).toBeNull();
    });
    

    test("deleteUser should delete the user and return true if deleted", async () => {
        mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const result = await UserService.deleteUser(1);

        expect(mockConnection.query).toHaveBeenCalledWith(
            "DELETE FROM user WHERE id = ?", [1]
        );

        expect(result).toBe(true);
    });

    test("deleteUser should return false if no user was deleted", async () => {
        mockConnection.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        const result = await UserService.deleteUser(999);

        expect(mockConnection.query).toHaveBeenCalledWith(
            "DELETE FROM user WHERE id = ?", [999]
        );

        expect(result).toBe(false);
    });

    test("getUserById should return a user if found", async () => {
        const mockUser = { id: 1, firstName: "John", lastName: "Doe", email: "john.doe@example.com" };

        mockConnection.query.mockResolvedValueOnce([[mockUser]]);
        jest.spyOn(User, "fromDatabase").mockReturnValue(mockUser);

        const result = await UserService.getUserById(1);

        expect(mockConnection.query).toHaveBeenCalledWith("SELECT * FROM user WHERE id = ?", [1]);
        expect(result).toEqual(mockUser);
    });

    test("getUserById should return null if no user found", async () => {
        mockConnection.query.mockResolvedValueOnce([[]]);

        const result = await UserService.getUserById(1);

        expect(mockConnection.query).toHaveBeenCalledWith("SELECT * FROM user WHERE id = ?", [1]);
        expect(result).toBeNull();
    });
});
