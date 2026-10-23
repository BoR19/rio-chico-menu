import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import WelcomeScreen from './src/screens/WelcomeScreen';
import MenuScreen from './src/screens/MenuScreen';
import MesasScreen from './src/screens/MesasScreen';
import CocinaScreen from './src/screens/CocinaScreen';
import AdminScreen from './src/screens/AdminScreen';
import BottomTabBar from './src/components/BottomTabBar';

export default function App() {
  const [inApp, setInApp] = useState(false);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'mesas' | 'cocina' | 'admin'

  // TODO: Connect these separately managed screens to shared order/mesa persistence.
  if (!inApp) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" translucent={true} />
        <WelcomeScreen onEnterMenu={() => setInApp(true)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent={true} />
      
      {/* Screen Render */}
      <View style={styles.content}>
        <View style={[styles.screen, activeTab !== 'menu' && styles.hiddenScreen]}>
          <MenuScreen onGoHome={() => setInApp(false)} />
        </View>
        <View style={[styles.screen, activeTab !== 'mesas' && styles.hiddenScreen]}>
          <MesasScreen />
        </View>
        <View style={[styles.screen, activeTab !== 'cocina' && styles.hiddenScreen]}>
          <CocinaScreen />
        </View>
        <View style={[styles.screen, activeTab !== 'admin' && styles.hiddenScreen]}>
          <AdminScreen />
        </View>
      </View>

      {/* Bottom Tab Bar (Matching Screenshot Reference) */}
      <BottomTabBar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a09'
  },
  content: {
    flex: 1
  },
  screen: {
    flex: 1
  },
  hiddenScreen: {
    display: 'none'
  }
});
