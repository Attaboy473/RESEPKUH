package models

import "time"

// Favorite model
type Favorite struct {
	Id        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID    uint      `json:"user_id"`
	RecipeID  uint      `json:"recipe_id"`
	User      User      `json:"user" gorm:"foreignKey:UserID"`
	Recipe    Recipe    `json:"recipe" gorm:"foreignKey:RecipeID"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
