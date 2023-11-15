import React, {useRef, useState} from "react";
import PinField from "react-pin-field";
import cn from "classnames";

import "./app.scss";

function App() {
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [code, setCode] = useState("");
  const [completed, setCompleted] = useState(false);
  const ref = useRef<HTMLInputElement[]>([]);

  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand" href="/">
          React PIN Field
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
          <h1 className="display-3">📟 React PIN Field</h1>
          <p className="lead">React component for entering PIN codes.</p>
          <div className="mb-4">
            <a className="mr-2" href="https://github.com/soywod/react-pin-field/actions/workflows/test.yml">
              <img
                src="https://img.shields.io/github/actions/workflow/status/soywod/react-pin-field/tests.yml?branch=master&label=tests&logo=github&style=flat-square"
                alt=""
              />
            </a>
            <a className="mr-2" href="https://app.codecov.io/gh/soywod/react-pin-field">
              <img
                src="https://img.shields.io/codecov/c/github/soywod/react-pin-field?logo=codecov&style=flat-square"
                alt=""
              />
            </a>
            <a className="mr-2" href="https://www.npmjs.com/package/react-pin-field">
              <img
                src="https://img.shields.io/npm/v/react-pin-field?logo=npm&label=npm&color=success&style=flat-square"
                alt=""
              />
            </a>
            <kbd>$ yarn add react-pin-field</kbd>
          </div>
          <div className="pin-field-container">
            <PinField
              className={cn("pin-field", {complete: demoCompleted})}
              onComplete={() => setDemoCompleted(true)}
              format={k => k.toUpperCase()}
              autoFocus
              disabled={demoCompleted}
              autoComplete="one-time-password"
            />
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <h2 className="display-5 mb-4">Default</h2>
        <div>
          <PinField data-cy="pin-field" />
        </div>

        <h2 className="display-5 mt-4">Reference</h2>
        <p className="mb-4 text-muted">Every input can be controlled thanks to the React reference:</p>
        <div>
          <PinField ref={ref} />
        </div>
        <div>
          <button onClick={() => ref && ref.current && ref.current[1].focus()}>Focus 2nd input</button>
          <button onClick={() => ref && ref.current && ref.current.forEach(input => (input.value = ""))}>
            Reset values
          </button>
        </div>

        <h2 className="display-5 mt-5">Style</h2>
        <p className="mb-4 text-muted">
          The pin field can be styled either with <code>style</code> or <code>className</code>. This last one allows you
          to use pseudo-classes like <code>:nth-of-type</code>,<code>:focus</code>, <code>:hover</code>,
          <code>:valid</code>,<code>:invalid</code>…
        </p>
        <div>
          <PinField className="pin-field" />
        </div>

        <h2 className="display-5 mt-5">Length</h2>
        <p className="mb-4 text-muted">
          The length of the code (number of characters) can be customized with the <code>length</code> prop.
        </p>
        <div>
          <p>Length: 3</p>
          <PinField className="pin-field" length={3} />
        </div>

        <h2 className="display-5 mt-5">Validate</h2>
        <p className="mb-4 text-muted">
          Characters can be validated with a validator. A validator can take the form of:
          <ul>
            <li>
              a String of allowed characters: <code>abcABC123</code>
            </li>
            <li>
              an Array of allowed characters: <code>["a", "b", "c", "1", "2", "3"]</code>
            </li>
            <li>
              a RegExp: <code>/^[a-zA-Z0-9]$/</code>
            </li>
            <li>
              a predicate: <code>(char: string) =&gt; boolean</code>
            </li>
          </ul>
        </p>
        <div>
          <p>Only numbers:</p>
          <PinField className="pin-field" validate="0123456789" inputMode="numeric" />
        </div>

        <h2 className="display-5 mt-5">Format</h2>
        <p className="mb-4 text-muted">
          Characters can be formatted with a formatter <code>(char: string) =&gt; string</code>.
        </p>
        <div>
          <p>Uppercase:</p>
          <PinField className="pin-field" format={c => c.toUpperCase()} />
        </div>

        {/* TODO: uncomment this code snippet for docs
        <h2 className="display-5 mt-5">Custom input aria-label</h2>
        <p className="mb-4 text-muted">
          You can customize inputs' aria-labels with your own sentence using{" "}
          <code>(idx: number, codeLength: number) =&gt; string</code>
        </p>
        <div>
          <PinField className="pin-field" formatAriaLabel={(i: number, c: number) => `custom pin code ${i} of ${c}`} />
        </div>
        */}

        <h2 className="display-5 mt-5">Events</h2>
        <ul className="mb-4 text-muted">
          <li>onResolveKey: when a key passes the validator</li>
          <li>onRejectKey: when a key is rejected by the validator</li>
          <li>onChange: when the code changes</li>
          <li>onComplete: when the code has been fully filled</li>
        </ul>
        <div>
          <PinField
            className="pin-field"
            onChange={setCode}
            onComplete={() => setCompleted(true)}
            format={k => k.toUpperCase()}
          />
        </div>
        <div>Current code: {code}</div>
        <div>Completed: {String(completed)}</div>

        <h2 className="display-5 mt-5">Custom InputHTMLAttributes</h2>
        <p className="mb-4 text-muted">Props inherit from InputHTMLAttributes. For eg. with a password type prop:</p>
        <div>
          <PinField className="pin-field" type="password" />
        </div>
      </div>
    </>
  );
}

export default App;
