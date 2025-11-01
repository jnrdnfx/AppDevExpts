// lib/firebase_options.dart

import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Manually created Firebase configuration for your project.
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return ios;
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: "AIzaSyD6g41Y4XCnjUzsjnclXQLkOn0zhttaH54",
  authDomain: "basic-auth-20569.firebaseapp.com",
  projectId: "basic-auth-20569",
  storageBucket: "basic-auth-20569.firebasestorage.app",
  messagingSenderId: "781211649855",
  appId: "1:781211649855:web:175522b0776f81fb83758a"
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: "AIzaSyD6g41Y4XCnjUzsjnclXQLkOn0zhttaH54",
  authDomain: "basic-auth-20569.firebaseapp.com",
  projectId: "basic-auth-20569",
  storageBucket: "basic-auth-20569.firebasestorage.app",
  messagingSenderId: "781211649855",
  appId: "1:781211649855:web:175522b0776f81fb83758a"
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: "AIzaSyD6g41Y4XCnjUzsjnclXQLkOn0zhttaH54",
  authDomain: "basic-auth-20569.firebaseapp.com",
  projectId: "basic-auth-20569",
  storageBucket: "basic-auth-20569.firebasestorage.app",
  messagingSenderId: "781211649855",
  appId: "1:781211649855:web:175522b0776f81fb83758a"
  );
}
