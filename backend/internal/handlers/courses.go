package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sandbox-science/online-learning-platform/configs/database"
	"github.com/sandbox-science/online-learning-platform/internal/entity"
)

// Courses function retrieves enrolled course titles and descriptions based on user_id from the URL
func Courses(c *fiber.Ctx) error {
	
	userID := c.Params("user_id")

	var user entity.Account
	// Check if the user exists
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}
	
	var courses []entity.Course
	// Get all courses that user is enrolled in
	if err := database.DB.Model(&entity.Course{}).Where("id IN (?)", database.DB.Table("enrollment").Select("course_id").Where("account_id = ?", userID)).Find(&courses).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	if len(courses) == 0{
		return c.JSON(fiber.Map{
			"message": "Not enrolled in any courses",
			"courses": courses,
		})
	}

	return c.JSON(fiber.Map{
		"message": "Courses successfully retrieved",
		"courses": courses,
	})

}
