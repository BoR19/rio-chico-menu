import AsyncStorage from '@react-native-async-storage/async-storage';
import Papa from 'papaparse';
import { CACHE_KEY, CSV_URL, fallbackDishes } from '../constants/fallbackData';

export function parsePrice(val) {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  const clean = val.toString().replace(/[^0-9.]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

export function generateTicketId() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `#RC-${rand}`;
}

export function calculateOrderTotal(items) {
  return items.reduce((total, item) => total + (item.dish.precio * item.qty), 0);
}

export async function loadCachedMenu() {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Error reading local cache:', err);
  }
  return fallbackDishes;
}

export async function fetchLiveMenu() {
  return new Promise((resolve) => {
    const resolveWithCachedMenu = async () => {
      const data = await loadCachedMenu();
      resolve({ data, source: data === fallbackDishes ? 'fallback' : 'cache' });
    };

    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.data && results.data.length > 0) {
          const parsed = results.data
            .filter(r => r.Nombre && r.Nombre.trim())
            .map((row, idx) => ({
              id: `rc_sheet_${idx + 1}`,
              categoria: row.Categoria ? row.Categoria.trim() : 'Otros',
              nombre: row.Nombre ? row.Nombre.trim() : '',
              descripcion: row.Descripcion ? row.Descripcion.trim() : '',
              precio: parsePrice(row['Precio Plato'] || row.Precio || ''),
              imagen: row.Imagen ? row.Imagen.trim() : ''
            }));

          if (parsed.length > 0) {
            try {
              await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
            } catch (e) {
              console.warn('AsyncStorage write error:', e);
            }
            return resolve({ data: parsed, source: 'sheet' });
          }
        }
        resolveWithCachedMenu();
      },
      error: (err) => {
        console.error('PapaParse error:', err);
        resolveWithCachedMenu();
      }
    });
  });
}

export function buildWhatsAppMessage({ items, orderMode, tableNumber, address, customerName, notes, ticketId }) {
  const totalPrice = calculateOrderTotal(items);
  const now = new Date();
  const formattedDate = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const modalidad = orderMode === 'table'
    ? `Mesa: ${tableNumber || 'No especificada (En Salón)'}`
    : `Para Llevar / Delivery Tarija: ${address || 'A coordinar'}`;

  const itemsText = items.map(item => {
    const freeBadge = item.dish.precio === 0 ? ' (¡Cortesía!)' : ` - ${item.dish.precio * item.qty} Bs`;
    let line = `• ${item.qty}x ${item.dish.nombre}${freeBadge}`;
    if (item.note) {
      line += `\n  ↳ _Nota: ${item.note}_`;
    }
    return line;
  }).join('\n');

  return `🍽️ *PEDIDO RESTAURANTE RÍO CHICO* 🍽️
🏷️ *Ticket:* ${ticketId}
📅 *Fecha:* ${formattedDate}
👤 *Cliente:* ${customerName || 'Cliente Río Chico'}
📍 *Modalidad:* ${modalidad}
----------------------------------------
📋 *DETALLE DEL PEDIDO:*
${itemsText}
• 1x Ensaladas Frescas - ¡Cortesía de la casa! 🥗
----------------------------------------
💰 *TOTAL A PAGAR:* ${totalPrice} Bs
----------------------------------------${notes ? `\n📝 *Nota Especial:* ${notes}\n` : ''}
⚠️ *MODIFICACIONES O CANCELACIÓN:*
Para modificar o cancelar tu orden, responde a este chat indicando tu ticket *${ticketId}* dentro de los primeros 10 minutos.

¡Muchas gracias por elegir Río Chico, tradición a la leña en Tarija! 🍷🔥`;
}
