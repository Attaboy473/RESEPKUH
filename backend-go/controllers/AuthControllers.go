package controllers

import (
	"os"
	"strconv"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
	"github.com/ikhsan/resepkuBackend/database"
	models "github.com/ikhsan/resepkuBackend/models"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

// get secret key
var secretKey string

func init() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
	secretKey = os.Getenv("JWT_SECRET")
}

// register colntroller
func Register(c *fiber.Ctx) error {
	var data map[string]string
	if err := c.BodyParser(&data); err != nil {
		return err
	}
	// enkripsi password
	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)
	user := models.User{
		Name:     data["name"],
		Email:    data["email"],
		Password: password,
	}
	database.DB.Create(&user)
	// return c.SendString("Hellow Fellas this is register")
	return c.JSON(user)
}

func Login(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.Id == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "user not found",
		})
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Incorrect Password",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.Id)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	// generate jwt key
	token, err := claims.SignedString([]byte(secretKey))

	// check if token is true or not
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "could not login",
		})
	}

	// create a cookie with both token and userId
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	userIdCookie := fiber.Cookie{
		Name:     "userId",
		Value:    strconv.Itoa(int(user.Id)),
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)
	c.Cookie(&userIdCookie)

	return c.JSON(fiber.Map{
		"message": "success bomb has been planted",
	})
}

func Logout(c *fiber.Ctx) error {
	cookie := fiber.Cookie{
		Name:    "jwt",
		Value:   "",
		Expires: time.Now().Add(-time.Hour),
	}

	userIdCookie := fiber.Cookie{
		Name:    "userId",
		Value:   "",
		Expires: time.Now().Add(-time.Hour),
	}

	c.Cookie(&cookie)
	c.Cookie(&userIdCookie)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func User(c *fiber.Ctx) error {
	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})
	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthoticated",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	if err := database.DB.Preload("Recipes").Where("id = ?", claims.Issuer).First(&user).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "User not found",
		})
	}

	return c.JSON(user)
}
