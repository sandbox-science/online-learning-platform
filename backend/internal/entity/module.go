package entity

import "gorm.io/gorm"

type Module struct {
	gorm.Model
	Title string `gorm:"size:255;not null;" json:"title"`
	Course Course `json:"course"`
	Content []Content `json:"content"`
}
