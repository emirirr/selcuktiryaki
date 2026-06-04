/**
 * Form secimlerini katalog ile eslestirip fiyat hesaplar (coklu para birimi).
 */
(function (global) {
  'use strict';

  function parseNum(val) {
    if (val === '' || val == null) return 0;
    var n = parseFloat(String(val).replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }

  function urunParaBirimi(urun, meta) {
    if (urun.currency) return String(urun.currency).toUpperCase();
    return (meta.varsayilanUrunParaBirimi || meta.paraBirimi || 'TRY').toUpperCase();
  }

  function urunBirimFiyat(urun, meta, gosterimPara) {
    if (urun.prices && typeof urun.prices === 'object') {
      var kod = gosterimPara.toUpperCase();
      if (urun.prices[kod] != null) return { amount: urun.prices[kod], currency: kod, kaynak: 'sabit' };
      var varsayilan = urunParaBirimi(urun, meta);
      var tutar = urun.prices[varsayilan] != null ? urun.prices[varsayilan] : urun.price;
      return { amount: tutar, currency: varsayilan, kaynak: 'sabit' };
    }
    return { amount: urun.price, currency: urunParaBirimi(urun, meta), kaynak: 'tek' };
  }

  function FiyatMotoru(form, katalog, kurServisi) {
    this.form = form;
    this.katalog = katalog || global.UrunKatalogu;
    this.kur = kurServisi || global.kurServisi;
    this.gosterimPara = (katalog && katalog.meta && katalog.meta.varsayilanParaBirimi) || 'TRY';
  }

  FiyatMotoru.prototype.setGosterimPara = function (kod) {
    this.gosterimPara = (kod || 'TRY').toUpperCase();
  };

  FiyatMotoru.prototype.getFieldValue = function (name) {
    var el = this.form.elements[name];
    if (!el) return null;
    if (el.type === 'radio' || el.type === 'checkbox') {
      if (el.length) {
        for (var i = 0; i < el.length; i++) {
          if (el[i].checked) return el[i].value;
        }
        return null;
      }
      return el.checked ? el.value : null;
    }
    return el.value;
  };

  FiyatMotoru.prototype.isChecked = function (name, value) {
    var els = this.form.querySelectorAll('[name="' + name + '"]');
    for (var i = 0; i < els.length; i++) {
      if (els[i].type === 'checkbox' && els[i].value === value && els[i].checked) return true;
    }
    return false;
  };

  FiyatMotoru.prototype.isRadio = function (name, value) {
    var el = this.form.querySelector('[name="' + name + '"][value="' + value + '"]');
    return el && el.checked;
  };

  FiyatMotoru.prototype.getQty = function (qtyField, fallback) {
    if (!qtyField) return fallback || 1;
    var v = parseNum(this.getFieldValue(qtyField));
    return v > 0 ? v : (fallback || 1);
  };

  FiyatMotoru.prototype.matchProduct = function (product) {
    var m = product.match;
    if (!m) return null;

    if (m.type === 'radio') {
      if (!this.isRadio(m.name, m.value)) return null;
      return { qty: 1 };
    }

    if (m.type === 'checkbox') {
      if (!this.isChecked(m.name, m.value)) return null;
      return { qty: this.getQty(m.qtyField, 1) };
    }

    if (m.type === 'quantity') {
      var q = parseNum(this.getFieldValue(m.field));
      if (q <= 0) return null;
      return { qty: q };
    }

    if (m.type === 'select') {
      var sel = this.getFieldValue(m.field);
      if (sel !== m.value) return null;
      return { qty: 1 };
    }

    if (m.type === 'selectValue') {
      var fields = m.fields || [];
      var values = m.values || [];
      for (var i = 0; i < fields.length; i++) {
        var v = this.getFieldValue(fields[i]);
        if (v && values.indexOf(v) !== -1) return { qty: 1, viaField: fields[i] };
      }
      return null;
    }

    return null;
  };

  FiyatMotoru.prototype._fiyatDonustur = function (ham, meta) {
    var gosterim = this.gosterimPara;
    var pb = urunBirimFiyat({ price: ham.amount, prices: ham.prices, currency: ham.currency }, meta, gosterim);

    if (pb.amount == null || pb.amount === 0) {
      return { unitPrice: 0, fiyatYok: true, kaynakPb: pb.currency };
    }

    var tutar = pb.amount;
    if (pb.prices && pb.prices[gosterim] != null) {
      tutar = pb.prices[gosterim];
    } else if (this.kur && pb.currency !== gosterim) {
      tutar = this.kur.cevir(pb.amount, pb.currency, gosterim);
    }

    return { unitPrice: tutar, fiyatYok: false, kaynakPb: pb.currency };
  };

  FiyatMotoru.prototype.hesapla = function () {
    var k = this.katalog;
    var meta = k.meta || {};
    var satirlar = [];
    var eklenenId = {};
    var adetCarpan = parseNum(this.getFieldValue(meta.adetAlani || 'adet')) || 1;
    if (adetCarpan < 1) adetCarpan = 1;
    var durak = parseNum(this.getFieldValue(meta.durakAlani || 'durak_sayisi'));
    var gosterim = this.gosterimPara;
    var self = this;

    function ekleSatir(urun, qty, markaAdi) {
      if (eklenenId[urun.id]) return;
      eklenenId[urun.id] = true;

      var pb = urunBirimFiyat(urun, meta, gosterim);
      var fiyatYok = pb.amount == null || pb.amount === 0;
      var unitPrice = 0;

      if (!fiyatYok) {
        if (urun.prices && urun.prices[gosterim] != null) {
          unitPrice = urun.prices[gosterim];
        } else if (self.kur && pb.currency !== gosterim) {
          unitPrice = self.kur.cevir(pb.amount, pb.currency, gosterim);
        } else {
          unitPrice = pb.amount;
        }
      }

      satirlar.push({
        id: urun.id,
        sku: urun.sku,
        marka: markaAdi,
        label: urun.label,
        qty: qty,
        unit: urun.unit || 'adet',
        unitPrice: unitPrice,
        lineTotal: fiyatYok ? 0 : unitPrice * qty,
        fiyatYok: fiyatYok,
        kaynakPara: pb.currency,
        gosterimPara: gosterim
      });
    }

    (k.brands || []).forEach(function (brand) {
      (brand.products || []).forEach(function (urun) {
        var hit = self.matchProduct(urun);
        if (hit) ekleSatir(urun, hit.qty, brand.name);
      });
    });

    (k.butonyerProducts || []).forEach(function (urun) {
      var hit = self.matchProduct(urun);
      if (!hit) return;
      var markaAdi = urun.brandId;
      (k.brands || []).forEach(function (b) {
        if (b.id === urun.brandId) markaAdi = b.name;
      });
      ekleSatir(urun, hit.qty, markaAdi);
    });

    if (k.durakBasiUcret && k.durakBasiUcret.aktif && durak >= (k.durakBasiUcret.minFloors || 2)) {
      var db = k.durakBasiUcret;
      var pbDb = urunBirimFiyat(
        { price: db.pricePerFloor, prices: db.prices, currency: db.currency },
        meta,
        gosterim
      );
      var fiyatYokDb = !pbDb.amount;
      var unitDb = fiyatYokDb ? 0 : (
        db.prices && db.prices[gosterim] != null
          ? db.prices[gosterim]
          : (self.kur && pbDb.currency !== gosterim
            ? self.kur.cevir(pbDb.amount, pbDb.currency, gosterim)
            : pbDb.amount)
      );
      satirlar.push({
        id: db.urunId || 'durak_basi',
        sku: 'DURAK-EK',
        marka: 'Hesaplama',
        label: db.label + ' (' + durak + ' durak)',
        qty: durak,
        unit: 'durak',
        unitPrice: unitDb,
        lineTotal: unitDb * durak,
        fiyatYok: fiyatYokDb,
        kaynakPara: pbDb.currency,
        gosterimPara: gosterim
      });
    }

    var araToplam = 0;
    var fiyatsizSay = 0;
    satirlar.forEach(function (s) {
      if (s.fiyatYok) fiyatsizSay++;
      else araToplam += s.lineTotal;
    });

    var tekAsansor = araToplam;
    araToplam = araToplam * adetCarpan;
    var kdvOrani = meta.kdvOrani != null ? meta.kdvOrani : 0.2;
    var kdv = araToplam * kdvOrani;
    var genelToplam = araToplam + kdv;

    return {
      satirlar: satirlar,
      adetCarpan: adetCarpan,
      durak: durak,
      araToplam: araToplam,
      tekAsansorAraToplam: tekAsansor,
      kdvOrani: kdvOrani,
      kdv: kdv,
      genelToplam: genelToplam,
      fiyatsizSay: fiyatsizSay,
      paraBirimi: gosterim
    };
  };

  global.FiyatMotoru = FiyatMotoru;
})(window);
