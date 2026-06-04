/**
 * Formu dinler, TCMB kur servisi ile fiyat panelini gunceller.
 */
(function () {
  'use strict';

  var form = document.getElementById('arcodeForm');
  if (!form || !window.UrunKatalogu || !window.FiyatMotoru) return;

  var katalog = window.UrunKatalogu;
  var kur = window.kurServisi;
  var motor = new FiyatMotoru(form, katalog, kur);

  var paraSelect = document.getElementById('fiyat-para-birimi');
  var kurBilgi = document.getElementById('fiyat-kur-bilgi');
  var kurDurum = document.getElementById('fiyat-kur-durum');
  var kurYenileBtn = document.getElementById('fiyat-kur-yenile');
  var kurUyari = document.getElementById('fiyat-kur-uyari');
  var listeEl = document.getElementById('fiyat-satirlar');
  var araEl = document.getElementById('fiyat-ara');
  var kdvEl = document.getElementById('fiyat-kdv');
  var topEl = document.getElementById('fiyat-toplam');
  var adetBilgi = document.getElementById('fiyat-adet-bilgi');
  var uyariEl = document.getElementById('fiyat-uyari');
  var bosEl = document.getElementById('fiyat-bos');

  var PARA_ETIKET = { TRY: 'TL', EUR: 'EUR', USD: 'USD' };

  function gosterimPara() {
    return paraSelect ? paraSelect.value : (katalog.meta.varsayilanParaBirimi || 'TRY');
  }

  function formatPara(tutar, kod) {
    if (tutar == null || isNaN(tutar)) return '-';
    kod = (kod || 'TRY').toUpperCase();
    try {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: kod,
        maximumFractionDigits: kod === 'TRY' ? 0 : 2
      }).format(tutar);
    } catch (e) {
      return tutar.toFixed(2) + ' ' + (PARA_ETIKET[kod] || kod);
    }
  }

  function kurPanelGuncelle() {
    if (!kur) return;
    if (kurBilgi) kurBilgi.textContent = kur.kurMetni();
    if (kurDurum) {
      kurDurum.textContent = kur.guncellemeMetni();
      kurDurum.classList.toggle('fiyat-kur-durum--hata', !!(kur.hata || kur.sunucuGerekliMi()));
    }
    if (kurUyari) kurUyari.hidden = !(kur.hata || kur.sunucuGerekliMi());
    if (kurYenileBtn) kurYenileBtn.disabled = kur.yukleniyor;
  }

  function guncelle() {
    motor.setGosterimPara(gosterimPara());
    var sonuc = motor.hesapla();
    var pb = sonuc.paraBirimi;

    if (sonuc.satirlar.length === 0) {
      if (bosEl) bosEl.hidden = false;
      if (listeEl) listeEl.innerHTML = '';
      if (araEl) araEl.textContent = formatPara(0, pb);
      if (kdvEl) kdvEl.textContent = formatPara(0, pb);
      if (topEl) topEl.textContent = formatPara(0, pb);
      if (adetBilgi) adetBilgi.textContent = '';
      if (uyariEl) uyariEl.hidden = true;
      return;
    }

    if (bosEl) bosEl.hidden = true;

    var html = '';
    sonuc.satirlar.forEach(function (s) {
      var tutarText = s.fiyatYok
        ? '<span class="fiyat-teklif">Teklif gerekli</span>'
        : formatPara(s.lineTotal, pb);
      var birimText = s.fiyatYok ? '-' : formatPara(s.unitPrice, pb);
      var kurNot = '';
      if (!s.fiyatYok && s.kaynakPara && s.kaynakPara !== pb) {
        kurNot = ' <span class="fiyat-kaynak-pb">(' + s.kaynakPara + ')</span>';
      }
      html += '<li class="fiyat-satir' + (s.fiyatYok ? ' fiyat-satir--eksik' : '') + '">' +
        '<div class="fiyat-satir-ust">' +
        '<span class="fiyat-marka">' + escapeHtml(s.marka) + '</span>' +
        '<span class="fiyat-tutar">' + tutarText + '</span>' +
        '</div>' +
        '<div class="fiyat-satir-ad">' + escapeHtml(s.label) + '</div>' +
        '<div class="fiyat-satir-detay">' +
        escapeHtml(s.qty + ' ' + s.unit) + ' x ' + birimText + kurNot +
        (s.sku ? ' · ' + escapeHtml(s.sku) : '') +
        '</div></li>';
    });
    if (listeEl) listeEl.innerHTML = html;

    if (araEl) araEl.textContent = formatPara(sonuc.araToplam, pb);
    if (kdvEl) {
      kdvEl.textContent = formatPara(sonuc.kdv, pb);
      var lbl = kdvEl.parentElement && kdvEl.parentElement.querySelector('.fiyat-ozet-label');
      if (lbl) lbl.textContent = 'KDV (%' + Math.round(sonuc.kdvOrani * 100) + ')';
    }
    if (topEl) topEl.textContent = formatPara(sonuc.genelToplam, pb);

    if (adetBilgi) {
      var parca = [];
      if (sonuc.adetCarpan > 1) {
        parca.push(sonuc.adetCarpan + ' asansör x ' + formatPara(sonuc.tekAsansorAraToplam, pb));
      }
      if (sonuc.durak > 0) parca.push(sonuc.durak + ' durak');
      parca.push('Gösterim: ' + (PARA_ETIKET[pb] || pb));
      adetBilgi.textContent = parca.join(' · ');
    }

    if (uyariEl) {
      uyariEl.hidden = sonuc.fiyatsizSay === 0;
      if (!uyariEl.hidden) {
        uyariEl.textContent = sonuc.fiyatsizSay + ' kalemde fiyat tan?ml? de?il; teklif ile tamamlanacak.';
      }
    }
  }

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  if (paraSelect) {
    paraSelect.addEventListener('change', function () {
      guncelle();
      kurPanelGuncelle();
    });
  }

  if (kurYenileBtn && kur) {
    kurYenileBtn.addEventListener('click', function () {
      kur.yenile();
    });
  }

  if (kur) {
    kur.onChange(function () {
      kurPanelGuncelle();
      guncelle();
    });
    kur.baslat();
  } else {
    guncelle();
  }

  form.addEventListener('input', guncelle);
  form.addEventListener('change', guncelle);
  kurPanelGuncelle();
  guncelle();
})();
