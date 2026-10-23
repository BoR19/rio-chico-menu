import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';

export default function BottomTabBar({ activeTab, onSelectTab }) {
  const tabs = [
    { key: 'menu', label: 'Menú', icon: '🍴' },
    { key: 'mesas', label: 'Mesas', icon: '🪑' },
    { key: 'cocina', label: 'Cocina', icon: '👨‍🍳' },
    { key: 'admin', label: 'Admin', icon: '📑', badge: '1' }
  ];

  const handlePress = (key) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSelectTab(key);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => handlePress(tab.key)}
              style={styles.tabItem}
            >
              <View style={styles.iconWrapper}>
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                {tab.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20, 18, 16, 0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.6,
        shadowRadius: 16
      },
      android: {
        elevation: 16
      }
    })
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%'
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    flex: 1
  },
  iconWrapper: {
    position: 'relative'
  },
  tabIcon: {
    fontSize: 20
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#f59e0b',
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: '#020617',
    fontSize: 10,
    fontWeight: '900'
  },
  tabLabel: {
    fontSize: 11,
    color: '#a8a29e',
    fontWeight: '700',
    marginTop: 3
  },
  tabLabelActive: {
    color: '#f97316'
  }
});
