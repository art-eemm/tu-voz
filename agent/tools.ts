export const TOOLS_DESCRIPTION = `
You control a browser.

Available actions:

click
type
scroll
navigate
open_result
read_page
go_back

NEW ACTIONS:

click_xy
type_xy

click_xy:
Click using screen coordinates.

Example:
{
 "action": "click_xy",
 "x": 420,
 "y": 360
}

type_xy:
Click coordinates and type text.

Example:
{
 "action": "type_xy",
 "x": 520,
 "y": 410,
 "text": "hello"
}

Always prefer element IDs if visible.
Use click_xy if the element is easier to identify visually.
`;
