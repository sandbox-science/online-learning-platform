package utils

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io"

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

// Encrypts the given plaintext using the provided key
func Encrypt(plaintext string, key [32]byte) (string, error) {
	var nonce [24]byte
	if _, err := io.ReadFull(rand.Reader, nonce[:]); err != nil {
		return "", err
	}

	plaintextBytes := []byte(plaintext)
	encrypted := secretbox.Seal(nonce[:], plaintextBytes, &nonce, &key)

	// Return the base64 encoded ciphertext
	return base64.StdEncoding.EncodeToString(encrypted), nil
}

// Decrypts the given ciphertext using the provided key
func Decrypt(ciphertext string, key [32]byte) (string, error) {
	encryptedBytes, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		return "", err
	}

	var nonce [24]byte
	copy(nonce[:], encryptedBytes[:24])
	decrypted, ok := secretbox.Open(nil, encryptedBytes[24:], &nonce, &key)
	if !ok {
		return "", fmt.Errorf("decryption failed")
	}

	return string(decrypted), nil
}
