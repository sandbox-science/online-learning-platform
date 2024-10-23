package handlers

import (
	"encoding/base64"
	"os"

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

	// Validate input
	if data["password"] != data["confirm_password"] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Passwords do not match"})
	}

	// Generate encryption key
	var key [32]byte
	keyString := os.Getenv("CRYPTO_KEY")
	decodedKey, err := base64.StdEncoding.DecodeString(keyString)
	if err != nil || len(decodedKey) != 32 {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "ENCRYPTION_KEY must be a valid Base64-encoded string of 32 bytes"})
	}
	copy(key[:], decodedKey) // Copy the decoded key to the key variable

	encryptedUsername, err := utils.Encrypt(data["username"], key)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error encrypting username"})
	}

	// Create user account
	user := entity.Account{
		Username: encryptedUsername,
		Email:    data["email"],
		Password: data["password"],
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
