package router

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/healthcheck"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/sandbox-science/online-learning-platform/internal/handlers"
)

var (
	limitedCtx    = map[string]context.Context{}
	limitedCancel = map[string]context.CancelFunc{}
)

func limiterNext(c *fiber.Ctx) bool {
	if ctx, ok := limitedCtx[c.IP()]; ok {
		select {
		case <-ctx.Done():
			limitedCancel[c.IP()]()
			delete(limitedCancel, c.IP())
			delete(limitedCtx, c.IP())
			return true
		default:
			return false
		}
	}
	return false
}

func limiterReached(c *fiber.Ctx) error {
	if _, ok := limitedCtx[c.IP()]; ok {
		return c.SendStatus(fiber.StatusTooManyRequests)
	}
	limitedCtx[c.IP()], limitedCancel[c.IP()] = context.WithTimeout(context.Background(), 1*time.Hour)
	return c.SendStatus(fiber.StatusTooManyRequests)
}

func SetupRoutes(app *fiber.App) {
	// Rate limiter middleware
	app.Use(limiter.New(limiter.Config{
		Max:          3000,
		Expiration:   1 * time.Hour,
		Next:         limiterNext,
		LimitReached: limiterReached,
	}))

	// Enable CORS for all routes
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Simple hello world test
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, Dominguez Hills!")
	})

	// Add healthcheck middleware for /livez and /readyz
	app.Use(healthcheck.New(healthcheck.Config{}))

	// Custom health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "OK"})
	})

	// Define routes
	app.Post("/register", handlers.Register)
	app.Post("/login", handlers.Login)
	app.Delete("/delete", handlers.Delete)
	app.Get("/user/:user_id", handlers.User)

	// Routes for updating user information
	app.Put("/update-username", handlers.UpdateUsername) // Update username
	app.Put("/update-email", handlers.UpdateEmail)       // Update email with confirmation
	app.Put("/update-password", handlers.UpdatePassword) // Update password and log user off after

	// Routes for courses
	app.Get("/courses/:user_id", handlers.Courses)
	app.Get("/course/:course_id", handlers.Course)
	app.Get("/course/", handlers.Course)
	app.Get("/modules/:course_id", handlers.Modules)
	app.Get("/content/:content_id", handlers.Content)
	app.Get("/all-content/:module_id", handlers.AllContent)
	app.Post("/create-course/:creator_id", handlers.CreateCourse)
	app.Post("/create-module/:creator_id/:course_id", handlers.CreateModule)
	app.Post("/create-content/:creator_id/:module_id", handlers.CreateContent)
	app.Post("/delete-file/:creator_id/:content_id", handlers.DeleteFile)
	app.Post("/edit-content/:creator_id/:content_id", handlers.EditContent)
	app.Post("/edit-thumbnail/:creator_id/:course_id", handlers.EditThumbnail)
	app.Get("/is-enrolled/:user_id/:course_id", handlers.IsEnrolled)
	app.Post("/enroll/:user_id/:course_id", handlers.Enroll)
	app.Delete("/unenroll/:user_id/:course_id", handlers.Unenroll)
}
