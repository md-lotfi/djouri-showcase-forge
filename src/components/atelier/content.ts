import tower from '@/assets/tower.webp.asset.json';
import coastal from '@/assets/coastal.webp.asset.json';
import villa from '@/assets/villa.webp.asset.json';
import plan from '@/assets/plan.webp.asset.json';
import living from '@/assets/living.webp.asset.json';
import kitchen from '@/assets/kitchen.webp.asset.json';
import interior from '@/assets/interior.webp.asset.json';
export type Language = 'fr' | 'ar';
export const projects = [
 {image:tower.url, title:['Résidence contemporaine','إقامة معاصرة'], type:'architecture', caption:['Architecture · Résidentiel','عمارة · سكني']},
 {image:villa.url, title:['Villa Andalousie','فيلا أندلسية'], type:'architecture',caption:['Architecture · Étude de façade','عمارة · دراسة الواجهة']},
 {image:living.url, title:['Un intérieur, une signature','تصميم داخلي مميز'],type:'interior',caption:['Design intérieur · Résidentiel','تصميم داخلي · سكني']},
 {image:plan.url,title:['L’espace en trois dimensions','الفضاء في ثلاثة أبعاد'],type:'plans',caption:['Conception · Planification 3D','تصميم · تخطيط ثلاثي الأبعاد']},
 {image:coastal.url,title:['Élévation méditerranéenne','عمارة متوسطية'],type:'architecture',caption:['Architecture · Habitat collectif','عمارة · سكن جماعي']},
 {image:kitchen.url,title:['Matières & lumière','مواد وإضاءة'],type:'interior',caption:['Design intérieur · Cuisine','تصميم داخلي · مطبخ']},
] as const;
export const studioImage=interior.url;
export function routeMeta(section:string,arSection:string){
 return {validateSearch:(search:Record<string,unknown>)=>({lang:search['lang']==='ar'?'ar' as const:'fr' as const}),loaderDeps:({search}:{search:{lang:Language}})=>({lang:search.lang}),loader:({deps}:{deps:{lang:Language}})=>deps,
 head:({loaderData}:{loaderData?:{lang:Language}})=>{ const ar=loaderData?.lang==='ar'; const title=`${ar?arSection:section} — DJOURI DESIGNE`; const description=ar?'مكتب ديجوري ديزاين للهندسة المعمارية والتصميم الداخلي. اكتشف مشاريعنا ورؤيتنا.':"DJOURI DESIGNE, atelier d’architecture et de design intérieur. Découvrez nos projets et notre vision de l’espace.";return {meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]};}}
}
