/**
 * Canli doviz kurlari — TCMB (Merkez Bankasi)
 * Tarayicidan TCMB'ye dogrudan istek CORS nedeniyle engellenir;
 * kur-sunucusu.mjs ile yerel API kullanilir.
 */
(function (global) {
  'use strict';

  var PARA_BIRIMLERI = ['TRY', 'EUR', 'USD'];
  var CACHE_KEY = 'asia_otomasyon_tcmb_kurlar';
  var CACHE_TTL_MS = 30 * 60 * 1000;

  var API_YOLLARI = [
    '/api/kurlar',
    'http://localhost:3789/api/kurlar',
    'http://127.0.0.1:3789/api/kurlar'
  ];

  var FALLBACK_TRY_PER_UNIT = { TRY: 1, USD: 45.92, EUR: 53.48 };

  function KurServisi() {
    this.rates = { TRY: 1, USD: 0.02177, EUR: 0.01869 };
    this.tryPerUnit = Object.assign({}, FALLBACK_TRY_PER_UNIT);
    this.kaynak = 'Varsayilan';
    this.tcmbTarih = null;
    this.yukleniyor = false;
    this.sonGuncelleme = null;
    this.hata = null;
    this.aktifApi = null;
    this._listeners = [];
    this._tryPerUnitToRates();
  }

  KurServisi.prototype._tryPerUnitToRates = function () {
    this.rates.TRY = 1;
    this.rates.USD = this.tryPerUnit.USD ? 1 / this.tryPerUnit.USD : 0.022;
    this.rates.EUR = this.tryPerUnit.EUR ? 1 / this.tryPerUnit.EUR : 0.019;
  };

  KurServisi.prototype.onChange = function (fn) {
    this._listeners.push(fn);
  };

  KurServisi.prototype._bildir = function () {
    var self = this;
    this._listeners.forEach(function (fn) {
      try { fn(self); } catch (e) { console.error(e); }
    });
  };

  KurServisi.prototype._cacheOku = function () {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      if (Date.now() - data.ts > CACHE_TTL_MS) return false;
      this._uygulaTcmbData(data.payload, true);
      this.sonGuncelleme = new Date(data.ts);
      return true;
    } catch (e) {
      return false;
    }
  };

  KurServisi.prototype._cacheYaz = function () {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        ts: Date.now(),
        payload: {
          kaynak: this.kaynak,
          tarih: this.tcmbTarih,
          tryPerUnit: this.tryPerUnit,
          aktifApi: this.aktifApi
        }
      }));
    } catch (e) { /* ignore */ }
  };

  KurServisi.prototype._uygulaTcmbData = function (data, fromCache) {
    if (!data || !data.tryPerUnit) return;
    this.tryPerUnit.TRY = 1;
    if (data.tryPerUnit.USD) this.tryPerUnit.USD = data.tryPerUnit.USD;
    if (data.tryPerUnit.EUR) this.tryPerUnit.EUR = data.tryPerUnit.EUR;
    this._tryPerUnitToRates();
    this.kaynak = data.kaynak || 'TCMB';
    this.tcmbTarih = data.tarih || null;
    this.aktifApi = data.aktifApi || null;
    if (!fromCache) this.sonGuncelleme = new Date();
    this.hata = null;
  };

  KurServisi.prototype._fetchApi = function (url) {
    return fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    }).then(function (res) {
      if (!res.ok) throw new Error('API ' + res.status);
      return res.json();
    }).then(function (data) {
      if (data.error) throw new Error(data.error);
      if (!data.tryPerUnit || !data.tryPerUnit.USD) throw new Error('Gecersiz kur verisi');
      data.aktifApi = url;
      return data;
    });
  };

  KurServisi.prototype._tcmbdenCek = function () {
    var self = this;
    var chain = Promise.reject(new Error('basla'));

    API_YOLLARI.forEach(function (apiUrl) {
      chain = chain.catch(function () {
        return self._fetchApi(apiUrl);
      });
    });

    return chain;
  };

  KurServisi.prototype.cevir = function (tutar, kaynak, hedef) {
    if (tutar == null || isNaN(tutar)) return 0;
    kaynak = (kaynak || 'TRY').toUpperCase();
    hedef = (hedef || 'TRY').toUpperCase();
    if (kaynak === hedef) return tutar;

    var tryTutar = tutar;
    if (kaynak !== 'TRY') {
      var tlPerUnit = this.tryPerUnit[kaynak];
      if (!tlPerUnit) return tutar;
      tryTutar = tutar * tlPerUnit;
    }

    if (hedef === 'TRY') return tryTutar;
    var tlPerHedef = this.tryPerUnit[hedef];
    if (!tlPerHedef) return tryTutar;
    return tryTutar / tlPerHedef;
  };

  KurServisi.prototype.kurMetni = function () {
    var usd = this.tryPerUnit.USD ? this.tryPerUnit.USD.toFixed(4) : '-';
    var eur = this.tryPerUnit.EUR ? this.tryPerUnit.EUR.toFixed(4) : '-';
    var kaynak = this.kaynak === 'TCMB' ? 'TCMB D\u00f6viz Sat\u0131\u015f' : this.kaynak;
    var tarih = this.tcmbTarih ? ' \u00b7 ' + this.tcmbTarih : '';
    return kaynak + tarih + ' \u00b7 1 USD = ' + usd + ' TL \u00b7 1 EUR = ' + eur + ' TL';
  };

  KurServisi.prototype.guncellemeMetni = function () {
    if (this.yukleniyor) return 'TCMB kurlar\u0131 y\u00fckleniyor...';
    if (this.hata) return this.hata;
    if (!this.sonGuncelleme) return 'Kur sunucusu bekleniyor';
    var saat = this.sonGuncelleme.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    return 'G\u00fcncellendi: ' + saat + (this.kaynak === 'TCMB' ? ' (TCMB canl\u0131)' : '');
  };

  KurServisi.prototype.sunucuGerekliMi = function () {
    return !!this.hata && this.kaynak !== 'TCMB';
  };

  KurServisi.prototype.yenile = function () {
    var self = this;
    if (self.yukleniyor) return Promise.resolve(self);

    self.yukleniyor = true;
    self.hata = null;
    self._bildir();

    return self._tcmbdenCek()
      .then(function (data) {
        self._uygulaTcmbData(data, false);
        self._cacheYaz();
        self._bildir();
        return self;
      })
      .catch(function (err) {
        self.hata = 'TCMB ba\u011flant\u0131s\u0131 yok. Terminalde: node kur-sunucusu.mjs';
        if (!self.sonGuncelleme) {
          self.tryPerUnit = Object.assign({}, FALLBACK_TRY_PER_UNIT);
          self._tryPerUnitToRates();
          self.kaynak = 'Varsay\u0131lan';
        }
        console.warn('[KurServisi]', err.message || err);
        self._bildir();
        return self;
      })
      .finally(function () {
        self.yukleniyor = false;
        self._bildir();
      });
  };

  KurServisi.prototype.baslat = function () {
    var self = this;
    if (this._cacheOku()) {
      this._bildir();
    }
    return this.yenile().then(function () {
      setInterval(function () {
        if (!self.yukleniyor) self.yenile();
      }, CACHE_TTL_MS);
      return self;
    });
  };

  KurServisi.PARA_BIRIMLERI = PARA_BIRIMLERI;
  global.KurServisi = KurServisi;
  global.kurServisi = new KurServisi();
})(window);
