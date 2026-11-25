// Division manifests & branding config reusing existing brand assets.
// Each division owns an independent preloading queue so we never waste bandwidth
// downloading the other division's assets before revealing its page.

export const DIVISIONS = {
  tableware: {
    id: 'tableware',
    name: 'Notch Tableware',
    shortLabel: 'TABLEWARE',
    tagline: '100% Sugarcane Bagasse & Bamboo Molded Tableware',
    description: 'Plastic-free plates, clamshells, meal trays, bowls & export packaging.',
    route: '/homepage-2',
    logo: '/assets/homepage2/notch_logo.png',
    previewImage: '/assets/homepage2/bestseller_plates.png',
    theme: {
      bg: '#F4EFE6',
      bgHex: '#F4EFE6',
      textPrimary: '#19241C',
      textSecondary: '#4E5C53',
      accent: '#cd9922',
      accentAlt: '#28543E',
      barTrack: 'rgba(25, 36, 28, 0.12)',
      barFill: '#28543E',
      isDark: false,
    },
    fonts: [
      '400 16px Outfit',
      '600 16px Outfit',
      '700 16px Outfit',
      '800 16px Outfit',
      '400 16px "Plus Jakarta Sans"',
      '500 16px "Plus Jakarta Sans"',
      '600 16px "Plus Jakarta Sans"',
    ],
    moduleLoader: () => import('../pages/HomePage2'),
    dataUrls: [
      { url: '/data/catalog.json', weight: 6 },
    ],
    // Essential assets required for an immediate, layout-shift-free reveal of /homepage-2
    // Weighted proportionally to real file sizes so progress mirrors actual transfer work.
    assets: [
      { url: '/assets/homepage2/notch_logo.png', weight: 3 },
      { url: '/assets/homepage2/logo_footer.png', weight: 2 },
      { url: '/assets/homepage2/hero_avatars.png', weight: 1 },
      { url: '/assets/homepage2/hero_mosaic_1.png', weight: 4 },
      { url: '/assets/homepage2/hero_mosaic_2.png', weight: 3 },
      { url: '/assets/homepage2/hero_mosaic_3.png', weight: 4 },
      { url: '/assets/homepage2/hero_mosaic_4.png', weight: 3 },
      { url: '/assets/homepage2/hero_mosaic_5.png', weight: 4 },
      { url: '/assets/homepage2/hero_mosaic_6.png', weight: 2 },
      { url: '/assets/homepage2/hero_mosaic_7.png', weight: 4 },
      { url: '/assets/homepage2/hero_mosaic_8.png', weight: 2 },
      { url: '/assets/homepage2/hero_mosaic_9.png', weight: 4 },
      { url: '/assets/homepage2/hero_mosaic_10.png', weight: 4 },
      { url: '/assets/homepage2/glance_plates_bowls.png', weight: 12 },
      { url: '/assets/homepage2/glance_compartment_plates.png', weight: 12 },
      { url: '/assets/homepage2/glance_meal_trays.png', weight: 12 },
      { url: '/assets/homepage2/who_moss_hands.png', weight: 10 },
      { url: '/assets/homepage2/who_hands_team.png', weight: 4 },
      { url: '/assets/homepage2/who_sugarcane.png', weight: 6 },
      { url: '/assets/homepage2/works_card_1_food_safe.png', weight: 8 },
      { url: '/assets/homepage2/works_card_2_plastic_free.png', weight: 10 },
      { url: '/assets/homepage2/works_card_3_compostable.png', weight: 9 },
      { url: '/assets/homepage2/works_card_4_microwave.png', weight: 11 },
      { url: '/assets/homepage2/works_card_5_reused.png', weight: 10 },
      { url: '/assets/homepage2/bestseller_plates.png', weight: 14 },
      { url: '/assets/homepage2/bestseller_bowls.png', weight: 14 },
      { url: '/assets/homepage2/bestseller_compartment.png', weight: 14 },
      { url: '/assets/homepage2/bestseller_trays.png', weight: 14 },
      { url: '/assets/homepage2/facility_full.png', weight: 20 },
      { url: '/assets/homepage2/cert_brcgs.png', weight: 2 },
      { url: '/assets/homepage2/cert_sedex.png', weight: 2 },
      { url: '/assets/homepage2/cert_sgs.png', weight: 2 },
      { url: '/assets/partners/haldirams_transparent.png', weight: 1 },
    ],
    // Secondary / below-the-fold carousel slides warmed gently after reveal
    backgroundAssets: [
      '/assets/who_we_supply/hospitality.png',
      '/assets/who_we_supply/restaurants.png',
      '/assets/who_we_supply/qsr_takeout.jpg',
      '/assets/who_we_supply/catering.png',
      '/assets/who_we_supply/airlines.jpg',
      '/assets/who_we_supply/distribution.png',
      '/assets/Assets/SlideShow/HeroSlide2.png',
      '/assets/Assets/SlideShow/HeroSlide4.png',
      '/assets/products/clampshell/clampshell.png',
    ],
  },

  hygiene: {
    id: 'hygiene',
    name: 'Notch Hygiene',
    shortLabel: 'HYGIENE',
    tagline: 'Ultra-Soft, Plant-Based Single-Use Virgin Towels',
    description: 'Dermatologically safe, biodegradable facial & hospitality bath towels.',
    route: '/hygiene',
    logo: '/assets/hygiene/hygiene_logo.png',
    previewImage: '/assets/hygiene/landing_hygiene_bg.jpg',
    theme: {
      bg: '#EAEEF1',
      bgHex: '#EAEEF1',
      textPrimary: '#3A1C0F',
      textSecondary: '#4A5559',
      accent: '#91593A',
      accentAlt: '#3A1C0F',
      barTrack: 'rgba(58, 28, 15, 0.14)',
      barFill: '#3A1C0F',
      isDark: false,
    },
    fonts: [
      '400 16px Outfit',
      '500 16px Outfit',
      '600 16px Outfit',
      '400 16px "Plus Jakarta Sans"',
      '500 16px "Plus Jakarta Sans"',
      '600 16px "Plus Jakarta Sans"',
    ],
    moduleLoader: () => import('../pages/HygienePage'),
    dataUrls: [],
    assets: [
      { url: '/assets/hygiene/hygiene_logo.png', weight: 3 },
      { url: '/assets/homepage2/notch_logo.png', weight: 3 },
      { url: '/assets/homepage2/logo_footer.png', weight: 2 },
      { url: '/assets/hygiene/hero_face_towel.png', weight: 14 },
      { url: '/assets/hygiene/disposable_hand_towel.jpg', weight: 8 },
      { url: '/assets/hygiene/disposable_hand_towel_2.jpg', weight: 12 },
      { url: '/assets/hygiene/disposable_bath_towel_1.jpg', weight: 12 },
      { url: '/assets/hygiene/disposable_bath_towel_2.jpg', weight: 14 },
      { url: '/assets/hygiene/env_spa.jpg?v=2', weight: 10 },
      { url: '/assets/hygiene/env_hotel.jpg', weight: 10 },
      { url: '/assets/hygiene/env_salon.jpg', weight: 10 },
      { url: '/assets/hygiene/env_fitness.jpg', weight: 10 },
      { url: '/assets/hygiene/wholesale_kraft_pouch.jpg', weight: 10 },
      { url: '/assets/hygiene/women_packaging_team.jpg?v=2', weight: 12 },
      { url: '/assets/hygiene/towel_strength.gif', weight: 18 },
    ],
    // Hero & section videos preloaded with streaming buffer progress & muted autoplay safety
    videos: [
      { url: '/assets/hygiene/hero.mp4?v=2', weight: 52 },
      { url: '/assets/hygiene/cleaner_way_face.mp4?v=2', weight: 40 },
    ],
    backgroundAssets: [],
  },
};

export function getDivisionForPath(path) {
  if (
    path === '/homepage-2' ||
    path === '/homepage2' ||
    path === '/home2' ||
    path === '/home-2'
  ) {
    return 'tableware';
  }
  if (path === '/hygiene' || path === '/hygiene-products') {
    return 'hygiene';
  }
  return null;
}
