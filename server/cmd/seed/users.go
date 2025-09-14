package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"

	"restaurant-server/internal/repository"
)

type User struct {
	Name     string
	Email    string
	Phone    string
	Role     string
	Password string
	Picture  string
}

// CreateUsers returns the proportional user list with plain passwords.
func CreateUsers() []User {
	users := []User{
		User{
			Name:     "John Doe",
			Email:    "john@example.com",
			Phone:    "0900110022",
			Role:     "admin",
			Password: "password",
			Picture:  "manager.jpg",
		},
		User{
			Name:     "Melissa Key",
			Email:    "melissa@example.com",
			Phone:    "0900110022",
			Role:     "waiter",
			Password: "password",
			Picture:  "melissa.jpg",
		},
		User{
			Name:     "Lawrence Bell",
			Email:    "lawrence@example.com",
			Phone:    "0900110022",
			Role:     "waiter",
			Password: "password",
			Picture:  "lawrence.jpg",
		},
		User{
			Name:     "Annette Oneal",
			Email:    "annette@example.com",
			Phone:    "0900110022",
			Role:     "waiter",
			Password: "password",
			Picture:  "anette.jpg",
		},
		User{
			Name:     "Diana Cabrera",
			Email:    "diana@example.com",
			Phone:    "0900110022",
			Role:     "kitchen",
			Password: "password",
			Picture:  "diana.jpg",
		},
		User{
			Name:     "Brent Chambers",
			Email:    "brent@example.com",
			Phone:    "0900110022",
			Role:     "kitchen",
			Password: "password",
			Picture:  "brent.jpg",
		},
		User{
			Name:     "Michael Clark",
			Email:    "michael@example.com",
			Phone:    "0900110022",
			Role:     "kitchen",
			Password: "password",
			Picture:  "michael.jpg",
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
			Name:    user.Name,
			Email:   user.Email,
			Phone:   user.Phone,
			Role:    user.Role,
			Picture: &user.Picture,
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
