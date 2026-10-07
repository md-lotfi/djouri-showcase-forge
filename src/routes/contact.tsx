import {createFileRoute} from '@tanstack/react-router';
import {routeMeta} from '@/components/atelier/content';
import {ContactSection} from '@/components/atelier/contact';
export const Route=createFileRoute('/contact')({...routeMeta('Contact','اتصل بنا'),component:ContactSection});
