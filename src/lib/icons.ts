// Icônes Font Awesome rendues en SVG au build (aucun JS côté navigateur).
import { icon, type IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faSquareFacebook,
  faSquareGithub,
  faSquareInstagram,
  faSquareLinkedin,
  faSquareXTwitter,
  faSquareYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

/** Markup SVG d'une icône (décorative : aria-hidden), avec classes CSS optionnelles. */
export function iconSvg(definition: IconDefinition, classes: string[] = []): string {
  return icon(definition, { classes }).html.join('');
}

/** Icône d'un lien social d'après son nom dans Strapi. */
export function socialIcon(name: string): IconDefinition {
  switch (name.toLowerCase()) {
    case 'github':
      return faSquareGithub;
    case 'linkedin':
      return faSquareLinkedin;
    case 'twitter':
    case 'x':
      return faSquareXTwitter;
    case 'instagram':
      return faSquareInstagram;
    case 'facebook':
      return faSquareFacebook;
    case 'youtube':
      return faSquareYoutube;
    default:
      return faSquare;
  }
}
