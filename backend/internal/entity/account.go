package entity

import "gorm.io/gorm"

type Account struct {
	gorm.Model
	Username string `gorm:"size:255;not null;" json:"username"`
	Password string `gorm:"size:255;not null;" json:"-"`
	Email    string `gorm:"size:100;not null;unique" json:"email"`
	Role     string `gorm:"size:10;not null;check:role IN ('student', 'educator');" json:"role"`
	Courses []*Course `gorm:"many2many:enrollment;"`
}
