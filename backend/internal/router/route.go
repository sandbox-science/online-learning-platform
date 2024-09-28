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
		return c.SendString("Hello, World!")
	})

	// Add healthcheck middleware for /livez and /readyz
	app.Use(healthcheck.New(healthcheck.Config{}))

	// Custom health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "OK"})
	})

	// Define route for user registration
	app.Post("/register", handlers.Register)
}
