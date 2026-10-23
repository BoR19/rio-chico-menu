import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Platform,
  Alert
} from 'react-native';
import * as Haptics from 'expo-haptics';

export default function AdminScreen() {
  const [users, setUsers] = useState([
    { id: 'u1', nombre: 'Héctor Valenzuela', rol: 'admin', contacto: 'admin@riochico.bo', icon: '👔' },
    { id: 'u2', nombre: 'Valeria Guzmán', rol: 'cajero', contacto: 'caja1@riochico.bo', icon: '💵' },
    { id: 'u3', nombre: 'Carlos Mendoza', rol: 'mozo', contacto: '+591 71829911', icon: '🤵' },
    { id: 'u4', nombre: 'Rodrigo Torrez', rol: 'mozo', contacto: '+591 76192833', icon: '🤵' }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newRole, setNewRole] = useState('mozo');

  const handleAddUser = () => {
    if (!newName.trim()) {
      Alert.alert('Aviso', 'Ingresa el nombre del usuario.');
      return;
    }
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    const icon = newRole === 'admin' ? '👔' : newRole === 'cajero' ? '💵' : '🤵';
    setUsers(prev => [
      ...prev,
      { id: `u_${Date.now()}`, nombre: newName.trim(), rol: newRole, contacto: newContact.trim() || 'Sin contacto', icon }
    ]);
    setNewName('');
    setNewContact('');
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Administración</Text>
          <Text style={styles.headerSub}>Roles de Mozo, Cajero y Administrador</Text>
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addBtn}
        >
          <Text style={styles.addBtnText}>+ Crear Usuario</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isAdm = item.rol === 'admin';
          const isCaj = item.rol === 'cajero';
          return (
            <View style={styles.card}>
              <View style={styles.userLeft}>
                <View style={styles.avatar}>
                  <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                </View>
                <View>
                  <Text style={styles.userName}>{item.nombre}</Text>
                  <Text style={styles.userContact}>{item.contacto}</Text>
                </View>
              </View>

              <View style={styles.userRight}>
                <View style={[styles.roleBadge, isAdm ? styles.badgeAdm : isCaj ? styles.badgeCaj : styles.badgeMoz]}>
                  <Text style={[styles.roleText, isAdm ? styles.textAdm : isCaj ? styles.textCaj : styles.textMoz]}>
                    {item.rol.toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                  <Text style={{ color: '#ef4444', fontSize: 13 }}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Modal Crear Usuario */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Usuario Río Chico</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Nombre completo"
              placeholderTextColor="#78716c"
              style={styles.input}
            />
            <TextInput
              value={newContact}
              onChangeText={setNewContact}
              placeholder="Correo o teléfono"
              placeholderTextColor="#78716c"
              style={styles.input}
            />

            <Text style={styles.roleLabel}>Seleccionar Rol:</Text>
            <View style={styles.rolesRow}>
              {[
                { r: 'mozo', label: '🤵 Mozo' },
                { r: 'cajero', label: '💵 Cajero' },
                { r: 'admin', label: '👔 Admin' }
              ].map(item => (
                <TouchableOpacity
                  key={item.r}
                  onPress={() => setNewRole(item.r)}
                  style={[styles.roleChip, newRole === item.r && styles.roleChipActive]}
                >
                  <Text style={[styles.roleChipText, newRole === item.r && styles.roleChipTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddUser} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    backgroundColor: '#d97706',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  },
  list: {
    padding: 16,
    paddingBottom: 90
  },
  card: {
    backgroundColor: '#1c1917',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#292524',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  userLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0c0a09',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  userName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  userContact: {
    color: '#78716c',
    fontSize: 11,
    marginTop: 2
  },
  userRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  badgeAdm: { backgroundColor: 'rgba(249, 115, 22, 0.2)' },
  badgeCaj: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  badgeMoz: { backgroundColor: 'rgba(59, 130, 246, 0.2)' },
  roleText: { fontSize: 10, fontWeight: '800' },
  textAdm: { color: '#fb923c' },
  textCaj: { color: '#6ee7b7' },
  textMoz: { color: '#93c5fd' },
  deleteBtn: {
    padding: 6
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#1c1917',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#292524'
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12
  },
  input: {
    backgroundColor: '#0c0a09',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#292524',
    padding: 10,
    color: '#ffffff',
    fontSize: 13,
    marginBottom: 10
  },
  roleLabel: {
    color: '#a8a29e',
    fontSize: 11,
    marginBottom: 6,
    fontWeight: '700'
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14
  },
  roleChip: {
    flex: 1,
    backgroundColor: '#0c0a09',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#292524'
  },
  roleChipActive: {
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.15)'
  },
  roleChipText: {
    color: '#78716c',
    fontSize: 11,
    fontWeight: '700'
  },
  roleChipTextActive: {
    color: '#fbbf24'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  cancelBtnText: {
    color: '#78716c',
    fontSize: 12
  },
  saveBtn: {
    backgroundColor: '#d97706',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800'
  }
});
