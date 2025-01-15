package controllers

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/ikhsan/resepkuBackend/database"
	"github.com/ikhsan/resepkuBackend/models"
)

func CreateRecipe(c *fiber.Ctx) error {
	// Parse form data
	title := c.FormValue("title")
	category := c.FormValue("category")
	description := c.FormValue("description")
	ingredients := c.FormValue("ingredients")
	instructions := c.FormValue("instructions")

	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Failed to upload image",
		})
	}

	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
	if err := c.SaveFile(file, fmt.Sprintf("./uploads/%s", filename)); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to save image",
		})
	}

	userId, _ := strconv.Atoi(c.Locals("userId").(string))
	recipe := models.Recipe{
		Title:        title,
		Category:     category,
		Description:  description,
		Ingredients:  ingredients,
		Instructions: instructions,
		Image:        filename,
		UserID:       uint(userId),
	}

	if err := database.DB.Create(&recipe).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not create recipe",
		})
	}

	// Reload the recipe with the associated user data
	if err := database.DB.Preload("User").First(&recipe, recipe.Id).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not load recipe with user data",
		})
	}

	return c.JSON(recipe)
}

func GetAllRecipes(c *fiber.Ctx) error {
	var recipes []models.Recipe

	if err := database.DB.Preload("User").Find(&recipes).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not fetch recipes",
		})
	}

	return c.JSON(recipes)
}

func GetRecipe(c *fiber.Ctx) error {
	id := c.Params("id")
	var recipe models.Recipe

	if err := database.DB.Preload("User").First(&recipe, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Recipe not found",
		})
	}

	return c.JSON(recipe)
}

func GetUserRecipes(c *fiber.Ctx) error {
	// Mengambil userId dari konteks lokal
	userId, err := strconv.Atoi(c.Locals("userId").(string))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Invalid user ID",
		})
	}

	var recipes []models.Recipe

	// Melakukan query ke database untuk mengambil resep berdasarkan user_id
	if err := database.DB.Where("user_id = ?", userId).Preload("User").Find(&recipes).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not fetch user recipes",
		})
	}

	if len(recipes) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "No recipes found for this user",
		})
	}

	return c.JSON(recipes)
}

func UpdateRecipe(c *fiber.Ctx) error {
	id := c.Params("id")
	var recipe models.Recipe

	if err := database.DB.First(&recipe, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Recipe not found",
		})
	}

	userId, _ := strconv.Atoi(c.Locals("userId").(string))
	if recipe.UserID != uint(userId) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "You are not allowed to update this recipe",
		})
	}

	var input models.Recipe
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input",
		})
	}

	recipe.Title = input.Title
	recipe.Description = input.Description
	recipe.Ingredients = input.Ingredients
	recipe.Instructions = input.Instructions

	// Handle image upload
	file, err := c.FormFile("image")
	if err == nil {
		// Save new image
		filePath := "uploads/" + file.Filename
		if err := c.SaveFile(file, filePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Failed to save image",
			})
		}
		// Optionally, delete the old image
		if recipe.Image != "" {
			oldImagePath := "uploads/" + recipe.Image
			if err := os.Remove(oldImagePath); err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"message": "Failed to delete old image",
				})
			}
		}
		// Update image path in recipe
		recipe.Image = file.Filename
	}

	if err := database.DB.Save(&recipe).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not update recipe",
		})
	}

	return c.JSON(recipe)
}

func DeleteRecipe(c *fiber.Ctx) error {
	id := c.Params("id")
	var recipe models.Recipe

	if err := database.DB.First(&recipe, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Recipe not found",
		})
	}

	userId, _ := strconv.Atoi(c.Locals("userId").(string))
	if recipe.UserID != uint(userId) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "You are not allowed to delete this recipe",
		})
	}

	// Hapus entri favorit terkait
	if err := database.DB.Where("recipe_id = ?", id).Delete(&models.Favorite{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not delete associated favorites",
		})
	}

	// Hapus resep
	if err := database.DB.Delete(&recipe).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Could not delete recipe",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Recipe deleted",
	})
}
