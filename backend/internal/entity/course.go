package entity

import "gorm.io/gorm"

type Course struct {
	gorm.Model
	Title       string    `gorm:"size:255;not null;" json:"title"`
	Description string    `gorm:"size:255;not null;" json:"description"`
	CreatorID   int       `gorm:"foreignKey" json:"creator_id"`
	Students    []Account `gorm:"many2many:enrollment;" json:"students"`
	Tags        []Tag     `gorm:"many2many:course_tag;" json:"tags"`
	Modules     []Module  `json:"modules"`
}
