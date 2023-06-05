# CSVParse (parse-csv-to-obj on npm)

This package allows you to parse CSV files into JavaScript objects.

## Example

### Without any options

| 1 | 2 | 3 |
|---|---|---|
| 4 | 5 | 6 |
| 7 | 8 | 9 |

This converts to:

`[["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"]]`

### With categories
This only has 1 column of categories. You can have an unlimited amount of nested categories.

| Category 1 | 1 | 2 | 3 |  |
|---|---|---|---|---|
|  | 4 | 5 | 6 |  |
| Category 2 | 7 | 8 | 9 |  |
|  |  |  |  |  |

This converts to:

`{"Category 1": [["1", "2", "3"], ["4", "5", "6"]], "Category 2": [["7", "8", "9"]]}`

## Quick start guide

### Installation
Run `npm install parse-csv-to-obj` in your projects directory.

### Inside your project
Enter `import csvparse from "parse-csv-to-obj"` at the beginning of your script.

Now use `csvparse(YourCsvString)` to parse the CSV.

## Option system
You can use options to alter the way the CSV is being read.

**Options**
- **integer**: Converts all number strings in the column to integers.
- - Valid values: All strings that only contain numbers are converted by this option.
- **boolean**: Converts all boolean strings in the column to integers.
- - Valid values: All strings that contain "0", "1", "false", "true", "f", or "t" are converted by this option.
- **category**: Creates a category in form of a nested object.
- - Valid usage: Only works on the first column or any column that's followed by a category column.

### How to use options
The 2nd argument for the csvparse() function is the option object. Use the column number (starting at 0) as the key and the option as the value.

Example: csvparse("1;2;3", {0: "category", 1: "integer"})

## Ignore lines
The 3rd argument for the csvparse() function is an array to define all lines that should be ignored.

Example: csvparse("1;2;3", {}, [0]) // This ignores the first row.