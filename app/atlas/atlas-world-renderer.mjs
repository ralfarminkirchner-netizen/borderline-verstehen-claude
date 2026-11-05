// An original, dependency-free sculptural reading space. Its folds are an
// editorial metaphor, never a map of clinical causality. Both views share
// every vertex: a change of view bends the same material into another form.
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,s)=>a.map(v=>v*s);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const unit=a=>mul(a,1/(Math.hypot(...a)||1));
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const clamp=t=>Math.max(0,Math.min(1,Number.isFinite(t)?t:1));
const paper=[.961,.922,.851],ink=[.063,.090,.153];
const palette=[[.557,.824,.741],[.718,.647,.875],[.937,.588,.490],[.670,.797,.587],[.490,.710,.850],[.914,.780,.470],[.839,.647,.490],[.735,.702,.894]];
export function worldPlaces(mode,narrow=false){
 if(mode==='tree')return [[-7,5,-1],[-3.4,9,-1.8],[-8,1.1,1],[-2.9,2.2,2.3],[6.8,1.5,1.5],[4,8,-1.8],[7.5,5.4,-.1],[1,5.7,2]].map(([x,y,z])=>[x*(narrow?.66:1),y,z]);
 return (narrow?[[-7.2,-12.5],[6.8,-12.6],[-6.6,-4.2],[6.5,-4.8],[6,2.8],[5.7,9],[-6.1,8.9],[-6.3,2.8]]:[[-10,-7],[-3,-10],[-12,1],[-4,2],[9,3],[8,-7],[7,11],[-7,11]]).map(([x,z])=>[x,0,z]);
}
function noise(x,z){return Math.sin(x*.69+Math.sin(z*.37))*Math.cos(z*.61-x*.17)*.55+Math.sin(x*1.61+z*.92)*.20+Math.sin(x*3.63-z*2.71)*.09;}
export function worldHeight(x,z,narrow=false){
 let h=.18+noise(x,z)*.62;
 worldPlaces('landscape',narrow).forEach(([cx,,cz],i)=>{const d=((x-cx)**2+(z-cz)**2)/((i%3+3.7)**2);h+=(i%3*.8+2.7)*Math.exp(-d*.8);});
 const river=x-(Math.sin(z*.21)*2.3+.08*z);h-=1.75*Math.exp(-river*river/3.1);
 return Math.max(-.23,h);
}
const bezier=(a,b,c,d,t)=>add(add(mul(a,(1-t)**3),mul(b,3*(1-t)**2*t)),add(mul(c,3*(1-t)*t*t),mul(d,t**3)));
function geometry(mode,narrow,low=false,weights){
 const positions=[],normals=[],colors=[],lines=[],lineNormals=[],lineColors=[];
 const tree=mode==='tree',places=worldPlaces(mode,narrow);
 const normal=(fn,u,v)=>unit(cross(sub(fn(u+.001,v),fn(u-.001,v)),sub(fn(u,v+.001),fn(u,v-.001))));
 const vertex=(fn,u,v,color)=>{positions.push(...fn(u,v));normals.push(...normal(fn,u,v));colors.push(...color(u,v));};
 const surface=(fn,nu,nv,color)=>{for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=i/nu,b=(i+1)/nu,c=j/nv,d=(j+1)/nv;vertex(fn,a,c,color);vertex(fn,b,c,color);vertex(fn,a,d,color);vertex(fn,b,c,color);vertex(fn,b,d,color);vertex(fn,a,d,color);}};
 const line=(a,b,color)=>{lines.push(...a,...b);lineNormals.push(0,1,0,0,1,0);lineColors.push(...color,...color);};
 const trace=(fn,n,color)=>{for(let i=0;i<n;i++)line(fn(i/n),fn((i+1)/n),color);};
 // The eight places retain their original anchor positions. Three nested
 // membranes reveal a different section of each place as the camera moves.
 places.forEach((p,g)=>{
  const base=tree?p[1]:worldHeight(p[0],p[2],narrow),phase=g*.81;
  const heft=(()=>{const w=Array.isArray(weights)&&Number.isFinite(+weights[g])?+weights[g]:1;return .82+.48*Math.max(.42,Math.min(1.05,w));})();
  for(let layer=0;layer<3;layer++){
   const radius=(2.85*heft-layer*.22)*(narrow&&!tree?.82:1),turn=phase+layer*.26;
   const sheet=(u,v)=>{
    const theta=u*Math.PI*2,r=.045+v*.955;
    const scallop=1+.095*Math.sin(theta*3+phase)+.055*Math.cos(theta*5-phase);
    const dx=Math.cos(theta)*radius*r*scallop,dz=Math.sin(theta)*radius*r*.77;
    const fold=Math.sin(theta*3+turn)*.58+Math.sin(theta*5-phase)*.22;
    const lift=r*r*(.65+fold)+Math.sin(r*Math.PI)*.26;
    if(tree){
     const tilt=(g%2?1:-1)*.25,xx=dx*.79,yy=dz*.73;
     return [p[0]+xx*Math.cos(tilt)-yy*Math.sin(tilt),base+xx*Math.sin(tilt)+yy*Math.cos(tilt),p[2]+.2+layer*.36+lift*.92+Math.cos(theta+phase)*r*.25];
    }
    return [p[0]+dx*Math.cos(turn)-dz*Math.sin(turn),base-1.15+layer*.47+lift,p[2]+dx*Math.sin(turn)+dz*Math.cos(turn)];
   };
   const color=(u,v)=>{
    const fold=Math.sin(u*Math.PI*6+turn),light=.16+layer*.13+v*.12+Math.max(0,fold)*.12;
    return mix(palette[g],paper,.04+light*.1);
   };
   surface(sheet,low?12:16,low?3:4,color);
   const seam=mix(palette[g],paper,.55);
   trace(t=>add(sheet(t,1),[0,tree?0:.02,tree?.02:0]),low?16:24,seam);
   for(const ring of [1,.62])trace(t=>add(sheet(t,ring),[0,tree?0:.03,tree?.03:0]),low?14:20,mix(palette[g],paper,.2));
   if(layer===2){
    trace(t=>add(sheet(t,.66),[0,tree?0:.025,tree?.025:0]),low?24:42,mix(palette[g],paper,.35));
    for(let k=0;k<3;k++)trace(t=>add(sheet((k/3+phase*.04)%1,.14+t*.85),[0,tree?0:.03,tree?.03:0]),low?7:12,mix(palette[g],paper,.55));
   }
  }
  // Bridges meet at the atlas centre. They are orientation, not a factual edge.
  const end=tree?[p[0],p[1]+.2,p[2]]:[p[0],base+.55,p[2]];
  const a=tree?[(g-3.5)*.07,-8,.04*g]:[(g-3.5)*.12,-1.35,(g-3.5)*.12];
  const b=tree?[(g-3.5)*.09,-2.2,-.7]:[p[0]*.18,-.8,p[2]*.42];
  const c=tree?[p[0]*.29,p[1]-.8,-1.5]:[p[0]*.63,base+.15,p[2]*.8];
  const centre=t=>bezier(a,b,c,end,t);
  const ribbon=(u,v)=>{
   const tangent=unit(sub(centre(u+.001),centre(u-.001))),side=unit(cross(tangent,tree?[0,0,1]:[0,1,0]));
   const normal=unit(cross(side,tangent)),s=v*2-1;
   const width=(tree?.55:1.05)+Math.sin(Math.PI*u)*(tree?.42:.78);
   const bend=(Math.cos(s*Math.PI)*.18+Math.sin(u*Math.PI*3+phase)*.055)*(Math.sin(Math.PI*u)*.7+.3);
   const arch=Math.sin(Math.PI*u)*(tree?1.05:1.9);
   return add(add(centre(u),add(mul(side,s*width),mul(normal,bend))),[0,arch,0]);
  };
  surface(ribbon,low?12:16,low?2:3,(u,v)=>mix(palette[g],paper,.12+Math.sin(Math.PI*u)*.25+Math.abs(v-.5)*.28));
  for(const v of [.08,.5,.92])trace(t=>add(ribbon(t,v),tree?[0,0,.024]:[0,.024,0]),low?12:18,mix(palette[g],paper,.45));
 });
 return Object.fromEntries(Object.entries({positions,normals,colors,lines,lineNormals,lineColors}).map(([k,v])=>[k,new Float32Array(v)]));
}
const vertexShader=`attribute vec3 aPosition,aFrom,aNormal,aNormalFrom,aColor;
uniform vec3 uEye,uRight,uUp,uForward;uniform float uAspect,uMorph;
varying vec3 vColor,vNormal,vPosition;varying float vDistance;
void main(){vec3 p=mix(aFrom,aPosition,uMorph);vec3 d=p-uEye;float z=dot(d,uForward);gl_Position=vec4(dot(d,uRight)*1.92/uAspect,dot(d,uUp)*1.92,1.002*z-.2002,z);vColor=aColor;vNormal=normalize(mix(aNormalFrom,aNormal,uMorph));vPosition=p;vDistance=length(d);}`;
const day=[.945,.953,.965];
function studioNight(){try{return globalThis.document?.documentElement?.dataset?.appearance==='dark';}catch{return false;}}
// Compact daylight needs deeper fold shadows; geometry and highlights stay stable.
const fragmentShader=`precision mediump float;varying vec3 vColor,vNormal,vPosition;varying float vDistance;uniform float uLine,uCompact;uniform vec3 uFog,uLift;uniform float uDay;
void main(){vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;vec3 light=normalize(vec3(-.35,1.,.55));float diffuse=max(0.,dot(n,light));float rim=pow(1.-abs(n.z),2.2);float shade=mix(.5,.58,uDay)-uDay*uCompact*.16+diffuse*(mix(.48,.22,uDay)+uDay*uCompact*.18);vec3 col=vColor*shade+uLift*rim*mix(.25,.05,uDay);col=mix(col,vColor*mix(.84,.9,uDay),uLine);float fog=smoothstep(40.,96.,vDistance);col=mix(col,uFog,fog*mix(.82,.28,uDay));gl_FragColor=vec4(col,1.);}`;
export function createWorldRenderer(canvas,{mode='landscape',narrow=false,fromMode=mode,weights}={}){
 let gl;try{gl=canvas.getContext('webgl',{alpha:false,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:true});}catch{}
 let w=1,h=1;
 function cameraBasis(camera){const forward=unit(sub(camera.target,camera.eye));let right=unit(cross(forward,[0,1,0]));if(Math.hypot(...right)<.01)right=[1,0,0];return {forward,right,up:cross(right,forward)};}
 function project(point,camera){const b=cameraBasis(camera),d=sub(point,camera.eye),z=dot(d,b.forward);return {x:w/2+dot(d,b.right)*1.92/(w/h)*w/2/z,y:h/2-dot(d,b.up)*1.92*h/2/z,visible:z>.2};}
 const mesh=geometry(mode,narrow,!gl,weights),from=fromMode===mode?mesh:geometry(fromMode,narrow,!gl,weights);
 if(!gl){
  const ctx=canvas.getContext('2d'),light=unit([-.45,1,.8]);
  return {project,resize(width,height){w=Math.max(1,width);h=Math.max(1,height);canvas.width=w;canvas.height=h;},draw(camera,time=0,transitionProgress=1){
   if(!ctx)return;const progress=clamp(transitionProgress),b=cameraBasis(camera),tris=[],night=studioNight(),fogColor=night?ink:day;
   ctx.fillStyle=night?'#101727':'#f1f4f7';ctx.fillRect(0,0,w,h);
   for(let i=0;i<mesh.positions.length;i+=9){
    const points=[];let depth=0,visible=true;
    for(let k=0;k<9;k+=3){const p=[0,1,2].map(j=>from.positions[i+k+j]+(mesh.positions[i+k+j]-from.positions[i+k+j])*progress),d=sub(p,camera.eye),z=dot(d,b.forward);if(z<.25){visible=false;break;}depth+=z;points.push([w/2+dot(d,b.right)*.96*h/z,h/2-dot(d,b.up)*.96*h/z]);}
    if(!visible)continue;
    const n=unit([0,1,2].map(j=>from.normals[i+j]+(mesh.normals[i+j]-from.normals[i+j])*progress));
    const shade=.48+Math.abs(dot(n,light))*.58,fog=Math.min(.70,Math.max(0,(depth/3-30)/52));
    const color=[0,1,2].map(j=>Math.round((mesh.colors[i+j]*shade*(1-fog)+fogColor[j]*fog)*255));
    tris.push({points,depth,color});
   }
   tris.sort((a,b)=>b.depth-a.depth);
   for(const tri of tris){ctx.fillStyle=`rgb(${tri.color.join(',')})`;ctx.beginPath();tri.points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();}
   // A low-cost contour pass also preserves the folded silhouette without GL.
   ctx.lineWidth=.65;
   for(let i=0;i<mesh.lines.length;i+=6){const points=[0,3].map(k=>project([0,1,2].map(j=>from.lines[i+k+j]+(mesh.lines[i+k+j]-from.lines[i+k+j])*progress),camera));if(points.some(p=>!p.visible))continue;ctx.strokeStyle=`rgba(${Array.from(mesh.lineColors.subarray(i,i+3),v=>Math.round(v*255)).join(',')},.32)`;ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);ctx.lineTo(points[1].x,points[1].y);ctx.stroke();}
  },destroy(){}};
 }
 function compile(type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error('Die räumliche Darstellung konnte nicht vorbereitet werden.');return shader;}
 const program=gl.createProgram(),shaders=[compile(gl.VERTEX_SHADER,vertexShader),compile(gl.FRAGMENT_SHADER,fragmentShader)];shaders.forEach(s=>gl.attachShader(program,s));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Die räumliche Darstellung konnte nicht verbunden werden.');gl.useProgram(program);
 const attributeNames=['aPosition','aFrom','aNormal','aNormalFrom','aColor'],attributes=attributeNames.map(n=>gl.getAttribLocation(program,n));
 const uniforms=Object.fromEntries(['uEye','uRight','uUp','uForward','uAspect','uMorph','uLine','uFog','uLift','uDay','uCompact'].map(n=>[n,gl.getUniformLocation(program,n)])),buffers=[];
 function buffer(data){const b=gl.createBuffer();buffers.push(b);gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return b;}
 const solid=[mesh.positions,from.positions,mesh.normals,from.normals,mesh.colors].map(buffer),lines=[mesh.lines,from.lines,mesh.lineNormals,from.lineNormals,mesh.lineColors].map(buffer);
 function bind(group){group.forEach((b,i)=>{if(attributes[i]<0)return;gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(attributes[i]);gl.vertexAttribPointer(attributes[i],3,gl.FLOAT,false,0,0);});}
 gl.enable(gl.DEPTH_TEST);gl.clearColor(...day,1);
 return {project,resize(width,height){w=Math.max(1,width);h=Math.max(1,height);const ratio=Math.min(globalThis.devicePixelRatio||1,1.5);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);gl.viewport(0,0,canvas.width,canvas.height);},draw(camera,time=0,transitionProgress=1){
  const b=cameraBasis(camera),night=studioNight();gl.useProgram(program);gl.clearColor(...(night?ink:day),1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.uniform3fv(uniforms.uEye,camera.eye);gl.uniform3fv(uniforms.uRight,b.right);gl.uniform3fv(uniforms.uUp,b.up);gl.uniform3fv(uniforms.uForward,b.forward);gl.uniform1f(uniforms.uAspect,w/h);gl.uniform1f(uniforms.uMorph,clamp(transitionProgress));gl.uniform3fv(uniforms.uFog,night?ink:day);gl.uniform3fv(uniforms.uLift,night?[.11,.09,.065]:[1,.99,.97]);gl.uniform1f(uniforms.uDay,night?0:1);gl.uniform1f(uniforms.uCompact,narrow?1:0);
  gl.uniform1f(uniforms.uLine,0);bind(solid);gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(1,1);gl.drawArrays(gl.TRIANGLES,0,mesh.positions.length/3);gl.disable(gl.POLYGON_OFFSET_FILL);gl.uniform1f(uniforms.uLine,1);bind(lines);gl.drawArrays(gl.LINES,0,mesh.lines.length/3);
 },destroy(){buffers.forEach(b=>gl.deleteBuffer(b));shaders.forEach(s=>gl.deleteShader(s));gl.deleteProgram(program);}};
}
