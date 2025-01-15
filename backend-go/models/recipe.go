package models

import (
	"time"
)

type Recipe struct {
	Id           uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	Title        string     `json:"title"`
	Category     string     `json:"category"`
	Description  string     `json:"description"`
	Ingredients  string     `json:"ingredients"`
	Instructions string     `json:"instructions"`
	UserID       uint       `json:"user_id"`
	Image        string     `json:"image"`
	User         User       `json:"user" gorm:"foreignKey:UserID"`
	Favorites    []Favorite `json:"favorites,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}
