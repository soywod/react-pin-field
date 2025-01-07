import{j as jsxRuntimeExports}from"./jsx-runtime-CLpGMVip.js";import{r as reactExports}from"./index-B-SYruCi.js";import{f as fn2}from"./index-CzjNP0xw.js";function noop(){}function range(r,e){return Array.from({length:e},(t,s)=>s+r)}const BACKSPACE=8,DELETE=46,defaultProps={length:5,format:r=>r,formatAriaLabel:(r,e)=>`PIN field ${r} of ${e}`,onChange:noop,onComplete:noop},defaultNativeProps={type:"text",inputMode:"text",autoCapitalize:"off",autoCorrect:"off",autoComplete:"off"},defaultState={length:defaultProps.length,format:defaultProps.format,dir:"ltr",cursor:0,values:Array(defaultProps.length),backspace:!1,composition:!1,ready:!1,dirty:!1};function reducer(r,e){switch(e.type){case"update-props":{const t={...r,...e.props};return t.cursor=Math.min(t.cursor,t.length-1),t.values=t.values.slice(0,t.cursor+1),t.ready=!0,t}case"start-composition":return{...r,dirty:!0,composition:!0};case"end-composition":{const t={...r};e.value?t.values[e.index]=e.value:delete t.values[e.index];const s=t.values[e.index]?1:0;return t.cursor=Math.min(e.index+s,t.length-1),t.composition=!1,t.dirty=!0,t}case"handle-change":{if(r.composition)break;const t={...r};if(e.reset&&t.values.splice(e.index,t.length),e.value){const s=e.value.split("").map(t.format),l=Math.min(t.length-e.index,s.length);t.values.splice(e.index,l,...s.slice(0,l)),t.cursor=Math.min(e.index+l,t.length-1)}else{delete t.values[e.index];const s=t.backspace?0:1;t.cursor=Math.max(0,e.index-s)}return t.backspace=!1,t.dirty=!0,t}case"handle-key-down":{const t=e.key==="Backspace"||e.key==="Delete",s=e.code==="Backspace"||e.code==="Delete",l=e.keyCode===BACKSPACE||e.keyCode===DELETE,c=e.which===BACKSPACE||e.which===DELETE;if(!(t||s||l||c)||r.values[e.index])break;{const d={...r};return d.cursor=Math.max(0,e.index-1),d.backspace=!0,d.dirty=!0,d}}}return r}function usePinField(){const r=reactExports.useRef([]),[e,t]=reactExports.useReducer(reducer,defaultState),s=reactExports.useMemo(()=>{let c="";for(let f=0;f<e.length;f++)c+=f in e.values?e.values[f]:"";return c},[e]),l=reactExports.useCallback(c=>{t({type:"handle-change",index:0,value:c,reset:!0})},[t,e.cursor]);return reactExports.useMemo(()=>({refs:r,state:e,dispatch:t,value:s,setValue:l}),[r,e,t,s,l])}const PinField=reactExports.forwardRef(({length:r=defaultProps.length,format:e=defaultProps.format,formatAriaLabel:t=defaultProps.formatAriaLabel,onChange:s=defaultProps.onChange,onComplete:l=defaultProps.onComplete,handler:c,autoFocus:f,...d},V)=>{const O=usePinField(),{refs:p,state:a,dispatch:u}=c||O;reactExports.useImperativeHandle(V,()=>p.current,[p]);function $(n){return o=>{o&&(p.current[n]=o)}}function _(n){return o=>{console.log("keyDown",n,o);const{key:i,code:m,keyCode:g,which:W}=o;u({type:"handle-key-down",index:n,key:i,code:m,keyCode:g,which:W})}}function B(n){return o=>{if(o.nativeEvent instanceof InputEvent){const i=o.nativeEvent.data;u({type:"handle-change",index:n,value:i})}else{const{value:i}=o.target;u({type:"handle-change",index:n,value:i,reset:!0})}}}function U(n){return()=>{u({type:"start-composition",index:n})}}function z(n){return o=>{u({type:"end-composition",index:n,value:o.data})}}if(reactExports.useEffect(()=>{var o,i;if(a.ready)return;const n=((o=d.dir)==null?void 0:o.toLowerCase())||((i=document.documentElement.getAttribute("dir"))==null?void 0:i.toLowerCase());u({type:"update-props",props:{length:r,format:e,dir:n}})},[a.ready,u,r,e]),reactExports.useEffect(()=>{a.ready&&r!==a.length&&u({type:"update-props",props:{length:r}})},[a.ready,r,a.length,u]),reactExports.useEffect(()=>{a.ready&&e!==a.format&&u({type:"update-props",props:{format:e}})},[a.ready,e,a.format,u]),reactExports.useEffect(()=>{var o,i;if(!a.ready)return;const n=((o=d.dir)==null?void 0:o.toLowerCase())||((i=document.documentElement.getAttribute("dir"))==null?void 0:i.toLowerCase());n!==a.dir&&u({type:"update-props",props:{dir:n}})},[a.ready,d.dir,a.dir,u]),reactExports.useEffect(()=>{if(!p.current||!a.ready||!a.dirty)return;let n=!1,o=a.values.length==a.length,i="";for(let m=0;m<a.length;m++){const g=m in a.values?a.values[m]:"";p.current[m].value=g,n=n||hasFocus(p.current[m]),o=o&&m in a.values&&p.current[m].checkValidity(),i+=g}n&&p.current[a.cursor].focus(),s&&s(i),l&&o&&l(i)},[p,a,s,l]),!a.ready)return null;const v=range(0,a.length).map(n=>reactExports.createElement("input",{...defaultNativeProps,...d,key:n,ref:$(n),autoFocus:n===0&&f,onKeyDown:_(n),onChange:B(n),onCompositionStart:U(n),onCompositionEnd:z(n),"aria-label":t(n+1,a.length),"aria-required":d.required?"true":void 0,"aria-disabled":d.disabled?"true":void 0,"aria-readonly":d.readOnly?"true":void 0}));return a.dir==="rtl"&&v.reverse(),v});function hasFocus(r){try{return(r.webkitMatchesSelector||r.matches).call(r,":focus")}catch{return!1}}PinField.__docgenInfo={description:"",methods:[],displayName:"PinField",props:{handler:{required:!1,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"type",value:{name:"literal",value:'"handle-key-down"',required:!0}},{key:"index",value:{name:"number",required:!0}}]}},{name:"Partial",elements:[{name:"Pick",elements:[{name:"KeyboardEvent",elements:[{name:"HTMLInputElement"}],raw:"KeyboardEvent<HTMLInputElement>"},{name:"union",raw:'"key" | "code" | "keyCode" | "which"',elements:[{name:"literal",value:'"key"'},{name:"literal",value:'"code"'},{name:"literal",value:'"keyCode"'},{name:"literal",value:'"which"'}]}],raw:'Pick<KeyboardEvent<HTMLInputElement>, "key" | "code" | "keyCode" | "which">'}],raw:'Partial<Pick<KeyboardEvent<HTMLInputElement>, "key" | "code" | "keyCode" | "which">>'}]}]}]}],raw:"ActionDispatch<[Action]>",required:!0}},{key:"value",value:{name:"string",required:!0}},{key:"setValue",value:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}},required:!0}}]}},description:""},length:{defaultValue:{value:"5",computed:!1},required:!1},format:{defaultValue:{value:"char => char",computed:!1},required:!1},formatAriaLabel:{defaultValue:{value:"(index: number, total: number) => `PIN field ${index} of ${total}`",computed:!1},required:!1},onChange:{defaultValue:{value:"function noop(): void {}",computed:!1},required:!1},onComplete:{defaultValue:{value:"function noop(): void {}",computed:!1},required:!1}}};const defaultArgs={length:defaultProps.length,format:defaultProps.format,formatAriaLabel:defaultProps.formatAriaLabel,onChange:fn2(),onComplete:fn2()},meta={title:"PinField",component:PinField,tags:["autodocs"],parameters:{layout:"centered",docs:{description:{component:"The `<PinField />` component is a simple wrapper around a list of HTML inputs.\n\nThe component exposes 4 event handlers, see stories below to learn more about the other props."}}}},Default={render:r=>jsxRuntimeExports.jsx(PinField,{...r,"data-cy":"pin-field"}),args:defaultArgs},StrictMode={render:r=>jsxRuntimeExports.jsx(reactExports.StrictMode,{children:jsxRuntimeExports.jsx(PinField,{...r})}),args:defaultArgs},Controlled={render:({controlled:r})=>{const e=usePinField();return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment,{children:[jsxRuntimeExports.jsx("div",{children:jsxRuntimeExports.jsx(PinField,{handler:r?e:void 0})}),jsxRuntimeExports.jsx("button",{onClick:()=>{var t;return(t=e.refs.current[0])==null?void 0:t.focus()},children:"focus first"}),jsxRuntimeExports.jsx("input",{type:"text",placeholder:"custom pin",value:e.value,onChange:t=>e.setValue(t.target.value)})]})},args:{controlled:!0}},Format={render:({formatEval,...props})=>{try{let format=eval(formatEval);return format("a"),jsxRuntimeExports.jsx(PinField,{...props,format})}catch(r){return jsxRuntimeExports.jsxs("div",{children:["Invalid format function: ",r.toString()]})}},argTypes:{formatEval:{control:"text",name:"format (fn eval)"}},args:{formatEval:"char => char.toUpperCase()",...defaultArgs}},HTMLInputAttributes={render:({formatAriaLabelEval,...props})=>{try{let formatAriaLabel=eval(formatAriaLabelEval);return formatAriaLabel(0,0),jsxRuntimeExports.jsxs("form",{children:[jsxRuntimeExports.jsx("div",{children:jsxRuntimeExports.jsx(PinField,{...props,formatAriaLabel})}),jsxRuntimeExports.jsx("button",{type:"submit",children:"submit"})]})}catch(r){return jsxRuntimeExports.jsxs("div",{children:["Invalid format aria label function: ",r.toString()]})}},argTypes:{formatAriaLabelEval:{control:"text",name:"formatAriaLabel (fn eval)"},type:{control:"select",options:["text","number","password"]},dir:{control:"select",options:["ltr","rtl"]}},args:{type:"password",className:"pin-field",pattern:"[0-9]+",required:!1,autoFocus:!1,disabled:!1,autoCorrect:"off",autoComplete:"off",dir:"ltr",formatAriaLabelEval:"(i, n) => `field ${i}/${n}`",...defaultArgs}};var y,h,b;Default.parameters={...Default.parameters,docs:{...(y=Default.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: props => <PinField {...props} data-cy="pin-field" />,
  args: defaultArgs
}`,...(b=(h=Default.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var x,E,k,w,C;StrictMode.parameters={...StrictMode.parameters,docs:{...(x=StrictMode.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: props => <ReactStrictMode>
      <PinField {...props} />
    </ReactStrictMode>,
  args: defaultArgs
}`,...(k=(E=StrictMode.parameters)==null?void 0:E.docs)==null?void 0:k.source},description:{story:"Story to detect inconsistent behaviours in React Strict Mode.",...(C=(w=StrictMode.parameters)==null?void 0:w.docs)==null?void 0:C.description}}};var A,P,L,M,I;Controlled.parameters={...Controlled.parameters,docs:{...(A=Controlled.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(T=(q=Format.parameters)==null?void 0:q.docs)==null?void 0:T.source},description:{story:"Characters can be formatted with a formatter `(char: string) => string`.",...(H=(F=Format.parameters)==null?void 0:F.docs)==null?void 0:H.description}}};var S,R,D,K,N;HTMLInputAttributes.parameters={...HTMLInputAttributes.parameters,docs:{...(S=HTMLInputAttributes.parameters)==null?void 0:S.docs,source:{originalSource:`{
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
    autoComplete: "off",
    dir: "ltr",
    formatAriaLabelEval: "(i, n) => \`field \${i}/\${n}\`",
    ...defaultArgs
  }
}`,...(D=(R=HTMLInputAttributes.parameters)==null?void 0:R.docs)==null?void 0:D.source},description:{story:"Characters can be validated using the HTML input attribute `pattern`:",...(N=(K=HTMLInputAttributes.parameters)==null?void 0:K.docs)==null?void 0:N.description}}};const __namedExportsOrder=["Default","StrictMode","Controlled","Format","HTMLInputAttributes"];export{Controlled,Default,Format,HTMLInputAttributes,StrictMode,__namedExportsOrder,meta as default};
