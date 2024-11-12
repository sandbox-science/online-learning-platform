package database

import (
	"fmt"

	"github.com/sandbox-science/online-learning-platform/internal/entity"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// InitDB initializes the database connection and performs necessary migrations.
func InitDB(cfg entity.Config) (*gorm.DB, error) {
	var err error

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.Host, cfg.User, cfg.Password, cfg.DBName, cfg.Port, cfg.SSLMode)

	// Connect to the database
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	// Perform schema migrations
	return DatabaseMigration(DB)
}

// DatabaseMigration performs the automatic migration for the schema entities
func DatabaseMigration(DB *gorm.DB) (*gorm.DB, error) {
	err := DB.AutoMigrate(&entity.Account{})
	if err != nil {
		return nil, err
	}

	err = DB.AutoMigrate(&entity.Course{})
	if err != nil {
		return nil, err
	}

	err = DB.AutoMigrate(&entity.Tag{})
	if err != nil {
		return nil, err
	}

	err = DB.AutoMigrate(&entity.Module{})
	if err != nil {
		return nil, err
	}

	err = DB.AutoMigrate(&entity.Content{})
	if err != nil {
		return nil, err
	}

	fmt.Println("Migrated database!")

	return DB, nil
}
