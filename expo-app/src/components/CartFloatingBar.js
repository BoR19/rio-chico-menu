import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function CartFloatingBar({ totalQty, totalPrice, onOpenOrder }) {
  if (totalQty === 0) return null;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onOpenOrder();
  };

  return (
    <View style={styles.floatingContainer}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handlePress}
        style={styles.card}
      >
        <View style={styles.left}>
          <View style={styles.badgeWrapper}>
            <LinearGradient
              colors={['#ea580c', '#dc2626']}
              style={styles.bagGradient}
            >
              <Text style={styles.bagIcon}>🛍️</Text>
            </LinearGradient>
            <View style={styles.qtyBadge}>
              <Text style={styles.qtyBadgeText}>{totalQty}</Text>
            </View>
          </View>

          <View style={styles.summaryText}>
            <Text style={styles.title}>TU PEDIDO ACTUAL</Text>
            <Text style={styles.price}>
              {totalPrice} <Text style={styles.currency}>Bs</Text>
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={['#dc2626', '#d97706']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.reviewBtn}
        >
          <Text style={styles.reviewText}>Revisar</Text>
          <Text style={styles.arrowText}>→</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    zIndex: 50
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.45)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 16
      },
      android: {
        elevation: 10
      }
    })
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  badgeWrapper: {
    position: 'relative',
    marginRight: 12
  },
  bagGradient: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bagIcon: {
    fontSize: 20
  },
  qtyBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ffffff',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyBadgeText: {
    color: '#020617',
    fontSize: 11,
    fontWeight: '900'
  },
  summaryText: {
    justifyContent: 'center'
  },
  title: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  price: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900'
  },
  currency: {
    fontSize: 12,
    color: '#fcd34d',
    fontWeight: '700'
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14
  },
  reviewText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  },
  arrowText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 6
  }
});
