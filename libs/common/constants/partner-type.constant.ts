import { generateUnique } from '@lib/utils/helpers';

enum PartnerTypeState {
  Classic = 'CLASSIC',
  Sports = 'SPORTS',
  Live = 'LIVE',
}

export const partnerTypeConstant = [
  {
    level: 1,
    state: PartnerTypeState.Classic,
    rate: '0|5|10|15|20|25|30|35|40|45|50',
    id: generateUnique(),
    order: 1,
  },
  {
    level: 2,
    state: PartnerTypeState.Classic,
    rate: '0|20|25|30|35|40|45|50',
    id: generateUnique(),
    order: 1,
  },
  {
    level: 3,
    state: PartnerTypeState.Classic,
    rate: '30|35|40|45|50',
    id: generateUnique(),
    order: 1,
  },
  {
    level: 1,
    state: PartnerTypeState.Sports,
    id: generateUnique(),
    order: 2,
  },
  {
    level: 2,
    state: PartnerTypeState.Sports,
    id: generateUnique(),
    order: 2,
  },
  {
    level: 1,
    state: PartnerTypeState.Live,
    id: generateUnique(),
    order: 3,
  },
  {
    level: 2,
    state: PartnerTypeState.Live,
    id: generateUnique(),
    order: 3,
  },
];
