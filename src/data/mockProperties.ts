import { Property } from '../types';

// 12 properties across PE30-PE36 and NR21 postcodes
export const mockProperties: Property[] = [
  // King's Lynn area - PE30
  {
    id: 'prop-king-street-12',
    postcode: 'PE30 1HQ',
    address: "12 King Street, King's Lynn",
    rubbishDayOfWeek: 1, // Monday
    recyclingDayOfWeek: 1,
    gardenDayOfWeek: 3, // Wednesday
    foodDayOfWeek: 1,
  },
  {
    id: 'prop-king-street-14',
    postcode: 'PE30 1HQ',
    address: "14 King Street, King's Lynn",
    rubbishDayOfWeek: 1,
    recyclingDayOfWeek: 1,
    gardenDayOfWeek: 3,
    foodDayOfWeek: 1,
  },
  {
    id: 'prop-queen-street-8',
    postcode: 'PE30 1EG',
    address: "8 Queen Street, King's Lynn",
    rubbishDayOfWeek: 1,
    recyclingDayOfWeek: 1,
    gardenDayOfWeek: 3,
    foodDayOfWeek: 1,
  },
  {
    id: 'prop-market-place-3',
    postcode: 'PE30 1HL',
    address: "3 Market Place, King's Lynn",
    rubbishDayOfWeek: 5, // Friday
    recyclingDayOfWeek: 5,
    gardenDayOfWeek: 2, // Tuesday
    foodDayOfWeek: 5,
  },
  // Dersingham area - PE31
  {
    id: 'prop-north-avenue-5',
    postcode: 'PE31 6HP',
    address: '5 North Avenue, Dersingham',
    rubbishDayOfWeek: 2, // Tuesday
    recyclingDayOfWeek: 2,
    gardenDayOfWeek: 4, // Thursday
    foodDayOfWeek: 2,
  },
  {
    id: 'prop-manor-road-22',
    postcode: 'PE31 6LN',
    address: '22 Manor Road, Dersingham',
    rubbishDayOfWeek: 2,
    recyclingDayOfWeek: 2,
    gardenDayOfWeek: 4,
    foodDayOfWeek: 2,
  },
  // Swaffham area - PE32
  {
    id: 'prop-market-square-1',
    postcode: 'PE32 2AB',
    address: '1 Market Square, Swaffham',
    rubbishDayOfWeek: 3, // Wednesday
    recyclingDayOfWeek: 3,
    gardenDayOfWeek: 5, // Friday
    foodDayOfWeek: 3,
  },
  // Downham Market area - PE33
  {
    id: 'prop-highfield-27',
    postcode: 'PE33 0RF',
    address: '27 Highfield Close, Downham Market',
    rubbishDayOfWeek: 4, // Thursday
    recyclingDayOfWeek: 4,
    gardenDayOfWeek: 5, // Friday
    foodDayOfWeek: 4,
  },
  {
    id: 'prop-bridge-street-15',
    postcode: 'PE33 9AF',
    address: '15 Bridge Street, Downham Market',
    rubbishDayOfWeek: 4,
    recyclingDayOfWeek: 4,
    gardenDayOfWeek: 5,
    foodDayOfWeek: 4,
  },
  // Hunstanton area - PE36
  {
    id: 'prop-beach-road-45',
    postcode: 'PE36 5BB',
    address: '45 Beach Road, Hunstanton',
    rubbishDayOfWeek: 5, // Friday
    recyclingDayOfWeek: 5,
    gardenDayOfWeek: 1, // Monday
    foodDayOfWeek: 5,
  },
  {
    id: 'prop-cliff-parade-7',
    postcode: 'PE36 6EJ',
    address: '7 Cliff Parade, Hunstanton',
    rubbishDayOfWeek: 5,
    recyclingDayOfWeek: 5,
    gardenDayOfWeek: 1,
    foodDayOfWeek: 5,
  },
  // Fakenham area - NR21
  {
    id: 'prop-norwich-road-100',
    postcode: 'NR21 8EH',
    address: '100 Norwich Road, Fakenham',
    rubbishDayOfWeek: 3, // Wednesday
    recyclingDayOfWeek: 3,
    gardenDayOfWeek: 2, // Tuesday
    foodDayOfWeek: 3,
  },
];
