package handlers

import (
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

	decryptedUsername, err := utils.Decrypt(user.Username)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Error decrypting username"})
	}

	decryptedUsernamePtr := &decryptedUsername

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"user": fiber.Map{
			"username": *decryptedUsernamePtr,
			"email":    user.Email,
			"role":     user.Role,
		},
	})

}
