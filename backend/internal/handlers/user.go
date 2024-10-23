package handlers

import (
	"encoding/base64"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/sandbox-science/online-learning-platform/configs/database"
	"github.com/sandbox-science/online-learning-platform/internal/entity"
	"github.com/sandbox-science/online-learning-platform/internal/utils"
)

// User function retrieves user information based on user_id from the URL
func User(c *fiber.Ctx) error {
	userID := c.Params("user_id")

	var user entity.Account
	// Check if the user exists
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	var key [32]byte
	keyString := os.Getenv("CRYPTO_KEY")
	decodedKey, err := base64.StdEncoding.DecodeString(keyString)
	if err != nil || len(decodedKey) != 32 {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "CRYPTO_KEY must be a valid Base64-encoded string of 32 bytes"})
	}
	copy(key[:], decodedKey)

	decryptedUsername, err := utils.Decrypt(user.Username, key)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error decrypting username"})
	}

	var decryptedUsernamePtr *string
	decryptedUsernamePtr = &decryptedUsername

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"user": fiber.Map{
			"username": *decryptedUsernamePtr,
			"email":    user.Email,
		},
	})

}
