/**
 * �R�N KATALO?U � Buraya marka ve fiyatlar? siz eklersiniz.
 *
 * Yap?:
 *   brands[].products[]  ? her �r�n�n sku, label, price (TRY), match (form alan?)
 *
 * match tipleri:
 *   { type: 'radio',   name: 'alan_adi', value: 'deger' }
 *   { type: 'checkbox', name: 'alan_adi', value: 'deger', qtyField?: 'adet_alan' }
 *   { type: 'quantity', field: 'alan_adi' }           ? say? x birim fiyat
 *   { type: 'select',   field: 'alan_adi', value: 'deger' }
 *
 * �rnek fiyatlar demo i�indir � kendi listenizle de?i?tirin.
 */
window.UrunKatalogu = {
  meta: {
    varsayilanParaBirimi: 'TRY',
    varsayilanUrunParaBirimi: 'TRY',
    desteklenenParaBirimleri: ['TRY', 'EUR', 'USD'],
    kdvOrani: 0.20,
    adetAlani: 'adet',
    durakAlani: 'durak_sayisi'
  },

  brands: [
    {
      id: 'arkel',
      name: 'Asia Otomasyon / ARCODE',
      products: [
        {
          id: 'arcode_pano_panoda',
          sku: 'ARC-PANO-PANODA',
          label: 'ARCODE Kumanda Panosu (panoda)',
          price: 185000,
          currency: 'TRY',
          prices: { TRY: 185000, EUR: 5200, USD: 5650 },
          unit: 'adet',
          match: { type: 'radio', name: 'kumanda_yer', value: 'panoda' }
        },
        {
          id: 'arcode_pano_kuyuda',
          sku: 'ARC-PANO-KUYU',
          label: 'ARCODE Kumanda (kuyu servis paneli)',
          price: 175000,
          unit: 'adet',
          match: { type: 'radio', name: 'kumanda_yer', value: 'kuyuda' }
        },
        {
          id: 'motor_vvvf',
          sku: 'ARC-MOT-VVVF',
          label: 'VVVF Asenkron motor paketi',
          price: 0,
          unit: 'adet',
          match: { type: 'radio', name: 'motor_tip', value: 'vvvf_asenkron' }
        },
        {
          id: 'motor_senkron',
          sku: 'ARC-MOT-SYN',
          label: 'Senkron motor paketi',
          price: 0,
          unit: 'adet',
          match: { type: 'radio', name: 'motor_tip', value: 'senkron' }
        },
        {
          id: 'grup_tek_buton',
          sku: 'ARC-GRUP-TEK',
          label: 'Grup kumanda � tek buton toplamal?',
          price: 12500,
          unit: 'adet',
          match: { type: 'radio', name: 'grup_kumanda', value: 'tek_buton' }
        },
        {
          id: 'grup_cift_buton',
          sku: 'ARC-GRUP-CIFT',
          label: 'Grup kumanda � �ift buton toplamal?',
          price: 18500,
          unit: 'adet',
          match: { type: 'radio', name: 'grup_kumanda', value: 'cift_buton' }
        },
        {
          id: 'ops_arem',
          sku: 'ARC-AREM',
          label: 'AREM (Uzaktan Eri?im Terminali)',
          price: 8500,
          unit: 'adet',
          match: { type: 'checkbox', name: 'ops', value: 'arem', qtyField: 'ops_arem_adet' }
        },
        {
          id: 'ops_cop',
          sku: 'ARC-COP-LOP',
          label: 'COP / LOP / LIP',
          price: 4200,
          unit: 'adet',
          match: { type: 'checkbox', name: 'ops', value: 'cop_lop_lip', qtyField: 'ops_cop_adet' }
        },
        {
          id: 'ops_paslanmaz',
          sku: 'ARC-PASLANMAZ',
          label: 'Paslanmaz kaplama pano',
          price: 15000,
          unit: 'adet',
          match: { type: 'checkbox', name: 'ops', value: 'paslanmaz' }
        },
        {
          id: 'ops_pano_sehpasi',
          sku: 'ARC-SEHPA',
          label: 'Pano sehpas?',
          price: 3200,
          unit: 'adet',
          match: { type: 'checkbox', name: 'ops', value: 'pano_sehpasi' }
        },
        {
          id: 'ops_paralel_16',
          sku: 'ARC-PARALEL',
          label: 'Kat/Kabin kaseti paralel tesisat (max 16 durak)',
          price: 9800,
          unit: 'adet',
          match: { type: 'checkbox', name: 'ops', value: 'paralel_16' }
        },
        {
          id: 'ops_canbus_arkel',
          sku: 'ARC-CANBUS-KASET',
          label: 'CANbus seri tesisat - kasetler Asia Otomasyon temini',
          price: 11000,
          unit: 'adet',
          match: { type: 'checkbox', name: 'ops', value: 'canbus_arkel' }
        },
        {
          id: 'ops_canbus_gosterge',
          sku: 'ARC-CANBUS-GOST',
          label: 'CANbus seri � yaln?zca g�sterge',
          price: 4500,
          unit: 'adet',
          match: { type: 'checkbox', name: 'ops', value: 'canbus_gosterge' }
        },
        {
          id: 'ops_gz_plus',
          sku: 'ARC-GZ-PLUS',
          label: 'G&Z Plus sesli anons ve m�zik',
          price: 7200,
          unit: 'adet',
          match: { type: 'checkbox', name: 'ops', value: 'gz_plus' }
        },
        {
          id: 'ops_sok_bobini',
          sku: 'ARC-SOK-BOBIN',
          label: 'AC giri? ?ok bobini',
          price: 1800,
          unit: 'adet',
          match: { type: 'checkbox', name: 'ops', value: 'sok_bobini' }
        },
        {
          id: 'ops_kuyu_aydinlatma',
          sku: 'ARC-KUYU-AYD',
          label: 'Kuyu ayd?nlatma',
          price: 2400,
          unit: 'adet',
          match: { type: 'checkbox', name: 'ops', value: 'kuyu_aydinlatma' }
        },
        {
          id: 'gosterge_d2xa_kat',
          sku: 'BC-D2XA-KAT',
          label: 'BC-D2XA g�sterge (kat)',
          price: 1850,
          unit: 'adet',
          match: { type: 'quantity', field: 'gosterge_d2xa_kat' }
        },
        {
          id: 'gosterge_d2xa_kabin',
          sku: 'BC-D2XA-KABIN',
          label: 'BC-D2XA g�sterge (kabin)',
          price: 1850,
          unit: 'adet',
          match: { type: 'quantity', field: 'gosterge_d2xa_kabin' }
        },
        {
          id: 'gosterge_d3xa_kat',
          sku: 'BC-D3XA-KAT',
          label: 'BC-D3XA g�sterge (kat)',
          price: 2100,
          unit: 'adet',
          match: { type: 'quantity', field: 'gosterge_d3xa_kat' }
        },
        {
          id: 'gosterge_d3xa_kabin',
          sku: 'BC-D3XA-KABIN',
          label: 'BC-D3XA g�sterge (kabin)',
          price: 2100,
          unit: 'adet',
          match: { type: 'quantity', field: 'gosterge_d3xa_kabin' }
        },
        {
          id: 'gosterge_lcda_kat',
          sku: 'BC-LCDA-KAT',
          label: 'BC-LCDA g�sterge (kat)',
          price: 3200,
          unit: 'adet',
          match: { type: 'quantity', field: 'gosterge_lcda_kat' }
        },
        {
          id: 'gosterge_lcda_kabin',
          sku: 'BC-LCDA-KABIN',
          label: 'BC-LCDA g�sterge (kabin)',
          price: 3200,
          unit: 'adet',
          match: { type: 'quantity', field: 'gosterge_lcda_kabin' }
        },
        {
          id: 'gosterge_lcd128_kat',
          sku: 'BC-LCD128-KAT',
          label: 'BC-LCD240x128 g�sterge (kat)',
          price: 4800,
          unit: 'adet',
          match: { type: 'quantity', field: 'gosterge_lcd128_kat' }
        },
        {
          id: 'gosterge_lcd128_kabin',
          sku: 'BC-LCD128-KABIN',
          label: 'BC-LCD240x128 g�sterge (kabin)',
          price: 4800,
          unit: 'adet',
          match: { type: 'quantity', field: 'gosterge_lcd128_kabin' }
        },
        {
          id: 'gosterge_liftmedia_kat',
          sku: 'LIFTMEDIA-KAT',
          label: 'LIFTMEDIA-S g�sterge (kat)',
          price: 12500,
          unit: 'adet',
          match: { type: 'quantity', field: 'gosterge_liftmedia_kat' }
        },
        {
          id: 'gosterge_liftmedia_kabin',
          sku: 'LIFTMEDIA-KABIN',
          label: 'LIFTMEDIA-S g�sterge (kabin)',
          price: 12500,
          unit: 'adet',
          match: { type: 'quantity', field: 'gosterge_liftmedia_kabin' }
        },
        {
          id: 'tesisat_kabin',
          sku: 'TES-KABIN',
          label: 'Kabin tesisat? (fleksib?l kablo)',
          price: 85,
          unit: 'm',
          match: { type: 'quantity', field: 'tesisat_kabin' }
        },
        {
          id: 'tesisat_extra_kabin',
          sku: 'TES-KABIN-EXT',
          label: 'Ekstra kabin tesisat?',
          price: 85,
          unit: 'm',
          match: { type: 'quantity', field: 'tesisat_extra_kabin' }
        },
        {
          id: 'tesisat_kuyu_dibi',
          sku: 'TES-KUYU-DIBI',
          label: 'Kuyu dibi tesisat?',
          price: 120,
          unit: 'm',
          match: { type: 'quantity', field: 'tesisat_kuyu_dibi' }
        },
        {
          id: 'tesisat_kanal',
          sku: 'TES-KANAL',
          label: 'Kablo kanal? 60x40 kapal?',
          price: 45,
          unit: 'm',
          match: { type: 'quantity', field: 'tesisat_kanal' }
        },
        {
          id: 'motor_ops_manuel_fren',
          sku: 'ARC-MFREN',
          label: 'Manuel fren a�t?rma',
          price: 3500,
          unit: 'adet',
          match: { type: 'checkbox', name: 'motor_ops', value: 'manuel_fren' }
        },
        {
          id: 'motor_ops_aktif',
          sku: 'ARC-AKTIF-SUR',
          label: 'Aktif motor s�rme',
          price: 8900,
          unit: 'adet',
          match: { type: 'checkbox', name: 'motor_ops', value: 'aktif_surme' }
        },
        {
          id: 'seviye_yenileme',
          sku: 'ARC-SEVIYE',
          label: 'Seviye yenileme',
          price: 5500,
          unit: 'adet',
          match: { type: 'radio', name: 'seviye_yenileme', value: 'evet' }
        },
        {
          id: 'kapi_erken_acma',
          sku: 'ARC-ERKEN-KAPI',
          label: 'Kap? erken a�ma',
          price: 4200,
          unit: 'adet',
          match: { type: 'radio', name: 'kapi_erken', value: 'evet' }
        }
      ]
    },

    /* ?kinci marka �rne?i � kendi �r�n listenizi buraya kopyalay?n */
    {
      id: 'ornek_marka',
      name: '�rnek Marka',
      products: [
        {
          id: 'ornek_urun_1',
          sku: 'ORN-001',
          label: '�rnek �r�n (formda e?le?tirme yap?lacak)',
          price: 1000,
          unit: 'adet',
          match: { type: 'checkbox', name: 'ops_p2', value: 'hoparlor' }
        }
      ]
    }
  ],

  /* Sayfa 2 � Butonyer �r�nleri (select alanlar?) */
  butonyerProducts: [
    {
      id: 'btn_kk2x3057',
      sku: 'KK2X3057',
      label: 'KK2X3057 (2x30 dotmatrix)',
      price: 2400,
      brandId: 'arkel',
      match: { type: 'selectValue', fields: ['btn_alarm', 'btn_stop', 'kabin_kaset_gosterge'], values: ['kk2x3057', '2x30'] }
    },
    {
      id: 'btn_kk3x3057',
      sku: 'KK3X3057',
      label: 'KK3X3057 (3x30 dotmatrix)',
      price: 2800,
      brandId: 'arkel',
      match: { type: 'selectValue', fields: ['btn_stop', 'btn_fan', 'kabin_kaset_gosterge'], values: ['kk3x3057', '3x30'] }
    },
    {
      id: 'btn_liftmedia',
      sku: 'LIFTMEDIA-KK',
      label: 'LIFTMEDIA kabin kaseti (5.7")',
      price: 14500,
      brandId: 'arkel',
      match: { type: 'selectValue', fields: ['btn_alarm', 'btn_fan', 'kabin_kaset_gosterge'], values: ['liftmedia'] }
    },
    {
      id: 'kapak_flexline',
      sku: 'KAPAK-FLEX',
      label: 'FLEXLINE kapak (1000 mm)',
      price: 1800,
      brandId: 'arkel',
      match: { type: 'checkbox', name: 'kapak', value: 'flexline' }
    },
    {
      id: 'kapak_hp',
      sku: 'KAPAK-HP',
      label: 'HP kapak (1000 mm)',
      price: 1650,
      brandId: 'arkel',
      match: { type: 'checkbox', name: 'kapak', value: 'hp' }
    },
    {
      id: 'ops_hoparlor',
      sku: 'OPS-HOP',
      label: 'M�zik yay?n? hoparl�r',
      price: 950,
      brandId: 'ornek_marka',
      match: { type: 'checkbox', name: 'ops_p2', value: 'hoparlor' }
    },
    {
      id: 'ops_acil_aydinlatma',
      sku: 'OPS-ACIL',
      label: 'Acil ayd?nlatma',
      price: 1200,
      brandId: 'arkel',
      match: { type: 'checkbox', name: 'ops_p2', value: 'acil_aydinlatma' }
    }
  ],

  /* Durak ba??na ek �cret (opsiyonel) */
  durakBasiUcret: {
    aktif: true,
    urunId: 'durak_basi_ek',
    label: 'Durak basi ek yapilandirma',
    pricePerFloor: 850,
    currency: 'TRY',
    minFloors: 2
  }
};
