package main

import (
	"context"
	"log"

	"restaurant-server/database"
	"restaurant-server/internal/repository"
	"restaurant-server/shared/config"
)

func main() {
	config.Load()
	db := database.Connect()
	defer db.Close()

	ctx := context.Background()

	q := repository.New(db)

	log.Println("🌱 Seeding data...")

	seedUsers(ctx, q)
}
