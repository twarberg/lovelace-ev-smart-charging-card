function t(t,e,i,s){var n,r=arguments.length,o=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(o=(r<3?n(o):r>3?n(e,i,o):n(e,i))||o);return r>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),n=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&n.set(e,t))}return t}toString(){return this.cssText}};const o=t=>new r("string"==typeof t?t:t+"",void 0,s),a=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)},c=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return o(e)})(t):t,{is:h,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:u,getPrototypeOf:g}=Object,_=globalThis,f=_.trustedTypes,y=f?f.emptyScript:"",m=_.reactiveElementPolyfillSupport,$=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?y:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!h(t,e),w={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty($("elementProperties")))return;const t=g(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...p(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(c(t))}else void 0!==t&&e.push(c(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),n=e.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const r=this.constructor;if(!1===s&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??b)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[$("elementProperties")]=new Map,x[$("finalized")]=new Map,m?.({ReactiveElement:x}),(_.reactiveElementVersions??=[]).push("2.1.2");const S=globalThis,A=t=>t,E=S.trustedTypes,k=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+T,N=`<${P}>`,O=document,D=()=>O.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,H="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,j=/>/g,F=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,I=/"/g,L=/^(?:script|style|textarea|title)$/i,q=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),W=q(1),K=q(2),V=Symbol.for("lit-noChange"),J=Symbol.for("lit-nothing"),Z=new WeakMap,G=O.createTreeWalker(O,129);function Q(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=R;for(let e=0;e<i;e++){const i=t[e];let a,c,h=-1,l=0;for(;l<i.length&&(o.lastIndex=l,c=o.exec(i),null!==c);)l=o.lastIndex,o===R?"!--"===c[1]?o=z:void 0!==c[1]?o=j:void 0!==c[2]?(L.test(c[2])&&(n=RegExp("</"+c[2],"g")),o=F):void 0!==c[3]&&(o=F):o===F?">"===c[0]?(o=n??R,h=-1):void 0===c[1]?h=-2:(h=o.lastIndex-c[2].length,a=c[1],o=void 0===c[3]?F:'"'===c[3]?I:B):o===I||o===B?o=F:o===z||o===j?o=R:(o=F,n=void 0);const d=o===F&&t[e+1].startsWith("/>")?" ":"";r+=o===R?i+N:h>=0?(s.push(a),i.slice(0,h)+C+i.slice(h)+T+d):i+T+(-2===h?e:d)}return[Q(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[c,h]=X(t,e);if(this.el=Y.createElement(c,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=h[r++],i=s.getAttribute(t).split(T),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?nt:"?"===o[1]?rt:"@"===o[1]?ot:st}),s.removeAttribute(t)}else t.startsWith(T)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(T),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],D()),G.nextNode(),a.push({type:2,index:++n});s.append(t[e],D())}}}else if(8===s.nodeType)if(s.data===P)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(T,t+1));)a.push({type:7,index:n}),t+=T.length-1}n++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function tt(t,e,i=t,s){if(e===V)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=M(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=tt(t,n._$AS(t,e.values),n,s)),e}class et{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??O).importNode(e,!0);G.currentNode=s;let n=G.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new it(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new at(n,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(n=G.nextNode(),r++)}return G.currentNode=O,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class it{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),M(t)?t===J||null==t||""===t?(this._$AH!==J&&this._$AR(),this._$AH=J):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==J&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(Q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new et(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new Y(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new it(this.O(D()),this.O(D()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}let st=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=J,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=J}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=tt(this,t,e,0),r=!M(t)||t!==this._$AH&&t!==V,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=tt(this,s[i+o],e,o),a===V&&(a=this._$AH[o]),r||=!M(a)||a!==this._$AH[o],a===J?t=J:t!==J&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}};class nt extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===J?void 0:t}}class rt extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==J)}}class ot extends st{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??J)===V)return;const i=this._$AH,s=t===J&&i!==J||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==J&&(i===J||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const ct=S.litHtmlPolyfillSupport;ct?.(Y,it),(S.litHtmlVersions??=[]).push("3.3.2");const ht=globalThis;class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new it(e.insertBefore(D(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}lt._$litElement$=!0,lt.finalized=!0,ht.litElementHydrateSupport?.({LitElement:lt});const dt=ht.litElementPolyfillSupport;dt?.({LitElement:lt}),(ht.litElementVersions??=[]).push("4.2.2");const pt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ut={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},gt=(t=ut,e,i)=>{const{kind:s,metadata:n}=i;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const n=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,n,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const n=this[s];e.call(this,i),this.requestUpdate(s,n,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function _t(t){return(e,i)=>"object"==typeof i?gt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function ft(t){return _t({...t,state:!0,attribute:!1})}const yt={plan_status:"planStatus",planned_hours:"plannedHours",slots_needed:"slotsNeeded",active_deadline:"activeDeadline",effective_departure:"effectiveDeparture",plugged_in:"pluggedIn",actively_charging:"activelyCharging",charge_now:"chargeNow",smart_charging_enabled:"smartCharging"};function mt(t,e){const i=Object.values(t.entities).filter(t=>t.device_id===e&&"smart_ev_charging"===t.platform);if(0===i.length)throw new Error(`discover: no entities found for device ${e}`);const s={};for(const t of i){const e=t.translation_key??$t(t.unique_id);if(!e)continue;const i=yt[e];i&&(s[i]=t.entity_id)}const n=["planStatus","plannedHours","slotsNeeded","activeDeadline","effectiveDeparture","pluggedIn","activelyCharging","chargeNow","smartCharging"];for(const t of n)if(!s[t])throw new Error(`discover: missing entity for ${t} on device ${e}`);const r=t.states[s.planStatus],o=r?.attributes??{},a=vt(o.source_price_entity),c=function(t){return"number"==typeof t&&Number.isFinite(t)?t:void 0}(o.charger_kw),h=vt(o.soc_entity),l=vt(o.target_soc_entity);return{...s,...a?{priceEntity:a}:{},...void 0!==c?{chargerKw:c}:{},...h?{socEntity:h}:{},...l?{targetSocEntity:l}:{}}}function $t(t){const e=t.indexOf("_");return e>=0?t.slice(e+1):null}function vt(t){return"string"==typeof t&&t.length>0?t:void 0}const bt={primary:"--primary-color",primaryText:"--primary-text-color",secondaryText:"--secondary-text-color",divider:"--divider-color",cardBg:"--card-background-color",success:"--success-color",warning:"--warning-color",error:"--error-color"};function wt(t,e){return`var(${bt[t]}, ${e})`}const xt={ok:wt("success","#22c55e"),partial:wt("warning","#f59e0b"),extended:wt("warning","#f59e0b"),no_data:wt("secondaryText","#94a3b8"),unplugged:wt("secondaryText","#94a3b8"),disabled:wt("secondaryText","#94a3b8")};let St=class extends lt{constructor(){super(...arguments),this._toggle=()=>{this.hass.callService("switch","toggle",void 0,{entity_id:this.entities.smartCharging})}}render(){const t=this.hass.states[this.entities.planStatus],e=this.hass.states[this.entities.smartCharging],i=this.hass.states[this.entities.effectiveDeparture],s=t?.state??"no_data",n=xt[s]??xt.no_data??"#94a3b8",r="one_off"===(i?.attributes.source??"default"),o=this.entities.socEntity?Number(this.hass.states[this.entities.socEntity]?.state):NaN,a=this.entities.targetSocEntity?Number(this.hass.states[this.entities.targetSocEntity]?.state):NaN,c=Number.isFinite(o),h=this.entities.planStatus.split(".")[1]?.replace(/_/g," ").replace(/plan status$/,"").trim()??"EV";return W`
      <div class="tile">
        <div class="header">
          <span class="name">${h}</span>
          <span class="pill" style="background:${n}">${s}</span>
          <button class="toggle-btn" @click=${this._toggle}>
            ${"on"===e?.state?"Smart: ON":"Smart: OFF"}
          </button>
        </div>
        <div class="row">
          <span>Deadline: ${i?.state??"—"}</span>
          ${r?W`<span title="one-off override active">★</span>`:""}
        </div>
        ${c?W`
              <div class="soc-track">
                <div class="soc-fill" style="width:${Math.max(0,Math.min(100,o))}%"></div>
                ${Number.isFinite(a)?W`<div class="soc-target" style="left:${a}%"></div>`:""}
              </div>
              <div class="row"><span>SoC ${o.toFixed(0)}% → ${Number.isFinite(a)?a.toFixed(0)+"%":"—"}</span></div>
            `:""}
      </div>
    `}};St.styles=a`
    :host { display: block; }
    .tile { background: ${o(wt("cardBg","#fff"))}; border-radius: 12px; padding: 12px; }
    .header { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
    .name { font-weight: 600; font-size: 1.05em; }
    .pill { padding: 2px 10px; border-radius: 999px; color: white; font-size: 0.85em; }
    .row { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; font-size: 0.9em; color: ${o(wt("secondaryText","#475569"))}; }
    .soc-track { height: 8px; background: ${o(wt("divider","#e5e7eb"))}; border-radius: 999px; overflow: hidden; margin-top: 6px; position: relative; }
    .soc-fill { height: 100%; background: ${o(wt("primary","#3b82f6"))}; transition: width .3s; }
    .soc-target { position: absolute; top: -2px; width: 2px; height: 12px; background: ${o(wt("primaryText","#0f172a"))}; }
    .toggle-btn { background: none; border: 1px solid ${o(wt("divider","#e5e7eb"))}; padding: 4px 10px; border-radius: 8px; cursor: pointer; }
  `,t([_t({attribute:!1})],St.prototype,"hass",void 0),t([_t({attribute:!1})],St.prototype,"entities",void 0),St=t([pt("ev-status")],St);const At=80;let Et=class extends lt{constructor(){super(...arguments),this._lastPrices=[],this._lastPlanned=new Set,this._emitSlot=(t,e)=>{const i={start:t.start,end:t.end,isPlanned:e,price:t.price};this.dispatchEvent(new CustomEvent("slot-click",{detail:i,bubbles:!0,composed:!0}))}}render(){const t=this._prices();if(this._lastPrices=t,0===t.length)return this._lastPlanned=new Set,W`<div class="tile"><h3>Price &amp; plan</h3><div class="empty">No price data yet</div></div>`;const e=this.hass.states[this.entities.plannedHours]?.attributes;this._lastPlanned=new Set(e?.hours??[]);const i=Math.min(...t.map(t=>t.price)),s=Math.max(...t.map(t=>t.price)),n=s-i||1,r=480/t.length,o=t.map((t,e)=>{const s=72-(t.price-i)/n*64;return`${(e*r+r/2).toFixed(1)},${s.toFixed(1)}`}).join(" "),a=new Date,c=t.findIndex(t=>new Date(t.start)<=a&&a<new Date(t.end)),h=c>=0?c*r+r*((a.getTime()-new Date(t[c].start).getTime())/36e5):-1;return W`
      <div class="tile">
        <h3>Price &amp; plan — next ${t.length}h</h3>
        <svg id="chart" viewBox="0 0 ${480} ${At}" role="img" aria-label="24h price curve with planned hours">
          <polyline points="${o}" fill="none" stroke="${wt("primary","#3b82f6")}" stroke-width="1.5" />
          ${h>=0?W`<line class="now-line" x1="${h}" y1="0" x2="${h}" y2="${At}"></line>`:""}
        </svg>
      </div>
    `}updated(){const t=this.shadowRoot?.querySelector("#chart");if(!t||0===this._lastPrices.length)return;t.querySelectorAll(".slot-group").forEach(t=>t.remove());const e=this._lastPrices,i=this._lastPlanned,s=480/e.length;for(let n=0;n<e.length;n++){const r=e[n],o=i.has(r.start),a=document.createElementNS("http://www.w3.org/2000/svg","g");a.setAttribute("class","slot-group");const c=document.createElementNS("http://www.w3.org/2000/svg","rect");c.setAttribute("class","slot"),c.setAttribute("x",String(n*s)),c.setAttribute("y","0"),c.setAttribute("width",String(s)),c.setAttribute("height",String(At)),c.setAttribute("fill","transparent"),c.setAttribute("stroke",wt("divider","#e5e7eb")),c.setAttribute("stroke-width","0.25"),c.setAttribute("data-slot-hour",String(n)),c.addEventListener("click",()=>this._emitSlot(r,o));const h=document.createElementNS("http://www.w3.org/2000/svg","title");if(h.textContent=`${new Date(r.start).toLocaleString()} · ${r.price.toFixed(2)}`,c.appendChild(h),a.appendChild(c),o){const t=document.createElementNS("http://www.w3.org/2000/svg","rect");t.setAttribute("class","planned-rect"),t.setAttribute("x",String(n*s)),t.setAttribute("y","8"),t.setAttribute("width",String(s)),t.setAttribute("height",String(64)),a.appendChild(t)}t.insertBefore(a,t.firstChild)}}_prices(){if(!this.entities?.priceEntity)return[];const t=this.hass.states[this.entities.priceEntity]?.attributes.prices;return Array.isArray(t)?t.filter(t=>t&&"string"==typeof t.start&&"string"==typeof t.end&&"number"==typeof t.price):[]}};function kt(t,e,i){if(null==t)return"—";const s=t.toFixed(2);return e?`${s} ${e}`:s}Et.styles=a`
    :host { display: block; }
    .tile { background: ${o(wt("cardBg","#fff"))}; border-radius: 12px; padding: 12px; }
    h3 { margin: 0 0 8px; font-size: 0.95em; color: ${o(wt("secondaryText","#475569"))}; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    svg { width: 100%; height: auto; display: block; }
    .slot { cursor: pointer; }
    .slot:hover rect { fill: ${o(wt("primary","#3b82f6"))}; opacity: 0.15; }
    .planned-rect { fill: ${o(wt("success","#22c55e"))}; opacity: 0.35; pointer-events: none; }
    .now-line { stroke: ${o(wt("primaryText","#0f172a"))}; stroke-width: 1; stroke-dasharray: 2 2; }
    .empty { color: ${o(wt("secondaryText","#94a3b8"))}; font-style: italic; }
  `,t([_t({attribute:!1})],Et.prototype,"hass",void 0),t([_t({attribute:!1})],Et.prototype,"entities",void 0),Et=t([pt("ev-timeline")],Et);let Ct=class extends lt{render(){const t=this.hass.states[this.entities.plannedHours]?.attributes??{},e=t.hours??[],i=t.hour_prices??[],s=t.hour_kwh??[],n=t.cost_unit??null,r=t.estimated_cost??null;if(this.hass.locale.language,0===e.length)return W`<div class="tile"><h3>Charge window</h3><div class="empty">No charging planned</div></div>`;let o=0;return W`
      <div class="tile">
        <h3>Charge window</h3>
        <table>
          <thead><tr><th>Time</th><th>Price/kWh</th><th>kWh</th><th>Cumulative</th></tr></thead>
          <tbody>
            ${e.map((t,e)=>{const r=i[e]??0,a=s[e]??0;return o+=r*a,W`
                <tr>
                  <td>${function(t){const e=new Date(t);return`${String(e.getHours()).padStart(2,"0")}:${String(e.getMinutes()).padStart(2,"0")}`}(t)}</td>
                  <td>${r.toFixed(2)}</td>
                  <td>${c=a,`${c.toFixed(1)} kWh`}</td>
                  <td>${kt(o,n)}</td>
                </tr>
              `;var c})}
          </tbody>
          <tfoot><tr><td colspan="3">Estimated total</td><td>${kt(r,n)}</td></tr></tfoot>
        </table>
      </div>
    `}};function Tt(t,e){const i=new Date(e).getTime()-new Date(t).getTime();return{start:t,end:e,durationHours:Math.max(0,i/36e5)}}function Pt(t,e,i){return t.map(t=>{const s=function(t,e,i){const s=new Date(e).getTime(),n=new Date(i).getTime();let r=0,o=0;for(const e of t){const t=new Date(e.start).getTime(),i=new Date(e.end).getTime(),a=Math.max(0,Math.min(n,i)-Math.max(s,t));if(0===a)continue;const c=a/36e5;r+=e.price*c,o+=c}return o>0?r/o:0}(e,t.start,t.end),n=t.durationHours*i;return{...t,kwh:n,cost:n*s}})}async function Nt(t,e,i,s){const n=await t.callWS({type:"history/history_during_period",start_time:i.toISOString(),end_time:s.toISOString(),entity_ids:e,minimal_response:!0,no_attributes:!0}),r={};for(const[t,e]of Object.entries(n))r[t]=e.map(t=>({state:t.s,t:new Date(1e3*t.lu).toISOString()}));return r}Ct.styles=a`
    :host { display: block; }
    .tile { background: ${o(wt("cardBg","#fff"))}; border-radius: 12px; padding: 12px; }
    h3 { margin: 0 0 8px; font-size: 0.95em; color: ${o(wt("secondaryText","#475569"))}; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9em; }
    th, td { padding: 4px 6px; border-bottom: 1px solid ${o(wt("divider","#eee"))}; text-align: right; }
    th:first-child, td:first-child { text-align: left; }
    tfoot td { font-weight: 600; border-top: 2px solid ${o(wt("divider","#eee"))}; border-bottom: none; padding-top: 8px; }
    .empty { color: ${o(wt("secondaryText","#94a3b8"))}; font-style: italic; }
  `,t([_t({attribute:!1})],Ct.prototype,"hass",void 0),t([_t({attribute:!1})],Ct.prototype,"entities",void 0),Ct=t([pt("ev-window")],Ct);let Ot=class extends lt{constructor(){super(...arguments),this.days=30,this._expanded=null,this._error=null,this._lastFetchKey=""}updated(){const t=`${this.entities?.chargeNow}|${this.days}`;t!==this._lastFetchKey&&this.hass&&this.entities&&(this._lastFetchKey=t,this._fetch())}render(){this.hass.locale.language;const t=this.hass.states[this.entities.planStatus]?.attributes.cost_unit??null,e=this._buckets??[],i=e.reduce((t,e)=>t+e.cost,0),s=e.reduce((t,e)=>t+e.sessions.length,0),n=Math.max(0,...e.map(t=>t.cost)),r=this._error?W`<div class="empty">${this._error}</div>`:0===e.length?W`<div class="empty">Loading…</div>`:W`
            <svg viewBox="0 0 ${8*e.length} 80">
              ${e.map((e,i)=>{const s=n>0?e.cost/n*76:0;return K`<rect class="bar" x="${8*i}" y="${80-s}" width="7" height="${s}"
                  fill="${wt("primary","#3b82f6")}"
                  @click=${()=>this._expanded=this._expanded===e.date?null:e.date}>
                  <title>${e.date}: ${e.cost.toFixed(2)} ${t??""}</title></rect>`})}
            </svg>
            ${this._expanded?W`<div class="drawer">
                  <strong>${this._expanded}</strong>
                  <ul>
                    ${e.find(t=>t.date===this._expanded)?.sessions.map(e=>W`<li>${new Date(e.start).toLocaleTimeString()}–${new Date(e.end).toLocaleTimeString()} · ${(e.kwh??0).toFixed(1)} kWh · ${kt(e.cost??null,t)}</li>`)}
                  </ul>
                </div>`:""}
          `;return W`
      <div class="tile">
        <h3>History — ${this.days}d</h3>
        <div class="header">
          <span>Total ${kt(i,t)}</span>
          <span>${s} sessions</span>
        </div>
        ${r}
      </div>
    `}async _fetch(){this._error=null;try{const t=new Date,e=new Date(t.getTime()-864e5*this.days),i=[this.entities.chargeNow];this.entities.priceEntity&&i.push(this.entities.priceEntity);const s=await Nt(this.hass,i,e,t),n=function(t,e){const i=[];let s=null;for(const e of t)"on"===e.state&&null===s?s=e.t:"on"!==e.state&&null!==s&&(i.push(Tt(s,e.t)),s=null);if(null!==s){const t=e??(new Date).toISOString();i.push(Tt(s,t))}return i}(s[this.entities.chargeNow]??[],t.toISOString()),r=this.entities.priceEntity?this.hass.states[this.entities.priceEntity]?.attributes.prices??[]:[],o=this.entities.chargerKw??11;this._buckets=function(t){const e=new Map;for(const i of t){const t=new Date(i.start).toISOString().slice(0,10),s=e.get(t)??{date:t,cost:0,sessions:[]};s.cost+=i.cost??0,s.sessions.push(i),e.set(t,s)}return[...e.values()].sort((t,e)=>t.date.localeCompare(e.date))}(Pt(n,r,o))}catch(t){this._error=`History fetch failed: ${t.message}`}}};Ot.styles=a`
    :host { display: block; }
    .tile { background: ${o(wt("cardBg","#fff"))}; border-radius: 12px; padding: 12px; }
    h3 { margin: 0 0 8px; font-size: 0.95em; color: ${o(wt("secondaryText","#475569"))}; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    .header { display: flex; justify-content: space-between; font-size: 0.85em; color: ${o(wt("secondaryText","#475569"))}; margin-bottom: 6px; }
    svg { width: 100%; height: 80px; display: block; }
    .bar { cursor: pointer; }
    .bar:hover { opacity: 0.7; }
    .drawer { margin-top: 8px; font-size: 0.85em; }
    .drawer ul { list-style: none; padding: 0; margin: 0; }
    .drawer li { padding: 2px 0; border-bottom: 1px solid ${o(wt("divider","#eee"))}; }
    .empty { color: ${o(wt("secondaryText","#94a3b8"))}; font-style: italic; }
  `,t([_t({attribute:!1})],Ot.prototype,"hass",void 0),t([_t({attribute:!1})],Ot.prototype,"entities",void 0),t([_t({type:Number})],Ot.prototype,"days",void 0),t([ft()],Ot.prototype,"_buckets",void 0),t([ft()],Ot.prototype,"_expanded",void 0),t([ft()],Ot.prototype,"_error",void 0),Ot=t([pt("ev-history")],Ot);let Dt=class extends lt{constructor(){super(...arguments),this.days=7,this._error=null,this._lastKey=""}updated(){if(!this.entities?.socEntity)return;const t=`${this.entities.socEntity}|${this.days}`;t!==this._lastKey&&(this._lastKey=t,this._fetch())}render(){if(!this.entities?.socEntity)return W`<div class="tile"><h3>SoC — ${this.days}d</h3><div class="empty">No SoC entity configured</div></div>`;if(this._error)return W`<div class="tile"><h3>SoC — ${this.days}d</h3><div class="empty">${this._error}</div></div>`;const t=(this._series??[]).filter(t=>Number.isFinite(Number(t.state)));if(t.length<2)return W`<div class="tile"><h3>SoC — ${this.days}d</h3><div class="empty">Loading…</div></div>`;const e=new Date(t[0].t).getTime(),i=new Date(t[t.length-1].t).getTime()-e||1,s=t.map(t=>{const s=(new Date(t.t).getTime()-e)/i*200,n=50-Number(t.state)/100*50;return`${s.toFixed(1)},${n.toFixed(1)}`}).join(" ");return W`
      <div class="tile">
        <h3>SoC — ${this.days}d</h3>
        <svg viewBox="0 0 ${200} ${50}">
          <polyline points="${s}" fill="none" stroke="${wt("success","#22c55e")}" stroke-width="1.5" />
        </svg>
      </div>
    `}async _fetch(){if(this.entities.socEntity)try{this._error=null;const t=new Date,e=new Date(t.getTime()-864e5*this.days),i=await Nt(this.hass,[this.entities.socEntity],e,t);this._series=i[this.entities.socEntity]??[]}catch(t){this._error=`SoC fetch failed: ${t.message}`}}};Dt.styles=a`
    :host { display: block; }
    .tile { background: ${o(wt("cardBg","#fff"))}; border-radius: 12px; padding: 12px; }
    h3 { margin: 0 0 8px; font-size: 0.95em; color: ${o(wt("secondaryText","#475569"))}; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
    svg { width: 100%; height: 60px; display: block; }
    .empty { color: ${o(wt("secondaryText","#94a3b8"))}; font-style: italic; }
  `,t([_t({attribute:!1})],Dt.prototype,"hass",void 0),t([_t({attribute:!1})],Dt.prototype,"entities",void 0),t([_t({type:Number})],Dt.prototype,"days",void 0),t([ft()],Dt.prototype,"_series",void 0),t([ft()],Dt.prototype,"_error",void 0),Dt=t([pt("ev-soc-trend")],Dt);let Mt=class extends lt{constructor(){super(...arguments),this.initialTime="06:00",this.open=!1,this._value="06:00",this._onChange=t=>{this._value=t.target.value},this._onBackdrop=()=>this._cancel(),this._cancel=()=>{this.dispatchEvent(new CustomEvent("deadline-cancel",{bubbles:!0,composed:!0})),this.open=!1},this._confirm=()=>{this.dispatchEvent(new CustomEvent("deadline-confirm",{detail:{time:this._value},bubbles:!0,composed:!0})),this.open=!1}}willUpdate(t){(t.has("initialTime")||t.has("open"))&&(this._value=this.initialTime)}render(){return this.open?W`
      <div class="backdrop" @click=${this._onBackdrop}>
        <div class="dialog" @click=${t=>t.stopPropagation()}>
          <strong>Set one-off departure</strong>
          <div style="margin-top: 12px">
            <input type="time" .value=${this._value} @change=${this._onChange} />
          </div>
          <div class="row">
            <button @click=${this._cancel}>Cancel</button>
            <button class="primary" @click=${this._confirm}>Set</button>
          </div>
        </div>
      </div>
    `:W``}};Mt.styles=a`
    :host { display: contents; }
    .backdrop {
      position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4);
      display: flex; align-items: center; justify-content: center; z-index: 100;
    }
    .dialog {
      background: ${o(wt("cardBg","#fff"))}; padding: 16px; border-radius: 12px;
      min-width: 240px; max-width: 90vw;
    }
    .row { display: flex; gap: 8px; margin-top: 12px; justify-content: flex-end; }
    button { background: none; border: 1px solid ${o(wt("divider","#e5e7eb"))}; padding: 6px 12px; border-radius: 8px; cursor: pointer; }
    button.primary { background: ${o(wt("primary","#3b82f6"))}; color: white; border-color: transparent; }
    input[type=time] { font-size: 1.2em; padding: 4px; }
  `,t([_t({type:String})],Mt.prototype,"initialTime",void 0),t([_t({type:Boolean,reflect:!0})],Mt.prototype,"open",void 0),t([ft()],Mt.prototype,"_value",void 0),Mt=t([pt("ev-deadline-picker")],Mt);let Ut=class extends lt{constructor(){super(...arguments),this.helperEntity="",this._deadlineOpen=!1,this._replan=()=>{this.hass.callService("smart_ev_charging","replan",{},this._target())},this._force=()=>{this.hass.callService("smart_ev_charging","force_charge_now",{duration:{hours:2}},this._target())},this._skip=()=>{const t=new Date(Date.now()+36e5).toISOString();this.hass.callService("smart_ev_charging","skip_until",{until:t},this._target())},this._clearOverride=()=>{this.hass.callService("smart_ev_charging","set_one_off_departure",{},this._target())},this._openDeadline=()=>{this._deadlineOpen=!0},this._onDeadlineConfirm=t=>{const e=t.detail.time;this.helperEntity?this.hass.callService("input_datetime","set_datetime",{time:e},{entity_id:this.helperEntity}):this.hass.callService("smart_ev_charging","set_one_off_departure",{departure_time:e},this._target())}}render(){const t=this.hass.states[this.entities.effectiveDeparture]?.state??"06:00";return W`
      <div class="tile">
        <button @click=${this._replan}>Replan</button>
        <button @click=${this._force}>Force charge (2h)</button>
        <button @click=${this._skip}>Skip 1h</button>
        <button @click=${this._openDeadline}>Set deadline</button>
        <button @click=${this._clearOverride}>Clear override</button>
      </div>
      <ev-deadline-picker
        .initialTime=${t}
        .open=${this._deadlineOpen}
        @deadline-confirm=${this._onDeadlineConfirm}
        @deadline-cancel=${()=>this._deadlineOpen=!1}
      ></ev-deadline-picker>
    `}_target(){return{entity_id:this.entities.planStatus}}};var Ht;Ut.styles=a`
    :host { display: block; }
    .tile { background: ${o(wt("cardBg","#fff"))}; border-radius: 12px; padding: 12px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: space-around; }
    button { background: none; border: 1px solid ${o(wt("divider","#e5e7eb"))}; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.9em; }
    button:hover { background: ${o(wt("primary","#3b82f6"))}; color: white; border-color: transparent; }
  `,t([_t({attribute:!1})],Ut.prototype,"hass",void 0),t([_t({attribute:!1})],Ut.prototype,"entities",void 0),t([_t({type:String})],Ut.prototype,"helperEntity",void 0),t([ft()],Ut.prototype,"_deadlineOpen",void 0),Ut=t([pt("ev-actions")],Ut);const Rt=["status","timeline","window","history","soc","actions"];let zt=class extends lt{constructor(){super(...arguments),this._onSlotClick=t=>{if(!this._entities)return;const e={entity_id:this._entities.planStatus};t.detail.isPlanned?this.hass.callService("smart_ev_charging","skip_until",{until:t.detail.end},e):this.hass.callService("smart_ev_charging","force_charge_now",{duration:{hours:1}},e)}}static getStubConfig(){return{device_id:""}}static async getConfigElement(){return await Promise.resolve().then(function(){return Bt}),document.createElement("ev-smart-charging-card-editor")}setConfig(t){if(!t?.device_id)throw new Error("device_id is required");this._config=t,this._entities=void 0,this._error=void 0}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),this._maybeSubscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0}render(){if(!this._config)return W``;if(this.hass&&!this._entities&&!this._error)try{this._entities=mt(this.hass,this._config.device_id),this._maybeSubscribe()}catch(t){this._error=t.message}if(this._error||!this._entities)return W`<div class="error">${this._error??"Loading…"}</div>`;const t=new Set(this._config.show??Rt);return W`
      <ha-card>
        <div class="grid">
          ${t.has("status")?W`<ev-status .hass=${this.hass} .entities=${this._entities}></ev-status>`:""}
          ${t.has("timeline")?W`<ev-timeline class="span2"
            .hass=${this.hass} .entities=${this._entities}
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
    `}async _maybeSubscribe(){!this._unsubscribe&&this.hass&&(this._unsubscribe=await this.hass.connection.subscribeEvents(()=>this.requestUpdate(),"smart_ev_charging_plan_updated"))}};zt.styles=a`
    :host { display: block; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 8px;
      padding: 8px;
    }
    .span2 { grid-column: span 2; }
    .full { grid-column: 1 / -1; }
    .error { padding: 12px; color: ${o(wt("error","#ef4444"))}; }
    @media (max-width: 600px) {
      .span2 { grid-column: span 1; }
    }
  `,t([_t({attribute:!1})],zt.prototype,"hass",void 0),t([ft()],zt.prototype,"_config",void 0),t([ft()],zt.prototype,"_entities",void 0),t([ft()],zt.prototype,"_error",void 0),zt=t([pt("ev-smart-charging-card")],zt),(Ht=window).customCards||(Ht.customCards=[]),window.customCards.push({type:"ev-smart-charging-card",name:"Smart EV Charging",description:"Status, plan timeline, history and actions for the Smart EV Charging integration.",preview:!1}),console.info("%c ev-smart-charging-card%c v0.1.0 ","color:white;background:#3b82f6;font-weight:700","color:#3b82f6");const jt=["status","timeline","window","history","soc","actions"];let Ft=class extends lt{constructor(){super(...arguments),this._config={},this._setField=t=>e=>{const i=e.target.value;this._config={...this._config,[t]:i||void 0},this._emit()},this._setNumber=t=>e=>{const i=Number(e.target.value);this._config={...this._config,[t]:Number.isFinite(i)?i:void 0},this._emit()},this._toggleTile=t=>e=>{const i=e.target.checked,s=new Set(this._config.show??jt);i?s.add(t):s.delete(t),this._config={...this._config,show:[...s]},this._emit()}}setConfig(t){this._config={...t}}render(){return W`
      <label>Device ID
        <input type="text" name="device_id" .value=${this._config.device_id??""}
          @input=${this._setField("device_id")} />
      </label>
      <label>Name (optional)
        <input type="text" name="name" .value=${this._config.name??""}
          @input=${this._setField("name")} />
      </label>
      <label>History days (7–90)
        <input type="number" name="history_days" min="7" max="90"
          .value=${String(this._config.history_days??30)}
          @input=${this._setNumber("history_days")} />
      </label>
      <label>SoC days (1–30)
        <input type="number" name="soc_days" min="1" max="30"
          .value=${String(this._config.soc_days??7)}
          @input=${this._setNumber("soc_days")} />
      </label>
      <label>Helper entity (optional)
        <input type="text" name="helper_entity" .value=${this._config.helper_entity??""}
          @input=${this._setField("helper_entity")} />
      </label>
      <fieldset>
        <legend>Show tiles</legend>
        ${jt.map(t=>W`
          <label class="inline">
            <input type="checkbox" name="show_${t}"
              .checked=${(this._config.show??jt).includes(t)}
              @change=${this._toggleTile(t)} /> ${t}
          </label>
        `)}
      </fieldset>
    `}_emit(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}};Ft.styles=a`
    :host { display: block; padding: 12px; }
    label { display: block; margin-top: 8px; font-size: 0.9em; }
    input[type="text"], input[type="number"], select { width: 100%; padding: 4px; margin-top: 2px; box-sizing: border-box; }
    fieldset { border: 1px solid #ddd; padding: 8px; margin-top: 8px; }
    legend { font-size: 0.85em; }
    label.inline { display: inline-flex; align-items: center; gap: 4px; margin-right: 8px; }
  `,t([_t({attribute:!1})],Ft.prototype,"hass",void 0),t([ft()],Ft.prototype,"_config",void 0),Ft=t([pt("ev-smart-charging-card-editor")],Ft);var Bt=Object.freeze({__proto__:null,get EvSmartChargingCardEditor(){return Ft}});export{zt as EvSmartChargingCard};
