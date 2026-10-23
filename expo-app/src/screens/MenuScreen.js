import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import * as Haptics from 'expo-haptics';
import DishCard from '../components/DishCard';
import CartFloatingBar from '../components/CartFloatingBar';
import OrderSheetModal from '../components/OrderSheetModal';
import AiAssistantModal from '../components/AiAssistantModal';
import { loadCachedMenu, fetchLiveMenu, generateTicketId } from '../services/menuService';

export default function MenuScreen({ onGoHome }) {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState(['Todos']);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({});
  const [ticketId, setTicketId] = useState(generateTicketId());
  
  // Modals
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Iniciando...');

  useEffect(() => {
    // 1. Initial boot from local cache
    loadCachedMenu().then(cached => {
      setDishes(cached);
      updateCategories(cached);
      setSyncStatus('Caché activo');
    });

    // 2. Background revalidation from Google Sheets
    handleSync();
  }, []);

  const updateCategories = (list) => {
    const set = new Set();
    list.forEach(d => {
      if (d.categoria) set.add(d.categoria);
    });
    setCategories(['Todos', ...Array.from(set)]);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Sincronizando...');
    const result = await fetchLiveMenu();
    setDishes(result.data);
    updateCategories(result.data);
    setIsSyncing(false);
    setSyncStatus(result.source === 'sheet' ? 'En vivo (Sheets)' : 'Respaldo local');
  };

  const handleAddToCart = (dish) => {
    setCart(prev => {
      const current = prev[dish.id];
      return {
        ...prev,
        [dish.id]: {
          dish,
          qty: current ? current.qty + 1 : 1,
          note: current ? current.note : ''
        }
      };
    });
  };

  const handleRemoveFromCart = (dish) => {
    setCart(prev => {
      const current = prev[dish.id];
      if (!current) return prev;
      if (current.qty <= 1) {
        const next = { ...prev };
        delete next[dish.id];
        return next;
      }
      return {
        ...prev,
        [dish.id]: {
          ...current,
          qty: current.qty - 1
        }
      };
    });
  };

  const handleNotePress = (dish) => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        `Nota para ${dish.nombre}`,
        'Especifica detalles para cocina (ej. sin vinagre, término medio, etc.):',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Guardar',
            onPress: (text) => {
              setCart(prev => {
                const current = prev[dish.id] || { dish, qty: 1, note: '' };
                return {
                  ...prev,
                  [dish.id]: {
                    ...current,
                    note: text || ''
                  }
                };
              });
            }
          }
        ],
        'plain-text',
        cart[dish.id]?.note || ''
      );
    } else {
      // Android / Web simple prompt fallback
      const currentNote = cart[dish.id]?.note || '';
      const newNote = prompt(`Nota para ${dish.nombre}:`, currentNote);
      if (newNote !== null) {
        setCart(prev => {
          const current = prev[dish.id] || { dish, qty: 1, note: '' };
          return {
            ...prev,
            [dish.id]: {
              ...current,
              note: newNote
            }
          };
        });
      }
    }
  };

  const handleAddDishById = (id) => {
    const target = dishes.find(d => d.id === id);
    if (target) {
      handleAddToCart(target);
    }
  };

  const filteredDishes = dishes.filter(d => {
    const matchesCat = activeCategory === 'Todos' || d.categoria === activeCategory;
    const matchesSearch = !searchQuery ||
      d.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartItems = Object.values(cart);
  const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + (i.dish.precio * i.qty), 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoHome} style={styles.headerBrand}>
          <Image
            source={require('../../assets/rio_chico_orange_glow.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.brandTitle}>Río Chico</Text>
              <View style={styles.liveDot} />
            </View>
            <Text style={styles.brandSubtitle}>Abierto Hoy • Tarija</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {/* AI Assistant Button */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setAiModalVisible(true);
            }}
            style={styles.aiBtn}
          >
            <Text style={styles.aiBtnText}>✨ Mesero IA</Text>
          </TouchableOpacity>

          {/* Sync Button */}
          <TouchableOpacity onPress={handleSync} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>{isSyncing ? '⏳' : '🔄'}</Text>
          </TouchableOpacity>

          {/* Home Button */}
          <TouchableOpacity onPress={onGoHome} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>🏠</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Salad Bar Banner */}
      <View style={styles.saladBanner}>
        <View style={styles.saladBadge}>
          <Text style={styles.saladBadgeText}>¡INVITA LA CASA!</Text>
        </View>
        <Text style={styles.saladBannerText} numberOfLines={1}>
          🥗 Ensaladas frescas gratuitas e ilimitadas con cualquier plato.
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar lechón, saice, sopa de maní, vino..."
          placeholderTextColor="#64748b"
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={{ color: '#94a3b8', fontSize: 14 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Category Navigation */}
      <View style={styles.categoryBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveCategory(cat);
                }}
                style={[styles.catChip, isActive && styles.catChipActive]}
              >
                <Text style={[styles.catChipText, isActive && styles.catChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Status & Dish Count */}
      <View style={styles.statusRow}>
        <Text style={styles.sectionHeading}>
          {activeCategory} ({filteredDishes.length})
        </Text>
        <Text style={styles.syncStatusText}>● {syncStatus}</Text>
      </View>

      {/* Dishes List */}
      <FlatList
        data={filteredDishes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            inCart={cart[item.id]}
            onAdd={handleAddToCart}
            onRemove={handleRemoveFromCart}
            onNotePress={handleNotePress}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Bottom Cart */}
      <CartFloatingBar
        totalQty={totalQty}
        totalPrice={totalPrice}
        onOpenOrder={() => setOrderModalVisible(true)}
      />

      {/* Order Sheet Modal */}
      <OrderSheetModal
        visible={orderModalVisible}
        onClose={() => setOrderModalVisible(false)}
        cart={cart}
        ticketId={ticketId}
        onAdd={handleAddToCart}
        onRemove={handleRemoveFromCart}
        onClear={() => setCart({})}
        onOrderSent={() => {
          setTicketId(generateTicketId());
          setOrderModalVisible(false);
        }}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        onAddDishById={handleAddDishById}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(15, 23, 42, 0.95)'
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerLogo: {
    width: 38,
    height: 38,
    marginRight: 10
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800'
  },
  brandSubtitle: {
    color: '#34d399',
    fontSize: 11,
    fontWeight: '600'
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginLeft: 6
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  aiBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14
  },
  aiBtnText: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '700'
  },
  iconBtn: {
    padding: 6
  },
  iconBtnText: {
    fontSize: 16
  },
  saladBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 78, 59, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.25)'
  },
  saladBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8
  },
  saladBadgeText: {
    color: '#6ee7b7',
    fontSize: 9,
    fontWeight: '900'
  },
  saladBannerText: {
    color: '#a7f3d0',
    fontSize: 11,
    flex: 1
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 13,
    paddingVertical: 8
  },
  clearBtn: {
    padding: 4
  },
  categoryBar: {
    marginTop: 10
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8
  },
  catChip: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  catChipActive: {
    backgroundColor: '#d97706',
    borderColor: '#fbbf24'
  },
  catChipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700'
  },
  catChipTextActive: {
    color: '#ffffff'
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8
  },
  sectionHeading: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800'
  },
  syncStatusText: {
    color: '#64748b',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100
  }
});
