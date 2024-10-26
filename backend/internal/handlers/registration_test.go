package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/sandbox-science/online-learning-platform/configs/database"
	"github.com/sandbox-science/online-learning-platform/internal/entity"
	"github.com/sandbox-science/online-learning-platform/internal/handlers"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// setupApp sets up a Fiber app for the registration handler tests.
func setupApp() *fiber.App {
	app := fiber.New()
	app.Post("/register", handlers.Register)
	return app
}

// setupTestDB sets up a test database for the registration handler tests.
func setupTestDB(t *testing.T) {
	var err error

	dsn := "host=" + os.Getenv("DB_HOST") +
		" user=" + os.Getenv("DB_USER") +
		" password=" + os.Getenv("DB_PASSWORD") +
		" dbname=" + os.Getenv("DB_NAME") +
		" port=" + os.Getenv("DB_PORT") +
		" sslmode=disable"
	database.DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to connect to test database: %v", err)
	}

	err = database.DB.AutoMigrate(&entity.Account{})
	if err != nil {
		t.Fatalf("Failed to migrate test database: %v", err)
	}
}

// clearAccountsTable clears the accounts table in the test database.
func clearAccountsTable(t *testing.T) {
	err := database.DB.Exec("DELETE FROM accounts").Error
	if err != nil {
		t.Fatalf("Failed to clear accounts table: %v", err)
	}
}

// TestRegister tests the registration handler.
func TestRegister(t *testing.T) {
	app := setupApp()
	setupTestDB(t)
	defer clearAccountsTable(t) // Clear database after all tests

	// Test cases for registration
	tests := []struct {
		name           string
		payload        map[string]string
		expectedStatus int
		expectedBody   map[string]interface{}
		setup          func(t *testing.T) // Optional setup for each test case
	}{
		{
			name: "Successful registration",
			payload: map[string]string{
				"username":         "testuser",
				"email":            "test@example.com",
				"password":         "password123",
				"confirm_password": "password123",
			},
			expectedStatus: fiber.StatusOK,
			expectedBody:   map[string]interface{}{"message": "User registered successfully"},
			setup:          func(t *testing.T) { clearAccountsTable(t) },
		},
		{
			name: "Passwords do not match",
			payload: map[string]string{
				"username":         "testuser",
				"email":            "test@example.com",
				"password":         "password123",
				"confirm_password": "password321",
			},
			expectedStatus: fiber.StatusBadRequest,
			expectedBody:   map[string]interface{}{"message": "Passwords do not match"},
			setup:          func(t *testing.T) {},
		},
		{
			name: "Account already exists",
			payload: map[string]string{
				"username":         "testuser",
				"email":            "test@example.com",
				"password":         "password123",
				"confirm_password": "password123",
			},
			expectedStatus: fiber.StatusInternalServerError,
			expectedBody:   map[string]interface{}{"message": "ERROR: duplicate key value violates unique constraint \"uni_accounts_email\" (SQLSTATE 23505)"},
			setup: func(t *testing.T) {
				clearAccountsTable(t)
				database.DB.Create(&entity.Account{Username: "testuser", Email: "test@example.com", Password: "hashedpassword"})
			},
		},
	}

	// Run tests
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.setup != nil {
				tt.setup(t)
			}

			body, _ := json.Marshal(tt.payload)
			req := httptest.NewRequest(http.MethodPost, "/register", bytes.NewReader(body))
			req.Header.Set("Content-Type", "application/json")

			resp, err := app.Test(req)
			if err != nil {
				t.Fatalf("Failed to make request: %v", err)
			}

			assert.Equal(t, tt.expectedStatus, resp.StatusCode)

			var responseBody map[string]interface{}
			if err := json.NewDecoder(resp.Body).Decode(&responseBody); err != nil {
				t.Fatalf("Failed to decode response body: %v", err)
			}
			assert.Contains(t, responseBody, "message")
			assert.Equal(t, tt.expectedBody["message"], responseBody["message"])
		})
	}
}
