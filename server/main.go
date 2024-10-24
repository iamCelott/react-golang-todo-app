package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func enableCors(w * http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
	(*w).Header().Set("Access-Control-Allow-Credentials", "true")
}

type Task struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `gorm:"type:varchar(255);not null" json:"title"`
	Description string    `json:"description"`
	Status      string    `gorm:"type:enum('pending', 'completed');default:'pending'" json:"status"`
	CreatedAt   time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func handleIndex(w http.ResponseWriter, r * http.Request) {
	enableCors(&w) 
	fmt.Fprintf(w, "Server Started...")
}

func handleTasks(w http.ResponseWriter, r * http.Request, db * gorm.DB) {
	enableCors(&w) 
	var tasks []Task
	result := db.Find(&tasks)

	if result.Error != nil {
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application.json")
	json.NewEncoder(w).Encode(tasks)
}

func handleCreateTask(w http.ResponseWriter, r * http.Request, db * gorm.DB) {
	enableCors(&w) 
	w.WriteHeader(http.StatusOK)
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	var task Task
	if err := json.Unmarshal(body, &task); err != nil {
		http.Error(w, "Invalid input format", http.StatusBadRequest)
		return
	}

	if result := db.Create(&task); result.Error != nil {
		http.Error(w, "Failed to create category", http.StatusInternalServerError)
        return
	}

	w.Header().Set("Content-Type", "application.json")
	json.NewEncoder(w).Encode(map[string]string{"message":"Task created successfully"})
}

func main() {
	mux := http.NewServeMux()
	var port = "8000"
	db, err := gorm.Open(mysql.Open("root@tcp(localhost)/db_react_golang_todo_app?parseTime=true"), &gorm.Config{})
	if err != nil {
		panic("Failed Connect to Database!")
	}
	fmt.Println("Success Connect to Database!") 

	mux.HandleFunc("/", handleIndex)
	mux.HandleFunc("/tasks", func(w http.ResponseWriter, r * http.Request) {
		handleTasks(w, r, db)
	})
	mux.HandleFunc("/task/store", func(w http.ResponseWriter, r * http.Request) {
		handleCreateTask(w, r, db)
	})

	fmt.Printf("Server Started at Port %s\n", port)
	http.ListenAndServe(":"+port, mux)
}