import { createFileRoute } from "@tanstack/react-router";
import { routeMeta } from '@/components/atelier/content';
import { Hero } from '@/components/atelier/hero';
import { Gallery } from '@/components/atelier/gallery';
import { SectionHeading, StudioSection, useText } from '@/components/atelier/site';
import { ContactSection } from '@/components/atelier/contact';
export const Route = createFileRoute("/")({
  ...routeMeta('Architecture & design intérieur', 'العمارة والتصميم الداخلي'),
  component: Index,
});
function Index() {
  const t=useText();
  return <><Hero/><section className="portfolio-section section-wrap"><SectionHeading number="01" title={t('Une sélection de nos projets','مجموعة مختارة من مشاريعنا')} subtitle={t('Architecture, intérieurs et perspectives. Chaque projet raconte une histoire.','عمارة وتصميم داخلي ورؤى. كل مشروع يروي قصة.')} link/><Gallery/></section><StudioSection/><ContactSection/></>;
}
