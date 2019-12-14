import React, {FC, useState} from "react"
import ReactDOM from "react-dom"
import classNames from "classnames"

import PinField from "./pin-field"

const App: FC = () => {
  const [demoCompleted, setDemoCompleted] = useState(false)

  const [code, setCode] = useState("")
  const [completed, setCompleted] = useState(false)

  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand" href="/">
          react-pin-field
        </a>
        <ul className="navbar-nav mr-auto" />
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a
              className="nav-link"
              href="https://github.com/soywod/react-pin-field"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
      </nav>

      <div className="jumbotron pb-3">
        <div className="container text-center">
          <h1 className="display-3">react-pin-field</h1>
          <p className="lead">A React component for entering PIN codes.</p>
          <code className="bg-light">$ npm install react-pin-field</code>
          <div className="container-a">
            <PinField
              className={classNames("field-a", {"field-a-complete": demoCompleted})}
              onComplete={() => setDemoCompleted(true)}
              autoFocus
              disabled={demoCompleted}
            />
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <h2 className="display-5 mb-4">Default</h2>
        <PinField />

        <h2 className="display-5 mt-5">With custom style</h2>
        <p className="mb-4 text-muted">
          You can pass a custom className, a custom style, or override the CSS class
          .react-pin-field
        </p>
        <PinField
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            border: "1px solid gray",
            outline: "none",
            textAlign: "center",
            margin: 10,
          }}
        />

        <h2 className="display-5 mt-5">With custom length</h2>
        <p className="mb-4 text-muted">
          You can set the number of chars with the length prop. Default set to 5 chars.
        </p>
        <PinField className="field-a" length={3} />

        <h2 className="display-5 mt-5">With custom events</h2>
        <ul className="mb-4 text-muted">
          <li>onChange: when a char change</li>
          <li>onComplete: when all the chars have been filled</li>
        </ul>
        <PinField className="field-a" onChange={setCode} onComplete={() => setCompleted(true)} />
        <div>Current code: {code}</div>
        <div>Completed: {String(completed)}</div>

        <h2 className="display-5 mt-5">With custom InputHTMLAttributes</h2>
        <p className="mb-4 text-muted">
          Props inherit from InputHTMLAttributes. For eg. with a password type prop:
        </p>
        <PinField className="field-a" type="password" />
      </div>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
