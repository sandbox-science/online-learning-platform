package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type ZeroBounceResponse struct {
	Status string `json:"status"`
}

// VerifyEmailWithZeroBounce checks if an email address is valid using the ZeroBounce API
func VerifyEmailWithZeroBounce(email string) (string, error) {

	apiKey := os.Getenv("ZEROBOUNCE_API_KEY")
	if apiKey == "" {

		return "", fmt.Errorf("ZeroBounce API key not set in environment variables")
	}

	url := fmt.Sprintf("https://api.zerobounce.net/v2/validate?email=%s&api_key=%s", email, apiKey)

	resp, err := http.Get(url)
	if err != nil {

		return "", fmt.Errorf("failed to connect to ZeroBounce API: %v", err)
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {

		return "", fmt.Errorf("ZeroBounce API returned status: %s", resp.Status)
	}

	var result ZeroBounceResponse

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {

		return "", fmt.Errorf("error decoding ZeroBounce API response: %v", err)
	}

	return result.Status, nil
}
