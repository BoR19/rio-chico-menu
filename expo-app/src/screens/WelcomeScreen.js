import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ onEnterMenu }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    const kenBurnsAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.14,
          duration: 16000,
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 16000,
          useNativeDriver: true
        })
      ])
    );

    const entranceAnimation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true
      })
    ]);

    kenBurnsAnimation.start();
    entranceAnimation.start();
    return () => {
      kenBurnsAnimation.stop();
      entranceAnimation.stop();
    };
  }, []);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onEnterMenu();
  };

  return (
    <View style={styles.container}>
      {/* Background with Ken Burns Effect */}
      <Animated.Image
        source={{ uri: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=85' }}
        style={[styles.bgImage, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="cover"
      />

      {/* Dark Gradient Overlay */}
      <LinearGradient
        colors={['rgba(2, 6, 23, 0.4)', 'rgba(2, 6, 23, 0.85)', '#020617']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Top Status */}
      <View style={styles.topStatus}>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>TARIJA • ABIERTO HOY</Text>
        </View>
        <Text style={styles.versionText}>v5.0 LIVE</Text>
      </View>

      {/* Content Container */}
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* Logo with Orange Glow */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoGlow} />
          <Image
            source={require('../../assets/rio_chico_orange_glow.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Restaurante <Text style={styles.titleHighlight}>Río Chico</Text>
        </Text>

        {/* Tarijeño Phrase */}
        <Text style={styles.phrase}>
          "Tradición a la leña, sabor único y la calidez de nuestra tierra tarijeña."
        </Text>

        {/* Glassmorphic Promo Badge */}
        <View style={styles.promoBadge}>
          <Text style={styles.promoIcon}>🥗</Text>
          <Text style={styles.promoText}>
            <Text style={styles.promoBold}>¡INVITA LA CASA! </Text>
            Ensaladas frescas gratuitas de cortesía
          </Text>
        </View>
      </Animated.View>

      {/* iOS Style Action Button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handlePress}
          style={styles.btnShadow}
        >
          <LinearGradient
            colors={['#dc2626', '#d97706', '#ea580c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnText}>Ver Menú Digital</Text>
            <Text style={styles.btnArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.footerCaption}>
          Pedidos directos a cocina y WhatsApp • Tarija, Bolivia
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'space-between',
    paddingVertical: Platform.OS === 'ios' ? 54 : 32,
    paddingHorizontal: 24,
    overflow: 'hidden'
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: width * 1.15,
    height: height * 1.15,
    opacity: 0.42
  },
  topStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#34d399',
    marginRight: 6
  },
  statusText: {
    color: '#fcd34d',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6
  },
  versionText: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  content: {
    alignItems: 'center',
    zIndex: 10
  },
  logoWrapper: {
    position: 'relative',
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  logoGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(249, 115, 22, 0.32)',
    filter: 'blur(20px)'
  },
  logoImage: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#ea580c',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20
      }
    })
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -0.5
  },
  titleHighlight: {
    color: '#fbbf24'
  },
  phrase: {
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
    maxWidth: 290,
    lineHeight: 20
  },
  promoBadge: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    maxWidth: 320
  },
  promoIcon: {
    fontSize: 18,
    marginRight: 8
  },
  promoText: {
    color: '#6ee7b7',
    fontSize: 12,
    lineHeight: 16,
    flex: 1
  },
  promoBold: {
    color: '#ffffff',
    fontWeight: '800'
  },
  bottomArea: {
    zIndex: 10,
    width: '100%',
    alignItems: 'center'
  },
  btnShadow: {
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#dc2626',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 14
      },
      android: {
        elevation: 8
      }
    })
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.35)'
  },
  btnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3
  },
  btnArrow: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 8
  },
  footerCaption: {
    marginTop: 12,
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center'
  }
});
