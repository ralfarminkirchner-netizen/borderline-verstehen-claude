// A route records choices through existing relations. It does not infer causality.
export const routeStorageKey='borderline.atlas.routes.v1';
export function routeConnection(edges,from,to){
  return edges.find(e=>(e.from===from&&e.to===to)||(e.from===to&&e.to===from))||null;
}
export function extendRoute(route,id,edges){
  if(!route.length)return {nodes:[id],edge:null};
  if(route.at(-1)===id)return {nodes:route.slice(),edge:null};
  const edge=routeConnection(edges,route.at(-1),id);
  return edge?{nodes:[...route,id],edge}:null;
}
export function validRoute(ids,byId,edges){
  return Array.isArray(ids)&&ids.length>0&&ids.length<=100&&ids.every(id=>typeof id==='string'&&byId.has(id))&&
    ids.every((id,i)=>i===0||!!routeConnection(edges,ids[i-1],id));
}
export function readRoutes(storage,byId,edges){
  try{
    const raw=JSON.parse(storage?.getItem(routeStorageKey)||'[]');
    return Array.isArray(raw)?raw.filter(r=>r&&typeof r.name==='string'&&validRoute(r.nodes,byId,edges)).slice(0,30).map(r=>({name:r.name.slice(0,100),nodes:r.nodes.slice()})):[];
  }catch{return [];}
}
export function saveRoutes(storage,routes){
  try{if(!storage?.setItem)return false;storage.setItem(routeStorageKey,JSON.stringify(routes.slice(-30)));return true;}catch{return false;}
}
