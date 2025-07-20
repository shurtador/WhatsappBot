package main

import (
	"fmt"
	"os"
	"time"
)

func RunTests() {
	fmt.Println("🧪 Running Supabase Integration Tests...")

	// Test 1: Supabase Connection
	fmt.Println("\n1. Testing Supabase Connection...")
	if err := TestSupabaseConnection(); err != nil {
		fmt.Printf("❌ Supabase connection test failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("✅ Supabase connection test passed!")

	// Test 2: MessageStore Creation
	fmt.Println("\n2. Testing MessageStore Creation...")
	messageStore, err := NewMessageStore()
	if err != nil {
		fmt.Printf("❌ MessageStore creation failed: %v\n", err)
		os.Exit(1)
	}
	defer messageStore.Close()
	fmt.Println("✅ MessageStore creation test passed!")

	// Test 3: Basic Database Operations
	fmt.Println("\n3. Testing Basic Database Operations...")

	// Test StoreChat
	testJID := "test@whatsapp.net"
	testName := "Test Chat"
	testTime := time.Now()

	err = messageStore.StoreChat(testJID, testName, testTime)
	if err != nil {
		fmt.Printf("❌ StoreChat test failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("✅ StoreChat test passed!")

	// Test GetChats
	chats, err := messageStore.GetChats()
	if err != nil {
		fmt.Printf("❌ GetChats test failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("✅ GetChats test passed! Found %d chats\n", len(chats))

	fmt.Println("\n🎉 All tests passed! Supabase integration is working correctly.")
}
