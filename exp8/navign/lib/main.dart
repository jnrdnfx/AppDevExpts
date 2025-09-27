import 'package:flutter/material.dart';

void main() {
  runApp(StepCounterApp());
}

class StepCounterApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
  debugShowCheckedModeBanner: false,
  title: 'Step Counter Demo',
  theme: ThemeData(
    primarySwatch: Colors.green,
  ),
  home: HomePage(),
);

  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3, // Steps, History, Profile
      child: Scaffold(
        appBar: AppBar(
          title: const Text("Step Counter"),
          bottom: const TabBar(
            tabs: [
              Tab(icon: Icon(Icons.directions_walk), text: "Steps"),
              Tab(icon: Icon(Icons.bar_chart), text: "History"),
              Tab(icon: Icon(Icons.person), text: "Profile"),
            ],
          ),
        ),

        // Drawer Navigation
        drawer: Drawer(
          child: ListView(
            padding: EdgeInsets.zero,
            children: [
              const DrawerHeader(
                decoration: BoxDecoration(color: Colors.green),
                child: Text(
                  "Step Tracker Menu",
                  style: TextStyle(color: Colors.white, fontSize: 20),
                ),
              ),
              ListTile(
                leading: const Icon(Icons.directions_walk),
                title: const Text("Steps"),
                onTap: () {
                  Navigator.pop(context);
                  DefaultTabController.of(context)?.animateTo(0);
                },
              ),
              ListTile(
                leading: const Icon(Icons.bar_chart),
                title: const Text("History"),
                onTap: () {
                  Navigator.pop(context);
                  DefaultTabController.of(context)?.animateTo(1);
                },
              ),
              ListTile(
                leading: const Icon(Icons.person),
                title: const Text("Profile"),
                onTap: () {
                  Navigator.pop(context);
                  DefaultTabController.of(context)?.animateTo(2);
                },
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.settings),
                title: const Text("Settings"),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => SettingsPage()),
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.info),
                title: const Text("About"),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => AboutPage()),
                  );
                },
              ),
            ],
          ),
        ),

        // Tab Content
        body: const TabBarView(
          children: [
            StepsPage(),
            HistoryPage(),
            ProfilePage(),
          ],
        ),
      ),
    );
  }
}

// ----------------- Tab Pages -----------------

class StepsPage extends StatelessWidget {
  const StepsPage();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Icon(Icons.directions_walk, size: 80, color: Colors.green),
          SizedBox(height: 20),
          Text("Today’s Steps", style: TextStyle(fontSize: 24)),
          SizedBox(height: 10),
          Text("5,432", style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

class HistoryPage extends StatelessWidget {
  const HistoryPage();

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: const [
        ListTile(title: Text("Mon: 6,120 steps")),
        ListTile(title: Text("Tue: 7,850 steps")),
        ListTile(title: Text("Wed: 4,300 steps")),
        ListTile(title: Text("Thu: 9,010 steps")),
        ListTile(title: Text("Fri: 5,432 steps")),
      ],
    );
  }
}

class ProfilePage extends StatelessWidget {
  const ProfilePage();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          CircleAvatar(
            radius: 50,
            backgroundImage: AssetImage("assets/profile.jpg"), // add image in assets
          ),
          SizedBox(height: 20),
          Text("John Doe", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          SizedBox(height: 10),
          Text("Fitness Enthusiast", style: TextStyle(fontSize: 16)),
        ],
      ),
    );
  }
}

// ----------------- Drawer-only Pages -----------------

class SettingsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Settings")),
      body: const Center(child: Text("⚙️ Settings go here")),
    );
  }
}

class AboutPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("About")),
      body: const Center(child: Text("📱 Step Counter Demo v1.0")),
    );
  }
}
