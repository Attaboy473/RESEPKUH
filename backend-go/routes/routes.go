package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/ikhsan/resepkuBackend/controllers"
	"github.com/ikhsan/resepkuBackend/middleware"
)

func Setup(app *fiber.App) {
	app.Static("/uploads", "./uploads")

	// Auth routes
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Post("/api/logout", controllers.Logout)
	app.Get("/api/user", controllers.User)

	// Recipe routes
	recipe := app.Group("/api/recipes")

	// Public routes (accessible without authentication)
	recipe.Get("/", controllers.GetAllRecipes)
	recipe.Get("/:id", controllers.GetRecipe)

	// Protected routes (authentication required)
	recipe.Use(middleware.Authenticated)

	recipe.Post("/", controllers.CreateRecipe)
	recipe.Put("/:id", controllers.UpdateRecipe)
	recipe.Delete("/:id", controllers.DeleteRecipe)
	recipe.Get("/user", controllers.GetUserRecipes)

	// Favorite routes
	favorites := app.Group("/api/favorites")
	favorites.Use(middleware.Authenticated)
	favorites.Post("/", controllers.CreateFavorite)
	favorites.Get("/", controllers.GetAllFavorites)
	favorites.Delete("/:id", controllers.DeleteFavorite)

}
