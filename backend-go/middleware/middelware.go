package middleware

import (
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
}

// Authenticated middleware function
func Authenticated(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	if cookie == "" {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Unauthenticated",
		})
	}

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil || !token.Valid {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Unauthenticated",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)
	c.Locals("userId", claims.Issuer)

	return c.Next()
}
