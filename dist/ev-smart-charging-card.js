function t(t,e,i,s){var n,r=arguments.length,o=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(o=(r<3?n(o):r>3?n(e,i,o):n(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const o=t=>new r("string"==typeof t?t:t+"",void 0,s),a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)},l=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return o(e)})(t):t,{is:c,defineProperty:h,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:g}=Object,f=globalThis,m=f.trustedTypes,y=m?m.emptyScript:"",_=f.reactiveElementPolyfillSupport,b=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?y:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!c(t,e),x={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=g(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...p(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const r=this.constructor;if(!1===s&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??$)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,_?.({ReactiveElement:w}),(f.reactiveElementVersions??=[]).push("2.1.2");const S=globalThis,A=t=>t,E=S.trustedTypes,k=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,N="?"+T,D=`<${N}>`,P=document,M=()=>P.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,H=Array.isArray,z="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,F=/>/g,B=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,j=/"/g,I=/^(?:script|style|textarea|title)$/i,q=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),W=q(1),V=q(2),K=Symbol.for("lit-noChange"),X=Symbol.for("lit-nothing"),Y=new WeakMap,J=P.createTreeWalker(P,129);function Z(t,e){if(!H(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=U;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(o.lastIndex=h,l=o.exec(i),null!==l);)h=o.lastIndex,o===U?"!--"===l[1]?o=R:void 0!==l[1]?o=F:void 0!==l[2]?(I.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=B):void 0!==l[3]&&(o=B):o===B?">"===l[0]?(o=n??U,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?B:'"'===l[3]?j:L):o===j||o===L?o=B:o===R||o===F?o=U:(o=B,n=void 0);const d=o===B&&t[e+1].startsWith("/>")?" ":"";r+=o===U?i+D:c>=0?(s.push(a),i.slice(0,c)+C+i.slice(c)+T+d):i+T+(-2===c?e:d)}return[Z(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[l,c]=G(t,e);if(this.el=Q.createElement(l,i),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=J.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=c[r++],i=s.getAttribute(t).split(T),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?nt:"?"===o[1]?rt:"@"===o[1]?ot:st}),s.removeAttribute(t)}else t.startsWith(T)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(I.test(s.tagName)){const t=s.textContent.split(T),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),J.nextNode(),a.push({type:2,index:++n});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===N)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(T,t+1));)a.push({type:7,index:n}),t+=T.length-1}n++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function tt(t,e,i=t,s){if(e===K)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=O(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=tt(t,n._$AS(t,e.values),n,s)),e}class et{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);J.currentNode=s;let n=J.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new it(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new at(n,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(n=J.nextNode(),r++)}return J.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class it{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=X,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),O(t)?t===X||null==t||""===t?(this._$AH!==X&&this._$AR(),this._$AH=X):t!==this._$AH&&t!==K&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>H(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==X&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new et(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new Q(t)),e}k(t){H(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new it(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}let st=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=X,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=X}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=tt(this,t,e,0),r=!O(t)||t!==this._$AH&&t!==K,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=tt(this,s[i+o],e,o),a===K&&(a=this._$AH[o]),r||=!O(a)||a!==this._$AH[o],a===X?t=X:t!==X&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===X?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}};class nt extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===X?void 0:t}}class rt extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==X)}}class ot extends st{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??X)===K)return;const i=this._$AH,s=t===X&&i!==X||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==X&&(i===X||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const lt=S.litHtmlPolyfillSupport;lt?.(Q,it),(S.litHtmlVersions??=[]).push("3.3.2");const ct=globalThis;class ht extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new it(e.insertBefore(M(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}}ht._$litElement$=!0,ht.finalized=!0,ct.litElementHydrateSupport?.({LitElement:ht});const dt=ct.litElementPolyfillSupport;dt?.({LitElement:ht}),(ct.litElementVersions??=[]).push("4.2.2");const pt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ut={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:$},gt=(t=ut,e,i)=>{const{kind:s,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ft(t){return(e,i)=>"object"==typeof i?gt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function mt(t){return ft({...t,state:!0,attribute:!1})}const yt={plan_status:"planStatus",planned_hours:"plannedHours",slots_needed:"slotsNeeded",active_deadline:"activeDeadline",effective_departure:"effectiveDeparture",plugged_in:"pluggedIn",actively_charging:"activelyCharging",charge_now:"chargeNow",smart_charging_enabled:"smartCharging"};function _t(t){const e=t.indexOf("_");return e>=0?t.slice(e+1):null}function bt(t){return"string"==typeof t&&t.length>0?t:void 0}function vt(t){return"number"==typeof t&&Number.isFinite(t)?t:void 0}const $t={primary:"--primary-color",primaryText:"--primary-text-color",secondaryText:"--secondary-text-color",divider:"--divider-color",cardBg:"--card-background-color",success:"--success-color",warning:"--warning-color",error:"--error-color"};function xt(t,e){return`var(${$t[t]}, ${e})`}let wt=class extends ht{constructor(){super(...arguments),this.cardTitle="",this._replanning=!1,this._replan=async()=>{if(!this._replanning){this._replanning=!0;try{await this.hass.callService("smart_ev_charging","replan",{},{entity_id:this.entities.planStatus})}finally{setTimeout(()=>{this._replanning=!1},400)}}},this._toggle=()=>{this.hass.callService("switch","toggle",void 0,{entity_id:this.entities.smartCharging})}}render(){const t=this.hass.states[this.entities.planStatus],e=this.hass.states[this.entities.smartCharging],i=this.hass.states[this.entities.effectiveDeparture],s=t?.state??"no_data",n=function(t){switch(t){case"ok":return{bg:"rgba(34,197,94,0.22)",fg:xt("success","#16a34a")};case"partial":case"extended":return{bg:"rgba(245,158,11,0.22)",fg:xt("warning","#d97706")};default:return{bg:"rgba(148,163,184,0.22)",fg:xt("secondaryText","#475569")}}}(s),r="one_off"===(i?.attributes.source??"default"),o=this.entities.socEntity?Number(this.hass.states[this.entities.socEntity]?.state):NaN,a=this.entities.targetSocEntity?Number(this.hass.states[this.entities.targetSocEntity]?.state):NaN,l=Number.isFinite(o),c=this.entities.planStatus.split(".")[1]?.replace(/_/g," ").replace(/plan status$/,"").trim()||"EV",h=this.cardTitle?.trim()||c;return W`
      <div class="tile">
        <div class="header">
          <div class="title-wrap">
            <ha-icon class="title-icon" icon="mdi:car-electric"></ha-icon>
            <span class="name">${h}</span>
          </div>
          <div class="controls">
            <button
              class="replan-btn ${this._replanning?"spinning":""}"
              title="Replan the charge window now."
              aria-label="Replan"
              aria-busy=${this._replanning?"true":"false"}
              @click=${this._replan}
              ?disabled=${this._replanning}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
            <span class="pill" style="background:${n.bg}; color:${n.fg};" aria-label="Plan status: ${s}">
              <span class="pill-dot" aria-hidden="true"></span>${s}
            </span>
            <ha-switch
              .checked=${"on"===e?.state}
              aria-label="Master charging toggle"
              @change=${this._toggle}
            ></ha-switch>
          </div>
        </div>

        <div class="meta">
          <span>
            <ha-icon icon="mdi:flag-checkered" style="--mdc-icon-size:16px;vertical-align:-3px;"></ha-icon>
            Deadline ${i?.state??"—"}
          </span>
          ${r?W`<span class="badge">
                <ha-icon icon="mdi:star" style="--mdc-icon-size:14px;vertical-align:-2px;"></ha-icon>
                one-off
              </span>`:""}
        </div>

        ${l?W`
              <div class="soc">
                <div class="soc-row">
                  <span>SoC ${o.toFixed(0)}%</span>
                  <span>${Number.isFinite(a)?"target "+a.toFixed(0)+"%":""}</span>
                </div>
                <div
                  class="soc-track"
                  role="progressbar"
                  aria-valuenow="${o}"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label="State of charge"
                >
                  <div class="soc-fill" style="width:${Math.max(0,Math.min(100,o))}%"></div>
                  ${Number.isFinite(a)?W`<div class="soc-target" style="left:${Math.max(0,Math.min(100,a))}%"></div>`:""}
                </div>
              </div>
            `:""}
      </div>
    `}};wt.styles=a`
    :host { display: block; }
    .tile {
      background: ${o(xt("cardBg","#fff"))};
      border-radius: 12px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }
    .title-icon { color: ${o(xt("primary","#3b82f6"))}; --mdc-icon-size: 22px; }
    .name {
      font-weight: 600;
      font-size: 1.05em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.82em;
      font-weight: 500;
      text-transform: capitalize;
    }
    .pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    .controls {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: auto;
    }
    .meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9em;
      color: ${o(xt("secondaryText","#475569"))};
    }
    .badge {
      padding: 2px 8px;
      border-radius: 6px;
      background: rgba(59,130,246,0.12);
      color: ${o(xt("primary","#3b82f6"))};
      font-size: 0.78em;
    }
    .soc {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .soc-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.82em;
      color: ${o(xt("secondaryText","#475569"))};
    }
    .soc-track {
      height: 8px;
      background: ${o(xt("divider","#e5e7eb"))};
      border-radius: 999px;
      overflow: visible;
      position: relative;
      margin-top: 4px;
    }
    .soc-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, ${o(xt("primary","#3b82f6"))}, ${o(xt("success","#22c55e"))});
      transition: width .35s ease;
    }
    .soc-target {
      position: absolute;
      top: -3px;
      width: 2px;
      height: 14px;
      background: ${o(xt("primaryText","#0f172a"))};
      border-radius: 1px;
    }
    .replan-btn {
      border: none;
      background: transparent;
      color: ${o(xt("primary","#3b82f6"))};
      cursor: pointer;
      padding: 4px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      --mdc-icon-size: 20px;
    }
    .replan-btn:hover { background: rgba(59,130,246,0.10); }
    .replan-btn:focus-visible { outline: 2px solid ${o(xt("primary","#3b82f6"))}; outline-offset: 2px; }
    .replan-btn:disabled { cursor: progress; opacity: 0.7; }
    .replan-btn.spinning ha-icon { animation: spin 0.9s linear infinite; }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,t([ft({attribute:!1})],wt.prototype,"hass",void 0),t([ft({attribute:!1})],wt.prototype,"entities",void 0),t([ft({type:String})],wt.prototype,"cardTitle",void 0),t([mt()],wt.prototype,"_replanning",void 0),wt=t([pt("ev-status")],wt);let St=class extends ht{constructor(){super(...arguments),this.visible=!1,this.x=0,this.y=0,this.text=""}render(){return this.visible&&this.text?W`<div class="box" style="left:${this.x}px;top:${this.y}px;">${this.text}</div>`:W``}};St.styles=a`
    :host {
      display: block;
      pointer-events: none;
    }
    .box {
      position: fixed;
      transform: translate(-50%, calc(-100% - 8px));
      background: ${o(xt("primaryText","#0f172a"))};
      color: ${o(xt("cardBg","#fff"))};
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 0.78em;
      font-weight: 500;
      white-space: nowrap;
      box-shadow: 0 4px 10px rgba(0,0,0,0.18);
      z-index: 9999;
    }
  `,t([ft({type:Boolean})],St.prototype,"visible",void 0),t([ft({type:Number})],St.prototype,"x",void 0),t([ft({type:Number})],St.prototype,"y",void 0),t([ft({type:String})],St.prototype,"text",void 0),St=t([pt("ev-hover-tooltip")],St);const At=80;let Et=class extends ht{constructor(){super(...arguments),this.hours=36,this._tip={visible:!1,x:0,y:0,text:""},this._lastPrices=[],this._lastPlanned=new Set,this._onMove=t=>e=>{const i=e.currentTarget.getBoundingClientRect(),s=(e.clientX-i.left)/i.width,n=Math.min(t.length-1,Math.max(0,Math.floor(s*t.length))),r=t[n];if(!r)return;const o=`${new Date(r.start).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})} · ${r.price.toFixed(2)}`;this._tip={visible:!0,x:e.clientX,y:e.clientY,text:o}},this._onLeave=()=>{this._tip={...this._tip,visible:!1}},this._emitSlot=(t,e)=>{const i={start:t.start,end:t.end,isPlanned:e,price:t.price};this.dispatchEvent(new CustomEvent("slot-click",{detail:i,bubbles:!0,composed:!0}))}}render(){const t=this._prices().slice(0,Math.max(1,Math.min(this.hours,48)));if(this._lastPrices=t,0===t.length)return this._lastPlanned=new Set,W`<div class="tile"><h3>Price &amp; plan</h3><div class="empty">No price data yet</div></div>`;const e=this.hass.states[this.entities.plannedHours]?.attributes;this._lastPlanned=new Set(e?.hours??[]);const i=Math.min(...t.map(t=>t.price)),s=Math.max(...t.map(t=>t.price)),n=s-i||1,r=480/t.length,o=t.map((t,e)=>{const s=72-(t.price-i)/n*64;return`${(e*r+r/2).toFixed(1)},${s.toFixed(1)}`}).join(" "),a=new Date,l=t.findIndex(t=>new Date(t.start)<=a&&a<new Date(t.end)),c=l>=0?l*r+r*((a.getTime()-new Date(t[l].start).getTime())/36e5):-1;return W`
      <div class="tile">
        <h3 id="timeline-title">Price &amp; plan — next ${t.length}h</h3>
        <svg
          id="chart"
          viewBox="0 0 ${480} ${At}"
          role="img"
          aria-labelledby="timeline-title"
          aria-describedby="timeline-desc"
          @mousemove=${this._onMove(t)}
          @mouseleave=${this._onLeave}
        >
          <polyline points="${o}" fill="none" stroke="${xt("primary","#3b82f6")}" stroke-width="1.5" />
          ${c>=0?W`<line class="now-line" x1="${c}" y1="0" x2="${c}" y2="${At}"></line>`:""}
        </svg>
        <span id="timeline-desc" class="sr-only">
          24-hour electricity price curve. Hover or focus a bar to see the slot price.
        </span>
        <ev-hover-tooltip
          .visible=${this._tip.visible}
          .x=${this._tip.x}
          .y=${this._tip.y}
          .text=${this._tip.text}
        ></ev-hover-tooltip>
      </div>
    `}updated(){const t=this.shadowRoot?.querySelector("#chart");if(!t||0===this._lastPrices.length)return;t.querySelectorAll(".slot-group").forEach(t=>t.remove());const e=this._lastPrices,i=this._lastPlanned,s=480/e.length;for(let n=0;n<e.length;n++){const r=e[n],o=i.has(r.start),a=document.createElementNS("http://www.w3.org/2000/svg","g");a.setAttribute("class","slot-group");const l=document.createElementNS("http://www.w3.org/2000/svg","rect");l.setAttribute("class","slot"),l.setAttribute("x",String(n*s)),l.setAttribute("y","0"),l.setAttribute("width",String(s)),l.setAttribute("height",String(At)),l.setAttribute("fill","transparent"),l.setAttribute("stroke",xt("divider","#e5e7eb")),l.setAttribute("stroke-width","0.25"),l.setAttribute("data-slot-hour",String(n)),l.addEventListener("click",()=>this._emitSlot(r,o));const c=document.createElementNS("http://www.w3.org/2000/svg","title");if(c.textContent=`${new Date(r.start).toLocaleString()} · ${r.price.toFixed(2)}`,l.appendChild(c),a.appendChild(l),o){const t=document.createElementNS("http://www.w3.org/2000/svg","rect");t.setAttribute("class","planned-rect"),t.setAttribute("x",String(n*s)),t.setAttribute("y","8"),t.setAttribute("width",String(s)),t.setAttribute("height",String(64)),a.appendChild(t)}t.insertBefore(a,t.firstChild)}t.querySelectorAll(".date-line, .date-label").forEach(t=>t.remove());const n="http://www.w3.org/2000/svg";for(let i=1;i<e.length;i++){const r=new Date(e[i-1].start),o=new Date(e[i].start);if(r.getFullYear()!==o.getFullYear()||r.getMonth()!==o.getMonth()||r.getDate()!==o.getDate()){const e=i*s,r=document.createElementNS(n,"line");r.setAttribute("x1",e.toFixed(1)),r.setAttribute("y1","0"),r.setAttribute("x2",e.toFixed(1)),r.setAttribute("y2",String(At)),r.setAttribute("class","date-line"),t.appendChild(r);const a=document.createElementNS(n,"text");a.setAttribute("x",(e+3).toFixed(1)),a.setAttribute("y","11"),a.setAttribute("class","date-label"),a.textContent=o.toLocaleDateString([],{weekday:"short",day:"2-digit"}),t.appendChild(a)}}}_prices(){if(!this.entities?.priceEntity)return[];const t=this.hass.states[this.entities.priceEntity]?.attributes.prices;if(!Array.isArray(t))return[];const e=Date.now();return t.filter(t=>t&&"string"==typeof t.start&&"string"==typeof t.end&&"number"==typeof t.price).filter(t=>new Date(t.end).getTime()>e)}};function kt(t,e,i){if(null==t)return"—";const s=t.toFixed(2);return e?`${s} ${e}`:s}Et.styles=a`
    :host { display: block; }
    .tile { background: ${o(xt("cardBg","#fff"))}; border-radius: 12px; padding: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); position: relative; }
    h3 { margin: 0 0 8px; font-size: 0.95em; color: ${o(xt("secondaryText","#475569"))}; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    svg { width: 100%; height: auto; display: block; }
    .slot { cursor: pointer; }
    .slot:hover rect { fill: ${o(xt("primary","#3b82f6"))}; opacity: 0.15; }
    .planned-rect { fill: ${o(xt("success","#22c55e"))}; opacity: 0.35; pointer-events: none; }
    .now-line { stroke: ${o(xt("primaryText","#0f172a"))}; stroke-width: 1; stroke-dasharray: 2 2; }
    .empty { color: ${o(xt("secondaryText","#94a3b8"))}; font-style: italic; }
    .date-line {
      stroke: ${o(xt("secondaryText","#94a3b8"))};
      stroke-width: 1;
      stroke-dasharray: 3 3;
      opacity: 0.6;
      pointer-events: none;
    }
    .date-label {
      fill: ${o(xt("secondaryText","#94a3b8"))};
      font-size: 9px;
      font-weight: 500;
      pointer-events: none;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    }
  `,t([ft({attribute:!1})],Et.prototype,"hass",void 0),t([ft({attribute:!1})],Et.prototype,"entities",void 0),t([ft({type:Number})],Et.prototype,"hours",void 0),t([mt()],Et.prototype,"_tip",void 0),Et=t([pt("ev-timeline")],Et);let Ct=class extends ht{render(){const t=this.hass.states[this.entities.plannedHours]?.attributes??{},e=t.hours??[],i=t.hour_prices??[],s=t.hour_kwh??[],n=t.cost_unit??null,r=t.estimated_cost??null;if(this.hass.locale.language,0===e.length){const t=this.hass.states[this.entities.planStatus]?.attributes??{},e=!0===t.min_soc_gate_active,i=this.entities.minSocThreshold??("number"==typeof t.min_soc_threshold?t.min_soc_threshold:void 0);return W`<div class="tile"><h3>Charge window</h3><div class="empty">${e&&void 0!==i?`Charging paused — SoC ≥ ${i}%`:"No charging planned"}</div></div>`}let o=0;return W`
      <div class="tile">
        <h3>Charge window</h3>
        <table>
          <thead><tr><th>Time</th><th>Price/kWh</th><th>kWh</th><th>Cumulative</th></tr></thead>
          <tbody>
            ${e.map((t,e)=>{const r=i[e]??0,a=s[e]??0;return o+=r*a,W`
                <tr>
                  <td>${function(t){const e=new Date(t);return`${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}`}(t)}</td>
                  <td>${r.toFixed(2)}</td>
                  <td>${l=a,`${l.toFixed(1)} kWh`}</td>
                  <td>${kt(o,n)}</td>
                </tr>
              `;var l})}
          </tbody>
          <tfoot><tr><td colspan="3">Estimated total</td><td>${kt(r,n)}</td></tr></tfoot>
        </table>
      </div>
    `}};function Tt(t,e){const i=new Date(e).getTime()-new Date(t).getTime();return{start:t,end:e,durationHours:Math.max(0,i/36e5)}}function Nt(t,e,i){return t.map(t=>{const s=function(t,e,i){const s=new Date(e).getTime(),n=new Date(i).getTime();let r=0,o=0;for(const e of t){const t=new Date(e.start).getTime(),i=new Date(e.end).getTime(),a=Math.max(0,Math.min(n,i)-Math.max(s,t));if(0===a)continue;const l=a/36e5;r+=e.price*l,o+=l}return o>0?r/o:0}(e,t.start,t.end),n=t.durationHours*i;return{...t,kwh:n,cost:n*s}})}async function Dt(t,e,i,s){const n=await t.callWS({type:"history/history_during_period",start_time:i.toISOString(),end_time:s.toISOString(),entity_ids:e,minimal_response:!0,no_attributes:!0}),r={};for(const[t,e]of Object.entries(n))r[t]=e.map(t=>Pt(t)).filter(t=>null!==t);return r}function Pt(t){const e="string"==typeof t.s?t.s:"string"==typeof t.state?t.state:null;if(null===e)return null;const i=t.lu??t.last_updated;let s;if("number"==typeof i&&Number.isFinite(i))s=i;else{if("string"!=typeof i)return null;{const t=Date.parse(i);if(Number.isNaN(t))return null;s=t/1e3}}return{state:e,t:new Date(1e3*s).toISOString()}}Ct.styles=a`
    :host { display: block; }
    .tile { background: ${o(xt("cardBg","#fff"))}; border-radius: 12px; padding: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); }
    h3 { margin: 0 0 8px; font-size: 0.95em; color: ${o(xt("secondaryText","#475569"))}; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9em; }
    th, td { padding: 4px 6px; border-bottom: 1px solid ${o(xt("divider","#eee"))}; text-align: right; }
    th:first-child, td:first-child { text-align: left; }
    tfoot td { font-weight: 600; border-top: 2px solid ${o(xt("divider","#eee"))}; border-bottom: none; padding-top: 8px; }
    .empty { color: ${o(xt("secondaryText","#94a3b8"))}; font-style: italic; }
  `,t([ft({attribute:!1})],Ct.prototype,"hass",void 0),t([ft({attribute:!1})],Ct.prototype,"entities",void 0),Ct=t([pt("ev-window")],Ct);let Mt=class extends ht{constructor(){super(...arguments),this.days=30,this._loading=!1,this._expanded=null,this._error=null,this._tip={visible:!1,x:0,y:0,text:""},this._lastFetchKey="",this._onMove=(t,e,i)=>i=>{const s=i.currentTarget.getBoundingClientRect(),n=Math.min(t.length-1,Math.max(0,Math.floor((i.clientX-s.left)/8))),r=t[n];if(!r)return;const o=`${r.date} · Total ${kt(r.cost,e)} · ${r.sessions.length} sessions`;this._tip={visible:!0,x:i.clientX,y:i.clientY,text:o}},this._onLeave=()=>{this._tip={...this._tip,visible:!1}}}updated(){const t=`${this.entities?.chargeNow}|${this.days}`;t!==this._lastFetchKey&&this.hass&&this.entities&&(this._lastFetchKey=t,this._fetch())}render(){const t=this.hass.locale.language,e=this.hass.states[this.entities.planStatus]?.attributes.cost_unit??null,i=this._buckets??[],s=i.reduce((t,e)=>t+e.cost,0),n=i.reduce((t,e)=>t+e.sessions.length,0),r=Math.max(0,...i.map(t=>t.cost)),o=this._error?W`<div class="empty">${this._error}</div>`:this._loading&&!this._buckets?W`<div class="empty">Loading…</div>`:0===i.length?W`<div class="empty">No charging sessions in the last ${this.days} days</div>`:W`
            <svg
              viewBox="0 0 ${8*i.length} 80"
              role="img"
              aria-labelledby="history-title"
              aria-describedby="history-desc"
              @mousemove=${this._onMove(i,e,t)}
              @mouseleave=${this._onLeave}
            >
              ${i.map((t,i)=>{const s=r>0?t.cost/r*76:0;return V`<rect class="bar" x="${8*i}" y="${80-s}" width="7" height="${s}"
                  fill="${xt("primary","#3b82f6")}"
                  @click=${()=>this._expanded=this._expanded===t.date?null:t.date}>
                  <title>${t.date}: ${t.cost.toFixed(2)} ${e??""}</title></rect>`})}
            </svg>
            <span id="history-desc" class="sr-only">
              Daily charging cost bar chart. Click a bar to expand session details.
            </span>
            <ev-hover-tooltip
              .visible=${this._tip.visible}
              .x=${this._tip.x}
              .y=${this._tip.y}
              .text=${this._tip.text}
            ></ev-hover-tooltip>
            ${this._expanded?W`<div class="drawer">
                  <strong>${this._expanded}</strong>
                  <ul>
                    ${i.find(t=>t.date===this._expanded)?.sessions.map(t=>W`<li>${new Date(t.start).toLocaleTimeString()}–${new Date(t.end).toLocaleTimeString()} · ${(t.kwh??0).toFixed(1)} kWh · ${kt(t.cost??null,e)}</li>`)}
                  </ul>
                </div>`:""}
          `;return W`
      <div class="tile">
        <h3 id="history-title">History — ${this.days}d</h3>
        <div class="header">
          <span>Total ${kt(s,e)}</span>
          <span>${n} sessions</span>
        </div>
        ${o}
      </div>
    `}async _fetch(){this._error=null,this._loading=!0;try{const t=new Date,e=new Date(t.getTime()-864e5*this.days),i=[this.entities.chargeNow];this.entities.priceEntity&&i.push(this.entities.priceEntity);const s=await Dt(this.hass,i,e,t);"undefined"!=typeof console&&console.debug("ev-history fetch",{days:this.days,chargeNow:this.entities.chargeNow,samples:s[this.entities.chargeNow]?.length??0});const n=function(t,e){const i=[];let s=null;for(const e of t)"on"===e.state&&null===s?s=e.t:"on"!==e.state&&null!==s&&(i.push(Tt(s,e.t)),s=null);if(null!==s){const t=e??(new Date).toISOString();i.push(Tt(s,t))}return i}(s[this.entities.chargeNow]??[],t.toISOString()),r=this.entities.priceEntity?this.hass.states[this.entities.priceEntity]?.attributes.prices??[]:[],o=this.entities.chargerKw??11;this._buckets=function(t){const e=new Map;for(const i of t){const t=new Date(i.start).toISOString().slice(0,10),s=e.get(t)??{date:t,cost:0,sessions:[]};s.cost+=i.cost??0,s.sessions.push(i),e.set(t,s)}return[...e.values()].sort((t,e)=>t.date.localeCompare(e.date))}(Nt(n,r,o))}catch(t){this._error=`History fetch failed: ${t.message}`}finally{this._loading=!1}}};Mt.styles=a`
    :host { display: block; }
    .tile { background: ${o(xt("cardBg","#fff"))}; border-radius: 12px; padding: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); position: relative; }
    h3 { margin: 0 0 8px; font-size: 0.95em; color: ${o(xt("secondaryText","#475569"))}; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; white-space: nowrap; }
    .header { display: flex; justify-content: space-between; font-size: 0.85em; color: ${o(xt("secondaryText","#475569"))}; margin-bottom: 6px; gap: 8px; flex-wrap: nowrap; }
    .header > span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    svg { width: 100%; height: 80px; display: block; }
    .bar { cursor: pointer; }
    .bar:hover { opacity: 0.7; }
    .drawer { margin-top: 8px; font-size: 0.85em; }
    .drawer ul { list-style: none; padding: 0; margin: 0; }
    .drawer li { padding: 2px 0; border-bottom: 1px solid ${o(xt("divider","#eee"))}; }
    .empty { color: ${o(xt("secondaryText","#94a3b8"))}; font-style: italic; }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    }
  `,t([ft({attribute:!1})],Mt.prototype,"hass",void 0),t([ft({attribute:!1})],Mt.prototype,"entities",void 0),t([ft({type:Number})],Mt.prototype,"days",void 0),t([mt()],Mt.prototype,"_buckets",void 0),t([mt()],Mt.prototype,"_loading",void 0),t([mt()],Mt.prototype,"_expanded",void 0),t([mt()],Mt.prototype,"_error",void 0),t([mt()],Mt.prototype,"_tip",void 0),Mt=t([pt("ev-history")],Mt);let Ot=class extends ht{constructor(){super(...arguments),this.days=7,this._error=null,this._tip={visible:!1,x:0,y:0,text:""},this._lastKey="",this._onMove=t=>e=>{const i=e.currentTarget.getBoundingClientRect();if(0===i.width)return;const s=Math.max(0,Math.min(1,(e.clientX-i.left)/i.width)),n=new Date(t[0].t).getTime(),r=n+s*(new Date(t[t.length-1].t).getTime()-n);let o=t[0],a=1/0;for(const e of t){const t=Math.abs(new Date(e.t).getTime()-r);t<a&&(a=t,o=e)}const l=`${new Date(o.t).toLocaleString()} · ${Number(o.state).toFixed(0)}%`;this._tip={visible:!0,x:e.clientX,y:e.clientY,text:l}},this._onLeave=()=>{this._tip={...this._tip,visible:!1}}}updated(){if(!this.entities?.socEntity)return;const t=`${this.entities.socEntity}|${this.days}`;t!==this._lastKey&&(this._lastKey=t,this._fetch())}render(){if(!this.entities?.socEntity)return W`<div class="tile"><h3>SoC — ${this.days}d</h3><div class="empty">No SoC entity configured</div></div>`;if(this._error)return W`<div class="tile"><h3>SoC — ${this.days}d</h3><div class="empty">${this._error}</div></div>`;const t=(this._series??[]).filter(t=>Number.isFinite(Number(t.state)));if(t.length<2)return W`<div class="tile"><h3>SoC — ${this.days}d</h3><div class="empty">Loading…</div></div>`;const e=new Date(t[0].t).getTime(),i=new Date(t[t.length-1].t).getTime(),s=i-e||1,n=t.map(t=>{const i=(new Date(t.t).getTime()-e)/s*200,n=50-Number(t.state)/100*50;return`${i.toFixed(1)},${n.toFixed(1)}`}).join(" "),r=[],o=new Date(e);for(let t=new Date(o.getFullYear(),o.getMonth(),o.getDate()+1).getTime();t<i;t+=864e5){const i=(t-e)/s;r.push({x:200*i,pct:i,label:new Date(t).toLocaleDateString([],{weekday:"short",day:"2-digit"})})}return W`
      <div class="tile">
        <h3 id="soc-title">SoC — ${this.days}d</h3>
        <div class="graph-wrap">
          <svg
            viewBox="0 0 ${200} ${50}"
            preserveAspectRatio="none"
            role="img"
            aria-labelledby="soc-title"
            aria-describedby="soc-desc"
            @mousemove=${this._onMove(t)}
            @mouseleave=${this._onLeave}
          >
            ${r.map(t=>V`<line
                class="date-line"
                x1=${t.x.toFixed(1)}
                y1="0"
                x2=${t.x.toFixed(1)}
                y2=${50}
              ></line>`)}
            <polyline points="${n}" fill="none" stroke="${xt("success","#22c55e")}" stroke-width="1.5" />
          </svg>
          ${r.map(t=>W`<span class="date-label" style="left: ${(100*t.pct).toFixed(2)}%">${t.label}</span>`)}
        </div>
        <span id="soc-desc" class="sr-only">
          State of charge trend over the last ${this.days} days. Hover to see value at a point in time.
        </span>
        <ev-hover-tooltip
          .visible=${this._tip.visible}
          .x=${this._tip.x}
          .y=${this._tip.y}
          .text=${this._tip.text}
        ></ev-hover-tooltip>
      </div>
    `}async _fetch(){if(this.entities.socEntity)try{this._error=null;const t=new Date,e=new Date(t.getTime()-864e5*this.days),i=await Dt(this.hass,[this.entities.socEntity],e,t);this._series=i[this.entities.socEntity]??[]}catch(t){this._error=`SoC fetch failed: ${t.message}`}}};Ot.styles=a`
    :host { display: block; }
    .tile {
      background: ${o(xt("cardBg","#fff"))};
      border-radius: 12px;
      padding: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      position: relative;
    }
    h3 {
      margin: 0 0 8px;
      font-size: 0.95em;
      color: ${o(xt("secondaryText","#475569"))};
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .graph-wrap {
      margin: 0;
      position: relative;
    }
    svg {
      width: 100%;
      height: 60px;
      display: block;
    }
    .date-line {
      stroke: ${o(xt("secondaryText","#94a3b8"))};
      stroke-width: 1;
      stroke-dasharray: 3 3;
      opacity: 0.6;
      pointer-events: none;
      vector-effect: non-scaling-stroke;
    }
    .date-label {
      position: absolute;
      top: 0;
      transform: translateX(2px);
      color: ${o(xt("secondaryText","#94a3b8"))};
      font-size: 9px;
      font-weight: 500;
      line-height: 1;
      pointer-events: none;
      white-space: nowrap;
    }
    .empty { color: ${o(xt("secondaryText","#94a3b8"))}; font-style: italic; }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    }
  `,t([ft({attribute:!1})],Ot.prototype,"hass",void 0),t([ft({attribute:!1})],Ot.prototype,"entities",void 0),t([ft({type:Number})],Ot.prototype,"days",void 0),t([mt()],Ot.prototype,"_series",void 0),t([mt()],Ot.prototype,"_error",void 0),t([mt()],Ot.prototype,"_tip",void 0),Ot=t([pt("ev-soc-trend")],Ot);let Ht=class extends ht{constructor(){super(...arguments),this.initialTime="06:00",this.open=!1,this._value="06:00",this._onChange=t=>{this._value=t.target.value},this._onBackdrop=()=>this._cancel(),this._cancel=()=>{this.dispatchEvent(new CustomEvent("deadline-cancel",{bubbles:!0,composed:!0})),this.open=!1},this._confirm=()=>{this.dispatchEvent(new CustomEvent("deadline-confirm",{detail:{time:this._value},bubbles:!0,composed:!0})),this.open=!1}}willUpdate(t){(t.has("initialTime")||t.has("open"))&&(this._value=this.initialTime)}render(){return this.open?W`
      <div class="backdrop" @click=${this._onBackdrop} role="presentation">
        <div
          class="dialog"
          @click=${t=>t.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dlg-title"
          aria-describedby="dlg-desc"
        >
          <div class="title" id="dlg-title">Set one-off departure</div>
          <div class="subtitle" id="dlg-desc">
            Override the departure deadline for the next charge cycle only.
            Reverts automatically once the deadline passes.
          </div>
          <input
            type="time"
            .value=${this._value}
            @change=${this._onChange}
            aria-label="Departure time"
          />
          <div class="row">
            <button class="cancel" @click=${this._cancel}>Cancel</button>
            <button class="primary" @click=${this._confirm}>Set</button>
          </div>
        </div>
      </div>
    `:W``}};Ht.styles=a`
    :host { display: contents; }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    }
    .dialog {
      background: ${o(xt("cardBg","#fff"))};
      padding: 22px 22px 18px;
      border-radius: 14px;
      min-width: 300px;
      max-width: 92vw;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.30);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .title {
      font-size: 1.05em;
      font-weight: 600;
      color: ${o(xt("primaryText","#0f172a"))};
    }
    .subtitle {
      font-size: 0.85em;
      color: ${o(xt("secondaryText","#475569"))};
      line-height: 1.35;
    }
    input[type=time] {
      font-size: 1.5em;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid ${o(xt("divider","#e5e7eb"))};
      background: ${o(xt("cardBg","#fff"))};
      color: ${o(xt("primaryText","#0f172a"))};
      width: 100%;
      box-sizing: border-box;
    }
    input[type=time]:focus-visible {
      outline: 2px solid ${o(xt("primary","#3b82f6"))};
      outline-offset: 2px;
    }
    .row {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 4px;
    }
    button {
      padding: 9px 16px;
      border-radius: 9px;
      cursor: pointer;
      font-size: 0.92em;
      font-weight: 500;
      transition: filter .12s;
    }
    button:hover { filter: brightness(0.95); }
    button:focus-visible {
      outline: 2px solid ${o(xt("primary","#3b82f6"))};
      outline-offset: 2px;
    }
    button.cancel {
      background: transparent;
      border: 1px solid ${o(xt("divider","#e5e7eb"))};
      color: ${o(xt("primaryText","#0f172a"))};
    }
    button.primary {
      background: ${o(xt("primary","#3b82f6"))};
      color: white;
      border: 1px solid transparent;
    }
  `,t([ft({type:String})],Ht.prototype,"initialTime",void 0),t([ft({type:Boolean,reflect:!0})],Ht.prototype,"open",void 0),t([mt()],Ht.prototype,"_value",void 0),Ht=t([pt("ev-deadline-picker")],Ht);let zt=class extends ht{constructor(){super(...arguments),this.helperEntity="",this._deadlineOpen=!1,this._clearing=!1,this._chargeNow=()=>{this.hass.callService("smart_ev_charging","force_charge_now",{},this._target())},this._clearOverride=async()=>{if(!this._clearing){this._clearing=!0;try{await this.hass.callService("smart_ev_charging","set_one_off_departure",{},this._target())}finally{setTimeout(()=>{this._clearing=!1},400)}}},this._openDeadline=()=>{this._deadlineOpen=!0},this._onDeadlineConfirm=t=>{const e=t.detail.time;this.helperEntity?this.hass.callService("input_datetime","set_datetime",{time:e},{entity_id:this.helperEntity}):this.hass.callService("smart_ev_charging","set_one_off_departure",{departure_time:e},this._target())}}render(){const t=this.hass.states[this.entities.effectiveDeparture]?.state??"06:00",e="one_off"===(this.hass.states[this.entities.effectiveDeparture]?.attributes.source??"default"),i="off"===this.hass.states[this.entities.pluggedIn]?.state;return W`
      <div class="tile">
        <button
          class="charge"
          title="${i?"Car is unplugged — plug in to force charge.":"Charge immediately, ignoring the price plan, until target SoC or unplug."}"
          aria-label="Charge now"
          ?disabled=${i}
          @click=${this._chargeNow}
        >
          <ha-icon icon="mdi:flash"></ha-icon> Charge now
        </button>
        <button
          class="set"
          title="One-time override of the departure deadline for the next charge cycle only. Reverts after the deadline passes."
          aria-label="Set one-off departure"
          @click=${this._openDeadline}
        >
          <ha-icon icon="mdi:clock-edit-outline"></ha-icon> Set departure
        </button>
        ${e?W`<button
              class="clear ${this._clearing?"spinning":""}"
              title="Clear the active one-off departure override."
              aria-label="Clear override"
              aria-busy=${this._clearing?"true":"false"}
              ?disabled=${this._clearing}
              @click=${this._clearOverride}
            >
              <ha-icon icon="${this._clearing?"mdi:loading":"mdi:close-circle-outline"}"></ha-icon>
              ${this._clearing?"Clearing…":"Clear"}
            </button>`:""}
      </div>
      <ev-deadline-picker
        .initialTime=${t}
        .open=${this._deadlineOpen}
        @deadline-confirm=${this._onDeadlineConfirm}
        @deadline-cancel=${()=>this._deadlineOpen=!1}
      ></ev-deadline-picker>
    `}_target(){return{entity_id:this.entities.planStatus}}};var Ut;zt.styles=a`
    :host { display: block; }
    .tile {
      background: ${o(xt("cardBg","#fff"))};
      border-radius: 12px;
      padding: 12px;
      overflow: hidden;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    button {
      flex: 1 1 auto;
      min-width: 130px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px 12px;
      border-radius: 10px;
      border: 1px solid transparent;
      cursor: pointer;
      font-size: 0.88em;
      font-weight: 500;
      transition: filter .12s, transform .05s;
      background: rgba(148,163,184,0.12);
      color: ${o(xt("primaryText","#0f172a"))};
    }
    button:hover { filter: brightness(0.95); }
    button:active { transform: translateY(1px); }
    button:focus-visible { outline: 2px solid ${o(xt("primary","#3b82f6"))}; outline-offset: 2px; }
    button ha-icon { --mdc-icon-size: 18px; }

    button.charge { background: rgba(245,158,11,0.18); color: ${o(xt("warning","#d97706"))}; }
    button.set    { background: rgba(34,197,94,0.18); color: ${o(xt("success","#16a34a"))}; }
    button.clear  { background: rgba(239,68,68,0.15); color: ${o(xt("error","#ef4444"))}; }
    button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
      background: rgba(148,163,184,0.12);
      color: ${o(xt("secondaryText","#94a3b8"))};
    }
    button:disabled:hover { filter: none; }
    button.spinning:disabled {
      cursor: progress;
      opacity: 0.7;
      background: rgba(239,68,68,0.15);
      color: ${o(xt("error","#ef4444"))};
    }
    button.spinning ha-icon { animation: spin 0.9s linear infinite; }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,t([ft({attribute:!1})],zt.prototype,"hass",void 0),t([ft({attribute:!1})],zt.prototype,"entities",void 0),t([ft({type:String})],zt.prototype,"helperEntity",void 0),t([mt()],zt.prototype,"_deadlineOpen",void 0),t([mt()],zt.prototype,"_clearing",void 0),zt=t([pt("ev-actions")],zt);const Rt=["status","timeline","window","history","soc","actions"];let Ft=class extends ht{constructor(){super(...arguments),this._onSlotClick=t=>{if(!this._entities)return;const e={entity_id:this._entities.planStatus};t.detail.isPlanned?this.hass.callService("smart_ev_charging","skip_until",{until:t.detail.end},e):this.hass.callService("smart_ev_charging","force_charge_now",{duration:{hours:1}},e)}}static getStubConfig(){return{device_id:""}}static async getConfigElement(){return await Promise.resolve().then(function(){return jt}),document.createElement("ev-smart-charging-card-editor")}setConfig(t){if(!t?.device_id)throw new Error("device_id is required");this._config=t,this._entities=void 0,this._error=void 0}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),this._maybeSubscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}render(){if(!this._config)return W``;if(this.hass&&!this._entities&&!this._error)try{this._entities=function(t,e){const i=Object.values(t.entities).filter(t=>t.device_id===e&&"smart_ev_charging"===t.platform);if(0===i.length)throw new Error(`discover: no entities found for device ${e}`);const s={};for(const t of i){const e=t.translation_key??_t(t.unique_id);if(!e)continue;const i=yt[e];i&&(s[i]=t.entity_id)}const n=["planStatus","plannedHours","slotsNeeded","activeDeadline","effectiveDeparture","pluggedIn","activelyCharging","chargeNow","smartCharging"];for(const t of n)if(!s[t])throw new Error(`discover: missing entity for ${t} on device ${e}`);const r=t.states[s.planStatus],o=r?.attributes??{},a=bt(o.source_price_entity),l=vt(o.charger_kw),c=bt(o.soc_entity),h=bt(o.target_soc_entity),d=vt(o.min_soc_threshold);return{...s,...a?{priceEntity:a}:{},...void 0!==l?{chargerKw:l}:{},...c?{socEntity:c}:{},...h?{targetSocEntity:h}:{},...void 0!==d?{minSocThreshold:d}:{}}}(this.hass,this._config.device_id),this._maybeSubscribe()}catch(t){this._error=t.message}if(this._error||!this._entities)return W`<div class="error">${this._error??"Loading…"}</div>`;const t=new Set(this._config.show??Rt);return W`
      <ha-card>
        <div class="grid" role="region" aria-label="Smart EV Charging">
          ${t.has("status")?W`<ev-status
  .hass=${this.hass}
  .entities=${this._entities}
  .cardTitle=${this._config?.name??""}
></ev-status>`:""}
          ${t.has("timeline")?W`<ev-timeline class="span2"
            .hass=${this.hass} .entities=${this._entities}
            .hours=${this._config.timeline_hours??36}
            @slot-click=${this._onSlotClick}></ev-timeline>`:""}
          ${t.has("window")?W`<ev-window .hass=${this.hass} .entities=${this._entities}></ev-window>`:""}
          ${t.has("history")?W`<ev-history .hass=${this.hass} .entities=${this._entities}
            .days=${this._config.history_days??30}></ev-history>`:""}
          ${t.has("soc")?W`<ev-soc-trend .hass=${this.hass} .entities=${this._entities}
            .days=${this._config.soc_days??7}></ev-soc-trend>`:""}
          ${t.has("actions")?W`<ev-actions class="full"
            .hass=${this.hass} .entities=${this._entities}
            .helperEntity=${this._config.helper_entity??""}></ev-actions>`:""}
        </div>
      </ha-card>
    `}async _maybeSubscribe(){!this._unsubscribe&&this.hass&&(this._unsubscribe=await this.hass.connection.subscribeEvents(()=>this.requestUpdate(),"smart_ev_charging_plan_updated"))}};Ft.styles=a`
    :host { display: block; }
    ha-card {
      padding: 4px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 520px), 1fr));
      gap: 10px;
      padding: 6px;
    }
    .grid > * {
      min-width: 0;
    }
    .span2 { grid-column: 1 / -1; }
    .full { grid-column: 1 / -1; }
    .error { padding: 14px; color: ${o(xt("error","#ef4444"))}; }
  `,t([ft({attribute:!1})],Ft.prototype,"hass",void 0),t([mt()],Ft.prototype,"_config",void 0),t([mt()],Ft.prototype,"_entities",void 0),t([mt()],Ft.prototype,"_error",void 0),Ft=t([pt("ev-smart-charging-card")],Ft),(Ut=window).customCards||(Ut.customCards=[]),window.customCards.push({type:"ev-smart-charging-card",name:"Smart EV Charging",description:"Status, plan timeline, history and actions for the Smart EV Charging integration.",preview:!1}),console.info("%c ev-smart-charging-card%c v0.1.0 ","color:white;background:#3b82f6;font-weight:700","color:#3b82f6");const Bt=["status","timeline","window","history","soc","actions"];let Lt=class extends ht{constructor(){super(...arguments),this._config={},this._onDeviceChanged=t=>{const e=t.detail.value;this._config={...this._config,device_id:e||""},this._emit()},this._setField=t=>e=>{const i=e.target.value;this._config={...this._config,[t]:i||void 0},this._emit()},this._setNumber=t=>e=>{const i=Number(e.target.value);this._config={...this._config,[t]:Number.isFinite(i)?i:void 0},this._emit()},this._toggleTile=t=>e=>{const i=e.target.checked,s=new Set(this._config.show??Bt);i?s.add(t):s.delete(t),this._config={...this._config,show:[...s]},this._emit()}}setConfig(t){this._config={...t}}render(){return W`
      <label>Device
        ${this.hass?W`
              <ha-selector
                .hass=${this.hass}
                .selector=${{device:{integration:"smart_ev_charging"}}}
                .value=${this._config.device_id??""}
                @value-changed=${this._onDeviceChanged}
              ></ha-selector>
            `:W`<input type="text" name="device_id" .value=${this._config.device_id??""}
              @input=${this._setField("device_id")} />`}
        <span class="hint">Pick the Smart EV Charging device (one per car / charger combination).</span>
      </label>
      <label>Name (optional)
        <input type="text" name="name" .value=${this._config.name??""}
          @input=${this._setField("name")} />
        <span class="hint">Display title above the card. Defaults to the device name.</span>
      </label>
      <label>History days (7–90)
        <input type="number" name="history_days" min="7" max="90"
          .value=${String(this._config.history_days??30)}
          @input=${this._setNumber("history_days")} />
        <span class="hint">How many days of past charging sessions to show in the cost-history chart. Higher = more bars, slower load.</span>
      </label>
      <label>SoC days (1–30)
        <input type="number" name="soc_days" min="1" max="30"
          .value=${String(this._config.soc_days??7)}
          @input=${this._setNumber("soc_days")} />
        <span class="hint">How many days of state-of-charge history to plot. Only shown if the integration is configured with a SoC sensor.</span>
      </label>
      <label>Timeline hours (12–48)
        <input type="number" name="timeline_hours" min="12" max="48"
          .value=${String(this._config.timeline_hours??36)}
          @input=${this._setNumber("timeline_hours")} />
        <span class="hint">How many hours of price + plan data the timeline shows. Strømligning publishes 48 hours; defaults to 36 for a compact chart.</span>
      </label>
      <label>Helper entity (optional)
        <input type="text" name="helper_entity" .value=${this._config.helper_entity??""}
          @input=${this._setField("helper_entity")} />
        <span class="hint">If you use an input_datetime helper + automation to apply one-off deadlines, point at it here. Leave blank to call the service directly.</span>
      </label>
      <fieldset>
        <legend>Show tiles</legend>
        <span class="hint">Toggle which tiles render in the card.</span>
        ${Bt.map(t=>W`
          <label class="inline">
            <input type="checkbox" name="show_${t}"
              .checked=${(this._config.show??Bt).includes(t)}
              @change=${this._toggleTile(t)} /> ${t}
          </label>
        `)}
      </fieldset>
    `}_emit(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}};Lt.styles=a`
    :host { display: block; padding: 12px; }
    label { display: block; margin-top: 8px; font-size: 0.9em; }
    input[type="text"], input[type="number"], select { width: 100%; padding: 4px; margin-top: 2px; box-sizing: border-box; }
    fieldset { border: 1px solid #ddd; padding: 8px; margin-top: 8px; }
    legend { font-size: 0.85em; }
    label.inline { display: inline-flex; align-items: center; gap: 4px; margin-right: 8px; }
    .hint { display: block; font-size: 0.78em; color: #6b7280; margin-top: 2px; line-height: 1.3; }
  `,t([ft({attribute:!1})],Lt.prototype,"hass",void 0),t([mt()],Lt.prototype,"_config",void 0),Lt=t([pt("ev-smart-charging-card-editor")],Lt);var jt=Object.freeze({__proto__:null,get EvSmartChargingCardEditor(){return Lt}});export{Ft as EvSmartChargingCard};
