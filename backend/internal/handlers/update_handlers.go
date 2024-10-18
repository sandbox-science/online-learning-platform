package handlers

import (
    "github.com/gofiber/fiber/v2"
    "github.com/sandbox-science/online-learning-platform/configs/database"
    "github.com/sandbox-science/online-learning-platform/internal/entity"
    "github.com/sandbox-science/online-learning-platform/internal/utils"
)

// UpdateUsername updates a user's username
func UpdateUsername(c *fiber.Ctx) error {
    var data map[string]string

    if err := c.BodyParser(&data); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid input"})
    }

    userID := data["user_id"]
    username := data["username"]

    var user entity.Account
    if err := database.DB.First(&user, userID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "User not found"})
    }

    user.Username = username
    if err := database.DB.Save(&user).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Couldn't update username"})
    }

    return c.JSON(fiber.Map{"message": "Username updated successfully"})
}

// UpdateEmail updates a user's email
func UpdateEmail(c *fiber.Ctx) error {
    var data map[string]string

    if err := c.BodyParser(&data); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid input"})
    }

    userID := data["user_id"]
    email := data["email"]
    confirmEmail := data["confirm_email"]

    if email != confirmEmail {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Emails do not match"})
    }

    var user entity.Account
    if err := database.DB.First(&user, userID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "User not found"})
    }

    user.Email = email
    if err := database.DB.Save(&user).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Couldn't update email"})
    }

    return c.JSON(fiber.Map{"message": "Email updated successfully"})
}

// UpdatePassword updates a user's password and logs them out
func UpdatePassword(c *fiber.Ctx) error {
    var data map[string]string

    if err := c.BodyParser(&data); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Invalid input"})
    }

    userID := data["user_id"]
    password := data["password"]
    confirmPassword := data["confirm_password"]

    if password != confirmPassword {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Passwords do not match"})
    }

    var user entity.Account
    if err := database.DB.First(&user, userID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "User not found"})
    }

    hashedPassword, err := utils.HashPassword(password)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Couldn't hash password"})
    }

    user.Password = hashedPassword
    if err := database.DB.Save(&user).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Couldn't update password"})
    }

    // Log out logic can be added here

    return c.JSON(fiber.Map{"message": "Password updated successfully"})
}
