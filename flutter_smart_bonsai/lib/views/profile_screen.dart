import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/profile_provider.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  late final TextEditingController _nameCtrl;
  late final TextEditingController _plantNameCtrl;
  late final TextEditingController _plantSpeciesCtrl;
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController();
    _plantNameCtrl = TextEditingController();
    _plantSpeciesCtrl = TextEditingController();
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _plantNameCtrl.dispose();
    _plantSpeciesCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(profileProvider);
    final notifier = ref.read(profileProvider.notifier);

    // Populate the text fields once, the first time real data arrives
    // from Firebase, without clobbering what the user is typing.
    if (!_initialized && profile.name.isNotEmpty) {
      _nameCtrl.text = profile.name;
      _plantNameCtrl.text = profile.plantName;
      _plantSpeciesCtrl.text = profile.plantSpecies;
      _initialized = true;
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Your name', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          TextField(
            controller: _nameCtrl,
            decoration: const InputDecoration(border: OutlineInputBorder()),
          ),
          const SizedBox(height: 16),
          const Text('Plant name', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          TextField(
            controller: _plantNameCtrl,
            decoration: const InputDecoration(border: OutlineInputBorder()),
          ),
          const SizedBox(height: 16),
          const Text('Species', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          TextField(
            controller: _plantSpeciesCtrl,
            decoration: const InputDecoration(border: OutlineInputBorder()),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              minimumSize: const Size(double.infinity, 48),
            ),
            onPressed: () {
              notifier.update(
                name: _nameCtrl.text,
                plantName: _plantNameCtrl.text,
                plantSpecies: _plantSpeciesCtrl.text,
              );
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Saved — synced to your other devices')),
              );
            },
            child: const Text('Save'),
          ),
          const SizedBox(height: 8),
          const Text(
            'Changes here sync live to the website and any other device '
            'signed in to this bonsai.',
            style: TextStyle(fontSize: 12, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
