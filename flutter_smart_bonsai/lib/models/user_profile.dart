// Matches UserProfile in src/types/index.ts — same bonsai/profile node.
class UserProfile {
  final String name;
  final String email;
  final String photoUrl;
  final String plantName;
  final String plantSpecies;
  final int plantAgeYears;
  final String connectedDevice;
  final String? phone;
  final String? location;

  UserProfile({
    required this.name,
    required this.email,
    required this.photoUrl,
    required this.plantName,
    required this.plantSpecies,
    required this.plantAgeYears,
    required this.connectedDevice,
    this.phone,
    this.location,
  });

  factory UserProfile.initial() => UserProfile(
        name: '',
        email: '',
        photoUrl: '',
        plantName: '',
        plantSpecies: '',
        plantAgeYears: 0,
        connectedDevice: '',
      );

  factory UserProfile.fromMap(Map<String, dynamic> map, UserProfile previous) {
    return UserProfile(
      name: map['name']?.toString() ?? previous.name,
      email: map['email']?.toString() ?? previous.email,
      photoUrl: map['photoUrl']?.toString() ?? previous.photoUrl,
      plantName: map['plantName']?.toString() ?? previous.plantName,
      plantSpecies: map['plantSpecies']?.toString() ?? previous.plantSpecies,
      plantAgeYears: map['plantAgeYears'] is num
          ? (map['plantAgeYears'] as num).toInt()
          : previous.plantAgeYears,
      connectedDevice:
          map['connectedDevice']?.toString() ?? previous.connectedDevice,
      phone: map['phone']?.toString() ?? previous.phone,
      location: map['location']?.toString() ?? previous.location,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'email': email,
      'photoUrl': photoUrl,
      'plantName': plantName,
      'plantSpecies': plantSpecies,
      'plantAgeYears': plantAgeYears,
      'connectedDevice': connectedDevice,
      if (phone != null) 'phone': phone,
      if (location != null) 'location': location,
    };
  }

  UserProfile copyWith({
    String? name,
    String? email,
    String? plantName,
    String? plantSpecies,
    int? plantAgeYears,
    String? phone,
    String? location,
  }) {
    return UserProfile(
      name: name ?? this.name,
      email: email ?? this.email,
      photoUrl: photoUrl,
      plantName: plantName ?? this.plantName,
      plantSpecies: plantSpecies ?? this.plantSpecies,
      plantAgeYears: plantAgeYears ?? this.plantAgeYears,
      connectedDevice: connectedDevice,
      phone: phone ?? this.phone,
      location: location ?? this.location,
    );
  }
}
