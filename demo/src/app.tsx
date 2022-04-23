import React, {FC, useRef, useState} from "react";
import ReactDOM from "react-dom";
<<<<<<< HEAD:lib/src/demo/index.tsx
import cn from "classnames";

import ReactPinField, {PinField} from "..";
=======
import PinField from "react-pin-field"
import cn from "classnames";

import './app.scss';
>>>>>>> 5ac272f (revert lib to v1 state):demo/src/app.tsx

function App() {
  const [demoCompleted, setDemoCompleted] = useState(false);
  const [code, setCode] = useState("");
  const [completed, setCompleted] = useState(false);
  const ref = useRef<PinField | null>(null);

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
          <p className="lead">A React component for entering PIN codes.</p>
          <div className="mb-4">
            <a className="mr-2" href="https://travis-ci.org/soywod/react-pin-field">
              <img src="https://travis-ci.org/soywod/react-pin-field.svg?branch=master" alt="" />
            </a>
            <a className="mr-2" href="https://codecov.io/gh/soywod/react-pin-field">
              <img src="https://codecov.io/gh/soywod/react-pin-field/branch/master/graph/badge.svg" alt="" />
            </a>
            <a className="mr-2" href="https://www.npmjs.com/package/react-pin-field">
              <img src="https://img.shields.io/npm/v/react-pin-field?label=npm" alt="" />
            </a>
            <kbd>$ yarn add react-pin-field</kbd>
          </div>
          <div className="pin-field-container">
<<<<<<< HEAD:lib/src/demo/index.tsx
            <ReactPinField
=======
            <PinField
>>>>>>> 5ac272f (revert lib to v1 state):demo/src/app.tsx
              className={cn("pin-field", {complete: demoCompleted})}
              onComplete={() => setDemoCompleted(true)}
              format={k => k.toUpperCase()}
              autoFocus
              disabled={demoCompleted}
            />
          </div>
        </div>
      </div>

      <div className="container mb-5">
        <h2 className="display-5 mb-4">Default</h2>
        <div>
<<<<<<< HEAD:lib/src/demo/index.tsx
          <ReactPinField data-cy="pin-field" />
        </div>

        <h2 className="display-5 mt-4">With ref</h2>
        <p className="mb-4 text-muted">You can control each input with the pin field ref:</p>
=======
          <PinField data-cy="pin-field" />
        </div>

        <h2 className="display-5 mt-4">With ref</h2>
        <p className="mb-4 text-muted">You can control each inputs with the pin field ref:</p>
        <div>
          <PinField ref={ref} />
        </div>
>>>>>>> 5ac272f (revert lib to v1 state):demo/src/app.tsx
        <div>
          <ReactPinField ref={ref} />
        </div>
        <div>
          <button onClick={() => ref && ref.current && ref.current.inputs[1].focus()}>Focus 2nd input</button>
          <button onClick={() => ref && ref.current && ref.current.inputs.forEach(input => (input.value = ""))}>
            Reset values
          </button>
        </div>

        <h2 className="display-5 mt-5">With custom style</h2>
        <p className="mb-4 text-muted">
<<<<<<< HEAD:lib/src/demo/index.tsx
          The attributes <code>className</code> and <code>style</code> are transmitted to all inputs. You can also use
          pseudo-classes
          <code>:valid</code>, <code>:invalid</code>, <code>:focus</code>, <code>:hover</code>…
        </p>
        <div>
          <ReactPinField className="pin-field" />
        </div>

        <h2 className="display-5 mt-5">With custom length</h2>
        <p className="mb-4 text-muted">You can set the number of chars with the length attribute.</p>
        <div>
          <ReactPinField className="pin-field" length={3} />
=======
          The field can be customized with the <code>class</code> and <code>style</code> attributes. Standard validation pseudo-classes <code>:valid</code> and <code>:invalid</code> can also be used. Since there is no <code>:complete</code> pseudo-classe, the field exposes a custom attribute <code>completed</code> to match with <code>disabled</code>.
        </p>
        <div>
          <PinField className="pin-field" />
        </div>

        <h2 className="display-5 mt-5">With custom length</h2>
        <p className="mb-4 text-muted">You can set the number of chars with the length prop. Default set to 5 chars.</p>
        <div>
          <PinField className="pin-field" length={3} />
>>>>>>> 5ac272f (revert lib to v1 state):demo/src/app.tsx
        </div>

        <h2 className="display-5 mt-5">With custom validation</h2>
        <p className="mb-4 text-muted">
          You can restrict input with a string of allowed chars, a regex, or a function.
        </p>
        <p>Only numbers:</p>
        <div>
<<<<<<< HEAD:lib/src/demo/index.tsx
          <ReactPinField className="pin-field" validate="0123456789" inputMode="numeric" />
=======
          <PinField className="pin-field" validate="0123456789" inputMode="numeric" />
>>>>>>> 5ac272f (revert lib to v1 state):demo/src/app.tsx
        </div>

        <h2 className="display-5 mt-5">With custom events</h2>
        <ul className="mb-4 text-muted">
          <li>onChange: when the code changes</li>
          <li>onComplete: when the code has been fully filled</li>
          <li>onResolveKey: when receiving a good key</li>
          <li>onRejectKey: when receiving a bad key</li>
        </ul>
        <div>
<<<<<<< HEAD:lib/src/demo/index.tsx
          <ReactPinField
=======
          <PinField
>>>>>>> 5ac272f (revert lib to v1 state):demo/src/app.tsx
            className="pin-field"
            onChange={setCode}
            onComplete={() => setCompleted(true)}
            format={k => k.toUpperCase()}
          />
        </div>
        <div>Current code: {code}</div>
        <div>Completed: {String(completed)}</div>

        <h2 className="display-5 mt-5">With custom InputHTMLAttributes</h2>
        <p className="mb-4 text-muted">Props inherit from InputHTMLAttributes. For eg. with a password type prop:</p>
        <div>
<<<<<<< HEAD:lib/src/demo/index.tsx
          <ReactPinField className="pin-field" type="password" />
=======
          <PinField className="pin-field" type="password" />
>>>>>>> 5ac272f (revert lib to v1 state):demo/src/app.tsx
        </div>
      </div>
    </>
  );
};

export default App;
