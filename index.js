const _ = require("lodash")

function parseBool(value) {
    if (["1", 1, "true", "t"].includes(value)) {
        return true
    } else if (["0", 0, "false", "f"].includes(value)) {
        return false
    } else {
        return undefined
    }
}

function reverseArray(array) { // Because some browsers don't support .toReversed()
    return array.reverse()
}

function csvparse(csv, options={}, ignoreLines=[]) {
    var lines = csv.replaceAll("\r", "").split("\n") // Remove /r because not needed and then split the lines
    var result = []

    // Remove empty lines at end that might be made by Excel
    if (lines[lines.length - 1] === "") {
        lines.splice(lines.length - 1, 1)
    }

    // Convert csv items to array
    lines.forEach(line => {
        result.push([])
        var entries = line.split(";")
        entries.forEach(entry => {
            result[result.length - 1].push(entry)
        })
    })

    if (options !== {}) {
        // Remove ignored lines
        result.forEach((line, lineIndex) => {
            if (ignoreLines.includes(lineIndex)) {
                result.splice(lineIndex, 1)
            }
        })

        // Get indexes of columns with category option
        var categoryIndexes = []
        for (var key in options) {
            if (options[key] === "category") {
                categoryIndexes.push(parseInt(key))
            }
        }
        categoryIndexes.sort()

        categoryIndexes.forEach(index => {
            if (result[0][index] === "") {
                throw "Error: The first CSV line can't have empty categories. Read documentation at ..."
            }
        })


        // Convert datatypes according to options
        result.forEach((line, lineIndex) => {
            line.forEach((entry, entryIndex) => {
                if (["int", "integer", "i"].includes(options[entryIndex]) && parseInt(entry) !== NaN) {
                    result[lineIndex][entryIndex] = parseInt(entry)
                } else if (["bool", "boolean", "b"].includes(options[entryIndex]) && parseBool(entry) !== undefined) {
                    result[lineIndex][entryIndex] = parseBool(entry) 
                }
            })
        })

        // Fill empty categories. Needed to merge them together later.
        if (categoryIndexes.length !== 0) {
            var lastLine
            result.forEach((line, lineIndex) => {
                line.forEach((entry, entryIndex) => {
                    if (categoryIndexes.includes(entryIndex) && entry === "") {
                        result[lineIndex][entryIndex] = lastLine[entryIndex]
                    }
                })
                lastLine = line
            })
        }

        // Check if categories are used properly
        var last = 0
        var error = false
        categoryIndexes.forEach(category => {
            if (last !== category) {
                console.log(category, last+1)
                error = true
            }
            last += 1
        })
        if (error === true) {return "Error: Wrong category option usage. Read documentation at ..."}

        // Convert each line to an object (  Example: [A, B, 1, 2] => {"A": {"B": [1, 2]}}  )
        var categories = []
        reverseArray(result).forEach((line, lineIndex) => {
            lineIndex = result.length - 1 - lineIndex // Reverse index
            
            var newLine = {}
            var array = []
            reverseArray(line).forEach((entry, entryIndex) => {
                entryIndex = line.length - 1 - entryIndex // Reverse index

                if (!categoryIndexes.includes(entryIndex)) {
                    array.unshift(entry)
                } else {
                    if (categoryIndexes[categoryIndexes.length - 1] === entryIndex) {
                        newLine = {[entry]: [array]}
                    } else {
                        newLine = {[entry]: newLine}
                    }
                }
                
            })
            if (categoryIndexes.length === 0) {
                newLine = array
            }
            categories.unshift(newLine)
        })

        // Merge lines with same category
        if (categoryIndexes.length >= 1) {
            var combinedCategories = {}
            function customizer(objValue, srcValue) {
                if (_.isArray(objValue)) {
                    return objValue.concat(srcValue)
                }
            }
            categories.forEach((line, lineIndex) => {
               _.mergeWith(combinedCategories, line, customizer)
            })
            return combinedCategories
        }
        return categories
    }
    return result
}

module.exports = csvparse