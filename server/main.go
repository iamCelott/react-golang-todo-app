package main

import (
	"fmt"
	"net/http"
)

func handleIndex(w http.ResponseWriter, r * http.Request) {
	fmt.Fprintf(w, "Server Started...")
}

func main() {
	mux := http.NewServeMux()
	var port = "8000"

	mux.HandleFunc("/", handleIndex)
	
	fmt.Printf("Server Started at Port %s\n", port)
	http.ListenAndServe(":"+port, mux)
}