package models

import (
	"time"
)

type User struct {
	Id        uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	Name      string     `json:"name"`
	Email     string     `json:"email" gorm:"unique"`
	Password  []byte     `json:"-"`
	Recipes   []Recipe   `json:"recipes,omitempty"`
	Favorites []Favorite `json:"favorites,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}
