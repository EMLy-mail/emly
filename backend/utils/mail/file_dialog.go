package internal

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var EmailDialogOptions = runtime.OpenDialogOptions{
	Title: "Select Email file",
	Filters: []runtime.FileFilter{
		{DisplayName: "Email Files (*.eml;*.msg)", Pattern: "*.eml;*.msg"},
		{DisplayName: "EML Files (*.eml)", Pattern: "*.eml"},
		{DisplayName: "MSG Files (*.msg)", Pattern: "*.msg"},
	},
	ShowHiddenFiles: false,
}

var FolderDialogOptions = runtime.OpenDialogOptions{
	Title: "Select Folder",
	Filters: []runtime.FileFilter{
		{DisplayName: "Folders", Pattern: "*"},
	},
	ShowHiddenFiles: false,
}

func ShowFileDialog(ctx context.Context) (string, error) {
	filePath, err := runtime.OpenFileDialog(ctx, EmailDialogOptions)
	if err != nil {
		return "", err
	}
	return filePath, nil
}

func ShowFolderDialog(ctx context.Context) (string, error) {
	folderPath, err := runtime.OpenDirectoryDialog(ctx, FolderDialogOptions)
	if err != nil {
		return "", err
	}
	return folderPath, nil
}

// SaveAttachmentToFolder saves a base64-encoded attachment to the specified folder.
// If folderPath is empty, uses the user's Downloads folder as default.
// Expands environment variables in the format %%VAR%% or %VAR%.
//
// Parameters:
//   - filename: The name to save the file as
//   - base64Data: The base64-encoded file content
//   - folderPath: Optional custom folder path (uses Downloads if empty)
//
// Returns:
//   - string: The full path where the file was saved
//   - error: Any file system or decoding errors
func SaveAttachmentToFolder(filename string, base64Data string, folderPath string) (string, error) {
	// Decode base64 data
	data, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		return "", fmt.Errorf("failed to decode attachment data: %w", err)
	}

	// Use configured folder or default to Downloads
	targetFolder := folderPath
	if targetFolder == "" {
		targetFolder = filepath.Join(os.Getenv("USERPROFILE"), "Downloads")
	} else {
		// Expand environment variables (%%VAR%% or %VAR% format)
		re := regexp.MustCompile(`%%([^%]+)%%|%([^%]+)%`)
		targetFolder = re.ReplaceAllStringFunc(targetFolder, func(match string) string {
			varName := strings.Trim(match, "%")
			return os.Getenv(varName)
		})
	}

	// Ensure the target folder exists
	if err := os.MkdirAll(targetFolder, 0755); err != nil {
		return "", fmt.Errorf("failed to create target folder: %w", err)
	}

	// Create full path
	fullPath := filepath.Join(targetFolder, filename)

	// Save the file
	if err := os.WriteFile(fullPath, data, 0644); err != nil {
		return "", fmt.Errorf("failed to save attachment: %w", err)
	}

	return fullPath, nil
}

// OpenFileExplorer opens Windows Explorer and selects the specified file.
// Uses the /select parameter to highlight the file in Explorer.
// If the path is a directory, opens the directory without selecting anything.
//
// Parameters:
//   - filePath: The full path to the file or directory to open in Explorer
//
// Returns:
//   - error: Any execution errors
func OpenFileExplorer(filePath string) error {
	// Check if path is a directory or file
	info, err := os.Stat(filePath)
	if err != nil {
		return fmt.Errorf("failed to stat path: %w", err)
	}

	if info.IsDir() {
		// Open directory
		cmd := exec.Command("explorer.exe", filePath)
		return cmd.Start()
	}

	// Open and select file
	cmd := exec.Command("explorer.exe", "/select,", filePath)
	return cmd.Start()
}
