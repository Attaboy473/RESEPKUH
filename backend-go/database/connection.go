package database

import (
	"fmt"
	"os"

	models "github.com/ikhsan/resepkuBackend/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")
	dbHost := os.Getenv("DB_Host")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPassword, dbHost, dbPort, dbName)
	// connection, err := gorm.Open(mysql.Open(`root:@/go_todo`), &gorm.Config{})
	connection, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("could not connect to database")
	}
	DB = connection
	connection.AutoMigrate(&models.User{}, &models.Recipe{}, &models.Favorite{})
}
