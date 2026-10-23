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

export default function CocinaScreen() {
  const [comandas, setComandas] = useState([
    {
      id: 'c1',
      ticket: '#RC-8421',
      mesa: 'Mesa 04 (Salón)',
      tiempo: '12 min',
      estado: 'fuego',
      items: [
        { nombre: '2x Lechón a la Cruz', nota: 'Cuero bien crocante' },
        { nombre: '1x Costillar a la Cruz', nota: 'Término dorado' },
        { nombre: '3x Ensaladas de cortesía 🥗', nota: '' }
      ]
    },
    {
      id: 'c2',
      ticket: '#RC-7492',
      mesa: 'Mesa 07 (Terraza)',
      tiempo: '24 min',
      estado: 'fuego',
      items: [
        { nombre: '2x Costillar y Lechón Mixto', nota: 'Porción generosa' },
        { nombre: '1x Pollo a la Cruz', nota: '' },
        { nombre: '2x Sopa de Maní con Presa', nota: 'Bien caliente' }
      ]
    },
    {
      id: 'c3',
      ticket: '#RC-1042',
      mesa: 'Mesa 03 (Salón)',
      tiempo: '7 min',
      estado: 'cocina',
      items: [
        { nombre: '2x Saice Criollo', nota: 'Sin picante' },
        { nombre: '1x Sábalo del Pilcomayo', nota: 'Dorado crocante' }
      ]
    }
  ]);

  const markDone = (id) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setComandas(prev => prev.filter(c => c.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Cocina & Brasas (KDS)</Text>
          <Text style={styles.headerSub}>Comandas de carnes y platos en tiempo real</Text>
        </View>
        <View style={styles.activePill}>
          <Text style={styles.activePillText}>🔥 {comandas.length} Activas</Text>
        </View>
      </View>

      <FlatList
        data={comandas}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.ticketCode}>{item.ticket}</Text>
                <Text style={styles.mesaDestino}>{item.mesa}</Text>
              </View>
              <Text style={styles.timerText}>⏱️ {item.tiempo}</Text>
            </View>

            <View style={styles.itemsList}>
              {item.items.map((it, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemName}>{it.nombre}</Text>
                  {it.nota ? <Text style={styles.itemNota}>↳ "{it.nota}"</Text> : null}
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => markDone(item.id)}
              style={styles.doneBtn}
            >
              <Text style={styles.doneBtnText}>Marcar Listo para Servir ✓</Text>
            </TouchableOpacity>
          </View>
        )}
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
  activePill: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12
  },
  activePillText: {
    color: '#fca5a5',
    fontSize: 11,
    fontWeight: '800'
  },
  list: {
    padding: 16,
    paddingBottom: 90
  },
  card: {
    backgroundColor: '#1c1917',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#292524',
    padding: 14,
    marginBottom: 14
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: 8,
    marginBottom: 10
  },
  ticketCode: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  mesaDestino: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  timerText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '700'
  },
  itemsList: {
    marginBottom: 12
  },
  itemRow: {
    marginBottom: 6
  },
  itemName: {
    color: '#f5f5f4',
    fontSize: 13,
    fontWeight: '700'
  },
  itemNota: {
    color: '#fcd34d',
    fontSize: 11,
    marginTop: 1
  },
  doneBtn: {
    backgroundColor: '#059669',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center'
  },
  doneBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  }
});
