package entity

import "gorm.io/gorm"

type Content struct {
	gorm.Model
	Title    string `gorm:"size:255;not null;" json:"title"`
	Path     string `gorm:"size:255;not null;" json:"path"`
	Body     string `gorm:"size:2000;" json:"body"`
	Type     string `gorm:"size:255;not null;" json:"type"`
	ModuleID uint
	Module   Module `gorm:"foreignKey:ModuleID;references:ID" json:"-"`
}
