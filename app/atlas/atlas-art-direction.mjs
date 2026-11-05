/** Light is the default studio. Dark follows the system until a person chooses otherwise. */
export function mountAtlasAppearance(host){
 const system=matchMedia('(prefers-color-scheme: dark)');
 let saved=null;try{const stored=localStorage.getItem('atlas.appearance.v1');saved=stored==='light'||stored==='dark'?stored:null;}catch{}
 const tools=host.querySelector('.atlas-shell-tools');const panel=document.createElement('div');panel.className='atlas-appearance';panel.setAttribute('role','group');panel.setAttribute('aria-label','Erscheinung');panel.innerHTML='<span>Erscheinung</span><button type="button" data-appearance-choice="light">Hell</button><button type="button" data-appearance-choice="dark">Dunkel</button>';tools.prepend(panel);
 const resolve=()=>saved||(system.matches?'dark':'light');
 function apply(){const mode=resolve();document.documentElement.dataset.appearance=mode;const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=mode==='dark'?'#101727':'#f5f5f7';panel.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.appearanceChoice===mode)));window.dispatchEvent(new CustomEvent('atlas:appearance',{detail:{appearance:mode}}));}
 panel.querySelectorAll('button').forEach(button=>button.onclick=()=>{saved=button.dataset.appearanceChoice;try{localStorage.setItem('atlas.appearance.v1',saved);}catch{}apply();});
 system.addEventListener('change',()=>{if(!saved)apply();});apply();
}
/** One motion preference for all rooms. Only presentation preferences live in session storage. */
export function mountAtlasMotion(host){
 const system=matchMedia('(prefers-reduced-motion: reduce)');let saved={};try{saved=JSON.parse(sessionStorage.getItem('atlas.motion.presentation.v1')||'{}');}catch{}
 let state={paused:!!saved.paused,quiet:!!saved.quiet,reduced:system.matches||!!saved.reduced};
 const tools=host.querySelector('.atlas-shell-tools');const panel=document.createElement('details');panel.className='atlas-motion-panel';panel.innerHTML='<summary>Bewegung</summary><div><strong>Den eigenen Rhythmus wählen</strong><label><input type="checkbox" data-motion-pref="paused"> Bewegung anhalten</label><label><input type="checkbox" data-motion-pref="quiet"> Ruhige Ansicht</label><label><input type="checkbox" data-motion-pref="reduced"> Reduzierte Bewegung</label><p>Du kannst Fahrten jederzeit durch Ziehen, Zoomen oder Escape unterbrechen. Reduzierte Bewegung wechselt direkt zum Ziel.</p></div>';tools.prepend(panel);
 const appearance=tools.querySelector('.atlas-appearance');if(appearance)panel.querySelector(':scope > div').append(appearance);
 function apply(){for(const [key,cls] of [['paused','atlas-motion-paused'],['quiet','atlas-quiet'],['reduced','atlas-reduced']]){document.documentElement.classList.toggle(cls,state[key]);panel.querySelector(`[data-motion-pref="${key}"]`).checked=state[key];}panel.querySelector('summary').textContent=state.paused?'Bewegung pausiert':state.quiet?'Ruhige Ansicht':'Bewegung';window.dispatchEvent(new CustomEvent('atlas:motionchange',{detail:{...state}}));try{sessionStorage.setItem('atlas.motion.presentation.v1',JSON.stringify(state));}catch{}}
 panel.querySelectorAll('input').forEach(input=>input.onchange=()=>{state[input.dataset.motionPref]=input.checked;apply();});system.addEventListener('change',e=>{state.reduced=e.matches;apply();});apply();return {getState:()=>({...state})};
}
