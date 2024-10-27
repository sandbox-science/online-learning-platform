package utils_test

import (
	"encoding/base64"
	"os"
	"testing"

	"github.com/sandbox-science/online-learning-platform/internal/entity"
	"github.com/sandbox-science/online-learning-platform/internal/utils"
	"github.com/stretchr/testify/assert"
	"golang.org/x/crypto/bcrypt"
)

var user = &entity.Account{
	Username: "dev",
	Password: "password123",
	Email:    "dev@example.com",
}

/*
 * Test cases for the HashPassword function
 */
func TestHashPasswordNoError(t *testing.T) {
	err := utils.HashPassword(user)
	assert.NoError(t, err, "No error while hashing password")
}

func TestHashPasswordNil(t *testing.T) {
	err := utils.HashPassword(user)
	assert.Nil(t, err, "Err should be nil")
}

/*
 * Test cases for the CheckPasswordHash function
 */
func TestCheckPasswordHashNoError(t *testing.T) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	assert.NoError(t, err, "No error while hashing password")

	err = utils.CheckPasswordHash(user.Password, string(hashedPassword))
	assert.NoError(t, err, "No error while verifying password")
}

func TestCheckPasswordHashError(t *testing.T) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("password1"), bcrypt.DefaultCost)
	assert.NoError(t, err, "No error while hashing password")

	err = utils.CheckPasswordHash(user.Password, string(hashedPassword))
	assert.Error(t, err, "Error while verifying password")
}

/*
 * Test cases for the Encrypt function
 */
func TestEncryptNoError(t *testing.T) {
	var key [32]byte
	keyString := os.Getenv("CRYPTO_KEY")
	decodedKey, _ := base64.StdEncoding.DecodeString(keyString)
	copy(key[:], decodedKey) // Copy the decoded key to the key variable

	encrypted, err := utils.Encrypt(user.Username, key)

	assert.NoError(t, err, nil, "Should have no error")
	assert.NotEmpty(t, encrypted, "Should not be empty")
}

/*
 * Test cases for the Decrypt function
 */
func TestDecryptNoError(t *testing.T) {
	var key [32]byte
	keyString := os.Getenv("CRYPTO_KEY")
	decodedKey, _ := base64.StdEncoding.DecodeString(keyString)
	copy(key[:], decodedKey)

	usernameEncrypted, _ := utils.Encrypt(user.Username, key)
	decryption, err := utils.Decrypt(usernameEncrypted, key)

	assert.NoError(t, err, nil, "Should have no Error during decryption")
	assert.NotEmpty(t, decryption, err)
}
