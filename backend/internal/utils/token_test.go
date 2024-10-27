package utils_test

import (
	"testing"

	"github.com/sandbox-science/online-learning-platform/internal/utils"
	"github.com/stretchr/testify/assert"
)

/*
 * Test cases for the GenerateJWT Token function
 */
func TestGenerateJWTNoError(t *testing.T) {
	token, err := utils.GenerateJWT(user.Email)
	assert.NoError(t, err, err)
	assert.NotEmpty(t, token, err)
}
