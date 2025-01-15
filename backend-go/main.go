package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	connection "github.com/ikhsan/resepkuBackend/database"
	routes "github.com/ikhsan/resepkuBackend/routes"
)

func main() {
	connection.Connect()
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "http://localhost:5173",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "GET, POST, PUT, DELETE",
	}))
	routes.Setup(app)

	app.Listen(":8080")
}
