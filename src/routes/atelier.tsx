import {createFileRoute} from '@tanstack/react-router';
import {routeMeta} from '@/components/atelier/content';
import {StudioSection} from '@/components/atelier/site';
export const Route=createFileRoute('/atelier')({...routeMeta('Notre atelier','مكتبنا'),component:()=> <StudioSection full/>});
