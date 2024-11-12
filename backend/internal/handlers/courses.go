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
	
	user_id := c.Params("user_id")

	var user entity.Account
	// Check if the user exists
	if err := database.DB.Where("id = ?", user_id).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}
	
	var courses []entity.Course
	// Get all courses that user is enrolled in
	if err := database.DB.Model(&entity.Course{}).Where("id IN (?)", database.DB.Table("enrollment").Select("course_id").Where("account_id = ?", user_id)).Find(&courses).Error; err != nil {
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

// Course function retrieves an indiviudal course from its id
func Course(c *fiber.Ctx) error {
	
	course_id := c.Params("course_id")

	var course entity.Course
	// Check if the course exists
	if err := database.DB.Preload("Students").Preload("Modules").Preload("Modules.Content").Preload("Tags").Where("id = ?", course_id).First(&course).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Course not found"})
	}

	return c.JSON(fiber.Map{
		"message": "Course successfully retrieved",
		"course": course,
	})

}

// Modules function retrieves the modules of a course
func Modules(c *fiber.Ctx) error {
	
	course_id := c.Params("course_id")

	var modules []entity.Module
	// Check if the course exists
	if err := database.DB.Preload("Content").Where("course_id = ?", course_id).Find(&modules).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Course not found"})
	}

	if len(modules) == 0{
		return c.JSON(fiber.Map{
			"message": "No modules in course",
			"modules": modules,
		})
	}

	return c.JSON(fiber.Map{
		"message": "Modules successfully retrieved",
		"modules": modules,
	})

}

// Content function retrieves the content of a module
func Content(c *fiber.Ctx) error {
	
	module_id := c.Params("module_id")

	var module entity.Module
	// Check if the module exists
	if err := database.DB.Preload("Content").Where("id = ?", module_id).First(&module).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Module not found"})
	}
	
	var content = module.Content

	if len(content) == 0{
		return c.JSON(fiber.Map{
			"message": "No content in module",
			"content": [] string{},
		})
	}

	return c.JSON(fiber.Map{
		"message": "Content successfully retrieved",
		"content": content,
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
	
	user_id := c.Params("user_id")
	course_id := c.Params("course_id")
	
	var user entity.Account
	// Check if the user exists
	if err := database.DB.Where("id = ?", user_id).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}
	
	var course entity.Course
	// Check if the course exists
	if err := database.DB.Where("id = ?", course_id).First(&course).Error; err != nil {
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

// Create a module inside a course
func CreateModule(c *fiber.Ctx) error {
	
	creator_id,err := strconv.Atoi(c.Params("creator_id"))
	if err != nil{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid creator_id"})
	}

	course_id,err := strconv.Atoi(c.Params("course_id"))
	if err != nil{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid course_id"})
	}

	var data map[string]string;
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	var course entity.Course
	// Check if the course exists
	if err := database.DB.Where("id = ?", course_id).First(&course).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Course not found"})
	}
	//Verify that the account attempting to create a module is the creator of the course
	if course.CreatorID != creator_id{
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User is not the course creator"})
	}

	// Create module
	module := entity.Module{
		Title: data["title"],
		Course: course,
	}

	// Add module to database
	if err := database.DB.Create(&module).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "Module created successfully",
		"module":    module,
	})
}

// Create content inside a module
func CreateContent(c *fiber.Ctx) error {
	
	creator_id,err := strconv.Atoi(c.Params("creator_id"))
	if err != nil{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid creator_id"})
	}

	module_id,err := strconv.Atoi(c.Params("module_id"))
	if err != nil{
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid module_id"})
	}

	var data map[string]string;
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	var module entity.Module
	// Check if the module exists
	if err := database.DB.Preload("Course").Where("id = ?", module_id).First(&module).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Module not found"})
	}
	//Verify that the account attempting to create content is the creator of the course
	if module.Course.CreatorID != creator_id{
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User is not the course creator"})
	}

	// Create content
	content := entity.Content{
		Title: data["title"],
		Module: module,
	}
	content.Path = fmt.Sprintf("content/%d/%d", module.Course.ID, content.ID)

	// Add content to database
	if err := database.DB.Create(&content).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "Content created successfully",
		"content":    content,
	})
}