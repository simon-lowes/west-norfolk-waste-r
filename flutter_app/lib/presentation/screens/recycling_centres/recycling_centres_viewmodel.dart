import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/models/recycling_centre.dart';
import '../../providers/recycling_centres_provider.dart';

class RecyclingCentresState {
  const RecyclingCentresState({required this.centres});

  final AsyncValue<List<RecyclingCentre>> centres;
}

final recyclingCentresViewModelProvider =
    AutoDisposeNotifierProvider<
      RecyclingCentresViewModel,
      RecyclingCentresState
    >(RecyclingCentresViewModel.new);

class RecyclingCentresViewModel
    extends AutoDisposeNotifier<RecyclingCentresState> {
  @override
  RecyclingCentresState build() {
    final centres = ref.watch(recyclingCentresProvider);
    return RecyclingCentresState(centres: centres);
  }

  Future<void> refreshCentres() async {
    final _ = await ref.refresh(recyclingCentresProvider.future);
  }
}
