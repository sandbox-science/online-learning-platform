package entity

import "gorm.io/gorm"

type Tag struct {
	gorm.Model
	TagName string `gorm:"size:255;not null;" json:"tag_name)"`
	Courses []*Course `gorm:"many2many:course_tag;"`
}
