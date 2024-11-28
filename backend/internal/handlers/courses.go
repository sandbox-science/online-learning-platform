package handlers

import (
	"fmt"
	"os"
	"strconv"
	"strings"

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
	if user.Role == "educator" {
		if err := database.DB.Model(&entity.Course{}).Where("creator_id = ?", user_id).Find(&courses).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Error retrieving courses"})
		}
	} else {
		if err := database.DB.Model(&entity.Course{}).Where("id IN (?)", database.DB.Table("enrollment").Select("course_id").Where("account_id = ?", user_id)).Find(&courses).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Error retrieving courses"})
		}
	}

	if len(courses) == 0 {
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
	courseID := c.Params("course_id")

	var courses []entity.Course
	var course entity.Course

	if courseID != "" {
		// Check if the specific course exists
		if err := database.DB.
			Preload("Students").
			Preload("Modules").
			Preload("Modules.Content").
			Preload("Tags").
			Where("id = ?", courseID).
			First(&course).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Course not found"})
		}

		// Return the specific course
		return c.JSON(fiber.Map{
			"message": "Course successfully retrieved",
			"course":  course,
		})
	} else {
		// Load all courses
		if err := database.DB.
			Preload("Students").
			Preload("Modules").
			Preload("Modules.Content").
			Preload("Tags").
			Find(&courses).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not load courses"})
		}

		// Return all courses
		return c.JSON(fiber.Map{
			"message": "All courses successfully retrieved",
			"courses": courses,
		})
	}
}

// Modules function retrieves the modules of a course
func Modules(c *fiber.Ctx) error {
	course_id := c.Params("course_id")

	var modules []entity.Module
	// Check if the course exists
	if err := database.DB.Preload("Content").Where("course_id = ?", course_id).Find(&modules).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Course not found"})
	}

	if len(modules) == 0 {
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

// AllContent function retrieves the content of a module
func AllContent(c *fiber.Ctx) error {
	module_id := c.Params("module_id")

	var module entity.Module
	// Check if the module exists
	if err := database.DB.Preload("Content").Where("id = ?", module_id).First(&module).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Module not found"})
	}

	var content = module.Content

	if len(content) == 0 {
		return c.JSON(fiber.Map{
			"message": "No content in module",
			"content": []string{},
		})
	}

	return c.JSON(fiber.Map{
		"message": "Content successfully retrieved",
		"content": content,
	})
}

// Content function retrieves a single peice of content by id
func Content(c *fiber.Ctx) error {
	content_id := c.Params("content_id")

	var content entity.Content
	// Check if the module exists
	if err := database.DB.Where("id = ?", content_id).First(&content).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Content not found"})
	}

	return c.JSON(fiber.Map{
		"message": "Content successfully retrieved",
		"content": content,
	})
}

// CreateCourse creates a course and adds it to the database.
func CreateCourse(c *fiber.Ctx) error {
	creator_id, err := strconv.Atoi(c.Params("creator_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid creator_id"})
	}

	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	//Verify that the account attempting to create a course is an educator
	var role string
	if err := database.DB.Model(&entity.Account{}).Select("role").Where("id = ?", creator_id).First(&role).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	if role != "educator" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User is not an educator"})
	}

	// Create course
	course := entity.Course{
		Title:       data["title"],
		Description: data["description"],
		CreatorID:   creator_id,
	}

	// Add course to database
	if err := database.DB.Create(&course).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "Course created successfully",
		"course":  course,
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
	creator_id, err := strconv.Atoi(c.Params("creator_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid creator_id"})
	}

	course_id, err := strconv.Atoi(c.Params("course_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid course_id"})
	}

	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	var course entity.Course
	// Check if the course exists
	if err := database.DB.Where("id = ?", course_id).First(&course).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Course not found"})
	}

	//Verify that the account attempting to create a module is the creator of the course
	if course.CreatorID != creator_id {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User is not the course creator"})
	}

	// Create module
	module := entity.Module{
		Title:  data["title"],
		Course: course,
	}

	// Add module to database
	if err := database.DB.Create(&module).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "Module created successfully",
		"module":  module,
	})
}

// Create content inside a module
func CreateContent(c *fiber.Ctx) error {
	creator_id, err := strconv.Atoi(c.Params("creator_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid creator_id"})
	}

	module_id, err := strconv.Atoi(c.Params("module_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid module_id"})
	}

	title := c.FormValue("title")
	if title == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	var module entity.Module
	// Check if the module exists
	if err := database.DB.Preload("Course").Where("id = ?", module_id).First(&module).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Module not found"})
	}

	//Verify that the account attempting to create content is the creator of the course
	if module.Course.CreatorID != creator_id {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User is not the course creator"})
	}

	// Create content database entry
	content := entity.Content{
		Title:  title,
		Module: module,
	}

	// Create content entry
	if err := database.DB.Create(&content).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "Content created successfully",
		"content": content,
	})
}

