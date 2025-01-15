package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/ikhsan/resepkuBackend/database"
	"github.com/ikhsan/resepkuBackend/models"
)

// controller untuk membuat favorite baru
func CreateFavorite(c *fiber.Ctx) error {
	var favorite models.Favorite

	if err := c.BodyParser(&favorite); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	userId, _ := strconv.Atoi(c.Locals("userId").(string))
	favorite.UserID = uint(userId)

	if err := database.DB.Create(&favorite).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not create favorite",
		})
	}

	if err := database.DB.Preload("User").Preload("Recipe").Preload("Recipe.User").First(&favorite, favorite.Id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not load favorite with user and recipe data",
		})
	}

	return c.JSON(favorite)
}

// function untuk get semua favorit dari pengguna
func GetAllFavorites(c *fiber.Ctx) error {
	var favorites []models.Favorite

	userId, _ := strconv.Atoi(c.Locals("userId").(string))

	if err := database.DB.Where("user_id = ?", userId).Preload("User").Preload("Recipe.User").Find(&favorites).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not fetch favorites",
		})
	}

	return c.JSON(favorites)
}

// function untuk menghapus favorit berdasarkan ID
func DeleteFavorite(c *fiber.Ctx) error {
	id := c.Params("id")
	var favorite models.Favorite

	if err := database.DB.First(&favorite, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Favorite not found",
		})
	}

	userId, _ := strconv.Atoi(c.Locals("userId").(string))
	if favorite.UserID != uint(userId) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "You are not allowed to delete this favorite",
		})
	}

	if err := database.DB.Delete(&favorite).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not delete favorite",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Favorite deleted",
	})
}
