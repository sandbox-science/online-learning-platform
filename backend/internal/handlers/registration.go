package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sandbox-science/online-learning-platform/configs/database"
	"github.com/sandbox-science/online-learning-platform/internal/entity"
	"github.com/sandbox-science/online-learning-platform/internal/utils"
)

// Register creates a new user and adds it to the database.
func Register(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid input"})
	}

	// Validate Role
	if data["role"] != "student" && data["role"] != "educator" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid role: must be student or educator"})
	}

	// Validate input
	if data["password"] != data["confirm_password"] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Passwords do not match"})
	}

	// Encypt username
	encryptedUsername, err := utils.Encrypt(data["username"])
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error encrypting username"})
	}

	// Create user account
	user := entity.Account{
		Username: encryptedUsername,
		Email:    data["email"],
		Password: data["password"],
		Role:     data["role"],
	}

	// Hash password
	if err := utils.HashPassword(&user); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Couldn't hash password"})
	}

	// Add user to database
	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "User registered successfully",
		"user":    user,
	})
}
