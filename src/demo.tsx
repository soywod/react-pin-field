import React, {FC} from "react"
import ReactDOM from "react-dom"

import PinField from "./pin-field"

const App: FC = () => {
  return (
    <>
      <PinField />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
