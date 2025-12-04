import '../models/enums.dart';
import '../models/waste_item.dart';

const mockWasteItems = <WasteItem>[
  WasteItem(
    id: 'waste-cardboard',
    name: 'Flattened cardboard',
    binType: BinType.recycling,
    notes: 'Remove any plastic film or polystyrene before recycling.',
  ),
  WasteItem(
    id: 'waste-food-scraps',
    name: 'Food scraps',
    binType: BinType.food,
    notes: 'Place loose in the brown food caddy liner.',
  ),
  WasteItem(
    id: 'waste-grass-cuttings',
    name: 'Grass cuttings',
    binType: BinType.garden,
    notes: 'Shake off soil and place directly in the green bin.',
  ),
  WasteItem(
    id: 'waste-soft-plastics',
    name: 'Soft plastics',
    binType: BinType.recyclingCentre,
    notes: 'Take to the nearest recycling centre bag drop point.',
  ),
  WasteItem(
    id: 'waste-nappies',
    name: 'Nappies',
    binType: BinType.general,
    notes: 'Bag securely before placing in the black bin.',
  ),
];
