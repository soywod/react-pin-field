import{j as jsxRuntimeExports}from"./jsx-runtime-CLpGMVip.js";import{r as reactExports}from"./index-B-SYruCi.js";import{f as fn2}from"./index-MpUCZ_R_.js";const BACKSPACE_KEY_CODE=8,DELETE_KEY_CODE=46;function noop(){}function range(n,e){return Array.from({length:e},(t,s)=>s+n)}function hasFocus(n){try{return(n.webkitMatchesSelector||n.matches).call(n,":focus")}catch{return!1}}const defaultProps={length:5,format:n=>n,formatAriaLabel:(n,e)=>`PIN field ${n} of ${e}`,onChange:noop,onComplete:noop},defaultNativeProps={type:"text",inputMode:"text",autoCapitalize:"off",autoCorrect:"off",autoComplete:"off"},defaultState={length:defaultProps.length,format:defaultProps.format,dir:"ltr",cursor:0,values:Array(defaultProps.length),backspace:!1,composition:!1,ready:!1,dirty:!1};function reducer(n,e){switch(e.type){case"update-props":{const t={...n,...e.props};return t.cursor=Math.min(t.cursor,t.length-1),t.values=t.values.slice(0,t.cursor+1),t.ready=!0,t}case"start-composition":return{...n,dirty:!0,composition:!0};case"end-composition":{const t={...n};e.value?t.values[e.index]=e.value:delete t.values[e.index];const s=t.values[e.index]?1:0;return t.cursor=Math.min(e.index+s,t.length-1),t.composition=!1,t.dirty=!0,t}case"handle-change":{if(n.composition)break;const t={...n};if(e.reset&&t.values.splice(e.index,t.length),e.value){const s=e.value.split("").map(t.format),l=Math.min(t.length-e.index,s.length);t.values.splice(e.index,l,...s.slice(0,l)),t.cursor=Math.min(e.index+l,t.length-1)}else{delete t.values[e.index];const s=t.backspace?0:1;t.cursor=Math.max(0,e.index-s)}return t.backspace=!1,t.dirty=!0,t}case"handle-key-down":{const t=e.key==="Backspace"||e.key==="Delete",s=e.code==="Backspace"||e.code==="Delete",l=e.keyCode===BACKSPACE_KEY_CODE||e.keyCode===DELETE_KEY_CODE,c=e.which===BACKSPACE_KEY_CODE||e.which===DELETE_KEY_CODE;if(!(t||s||l||c)||n.values[e.index])break;{const d={...n};return d.cursor=Math.max(0,e.index-1),d.backspace=!0,d.dirty=!0,d}}}return n}function usePinField(){const n=reactExports.useRef([]),[e,t]=reactExports.useReducer(reducer,defaultState),s=reactExports.useMemo(()=>{let c="";for(let f=0;f<e.length;f++)c+=f in e.values?e.values[f]:"";return c},[e]),l=reactExports.useCallback(c=>{t({type:"handle-change",index:0,value:c,reset:!0})},[t,e.cursor]);return reactExports.useMemo(()=>({refs:n,state:e,dispatch:t,value:s,setValue:l}),[n,e,t,s,l])}const PinField=reactExports.forwardRef(({length:n=defaultProps.length,format:e=defaultProps.format,formatAriaLabel:t=defaultProps.formatAriaLabel,onChange:s=defaultProps.onChange,onComplete:l=defaultProps.onComplete,handler:c,autoFocus:f,...d},O)=>{const N=usePinField(),{refs:p,state:r,dispatch:u}=c||N;reactExports.useImperativeHandle(O,()=>p.current,[p]);function V(a){return o=>{o&&(p.current[a]=o)}}function $(a){return o=>{const{key:i,code:m,keyCode:v,which:z}=o;u({type:"handle-key-down",index:a,key:i,code:m,keyCode:v,which:z})}}function Y(a){return o=>{if(o.nativeEvent instanceof InputEvent){const i=o.nativeEvent.data;u({type:"handle-change",index:a,value:i})}else{const{value:i}=o.target;u({type:"handle-change",index:a,value:i,reset:!0})}}}function B(a){return()=>{u({type:"start-composition",index:a})}}function U(a){return o=>{u({type:"end-composition",index:a,value:o.data})}}if(reactExports.useEffect(()=>{var o,i;if(r.ready)return;const a=((o=d.dir)==null?void 0:o.toLowerCase())||((i=document.documentElement.getAttribute("dir"))==null?void 0:i.toLowerCase());u({type:"update-props",props:{length:n,format:e,dir:a}})},[r.ready,u,n,e]),reactExports.useEffect(()=>{r.ready&&n!==r.length&&u({type:"update-props",props:{length:n}})},[r.ready,n,r.length,u]),reactExports.useEffect(()=>{r.ready&&e!==r.format&&u({type:"update-props",props:{format:e}})},[r.ready,e,r.format,u]),reactExports.useEffect(()=>{var o,i;if(!r.ready)return;const a=((o=d.dir)==null?void 0:o.toLowerCase())||((i=document.documentElement.getAttribute("dir"))==null?void 0:i.toLowerCase());a!==r.dir&&u({type:"update-props",props:{dir:a}})},[r.ready,d.dir,r.dir,u]),reactExports.useEffect(()=>{if(!p.current||!r.ready||!r.dirty)return;let a=!1,o=r.values.length==r.length,i="";for(let m=0;m<r.length;m++){const v=m in r.values?r.values[m]:"";p.current[m].value=v,a=a||hasFocus(p.current[m]),o=o&&m in r.values&&p.current[m].checkValidity(),i+=v}a&&p.current[r.cursor].focus(),s&&s(i),l&&o&&l(i)},[p,r,s,l]),!r.ready)return null;const g=range(0,r.length).map(a=>reactExports.createElement("input",{...defaultNativeProps,...d,key:a,ref:V(a),value:a in r.values?r.values[a]:"",autoFocus:a===0&&f,onKeyDown:$(a),onChange:Y(a),onCompositionStart:B(a),onCompositionEnd:U(a),"aria-label":t(a+1,r.length),"aria-required":d.required?"true":void 0,"aria-disabled":d.disabled?"true":void 0,"aria-readonly":d.readOnly?"true":void 0}));return r.dir==="rtl"&&g.reverse(),g});PinField.__docgenInfo={description:"",methods:[],displayName:"PinField",props:{handler:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  refs: RefObject<HTMLInputElement[]>;
  state: State;
  dispatch: ActionDispatch<[Action]>;
  value: string;
  setValue: (value: string) => void;
}`,signature:{properties:[{key:"refs",value:{name:"RefObject",elements:[{name:"Array",elements:[{name:"HTMLInputElement"}],raw:"HTMLInputElement[]"}],raw:"RefObject<HTMLInputElement[]>",required:!0}},{key:"state",value:{name:"intersection",raw:`StateProps & {
  cursor: number;
  values: string[];
  backspace: boolean;
  composition: boolean;
  ready: boolean;
  dirty: boolean;
}`,elements:[{name:"intersection",raw:'Pick<NativeProps, "dir"> & Pick<InnerProps, "length" | "format">',elements:[{name:"Pick",elements:[{name:"Omit",elements:[{name:"InputHTMLAttributes",elements:[{name:"HTMLInputElement"}],raw:"InputHTMLAttributes<HTMLInputElement>"},{name:"union",raw:'"onChange" | "onKeyDown" | "onCompositionStart" | "onCompositionEnd"',elements:[{name:"literal",value:'"onChange"'},{name:"literal",value:'"onKeyDown"'},{name:"literal",value:'"onCompositionStart"'},{name:"literal",value:'"onCompositionEnd"'}]}],raw:`Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "onKeyDown" | "onCompositionStart" | "onCompositionEnd"
>`},{name:"literal",value:'"dir"'}],raw:'Pick<NativeProps, "dir">'},{name:"Pick",elements:[{name:"signature",type:"object",raw:`{
  length: number;
  format: (char: string) => string;
  formatAriaLabel: (index: number, total: number) => string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
}`,signature:{properties:[{key:"length",value:{name:"number",required:!0}},{key:"format",value:{name:"signature",type:"function",raw:"(char: string) => string",signature:{arguments:[{type:{name:"string"},name:"char"}],return:{name:"string"}},required:!0}},{key:"formatAriaLabel",value:{name:"signature",type:"function",raw:"(index: number, total: number) => string",signature:{arguments:[{type:{name:"number"},name:"index"},{type:{name:"number"},name:"total"}],return:{name:"string"}},required:!0}},{key:"onChange",value:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}},required:!0}},{key:"onComplete",value:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}},required:!0}}]}},{name:"union",raw:'"length" | "format"',elements:[{name:"literal",value:'"length"'},{name:"literal",value:'"format"'}]}],raw:'Pick<InnerProps, "length" | "format">'}]},{name:"signature",type:"object",raw:`{
  cursor: number;
  values: string[];
  backspace: boolean;
  composition: boolean;
  ready: boolean;
  dirty: boolean;
}`,signature:{properties:[{key:"cursor",value:{name:"number",required:!0}},{key:"values",value:{name:"Array",elements:[{name:"string"}],raw:"string[]",required:!0}},{key:"backspace",value:{name:"boolean",required:!0}},{key:"composition",value:{name:"boolean",required:!0}},{key:"ready",value:{name:"boolean",required:!0}},{key:"dirty",value:{name:"boolean",required:!0}}]}}],required:!0}},{key:"dispatch",value:{name:"ActionDispatch",elements:[{name:"tuple",raw:"[Action]",elements:[{name:"union",raw:`| NoOpAction
| UpdatePropsAction
| HandleCompositionStartAction
| HandleCompositionEndAction
| HandleKeyChangeAction
| HandleKeyDownAction`,elements:[{name:"signature",type:"object",raw:`{
  type: "noop";
}`,signature:{properties:[{key:"type",value:{name:"literal",value:'"noop"',required:!0}}]}},{name:"signature",type:"object",raw:`{
  type: "update-props";
  props: Partial<StateProps>;
}`,signature:{properties:[{key:"type",value:{name:"literal",value:'"update-props"',required:!0}},{key:"props",value:{name:"Partial",elements:[{name:"intersection",raw:'Pick<NativeProps, "dir"> & Pick<InnerProps, "length" | "format">',elements:[{name:"Pick",elements:[{name:"Omit",elements:[{name:"InputHTMLAttributes",elements:[{name:"HTMLInputElement"}],raw:"InputHTMLAttributes<HTMLInputElement>"},{name:"union",raw:'"onChange" | "onKeyDown" | "onCompositionStart" | "onCompositionEnd"',elements:[{name:"literal",value:'"onChange"'},{name:"literal",value:'"onKeyDown"'},{name:"literal",value:'"onCompositionStart"'},{name:"literal",value:'"onCompositionEnd"'}]}],raw:`Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "onKeyDown" | "onCompositionStart" | "onCompositionEnd"
>`},{name:"literal",value:'"dir"'}],raw:'Pick<NativeProps, "dir">'},{name:"Pick",elements:[{name:"signature",type:"object",raw:`{
  length: number;
  format: (char: string) => string;
  formatAriaLabel: (index: number, total: number) => string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
}`,signature:{properties:[{key:"length",value:{name:"number",required:!0}},{key:"format",value:{name:"signature",type:"function",raw:"(char: string) => string",signature:{arguments:[{type:{name:"string"},name:"char"}],return:{name:"string"}},required:!0}},{key:"formatAriaLabel",value:{name:"signature",type:"function",raw:"(index: number, total: number) => string",signature:{arguments:[{type:{name:"number"},name:"index"},{type:{name:"number"},name:"total"}],return:{name:"string"}},required:!0}},{key:"onChange",value:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}},required:!0}},{key:"onComplete",value:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}},required:!0}}]}},{name:"union",raw:'"length" | "format"',elements:[{name:"literal",value:'"length"'},{name:"literal",value:'"format"'}]}],raw:'Pick<InnerProps, "length" | "format">'}]}],raw:"Partial<StateProps>",required:!0}}]}},{name:"signature",type:"object",raw:`{
  type: "start-composition";
  index: number;
}`,signature:{properties:[{key:"type",value:{name:"literal",value:'"start-composition"',required:!0}},{key:"index",value:{name:"number",required:!0}}]}},{name:"signature",type:"object",raw:`{
  type: "end-composition";
  index: number;
  value: string;
}`,signature:{properties:[{key:"type",value:{name:"literal",value:'"end-composition"',required:!0}},{key:"index",value:{name:"number",required:!0}},{key:"value",value:{name:"string",required:!0}}]}},{name:"signature",type:"object",raw:`{
  type: "handle-change";
  index: number;
  value: string | null;
  reset?: boolean;
}`,signature:{properties:[{key:"type",value:{name:"literal",value:'"handle-change"',required:!0}},{key:"index",value:{name:"number",required:!0}},{key:"value",value:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}],required:!0}},{key:"reset",value:{name:"boolean",required:!1}}]}},{name:"intersection",raw:`{
  type: "handle-key-down";
  index: number;
} & Partial<Pick<KeyboardEvent<HTMLInputElement>, "key" | "code" | "keyCode" | "which">>`,elements:[{name:"signature",type:"object",raw:`{
  type: "handle-key-down";
  index: number;
}`,signature:{properties:[{key:"type",value:{name:"literal",value:'"handle-key-down"',required:!0}},{key:"index",value:{name:"number",required:!0}}]}},{name:"Partial",elements:[{name:"Pick",elements:[{name:"KeyboardEvent",elements:[{name:"HTMLInputElement"}],raw:"KeyboardEvent<HTMLInputElement>"},{name:"union",raw:'"key" | "code" | "keyCode" | "which"',elements:[{name:"literal",value:'"key"'},{name:"literal",value:'"code"'},{name:"literal",value:'"keyCode"'},{name:"literal",value:'"which"'}]}],raw:'Pick<KeyboardEvent<HTMLInputElement>, "key" | "code" | "keyCode" | "which">'}],raw:'Partial<Pick<KeyboardEvent<HTMLInputElement>, "key" | "code" | "keyCode" | "which">>'}]}]}]}],raw:"ActionDispatch<[Action]>",required:!0}},{key:"value",value:{name:"string",required:!0}},{key:"setValue",value:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}},required:!0}}]}},description:""},length:{defaultValue:{value:"5",computed:!1},required:!1},format:{defaultValue:{value:"char => char",computed:!1},required:!1},formatAriaLabel:{defaultValue:{value:"(index: number, total: number) => `PIN field ${index} of ${total}`",computed:!1},required:!1},onChange:{defaultValue:{value:"function noop(): void {}",computed:!1},required:!1},onComplete:{defaultValue:{value:"function noop(): void {}",computed:!1},required:!1}}};const defaultArgs={length:defaultProps.length,format:defaultProps.format,formatAriaLabel:defaultProps.formatAriaLabel,onChange:fn2(),onComplete:fn2()},meta={title:"PinField",component:PinField,tags:["autodocs"],parameters:{layout:"centered",docs:{description:{component:"The `<PinField />` component is a simple wrapper around a list of HTML inputs.\n\nThe component exposes 4 event handlers, see stories below to learn more about the other props."}}}},Default={render:n=>jsxRuntimeExports.jsx(PinField,{...n,"data-cy":"pin-field"}),args:defaultArgs},StrictMode={render:n=>jsxRuntimeExports.jsx(reactExports.StrictMode,{children:jsxRuntimeExports.jsx(PinField,{...n})}),args:defaultArgs},Controlled={render:({controlled:n})=>{const e=usePinField();return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{children:jsxRuntimeExports.jsx(PinField,{handler:n?e:void 0})}),jsxRuntimeExports.jsx("button",{onClick:()=>{var t;return(t=e.refs.current[0])==null?void 0:t.focus()},children:"focus first"}),jsxRuntimeExports.jsx("input",{type:"text",placeholder:"custom pin",value:e.value,onChange:t=>e.setValue(t.target.value)})]})},args:{controlled:!0}},Format={render:({formatEval,...props})=>{try{let format=eval(formatEval);return format("a"),jsxRuntimeExports.jsx(PinField,{...props,format})}catch(n){return jsxRuntimeExports.jsxs("div",{children:["Invalid format function: ",n.toString()]})}},argTypes:{formatEval:{control:"text",name:"format (fn eval)"}},args:{formatEval:"char => char.toUpperCase()",...defaultArgs}},HTMLInputAttributes={render:({formatAriaLabelEval,...props})=>{try{let formatAriaLabel=eval(formatAriaLabelEval);return formatAriaLabel(0,0),jsxRuntimeExports.jsxs("form",{children:[jsxRuntimeExports.jsx("div",{children:jsxRuntimeExports.jsx(PinField,{...props,formatAriaLabel})}),jsxRuntimeExports.jsx("button",{type:"submit",children:"submit"})]})}catch(n){return jsxRuntimeExports.jsxs("div",{children:["Invalid format aria label function: ",n.toString()]})}},argTypes:{formatAriaLabelEval:{control:"text",name:"formatAriaLabel (fn eval)"},type:{control:"select",options:["text","number","password"]},dir:{control:"select",options:["ltr","rtl"]},autoComplete:{control:"select",options:["off","on","one-time-code"]}},args:{type:"password",className:"pin-field",pattern:"[0-9]+",required:!1,autoFocus:!1,disabled:!1,autoCorrect:"off",autoComplete:"one-time-code",dir:"ltr",formatAriaLabelEval:"(i, n) => `field ${i}/${n}`",...defaultArgs}};var y,h,b;Default.parameters={...Default.parameters,docs:{...(y=Default.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: props => <PinField {...props} data-cy="pin-field" />,
  args: defaultArgs
}`,...(b=(h=Default.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var E,x,C,k,w;StrictMode.parameters={...StrictMode.parameters,docs:{...(E=StrictMode.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: props => <ReactStrictMode>
      <PinField {...props} />
    </ReactStrictMode>,
  args: defaultArgs
}`,...(C=(x=StrictMode.parameters)==null?void 0:x.docs)==null?void 0:C.source},description:{story:"Story to detect inconsistent behaviours in React Strict Mode.",...(w=(k=StrictMode.parameters)==null?void 0:k.docs)==null?void 0:w.description}}};var A,P,L,M,I;Controlled.parameters={...Controlled.parameters,docs:{...(A=Controlled.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: ({
    controlled
  }) => {
    const handler = usePinField();
    return <>
        <div>
          <PinField handler={controlled ? handler : undefined} />
        </div>
        <button onClick={() => handler.refs.current[0]?.focus()}>focus first</button>
        <input type="text" placeholder="custom pin" value={handler.value} onChange={event => handler.setValue(event.target.value)} />
      </>;
  },
  args: {
    controlled: true
  }
}`,...(L=(P=Controlled.parameters)==null?void 0:P.docs)==null?void 0:L.source},description:{story:"The `usePinField()` hook exposes a handler to control the PIN field:\n\n- `refs`: the list of HTML input elements that composes the PIN field\n- `value`: the current value of the PIN field\n- `setValue`: change the current value of the PIN field\n\nIt also exposes the internal `state` and `dispatch` for advance usage.\n\nThe handler returned by `usePinField()` needs to be passed down to the composant for the control to work:\n\n```tsx\nconst handler = usePinField();\nreturn <PinField handler={handler} />\n```",...(I=(M=Controlled.parameters)==null?void 0:M.docs)==null?void 0:I.description}}};var j,q,T,F,H;Format.parameters={...Format.parameters,docs:{...(j=Format.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: ({
    formatEval,
    ...props
  }) => {
    try {
      let format = eval(formatEval);
      format("a");
      return <PinField {...props} format={format} />;
    } catch (err: any) {
      return <div>Invalid format function: {err.toString()}</div>;
    }
  },
  argTypes: {
    formatEval: {
      control: "text",
      name: "format (fn eval)"
    }
  },
  args: {
    formatEval: "char => char.toUpperCase()",
    ...defaultArgs
  }
}`,...(T=(q=Format.parameters)==null?void 0:q.docs)==null?void 0:T.source},description:{story:"Characters can be formatted with a formatter `(char: string) => string`.",...(H=(F=Format.parameters)==null?void 0:F.docs)==null?void 0:H.description}}};var S,D,R,K,_;HTMLInputAttributes.parameters={...HTMLInputAttributes.parameters,docs:{...(S=HTMLInputAttributes.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: ({
    formatAriaLabelEval,
    ...props
  }) => {
    try {
      let formatAriaLabel = eval(formatAriaLabelEval);
      formatAriaLabel(0, 0);
      return <form>
          <div>
            <PinField {...props} formatAriaLabel={formatAriaLabel} />
          </div>
          <button type="submit">submit</button>
        </form>;
    } catch (err: any) {
      return <div>Invalid format aria label function: {err.toString()}</div>;
    }
  },
  argTypes: {
    formatAriaLabelEval: {
      control: "text",
      name: "formatAriaLabel (fn eval)"
    },
    type: {
      control: "select",
      options: ["text", "number", "password"]
    },
    dir: {
      control: "select",
      options: ["ltr", "rtl"]
    },
    autoComplete: {
      control: "select",
      options: ["off", "on", "one-time-code"]
    }
  },
  args: {
    type: "password",
    className: "pin-field",
    pattern: "[0-9]+",
    required: false,
    autoFocus: false,
    disabled: false,
    autoCorrect: "off",
    autoComplete: "one-time-code",
    dir: "ltr",
    formatAriaLabelEval: "(i, n) => \`field \${i}/\${n}\`",
    ...defaultArgs
  }
}`,...(R=(D=HTMLInputAttributes.parameters)==null?void 0:D.docs)==null?void 0:R.source},description:{story:"Characters can be validated using the HTML input attribute `pattern`:",...(_=(K=HTMLInputAttributes.parameters)==null?void 0:K.docs)==null?void 0:_.description}}};const __namedExportsOrder=["Default","StrictMode","Controlled","Format","HTMLInputAttributes"];export{Controlled,Default,Format,HTMLInputAttributes,StrictMode,__namedExportsOrder,meta as default};
