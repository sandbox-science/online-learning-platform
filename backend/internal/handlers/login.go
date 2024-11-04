package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sandbox-science/online-learning-platform/configs/database"
	"github.com/sandbox-science/online-learning-platform/internal/entity"
	"github.com/sandbox-science/online-learning-platform/internal/utils"
)

// Login auths a user by checking email and password, and generate a token
func Login(c *fiber.Ctx) error {
	var data entity.Login

	if err := c.BodyParser(&data); err != nil {

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid input"})
	}

	var user entity.Account

	// Check if email exist
	if err := database.DB.Where("email = ?", data.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "There is no account with this email. Please register."})
	}

	// Check if the password matches
	if err := utils.CheckPasswordHash(data.Password, user.Password); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "Incorrect password"})
	}

	// Generate token upon successful login
	token, err := utils.GenerateJWT(user.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Could not generate token"})
	}

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"token":   token,
		"user":    user,
	})
}
