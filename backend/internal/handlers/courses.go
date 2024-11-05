package handlers

import (
	"fmt"
	"strconv"

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
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Error retrieving courses"})
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

// CreateCourse creates a course and adds it to the database.
func CreateCourse(c *fiber.Ctx) error {
	
	creator_id,err := strconv.Atoi(c.Params("creator_id"))
	if err != nil{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid creator_id"})
	}

	var data map[string]string;
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	//Verify that the account attempting to create a course is an educator
	var role string;
	if err := database.DB.Model(&entity.Account{}).Select("role").Where("id = ?", creator_id).First(&role).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}
	if role != "educator"{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User is not an educator"})
	}

	// Create course
	course := entity.Course{
		Title: data["title"],
		Description: data["description"],
		CreatorID: creator_id,
	}

	// Add course to database
	if err := database.DB.Create(&course).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "Course created successfully",
		"course":    course,
	})
}

// Enroll user into course
func Enroll(c *fiber.Ctx) error {
	
	userID := c.Params("user_id")
	courseID := c.Params("course_id")
	
	var user entity.Account
	// Check if the user exists
	if err := database.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}
	
	var course entity.Course
	// Check if the course exists
	if err := database.DB.Where("id = ?", courseID).First(&course).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Course not found"})
	}

	// Enroll user into course
	if err := database.DB.Model(&user).Association("Courses").Append(&course); err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Error enrolling into course"})
	}

	return c.JSON(fiber.Map{
		"message": fmt.Sprintf("Successfully enrolled user id %d in course %s", user.ID, course.Title),
	})

}