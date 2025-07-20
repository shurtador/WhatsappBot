package main

import (
	"fmt"
	"os"

	"github.com/supabase-community/supabase-go"
)

// TestSupabaseConnection tests the Supabase connection
func TestSupabaseConnection() error {
	fmt.Println("Testing Supabase connection...")

	// Check environment variables
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	postgresURL := os.Getenv("SUPABASE_POSTGRES_URL")

	if supabaseURL == "" {
		return fmt.Errorf("SUPABASE_URL environment variable is required")
	}
	if supabaseKey == "" {
		return fmt.Errorf("SUPABASE_SERVICE_ROLE_KEY environment variable is required")
	}
	if postgresURL == "" {
		return fmt.Errorf("SUPABASE_POSTGRES_URL environment variable is required")
	}

	fmt.Printf("✓ Environment variables found:\n")
	fmt.Printf("  - SUPABASE_URL: %s\n", supabaseURL)
	fmt.Printf("  - SUPABASE_SERVICE_ROLE_KEY: %s...\n", supabaseKey[:10])
	fmt.Printf("  - SUPABASE_POSTGRES_URL: %s...\n", postgresURL[:20])

	// Test Supabase client creation
	supabase, err := supabase.NewClient(supabaseURL, supabaseKey, nil)
	if err != nil {
		return fmt.Errorf("failed to create Supabase client: %v", err)
	}

	fmt.Println("✓ Supabase client created successfully")

	// Test a simple query to verify connection
	data, _, err := supabase.From("chats").Select("count", "", false).Execute()
	if err != nil {
		return fmt.Errorf("failed to query chats table: %v", err)
	}

	fmt.Printf("✓ Successfully queried chats table: %s\n", string(data))

	return nil
}
