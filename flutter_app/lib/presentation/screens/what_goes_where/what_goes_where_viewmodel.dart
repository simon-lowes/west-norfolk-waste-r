import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/waste_item.dart';
import '../../providers/waste_items_provider.dart';

class WhatGoesWhereState {
  const WhatGoesWhereState({required this.searchQuery, required this.items});

  final String searchQuery;
  final AsyncValue<List<WasteItem>> items;
}

final whatGoesWhereViewModelProvider =
    AutoDisposeNotifierProvider<WhatGoesWhereViewModel, WhatGoesWhereState>(
      WhatGoesWhereViewModel.new,
    );

class WhatGoesWhereViewModel extends AutoDisposeNotifier<WhatGoesWhereState> {
  @override
  WhatGoesWhereState build() {
    final query = ref.watch(wasteSearchQueryProvider);
    final filteredItems = ref.watch(filteredWasteItemsProvider);

    return WhatGoesWhereState(searchQuery: query, items: filteredItems);
  }

  void updateSearchQuery(String value) {
    if (value == ref.read(wasteSearchQueryProvider)) {
      return;
    }
    ref.read(wasteSearchQueryProvider.notifier).state = value;
  }

  void clearSearch() {
    ref.read(wasteSearchQueryProvider.notifier).state = '';
  }
}
