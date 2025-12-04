import '../models/recycling_centre.dart';

const mockRecyclingCentres = <RecyclingCentre>[
  RecyclingCentre(
    id: 'centre-king-lynn',
    name: "King's Lynn Household Waste Recycling Centre",
    address: 'Willows Business Park, Saddlebow Road, PE34 3RD',
    latitude: 52.7329,
    longitude: 0.4156,
    openingHours: 'Mon-Sat 9am-4pm, Sun 10am-4pm',
    notes: 'Accepts batteries, small electricals, garden waste and wood.',
  ),
  RecyclingCentre(
    id: 'centre-heacham',
    name: 'Heacham Recycling Centre',
    address: 'Lynn Road, Heacham, PE31 7JE',
    latitude: 52.9079,
    longitude: 0.4874,
    openingHours: 'Daily 9am-5pm (closed Wednesdays)',
    notes: 'No commercial waste. Provides paint reuse scheme.',
  ),
];
