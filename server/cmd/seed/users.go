package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"

	"restaurant-server/internal/repository"
	"restaurant-server/shared/types"
)

// CreateUsers returns the proportional user list with plain passwords.
func CreateUsers() []types.UserPayload {
	users := []types.UserPayload{
		types.UserPayload{
			Name:     "Abdulfetah Suudi",
			Email:    "suudi@example.com",
			Phone:    "0991752985",
			Role:     "admin",
			Password: "password",
		},
		types.UserPayload{
			Name:     "Melissa Key",
			Email:    "melissa@example.com",
			Phone:    "0900110022",
			Role:     "waiter",
			Password: "password",
		},
		types.UserPayload{
			Name:     "Lawrence Bell",
			Email:    "lawrence@example.com",
			Phone:    "0900110022",
			Role:     "waiter",
			Password: "password",
		},
		types.UserPayload{
			Name:     "Annette Oneal",
			Email:    "annette@example.com",
			Phone:    "0900110022",
			Role:     "waiter",
			Password: "password",
		},
		types.UserPayload{
			Name:     "Diana Cabrera",
			Email:    "diana@example.com",
			Phone:    "0900110022",
			Role:     "kitchen",
			Password: "password",
		},
		types.UserPayload{
			Name:     "Brent Chambers",
			Email:    "brent@example.com",
			Phone:    "0900110022",
			Role:     "kitchen",
			Password: "password",
		},
		types.UserPayload{
			Name:     "Michael Clark",
			Email:    "michael@example.com",
			Phone:    "0900110022",
			Role:     "kitchen",
			Password: "password",
		},
	}
	return users
}

func seedUsers(ctx context.Context, queries *repository.Queries) {
	users := CreateUsers()

	start := time.Now()

	for _, user := range users {
		fmt.Println(user.Email, user.Password)
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("Failed to hash password: %v", err)
		}

		user, err := queries.CreateUser(ctx, repository.CreateUserParams{
			Name:  user.Name,
			Email: user.Email,
			Phone: user.Phone,
			Role:  user.Role,
		})
		if err != nil {
			log.Fatalf("Failed to seed user: %v", err)
		}
		err = queries.CreateAccount(ctx, repository.CreateAccountParams{
			UserID:       user.ID,
			Blocked:      false,
			PasswordHash: string(hashedPassword),
		})
		if err != nil {
			log.Fatalf("Failed to seed account: %v", err)
		}
		// log.Printf("✅ User: %s seeded with role: %s.", created.FirstName, created.Role)
	}

	elapsed := time.Since(start)

	fmt.Printf("\n✅ %d users seeded successfully. Took %s\n", len(users), elapsed)
}
