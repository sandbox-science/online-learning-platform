package entity

import "gorm.io/gorm"

type Module struct {
	gorm.Model
	Title string `gorm:"size:255;not null;" json:"title"`
	CourseID int 
	Course Course `gorm:"foreignKey:CourseID;references:ID" json:"course"`
	Content []Content `json:"content"`
}
