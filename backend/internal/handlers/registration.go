package handlers

import (
	"log"

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
		Username:      encryptedUsername,
		Email:         data["email"],
		Password:      data["password"],
		Role:          data["role"],
		EmailVerified: false,
	}

	// Hash password

	if err := utils.HashPassword(&user); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Couldn't hash password"})
	}

	// Add user to database

	if err := database.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	// Trigger email verification asynchronously

	go func(email string, userID uint) {

		status, err := utils.VerifyEmailWithZeroBounce(email)
		if err != nil {
			log.Printf("[ERROR] Failed to verify email for user ID %d (%s): %v\n", userID, email, err)
			return
		}

		if status == "valid" {
			// Update EmailVerified to true
			if err := database.DB.Model(&entity.Account{}).Where("id = ?", userID).Update("EmailVerified", true).Error; err != nil {
				log.Printf("[ERROR] Failed to update EmailVerified for user ID %d (%s): %v\n", userID, email, err)
			} else {
				log.Printf("[INFO] Email verified successfully for user ID %d (%s)\n", userID, email)
			}
		} else {
			log.Printf("[WARN] Invalid email detected for user ID %d (%s): %s\n", userID, email, status)
		}
	}(user.Email, user.ID)

	return c.JSON(fiber.Map{
		"message": "User registered successfully",
		"user":    user,
	})
}
