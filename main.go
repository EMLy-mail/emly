package main

import (
	"embed"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/build
var assets embed.FS

func (a *App) onSecondInstanceLaunch(secondInstanceData options.SecondInstanceData) {
	var secondInstanceArgs []string
	secondInstanceArgs = secondInstanceData.Args

	log.Println("user opened second instance", strings.Join(secondInstanceData.Args, ","))
	log.Println("user opened second from", secondInstanceData.WorkingDirectory)
	runtime.WindowUnminimise(a.ctx)
	runtime.WindowShow(a.ctx)
	log.Println("launchArgs", secondInstanceArgs)
	go runtime.EventsEmit(a.ctx, "launchArgs", secondInstanceArgs)
}

func main() {
	if err := InitLogger(); err != nil {
		log.Println("Error initializing logger:", err)
	}
	defer CloseLogger()

	// Load config.ini to get WebView2 paths
	configPath := filepath.Join(filepath.Dir(os.Args[0]), "config.ini")
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		configPath = "config.ini" // fallback to current directory
	}

	// Check for custom args
	args := os.Args
	uniqueId := "emly-app-lock"
	windowTitle := "EMLy - EML Viewer for 3gIT"
	windowWidth := 1024
	windowHeight := 768
	frameless := true

	for _, arg := range args {
		if strings.Contains(arg, "--view-image") {
			uniqueId = "emly-viewer-" + strings.ReplaceAll(arg, "--view-image=", "") // Make unique per image or just random?
			// Actually, just using a different base ID allows multiple viewers if we append something random or just use "mailpaw-viewer" and disable single instance for viewers?
			// Let's just disable single instance for viewers by generating a random ID or appending timestamp
			uniqueId = "emly-viewer-" + arg // simplified uniqueness
			windowTitle = "EMLy Image Viewer"
			windowWidth = 800
			windowHeight = 600
		}
		if strings.Contains(arg, "--view-pdf") {
			uniqueId = "emly-pdf-viewer-" + strings.ReplaceAll(arg, "--view-pdf=", "")
			windowTitle = "EMLy PDF Viewer"
			windowWidth = 800
			windowHeight = 600
			frameless = true
		}
	}

	// Create an instance of the app structure
	app := NewApp()

	// Parse args again to set startup file on the app instance
	for _, arg := range args {
		if strings.HasSuffix(strings.ToLower(arg), ".eml") {
			app.StartupFilePath = arg
		}
		if strings.HasSuffix(strings.ToLower(arg), ".msg") {
			app.StartupFilePath = arg
		}
	}

	// Create application with options
	// Configure WebView2 DataPath (user data folder)
	userDataPath := filepath.Join(os.Getenv("APPDATA"), "EMLy")          // default
	downloadPath := filepath.Join(os.Getenv("USERPROFILE"), "Downloads") // default

	// Helper function to expand Windows-style environment variables
	expandEnvVars := func(path string) string {
		// Match %%VAR%% or %VAR% patterns and replace with actual values
		re := regexp.MustCompile(`%%([^%]+)%%|%([^%]+)%`)
		return re.ReplaceAllStringFunc(path, func(match string) string {
			varName := strings.Trim(match, "%")
			return os.Getenv(varName)
		})
	}

	// Load paths from config.ini if available
	if cfg, err := os.ReadFile(configPath); err == nil {
		// Simple INI parsing for these specific values
		lines := strings.Split(string(cfg), "\n")
		for _, line := range lines {
			line = strings.TrimSpace(line)
			if strings.HasPrefix(line, "WEBVIEW2_USERDATA_PATH") {
				parts := strings.SplitN(line, "=", 2)
				if len(parts) == 2 {
					path := strings.TrimSpace(parts[1])
					if path != "" {
						userDataPath = expandEnvVars(path)
					}
				}
			} else if strings.HasPrefix(line, "WEBVIEW2_DOWNLOAD_PATH") {
				parts := strings.SplitN(line, "=", 2)
				if len(parts) == 2 {
					path := strings.TrimSpace(parts[1])
					if path != "" {
						downloadPath = expandEnvVars(path)
					}
				}
			}
		}
	}

	log.Printf("WebView2 UserDataPath: %s", userDataPath)
	log.Printf("WebView2 DownloadPath: %s", downloadPath)

	err := wails.Run(&options.App{
		Title:  windowTitle,
		Width:  windowWidth,
		Height: windowHeight,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		SingleInstanceLock: &options.SingleInstanceLock{
			UniqueId:               uniqueId,
			OnSecondInstanceLaunch: app.onSecondInstanceLaunch,
		},
		EnableDefaultContextMenu: true,
		MinWidth:                 964,
		MinHeight:                690,
		Frameless:                frameless,
		Windows: &windows.Options{
			WebviewUserDataPath: userDataPath,
			WebviewBrowserPath:  "", // Empty = use system Edge WebView2
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
