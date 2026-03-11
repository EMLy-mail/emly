package internal

// EmailFilters defines the file filters for the email file open dialog.
var EmailFilters = []struct {
	DisplayName string
	Pattern     string
}{
	{DisplayName: "Email Files (*.eml;*.msg)", Pattern: "*.eml;*.msg"},
	{DisplayName: "EML Files (*.eml)", Pattern: "*.eml"},
	{DisplayName: "MSG Files (*.msg)", Pattern: "*.msg"},
}
