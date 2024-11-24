package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	configs "github.com/sandbox-science/online-learning-platform/configs/database"
	"github.com/sandbox-science/online-learning-platform/internal/entity"
	"github.com/sandbox-science/online-learning-platform/internal/router"
	"gorm.io/gorm"
)

// initServer initializes the server and returns the Fiber server and the initialized database connection.
func initServer() (*fiber.App, *gorm.DB, error) {
	app := fiber.New(fiber.Config{BodyLimit: 500 * 1024 * 1024})

	// Initialize the database configuration
	conf := entity.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
		DBName:   os.Getenv("DB_NAME"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
	}

	// Initialize the database
	db, err := configs.InitDB(conf)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to initialize database: %v", err)
	}

	fmt.Printf("Database initialized!\n")

	// Setup routes
	router.SetupRoutes(app)

	return app, db, nil
}

func main() {
	// Load the environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize the server
	app, _, err := initServer()
	if err != nil {
		log.Fatal(err)
	}

	listenAddr := os.Getenv("HOST_ADDR")
	if len(listenAddr) == 0 {
		listenAddr = ":8080"
	}

	// Start the server
	if err := app.Listen(listenAddr); err != nil {
		log.Fatal(err)
	}
}