// Edit content inside a module
func EditContent(c *fiber.Ctx) error {
	creator_id, err := strconv.Atoi(c.Params("creator_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid creator_id"})
	}

	content_id, err := strconv.Atoi(c.Params("content_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid content_id"})
	}

	var content entity.Content
	// Check if the content exists
	if err := database.DB.Model(entity.Content{}).Preload("Module.Course").Where("id = ?", content_id).First(&content).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Course not found"})
	}

	module := content.Module
	//Verify that the account attempting to edit is the creator of the course
	if module.Course.CreatorID != creator_id {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User is not the course creator"})
	}

	title := c.FormValue("title")
	if title != "" {
		if err := database.DB.Model(&content).Update("title", title).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}
	}

	body := c.FormValue("body")
	if body != "" {
		if err := database.DB.Model(&content).Update("body", body).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}
	}

	file, err := c.FormFile("file")
	if err != nil {
		if err.Error() != "there is no uploaded file associated with the given key" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid file"})
		}
	}

	if file != nil {
		var fileExtension = file.Filename[strings.LastIndex(file.Filename, "."):]

		if err := os.MkdirAll(fmt.Sprintf("./content/%d/", module.Course.ID), 0777); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}

		path := fmt.Sprintf("/%d/%s", module.Course.ID, strconv.FormatUint(uint64(content.ID), 10)+fileExtension)

		//Remove previous attachment if there is one
		if _, err := os.Stat("./content" + path); err == nil {
			if err := os.Remove("./content" + path); err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
			}
		} else if !os.IsNotExist(err){
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}

		if err := c.SaveFile(file, "./content"+path); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}

		// Add the path
		if err := database.DB.Model(&content).Update("path", path).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}

		// Add the type
		filetype := file.Header.Get("Content-Type")
		if err := database.DB.Model(&content).Update("type", filetype).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}
	}

	return c.JSON(fiber.Map{
		"message": "Successfully updated content",
	})
}

// Delete file from content
func DeleteFile(c *fiber.Ctx) error {
	creator_id, err := strconv.Atoi(c.Params("creator_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid creator_id"})
	}

	content_id, err := strconv.Atoi(c.Params("content_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid content_id"})
	}

	var content entity.Content
	// Check if the content exists
	if err := database.DB.Model(entity.Content{}).Preload("Module.Course").Where("id = ?", content_id).First(&content).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Course not found"})
	}

	module := content.Module
	//Verify that the account attempting to edit is the creator of the course
	if module.Course.CreatorID != creator_id {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User is not the course creator"})
	}

	//Delete file
	if _, err := os.Stat("./content" + content.Path); err == nil {
		if err := os.Remove("./content" + content.Path); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}
	} else {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	//Update database entry
	if err := database.DB.Model(&content).Update("path", "").Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
	}

	return c.JSON(fiber.Map{
		"message": "Successfully deleted file",
	})
}

// Edit thumbnail of course
func EditThumbnail(c *fiber.Ctx) error {
	creator_id, err := strconv.Atoi(c.Params("creator_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid creator_id"})
	}

	course_id, err := strconv.Atoi(c.Params("course_id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid course_id"})
	}

	var course entity.Course
	// Check if the course exists
	if err := database.DB.Where("id = ?", course_id).First(&course).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Course not found"})
	}

	//Verify that the account attempting to create a module is the creator of the course
	if course.CreatorID != creator_id {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User is not the course creator"})
	}

	file, err := c.FormFile("file")
	if err != nil {
		if err.Error() != "there is no uploaded file associated with the given key" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid file"})
		}
	}

	if file != nil {
		if err := os.MkdirAll(fmt.Sprintf("./content/%d/", course_id), 0777); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}

		//Remove previous attachment if there is one
		if _, err := os.Stat(fmt.Sprintf("./content/%d/thumbnail.png", course_id)); err == nil {
			if err := os.Remove(fmt.Sprintf("./content/%d/thumbnail.png", course_id)); err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
			}
		} else if !os.IsNotExist(err){
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}

		if err := c.SaveFile(file, fmt.Sprintf("./content/%d/thumbnail.png", course_id)); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": err.Error()})
		}
	}

	return c.JSON(fiber.Map{
		"message": "Successfully updated thumbnail",
	})
}
