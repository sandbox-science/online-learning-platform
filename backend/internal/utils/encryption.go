package utils

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"os"

	"github.com/sandbox-science/online-learning-platform/internal/entity"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/crypto/nacl/secretbox"
)

// HashPassword hashes the user's password using bcrypt.
func HashPassword(user *entity.Account) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	if err != nil {
		return err
	}

	user.Password = string(hashedPassword)
	return nil
}

// CheckPasswordHash checks if the hashed password matches the plain text password.
func CheckPasswordHash(password, hash string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}

// getCryptoKey retrieves and validates the encryption key from the environment variable.
func getCryptoKey() ([]byte, error) {
	keyString := os.Getenv("CRYPTO_KEY")
	if keyString == "" {
		return nil, errors.New("CRYPTO_KEY environment variable is not set")
	}

	decodedKey, err := base64.StdEncoding.DecodeString(keyString)
	if err != nil || len(decodedKey) != 32 {
		return nil, errors.New("CRYPTO_KEY must be a valid Base64-encoded string of 32 bytes")
	}

	return decodedKey, nil
}

// Encrypt encrypts the given plaintext using the key from the environment variable.
func Encrypt(plaintext string) (string, error) {
	var nonce [24]byte
	if _, err := io.ReadFull(rand.Reader, nonce[:]); err != nil {
		return "", fmt.Errorf("failed to generate nonce for encryption: %w", err)
	}

	decodedKey, err := getCryptoKey()
	if err != nil {
		return "", fmt.Errorf("failed to retrieve encryption key: %w", err)
	}

	var key [32]byte
	copy(key[:], decodedKey)

	// Encrypt the plaintext
	plaintextData := []byte(plaintext)
	encrypted := secretbox.Seal(nonce[:], plaintextData, &nonce, &key)

	return base64.StdEncoding.EncodeToString(encrypted), nil
}

// Decrypt decrypts the given ciphertext using the key from the environment variable.
func Decrypt(ciphertext string) (string, error) {
	// Decode the ciphertext from Base64
	ciphertextBytes, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		return "", fmt.Errorf("failed to decode ciphertext: %w", err)
	}

	var nonce [24]byte
	copy(nonce[:], ciphertextBytes[:24])

	decodedKey, err := getCryptoKey()
	if err != nil {
		return "", fmt.Errorf("failed to retrieve decryption key: %w", err)
	}

	var key [32]byte
	copy(key[:], decodedKey)

	// Attempt to decrypt the data
	decrypted, ok := secretbox.Open(nil, ciphertextBytes[24:], &nonce, &key)
	if !ok {
		return "", errors.New("decryption failed")
	}

	return string(decrypted), nil
}
