package handlers_test

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/sandbox-science/online-learning-platform/configs/database"
	"github.com/sandbox-science/online-learning-platform/internal/entity"
	"github.com/sandbox-science/online-learning-platform/internal/handlers"
	"github.com/sandbox-science/online-learning-platform/internal/utils"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// clearAccounts deletes all records from the accounts table for testing purposes.
func clearAccounts(t *testing.T) {
	if err := database.DB.Exec("DELETE FROM accounts").Error; err != nil {
		t.Fatalf("Failed to clear accounts table: %v", err)
	}
}

func TestDB(t *testing.T) {
	var err error

	dsn := "host=postgres user=postgres password=1234 dbname=csudh_test port=5432 sslmode=disable"
	database.DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		t.Fatalf("Failed to connect to test database: %v", err)
	}

	err = database.DB.AutoMigrate(&entity.Account{})
	if err != nil {
		t.Fatalf("Failed to migrate test database: %v", err)
	}

	// Clear accounts table before creating mock user
	clearAccounts(t)

	// Setup a mock user in the database
	mockUser := entity.Account{
		Username: "dev_test",
		Email:    "test_login@example.com",
		Password: "Password1234",
	}

	utils.HashPassword(&mockUser)

	err = database.DB.Create(&mockUser).Error
	if err != nil {
		t.Fatalf("Failed to create mock user: %v", err)
	}
}

func TestLogin(t *testing.T) {
	app := fiber.New()
	app.Post("/login", handlers.Login)

	// Initialize the test database and create mock user
	TestDB(t)
	defer clearAccountsTable(t) // Clear accounts table after tests

	tests := []struct {
		name           string
		payload        map[string]string
		expectedStatus int
		expectedBody   map[string]interface{}
	}{
		{
			name: "Incorrect Password",
			payload: map[string]string{
				"email":    "test_login@example.com",
				"password": "wrongpassword", // Incorrect password
			},
			expectedStatus: fiber.StatusUnauthorized,
			expectedBody:   map[string]interface{}{"message": "Incorrect password"},
		},
		{
			name: "Successful Login",
			payload: map[string]string{
				"email":    "test_login@example.com",
				"password": "Password1234", // Correct password
			},
			expectedStatus: fiber.StatusOK,
			expectedBody: map[string]interface{}{"message": "Login successful", "user": map[string]string{
				"email": "test_login@example.com",
			}},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body, _ := json.Marshal(tt.payload)
			req := httptest.NewRequest(http.MethodPost, "/login", bytes.NewReader(body))
			req.Header.Set("Content-Type", "application/json")

			resp, err := app.Test(req)
			if err != nil {
				t.Fatalf("Failed to make request: %v", err)
			}

			assert.Equal(t, tt.expectedStatus, resp.StatusCode)

			// Read and unmarshal response body
			bodyBytes, _ := io.ReadAll(resp.Body)
			var responseBody map[string]interface{}
			json.Unmarshal(bodyBytes, &responseBody)

			// Validate the response message
			assert.Equal(t, tt.expectedBody["message"], responseBody["message"])

			// If the test is for successful login, validate the token
			if tt.name == "Successful Login" {
				// Check if the token exists and is not empty
				token, exists := responseBody["token"]
				assert.True(t, exists, "Expected token to be present in the response")
				assert.NotEmpty(t, token, "Expected token to be not empty")

				// Validate user information
				user, userExists := responseBody["user"]
				assert.True(t, userExists, "Expected user to be present in the response")
				userMap, ok := user.(map[string]interface{})
				assert.True(t, ok, "Expected user to be a map")

				assert.Equal(t, "test_login@example.com", userMap["email"])
			} else {
				// For other test cases, just check that the token is not present
				_, tokenExists := responseBody["token"]
				assert.False(t, tokenExists, "Expected token to not be present for failed login")
			}
		})
	}
}
