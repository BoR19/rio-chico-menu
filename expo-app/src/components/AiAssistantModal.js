import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import * as Haptics from 'expo-haptics';

export default function AiAssistantModal({ visible, onClose, onAddDishById }) {
  const [topic, setTopic] = useState(null);

  const handleSelect = (t) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTopic(t);
  };

  const handleAdd = (dishId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAddDishById(dishId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 16 }}>✨</Text>
              </View>
              <View>
                <Text style={styles.title}>Mesero IA Río Chico</Text>
                <Text style={styles.subtitle}>Sommelier & Recomendaciones Tarijeñas</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Conversation Area */}
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>
                ¡Buen provecho, casero! Soy tu <Text style={{ fontWeight: '800' }}>Mesero Virtual de Río Chico</Text>. Te oriento sobre el mejor maridaje de vinos del valle, cortes a la leña o platos criollos del día.
              </Text>
            </View>

            {topic === 'vino' && (
              <View style={styles.answerCard}>
                <Text style={styles.answerTitle}>🍷 Maridaje Recomendado:</Text>
                <Text style={styles.answerDesc}>
                  Para el <Text style={{ fontWeight: '700' }}>Lechón o Costillar a la Cruz</Text>, el mejor acompañante es un <Text style={{ fontWeight: '700' }}>Terruño Tinto (22 Bs)</Text> o <Text style={{ fontWeight: '700' }}>Kohlberg Tinto (22 Bs)</Text>. Sus notas frutales y taninos redondos equilibran de forma insuperable el toque ahumado.
                </Text>
                <TouchableOpacity onPress={() => handleAdd('rc_25')} style={styles.addBtn}>
                  <Text style={styles.addBtnText}>+ Agregar Terruño Tinto (22 Bs)</Text>
                </TouchableOpacity>
              </View>
            )}

            {topic === 'especialidad' && (
              <View style={styles.answerCard}>
                <Text style={styles.answerTitle}>🔥 Especialidad Insignia de Río Chico:</Text>
                <Text style={styles.answerDesc}>
                  El <Text style={{ fontWeight: '700' }}>Lechón a la Cruz (85 Bs)</Text>. Asado lentamente a la leña durante cuatro horas con cuero ultracrocante y carne tierna que se deshace sola.
                </Text>
                <TouchableOpacity onPress={() => handleAdd('rc_2')} style={styles.addBtn}>
                  <Text style={styles.addBtnText}>+ Agregar Lechón a la Cruz (85 Bs)</Text>
                </TouchableOpacity>
              </View>
            )}

            {topic === 'criollo' && (
              <View style={styles.answerCard}>
                <Text style={styles.answerTitle}>🍲 Tradición Criolla Tarijeña:</Text>
                <Text style={styles.answerDesc}>
                  Inicia con una humeante <Text style={{ fontWeight: '700' }}>Sopa de Maní con Presa (12 Bs)</Text> espesa y cremosa, seguida por un delicioso <Text style={{ fontWeight: '700' }}>Saice Criollo (10 Bs)</Text>.
                </Text>
                <TouchableOpacity onPress={() => handleAdd('rc_13')} style={styles.addBtn}>
                  <Text style={styles.addBtnText}>+ Agregar Sopa de Maní con Presa (12 Bs)</Text>
                </TouchableOpacity>
              </View>
            )}

            {topic === 'familia' && (
              <View style={styles.answerCard}>
                <Text style={styles.answerTitle}>👨‍👩‍👧 Combo Familiar (3-4 Personas):</Text>
                <Text style={styles.answerDesc}>
                  • Costillar y Lechón Mixto (60 Bs){'\n'}
                  • Pollo a la Cruz (20 Bs){'\n'}
                  • Jarra de Vino Patero Artesanal (25 Bs){'\n'}
                  • Ensaladas ilimitadas gratuitas
                </Text>
                <TouchableOpacity onPress={() => handleAdd('rc_4')} style={styles.addBtn}>
                  <Text style={styles.addBtnText}>+ Agregar Costillar y Lechón Mixto (60 Bs)</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/* Quick Prompts */}
          <View style={styles.promptArea}>
            <Text style={styles.promptLabel}>PREGUNTAS SUGERIDAS:</Text>
            <View style={styles.promptButtons}>
              <TouchableOpacity onPress={() => handleSelect('vino')} style={styles.promptBtn}>
                <Text style={styles.promptBtnText}>🍷 Vino para carne a la cruz</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelect('especialidad')} style={styles.promptBtn}>
                <Text style={styles.promptBtnText}>🔥 Plato más famoso</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelect('criollo')} style={styles.promptBtn}>
                <Text style={styles.promptBtnText}>🍲 Sopa o plato tradicional</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelect('familia')} style={styles.promptBtn}>
                <Text style={styles.promptBtnText}>👨‍👩‍👧 Combo para compartir</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
    padding: 20
  },
  dialog: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    overflow: 'hidden',
    maxHeight: '80%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(2, 6, 23, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 158, 11, 0.2)'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  },
  subtitle: {
    color: '#fbbf24',
    fontSize: 10
  },
  closeBtn: {
    padding: 4
  },
  closeText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '700'
  },
  body: {
    padding: 16
  },
  bubble: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12
  },
  bubbleText: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 18
  },
  answerCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    padding: 12,
    marginBottom: 8
  },
  answerTitle: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4
  },
  answerDesc: {
    color: '#e2e8f0',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10
  },
  addBtn: {
    backgroundColor: '#d97706',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  promptArea: {
    padding: 14,
    backgroundColor: '#020617',
    borderTopWidth: 1,
    borderTopColor: '#1e293b'
  },
  promptLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8
  },
  promptButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  promptBtn: {
    backgroundColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  promptBtnText: {
    color: '#fcd34d',
    fontSize: 11,
    fontWeight: '600'
  }
});
