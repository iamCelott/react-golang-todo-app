package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Task struct {
	ID          uint   `gorm:"primaryKey"`
	Title       string `gorm:"type:varchar(255);not null"`
	Description string
	Status      string `gorm:"type:enum('pending', 'completed');default:'pending'"`
	CreatedAt   int64  `gorm:"autoCreateTime"`
	UpdatedAt   int64  `gorm:"autoUpdateTime"`
}

func handleIndex(w http.ResponseWriter, r * http.Request) {
	fmt.Fprintf(w, "Server Started...")
}

func handleTasks(w http.ResponseWriter, r * http.Request, db * gorm.DB) {
	var tasks []Task
	result := db.Find(&tasks)

	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application.json")
	json.NewEncoder(w).Encode(tasks)
}

func main() {
	mux := http.NewServeMux()
	var port = "8000"
	db, err := gorm.Open(mysql.Open("root@tcp(localhost)/db_react_golang_todo_app"), &gorm.Config{})
	if err != nil {
		panic("Failed Connect to Database!")
	}
	fmt.Println("Success Connect to Database!") 

	mux.HandleFunc("/", handleIndex)
	mux.HandleFunc("/tasks", func(w http.ResponseWriter, r * http.Request) {
		handleTasks(w, r, db)
	})

	fmt.Printf("Server Started at Port %s\n", port)
	http.ListenAndServe(":"+port, mux)
}