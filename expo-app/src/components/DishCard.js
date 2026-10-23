import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { dishSpecificImages, categoryDefaultImages } from '../constants/fallbackData';

export default function DishCard({ dish, inCart, onAdd, onRemove, onNotePress }) {
  const qty = inCart ? inCart.qty : 0;
  const hasNote = inCart && inCart.note;
  const isFree = dish.precio === 0 || dish.categoria === 'Ensaladas';

  const imageUrl = dish.imagen && dish.imagen.startsWith('http')
    ? dish.imagen
    : (dishSpecificImages[dish.nombre] || categoryDefaultImages[dish.categoria] || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80');

  const handleAdd = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onAdd(dish);
  };

  const handleRemove = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onRemove(dish);
  };

  return (
    <View style={styles.card}>
      {/* Dish Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Category Pill */}
        <View style={styles.catBadge}>
          <Text style={styles.catText}>{dish.categoria}</Text>
        </View>

        {/* Price / Complimentary Badge */}
        <View style={styles.priceBadge}>
          {isFree ? (
            <Text style={styles.freeText}>🥗 ¡CORTESÍA!</Text>
          ) : (
            <Text style={styles.priceText}>
              {dish.precio} <Text style={styles.currencyText}>Bs</Text>
            </Text>
          )}
        </View>
      </View>

      {/* Info Content */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{dish.nombre}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {dish.descripcion || 'Especialidad tradicional de la casa.'}
        </Text>

        {hasNote ? (
          <View style={styles.noteBox}>
            <Text style={styles.noteText} numberOfLines={1}>
              ↳ Nota: {inCart.note}
            </Text>
          </View>
        ) : null}

        {/* Bottom Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => onNotePress(dish)}
            style={styles.noteBtn}
          >
            <Text style={styles.noteBtnText}>💬 Nota</Text>
          </TouchableOpacity>

          {qty === 0 ? (
            <TouchableOpacity
              onPress={handleAdd}
              activeOpacity={0.8}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>+ Agregar</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.stepper}>
              <TouchableOpacity onPress={handleRemove} style={styles.stepBtn}>
                <Text style={styles.stepBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity onPress={handleAdd} style={[styles.stepBtn, styles.stepBtnAdd]}>
                <Text style={[styles.stepBtnText, styles.stepBtnAddText]}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.75)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 16
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: '#0f172a'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  catBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  catText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600'
  },
  priceBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12
  },
  freeText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5
  },
  priceText: {
    color: '#020617',
    fontWeight: '900',
    fontSize: 14
  },
  currencyText: {
    fontSize: 11,
    fontWeight: '700'
  },
  info: {
    padding: 14
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800'
  },
  desc: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17
  },
  noteBox: {
    marginTop: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  noteText: {
    color: '#fcd34d',
    fontSize: 11
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)'
  },
  noteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  noteBtnText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600'
  },
  addBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d97706'
  },
  addBtnText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '700'
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020617',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)'
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  stepBtnAdd: {
    backgroundColor: '#d97706'
  },
  stepBtnAddText: {
    color: '#ffffff'
  },
  qtyText: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: '800',
    marginHorizontal: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  }
});
