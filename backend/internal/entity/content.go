package entity

import "gorm.io/gorm"

type Content struct {
	gorm.Model
	Title    string `gorm:"size:255;not null;" json:"title"`
	Path     string `gorm:"size:255;not null;" json:"path"`
	ModuleID uint
	Module   Module `gorm:"foreignKey:ModuleID;references:ID" json:"-"`
}
