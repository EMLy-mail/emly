package main

import (
	"embed"
	"fmt"
	"log"
	"os"
	"strings"

	pkglogger "emly/backend/logger"
	"emly/backend/utils"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/build
var assets embed.FS

func main() {
	if err := InitLogger(); err != nil {
		log.Println("Error initializing logger:", err)
	}
	defer CloseLogger()

	// Check for custom args
	args := os.Args
	uniqueId := "emly-app-lock"
	windowTitle := "EMLy - EML Viewer for 3gIT"
	windowWidth := 1024
	windowHeight := 700
	frameless := true

	for _, arg := range args {
		if strings.Contains(arg, "--view-image") {
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

	// Build custom User-Agent from config version
	guiVersion := "unknown"
	if cfg, err := utils.LoadConfig(utils.DefaultConfigPath()); err == nil && cfg != nil {
		guiVersion = cfg.EMLy.GUISemver
	}
	userAgent := fmt.Sprintf("EMLy/%s", guiVersion)

	// Use a pointer closure so OnSecondInstanceLaunch can reference the App
	// even though it's registered before the App is constructed.
	var appPtr *App

	wailsApp := application.New(application.Options{
		Name: windowTitle,
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		SingleInstance: &application.SingleInstanceOptions{
			UniqueID: uniqueId,
			OnSecondInstanceLaunch: func(data application.SecondInstanceData) {
				if appPtr == nil {
					return
				}
				pkglogger.Info("second instance launched",
					"args", strings.Join(data.Args, ","),
					"working_dir", data.WorkingDir,
				)
				mainWin, exists := appPtr.app.Window.GetByName("main")
				if exists {
					mainWin.UnMinimise()
					mainWin.Show()
				}
				go appPtr.app.Event.Emit("launchArgs", data.Args)
			},
		},
	})

	// Create app instance with the wails application reference
	app := NewApp(userAgent, wailsApp)
	appPtr = app

	// Register the app as a service
	wailsApp.RegisterService(application.NewService(app))

	// Parse args to set startup file on the app instance
	for _, arg := range args {
		if strings.HasSuffix(strings.ToLower(arg), ".eml") {
			app.StartupFilePath = arg
		}
		if strings.HasSuffix(strings.ToLower(arg), ".msg") {
			app.StartupFilePath = arg
		}
	}

	// Create main window
	wailsApp.Window.NewWithOptions(application.WebviewWindowOptions{
		Name:             "main",
		Title:            windowTitle,
		Width:            windowWidth,
		Height:           windowHeight,
		MinWidth:         964,
		MinHeight:        690,
		Frameless:        frameless,
		BackgroundColour: application.NewRGBA(27, 38, 54, 1),
	})

	if err := wailsApp.Run(); err != nil {
		pkglogger.Error("application error", "error", err.Error())
	}
}
