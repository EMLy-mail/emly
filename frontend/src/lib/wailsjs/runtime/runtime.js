/*
 Wails v3 runtime compatibility shim.
 Exposes the same API surface as the Wails v2 runtime so that existing
 imports from '$lib/wailsjs/runtime/runtime' continue to work without change.
*/

import { Events, Window, Application } from '@wailsio/runtime';

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

// In v3, event callbacks receive a WailsEvent object ({ name, data }).
// Wrap so callers receive the raw data directly, matching v2 behaviour.

export function EventsOnMultiple(eventName, callback, maxCallbacks) {
    return Events.OnMultiple(eventName, (ev) => callback(ev.data), maxCallbacks);
}

export function EventsOn(eventName, callback) {
    return Events.On(eventName, (ev) => callback(ev.data));
}

export function EventsOnce(eventName, callback) {
    return Events.Once(eventName, (ev) => callback(ev.data));
}

export function EventsOff(eventName, ...additionalEventNames) {
    Events.Off(eventName, ...additionalEventNames);
}

export function EventsOffAll() {
    Events.OffAll();
}

export function EventsEmit(eventName, ...args) {
    Events.Emit(eventName, args.length === 1 ? args[0] : args);
}

// ---------------------------------------------------------------------------
// Window
// ---------------------------------------------------------------------------

export function WindowShow() {
    Window.Show();
}

export function WindowHide() {
    Window.Hide();
}

export function WindowMaximise() {
    Window.Maximise();
}

export function WindowUnmaximise() {
    Window.UnMaximise();
}

export function WindowToggleMaximise() {
    Window.ToggleMaximise();
}

export function WindowIsMaximised() {
    return Window.IsMaximised();
}

export function WindowMinimise() {
    Window.Minimise();
}

export function WindowUnminimise() {
    Window.UnMinimise();
}

export function WindowIsMinimised() {
    return Window.IsMinimised();
}

export function WindowCenter() {
    Window.Center();
}

export function WindowSetTitle(title) {
    Window.SetTitle(title);
}

export function WindowSetSize(width, height) {
    Window.SetSize(width, height);
}

export function WindowSetMinSize(width, height) {
    Window.SetMinSize(width, height);
}

export function WindowSetMaxSize(width, height) {
    Window.SetMaxSize(width, height);
}

export function WindowSetAlwaysOnTop(b) {
    Window.SetAlwaysOnTop(b);
}

// ---------------------------------------------------------------------------
// Application / Logging
// ---------------------------------------------------------------------------

export function Quit() {
    Application.Quit();
}

export function Hide() {
    Application.Hide();
}

export function Show() {
    Application.Show();
}

// Logging stubs — Wails v3 no longer routes log calls to the Go logger
// through the frontend runtime.  Fall back to the browser console.
export function LogPrint(message) { console.log(message); }
export function LogTrace(message) { console.trace(message); }
export function LogDebug(message) { console.debug(message); }
export function LogInfo(message)  { console.info(message); }
export function LogWarning(message) { console.warn(message); }
export function LogError(message) { console.error(message); }
export function LogFatal(message) { console.error('[FATAL]', message); }
