import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/telemetry_provider.dart';
import '../widgets/circular_gauge_widget.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final telemetry = ref.watch(telemetryProvider);
    final notifier = ref.read(telemetryProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Smart Bonsai',
              style: TextStyle(fontWeight: FontWeight.extrabold),
            ),
            Text(
              'Japanese Black Pine • ESP32 Online',
              style: TextStyle(fontSize: 11, color: Colors.emerald),
            )
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F382C), Color(0xFF10B981)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(28),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black26,
                    blurRadius: 16,
                    offset: Offset(0, 4),
                  )
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white24,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'ONLINE • 1s STREAM',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Zenith Bonsai Node',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Automatic Micro-Irrigation & Climate Engine',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.park, size: 64, color: Colors.white)
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text(
              'Telemetry Gauges',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 0.9,
              children: [
                CircularGaugeWidget(
                  label: 'Soil Moisture',
                  value: telemetry.soilMoisture,
                  unit: '%',
                  icon: Icons.water_drop,
                  color: telemetry.soilMoisture < 30.0 ? Colors.orange : Colors.cyan,
                  status: telemetry.soilMoisture < 30.0 ? 'Dry' : 'Optimal',
                ),
                CircularGaugeWidget(
                  label: 'Temperature',
                  value: telemetry.temperature,
                  unit: '°C',
                  icon: Icons.thermostat,
                  color: Colors.amber,
                  status: 'Normal',
                ),
                CircularGaugeWidget(
                  label: 'Air Humidity',
                  value: telemetry.humidity,
                  unit: '%',
                  icon: Icons.air,
                  color: Colors.blue,
                  status: 'Optimal',
                ),
                CircularGaugeWidget(
                  label: 'Light Intensity',
                  value: telemetry.light,
                  unit: '%',
                  icon: Icons.wb_sunny,
                  color: Colors.yellow,
                  status: 'Daylight',
                ),
              ],
            ),
            const SizedBox(height: 24),

            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(
                  color: telemetry.pump ? Colors.cyan : Colors.grey.withOpacity(0.2),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.local_drink,
                            color: telemetry.pump ? Colors.cyan : Colors.grey,
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'Water Pump System',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                      Switch(
                        value: telemetry.autoMode,
                        onChanged: (val) => notifier.toggleAutoMode(val),
                        activeColor: const Color(0xFF10B981),
                      )
                    ],
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: telemetry.pump ? Colors.redAccent : const Color(0xFF10B981),
                      minimumSize: const Size(double.infinity, 48),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    onPressed: () => notifier.togglePump(),
                    icon: Icon(telemetry.pump ? Icons.power_settings_new : Icons.play_arrow),
                    label: Text(
                      telemetry.pump ? 'STOP PUMP' : 'MANUAL WATER NOW',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
