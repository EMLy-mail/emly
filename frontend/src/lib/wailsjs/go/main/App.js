// @ts-check
// Wails v3 bindings — calls are routed through Call.ByName('main.App.MethodName', ...args)
// DO NOT EDIT — regenerate with: wails3 generate bindings

import { Call } from '@wailsio/runtime';

const pkg = 'main.App';

export function CheckForUpdates() {
  return Call.ByName(`${pkg}.CheckForUpdates`);
}

export function CheckIsDefaultEMLHandler() {
  return Call.ByName(`${pkg}.CheckIsDefaultEMLHandler`);
}

export function ConvertToUTF8(arg1) {
  return Call.ByName(`${pkg}.ConvertToUTF8`, arg1);
}

export function CreateBugReportFolder() {
  return Call.ByName(`${pkg}.CreateBugReportFolder`);
}

export function DetectEmailFormat(arg1) {
  return Call.ByName(`${pkg}.DetectEmailFormat`, arg1);
}

export function DownloadUpdate() {
  return Call.ByName(`${pkg}.DownloadUpdate`);
}

export function ExportSettings(arg1) {
  return Call.ByName(`${pkg}.ExportSettings`, arg1);
}

export function FrontendLog(arg1, arg2, arg3) {
  return Call.ByName(`${pkg}.FrontendLog`, arg1, arg2, arg3);
}

export function GetConfig() {
  return Call.ByName(`${pkg}.GetConfig`);
}

export function GetCurrentMailFilePath() {
  return Call.ByName(`${pkg}.GetCurrentMailFilePath`);
}

export function GetImageViewerData() {
  return Call.ByName(`${pkg}.GetImageViewerData`);
}

export function GetMachineData() {
  return Call.ByName(`${pkg}.GetMachineData`);
}

export function GetPDFViewerData() {
  return Call.ByName(`${pkg}.GetPDFViewerData`);
}

export function GetStartupFile() {
  return Call.ByName(`${pkg}.GetStartupFile`);
}

export function GetUpdateStatus() {
  return Call.ByName(`${pkg}.GetUpdateStatus`);
}

export function GetViewerData() {
  return Call.ByName(`${pkg}.GetViewerData`);
}

export function ImportSettings() {
  return Call.ByName(`${pkg}.ImportSettings`);
}

export function InstallUpdate(arg1) {
  return Call.ByName(`${pkg}.InstallUpdate`, arg1);
}

export function InstallUpdateSilent() {
  return Call.ByName(`${pkg}.InstallUpdateSilent`);
}

export function InstallUpdateSilentFromPath(arg1) {
  return Call.ByName(`${pkg}.InstallUpdateSilentFromPath`, arg1);
}

export function IsAppInDebugMode() {
  return Call.ByName(`${pkg}.IsAppInDebugMode`);
}

export function IsDebuggerRunning() {
  return Call.ByName(`${pkg}.IsDebuggerRunning`);
}

export function OpenDefaultAppsSettings() {
  return Call.ByName(`${pkg}.OpenDefaultAppsSettings`);
}

export function OpenEMLWindow(arg1, arg2) {
  return Call.ByName(`${pkg}.OpenEMLWindow`, arg1, arg2);
}

export function OpenFolderInExplorer(arg1) {
  return Call.ByName(`${pkg}.OpenFolderInExplorer`, arg1);
}

export function OpenImage(arg1, arg2) {
  return Call.ByName(`${pkg}.OpenImage`, arg1, arg2);
}

export function OpenImageWindow(arg1, arg2) {
  return Call.ByName(`${pkg}.OpenImageWindow`, arg1, arg2);
}

export function OpenPDF(arg1, arg2) {
  return Call.ByName(`${pkg}.OpenPDF`, arg1, arg2);
}

export function OpenPDFWindow(arg1, arg2) {
  return Call.ByName(`${pkg}.OpenPDFWindow`, arg1, arg2);
}

export function OpenURLInBrowser(arg1) {
  return Call.ByName(`${pkg}.OpenURLInBrowser`, arg1);
}

export function QuitApp() {
  return Call.ByName(`${pkg}.QuitApp`);
}

export function ReadAuto(arg1) {
  return Call.ByName(`${pkg}.ReadAuto`, arg1);
}

export function ReadEML(arg1) {
  return Call.ByName(`${pkg}.ReadEML`, arg1);
}

export function ReadMSG(arg1, arg2) {
  return Call.ByName(`${pkg}.ReadMSG`, arg1, arg2);
}

export function ReadMSGOSS(arg1) {
  return Call.ByName(`${pkg}.ReadMSGOSS`, arg1);
}

export function ReadPEC(arg1) {
  return Call.ByName(`${pkg}.ReadPEC`, arg1);
}

export function ReloadConfig() {
  return Call.ByName(`${pkg}.ReloadConfig`);
}

export function ReloadEMLyConfig() {
  return Call.ByName(`${pkg}.ReloadEMLyConfig`);
}

export function RestartApp() {
  return Call.ByName(`${pkg}.RestartApp`);
}

export function SaveConfig(arg1) {
  return Call.ByName(`${pkg}.SaveConfig`, arg1);
}

export function SaveScreenshot() {
  return Call.ByName(`${pkg}.SaveScreenshot`);
}

export function SaveScreenshotAs() {
  return Call.ByName(`${pkg}.SaveScreenshotAs`);
}

export function SetCurrentMailFilePath(arg1) {
  return Call.ByName(`${pkg}.SetCurrentMailFilePath`, arg1);
}

export function SetUpdateCheckerEnabled(arg1) {
  return Call.ByName(`${pkg}.SetUpdateCheckerEnabled`, arg1);
}

export function SetUpdatePath(arg1) {
  return Call.ByName(`${pkg}.SetUpdatePath`, arg1);
}

export function ShowOpenFileDialog() {
  return Call.ByName(`${pkg}.ShowOpenFileDialog`);
}

export function SubmitBugReport(arg1) {
  return Call.ByName(`${pkg}.SubmitBugReport`, arg1);
}

export function TakeScreenshot() {
  return Call.ByName(`${pkg}.TakeScreenshot`);
}
