import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { buildWhatsAppMessage } from '../services/menuService';
import { WHATSAPP_PHONE } from '../constants/fallbackData';

export default function OrderSheetModal({
  visible,
  onClose,
  cart,
  ticketId,
  onAdd,
  onRemove,
  onClear,
  onOrderSent
}) {
  const [orderMode, setOrderMode] = useState('table'); // 'table' | 'takeaway'
  const [tableNumber, setTableNumber] = useState('');
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');

  const items = Object.values(cart);
  const totalPrice = items.reduce((sum, item) => sum + (item.dish.precio * item.qty), 0);

  const handleSendWhatsApp = async () => {
    if (items.length === 0) {
      Alert.alert('Aviso', 'Tu pedido está vacío. Elige al menos un plato.');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const message = buildWhatsAppMessage({
      items,
      orderMode,
      tableNumber,
      address,
      customerName,
      notes,
      ticketId
    });

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported || Platform.OS === 'web') {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se pudo abrir WhatsApp en este dispositivo.');
      }
    } catch (err) {
      console.warn('Linking error:', err);
      Linking.openURL(url);
    }

    onOrderSent();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.sheetTitle}>Detalle de tu Orden</Text>
              <Text style={styles.ticketBadge}>Ticket: {ticketId}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Body */}
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            
            {/* Items List */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>PLATOS SELECCIONADOS</Text>
              <TouchableOpacity onPress={onClear}>
                <Text style={styles.clearText}>Vaciar todo</Text>
              </TouchableOpacity>
            </View>

            {items.map(item => {
              const itemTotal = item.dish.precio * item.qty;
              const isFree = item.dish.precio === 0;

              return (
                <View key={item.dish.id} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.dish.nombre}</Text>
                    <Text style={styles.itemPriceSub}>
                      {isFree ? '¡Cortesía!' : `${item.dish.precio} Bs c/u`}
                    </Text>
                    {item.note ? (
                      <Text style={styles.itemNoteText}>↳ "{item.note}"</Text>
                    ) : null}
                  </View>

                  <View style={styles.itemActions}>
                    <View style={styles.miniStepper}>
                      <TouchableOpacity onPress={() => onRemove(item.dish)} style={styles.miniBtn}>
                        <Text style={styles.miniBtnText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.miniQty}>{item.qty}</Text>
                      <TouchableOpacity onPress={() => onAdd(item.dish)} style={styles.miniBtn}>
                        <Text style={styles.miniBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemTotalText}>
                      {isFree ? '0 Bs' : `${itemTotal} Bs`}
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* Salad Promo Callout */}
            <View style={styles.saladCallout}>
              <Text style={styles.saladIcon}>🥗</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.saladTitle}>¡Ensaladas de cortesía incluidas!</Text>
                <Text style={styles.saladDesc}>
                  Te llevaremos ensaladas frescas variadas sin ningún costo adicional.
                </Text>
              </View>
            </View>

            {/* Mode Toggle */}
            <Text style={styles.inputLabel}>MODALIDAD DEL PEDIDO</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                onPress={() => setOrderMode('table')}
                style={[styles.toggleBtn, orderMode === 'table' && styles.toggleBtnActive]}
              >
                <Text style={[styles.toggleText, orderMode === 'table' && styles.toggleTextActive]}>
                  🍽️ En Salón / Mesa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setOrderMode('takeaway')}
                style={[styles.toggleBtn, orderMode === 'takeaway' && styles.toggleBtnActive]}
              >
                <Text style={[styles.toggleText, orderMode === 'takeaway' && styles.toggleTextActive]}>
                  📦 Para Llevar / Delivery
                </Text>
              </TouchableOpacity>
            </View>

            {/* Inputs based on mode */}
            {orderMode === 'table' ? (
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Número de Mesa en Río Chico:</Text>
                <TextInput
                  value={tableNumber}
                  onChangeText={setTableNumber}
                  placeholder="Ej. Mesa 4 o 'En barra'"
                  placeholderTextColor="#64748b"
                  style={styles.textInput}
                />
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>Dirección de entrega / Referencia en Tarija:</Text>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Barrio, calle y referencia"
                  placeholderTextColor="#64748b"
                  style={styles.textInput}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Tu Nombre o Nombre de la Reserva:</Text>
              <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Ej. Juan Pérez"
                placeholderTextColor="#64748b"
                style={styles.textInput}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>Instrucciones o nota para cocina:</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Ej. Servir sopas de entrada por favor"
                placeholderTextColor="#64748b"
                style={styles.textInput}
              />
            </View>

            {/* Price Breakdown */}
            <View style={styles.breakdownBox}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Subtotal de platos:</Text>
                <Text style={styles.breakdownVal}>{totalPrice} Bs</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Ensaladas de la casa:</Text>
                <Text style={styles.breakdownFree}>¡CORTESÍA! (0 Bs)</Text>
              </View>
              <View style={[styles.breakdownRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total a pagar:</Text>
                <Text style={styles.totalVal}>{totalPrice} <Text style={{ fontSize: 13 }}>Bs</Text></Text>
              </View>
            </View>

            {/* Modification Policy Note */}
            <View style={styles.policyBox}>
              <Text style={styles.policyTitle}>⚠️ Política de Cambios y Cancelación</Text>
              <Text style={styles.policyDesc}>
                Para modificar o cancelar tu orden, responde al chat de WhatsApp citando tu ticket{' '}
                <Text style={{ fontWeight: '800', color: '#f59e0b' }}>{ticketId}</Text> dentro de los primeros 10 minutos.
              </Text>
            </View>

          </ScrollView>

          {/* Footer Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleSendWhatsApp}
              activeOpacity={0.88}
              style={styles.btnSend}
            >
              <Text style={styles.btnSendIcon}>💬</Text>
              <Text style={styles.btnSendText}>Confirmar y Enviar por WhatsApp</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    justifyContent: 'flex-end'
  },
  sheetContainer: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 32 : 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)'
  },
  sheetTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800'
  },
  ticketBadge: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  closeBtn: {
    padding: 6
  },
  closeText: {
    color: '#94a3b8',
    fontSize: 18,
    fontWeight: '700'
  },
  body: {
    padding: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  clearText: {
    color: '#f87171',
    fontSize: 12
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  itemInfo: {
    flex: 1,
    marginRight: 10
  },
  itemName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  itemPriceSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2
  },
  itemNoteText: {
    color: '#fcd34d',
    fontSize: 11,
    marginTop: 2
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  miniStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 10
  },
  miniBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  miniBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13
  },
  miniQty: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '800',
    minWidth: 16,
    textAlign: 'center'
  },
  itemTotalText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    minWidth: 46,
    textAlign: 'right'
  },
  saladCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 78, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    borderRadius: 14,
    padding: 12,
    marginVertical: 14
  },
  saladIcon: {
    fontSize: 22,
    marginRight: 10
  },
  saladTitle: {
    color: '#6ee7b7',
    fontSize: 12,
    fontWeight: '800'
  },
  saladDesc: {
    color: '#a7f3d0',
    fontSize: 11,
    marginTop: 2
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 10,
    marginBottom: 8
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#f59e0b'
  },
  toggleText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700'
  },
  toggleTextActive: {
    color: '#fbbf24'
  },
  inputGroup: {
    marginBottom: 12
  },
  fieldLabel: {
    color: '#cbd5e1',
    fontSize: 11,
    marginBottom: 4
  },
  textInput: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: '#ffffff',
    fontSize: 13
  },
  breakdownBox: {
    backgroundColor: '#020617',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)'
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  breakdownLabel: {
    color: '#94a3b8',
    fontSize: 12
  },
  breakdownVal: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  breakdownFree: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '700'
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 0
  },
  totalLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  },
  totalVal: {
    color: '#fbbf24',
    fontSize: 20,
    fontWeight: '900'
  },
  policyBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  policyTitle: {
    color: '#fcd34d',
    fontSize: 11,
    fontWeight: '800'
  },
  policyDesc: {
    color: '#fde68a',
    fontSize: 11,
    marginTop: 4,
    lineHeight: 16
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)'
  },
  btnSend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 16
  },
  btnSendIcon: {
    fontSize: 18,
    marginRight: 8
  },
  btnSendText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800'
  }
});
