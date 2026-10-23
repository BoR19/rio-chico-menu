import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';

export default function MesasScreen() {
  const [filter, setFilter] = useState('all');
  const [mesas, setMesas] = useState([
    { id: 'm1', num: 'Mesa 01', cap: 4, est: 'libre', zona: 'Salón Principal', ticket: '', mozo: '' },
    { id: 'm2', num: 'Mesa 02', cap: 4, est: 'libre', zona: 'Salón Principal', ticket: '', mozo: '' },
    { id: 'm3', num: 'Mesa 03', cap: 6, est: 'ocupada', zona: 'Salón Principal', ticket: '#RC-1042', mozo: 'Carlos M.' },
    { id: 'm4', num: 'Mesa 04', cap: 4, est: 'ocupada', zona: 'Parrilla & Brasas', ticket: '#RC-8421', mozo: 'Carlos M.' },
    { id: 'm5', num: 'Mesa 05', cap: 8, est: 'libre', zona: 'Parrilla & Brasas', ticket: '', mozo: '' },
    { id: 'm6', num: 'Mesa 06', cap: 4, est: 'libre', zona: 'Terraza Tarijeña', ticket: '', mozo: '' },
    { id: 'm7', num: 'Mesa 07', cap: 6, est: 'ocupada', zona: 'Terraza Tarijeña', ticket: '#RC-7492', mozo: 'Rodrigo T.' },
    { id: 'm8', num: 'Mesa 08', cap: 4, est: 'cobro', zona: 'Terraza Tarijeña', ticket: '#RC-6119', mozo: 'Rodrigo T.' }
  ]);

  const filtered = mesas.filter(m => {
    if (filter === 'all') return true;
    return m.est === filter;
  });

  const toggleStatus = (id) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setMesas(prev => prev.map(m => {
      if (m.id !== id) return m;
      const nextEst = m.est === 'libre' ? 'ocupada' : m.est === 'ocupada' ? 'cobro' : 'libre';
      return {
        ...m,
        est: nextEst,
        ticket: nextEst === 'ocupada' ? `#RC-${Math.floor(1000 + Math.random() * 9000)}` : nextEst === 'cobro' ? m.ticket : '',
        mozo: nextEst === 'ocupada' ? 'Carlos M.' : ''
      };
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Control de Mesas</Text>
          <Text style={styles.headerSub}>Salón Principal & Terraza Tarija</Text>
        </View>
        <View style={styles.metricBadge}>
          <Text style={styles.metricVal}>42%</Text>
          <Text style={styles.metricLabel}>Ocupación</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {['all', 'libre', 'ocupada', 'cobro'].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'Todas (8)' : f === 'libre' ? '🟢 Libres' : f === 'ocupada' ? '🔴 Ocupadas' : '🟡 Cobro'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isLibre = item.est === 'libre';
          const isCobro = item.est === 'cobro';
          return (
            <View style={[styles.card, !isLibre && styles.cardActive]}>
              <View style={styles.cardTop}>
                <Text style={[styles.statusPill, isLibre ? styles.pillLibre : isCobro ? styles.pillCobro : styles.pillOcupada]}>
                  {isLibre ? '🟢 Libre' : isCobro ? '🟡 Cobrar' : '🔴 Ocupada'}
                </Text>
                <Text style={styles.capText}>👥 {item.cap}</Text>
              </View>

              <Text style={styles.mesaNum}>{item.num}</Text>
              <Text style={styles.mesaZona}>{item.zona}</Text>

              {item.ticket ? (
                <View style={styles.ticketBox}>
                  <Text style={styles.ticketCode}>{item.ticket}</Text>
                  <Text style={styles.mozoName}>{item.mozo || 'Mozo asignado'}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => toggleStatus(item.id)}
                style={styles.actionBtn}
              >
                <Text style={styles.actionBtnText}>
                  {isLibre ? 'Ocupar Mesa' : isCobro ? 'Liberar Mesa' : 'Pasar a Cobro'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a09'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)'
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800'
  },
  headerSub: {
    color: '#a8a29e',
    fontSize: 11
  },
  metricBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center'
  },
  metricVal: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '900'
  },
  metricLabel: {
    color: '#fcd34d',
    fontSize: 9,
    fontWeight: '700'
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6
  },
  filterChip: {
    backgroundColor: '#1c1917',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#292524'
  },
  filterChipActive: {
    backgroundColor: '#d97706',
    borderColor: '#f59e0b'
  },
  filterText: {
    color: '#a8a29e',
    fontSize: 11,
    fontWeight: '700'
  },
  filterTextActive: {
    color: '#ffffff'
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 90
  },
  card: {
    flex: 1,
    backgroundColor: '#1c1917',
    borderRadius: 18,
    padding: 12,
    margin: 6,
    borderWidth: 1,
    borderColor: '#292524'
  },
  cardActive: {
    borderColor: 'rgba(245, 158, 11, 0.4)'
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  statusPill: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  pillLibre: { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' },
  pillOcupada: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' },
  pillCobro: { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fde047' },
  capText: {
    color: '#a8a29e',
    fontSize: 11
  },
  mesaNum: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800'
  },
  mesaZona: {
    color: '#78716c',
    fontSize: 11,
    marginBottom: 6
  },
  ticketBox: {
    backgroundColor: '#0c0a09',
    padding: 6,
    borderRadius: 8,
    marginBottom: 8
  },
  ticketCode: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  mozoName: {
    color: '#d6d3d1',
    fontSize: 10
  },
  actionBtn: {
    backgroundColor: '#292524',
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center'
  },
  actionBtnText: {
    color: '#e7e5e4',
    fontSize: 11,
    fontWeight: '700'
  }
});
