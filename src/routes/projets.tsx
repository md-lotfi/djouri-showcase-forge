import {createFileRoute} from '@tanstack/react-router';
import {routeMeta} from '@/components/atelier/content';
import {Gallery} from '@/components/atelier/gallery';
import {useText} from '@/components/atelier/site';
export const Route=createFileRoute('/projets')({...routeMeta('Nos projets','مشاريعنا'),component:Projects});
function Projects(){const t=useText();return <div className="section-wrap page-content"><span className="eyebrow">DJOURI DESIGNE / {t('PORTFOLIO','المشاريع')}</span><h1>{t('Nos projets','مشاريعنا')}</h1><p className="page-intro">{t('Des visions singulières. Une même exigence.','رؤى فريدة. التزام واحد.')}</p><Gallery filters/></div>}
