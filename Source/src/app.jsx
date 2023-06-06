import React from "react"
import csvparse from "parse-csv-to-obj"
import "./index.css"

export default function App() {
    var [data, setData] = React.useState()
    React.useEffect(() => {
        fetch("data.csv").then(x => x.text()).then(x => setData(csvparse(x, {0: "category"})))
    }, [])

    var categories = []

    if (data !== undefined) {
        for (var key in data) {
            var elements = []
            data[key].forEach(entry => {
                elements.push(<Element Title={entry[0]} Text={entry[1]}/>)
            })

            categories.push(<div><h1>{key}</h1>{elements}</div>)
        } 
    }

    return (
        <div>
            {categories}
        </div>
    )
}

function Element(props) {
    return (
        <div className="Element" onClick={props.onClick}>
            <h2>{props.Title}</h2>
            <p>{props.Text}</p>
        </div>
    )
}