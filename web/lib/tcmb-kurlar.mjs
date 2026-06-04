import https from 'https';

const TCMB_URL = 'https://www.tcmb.gov.tr/kurlar/today.xml';
const CACHE_MS = 30 * 60 * 1000;

let kurCache = null;

export function fetchTcmbXml() {
  return new Promise(function (resolve, reject) {
    https.get(TCMB_URL, { headers: { 'User-Agent': 'AsiaOtomasyon-Kur/1.0' } }, function (res) {
      if (res.statusCode !== 200) {
        reject(new Error('TCMB HTTP ' + res.statusCode));
        return;
      }
      var chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () {
        resolve(Buffer.concat(chunks).toString('utf8'));
      });
    }).on('error', reject);
  });
}

export function parseTcmbXml(xml) {
  var tarihMatch = xml.match(/<Tarih_Date[^>]*\sTarih="([^"]+)"/);
  var bultenMatch = xml.match(/Bulten_No="([^"]+)"/);

  function tryKur(kod) {
    var blockRe = new RegExp('<Currency[^>]*Kod="' + kod + '"[\\s\\S]*?</Currency>', 'i');
    var block = xml.match(blockRe);
    if (!block) return null;
    var unitM = block[0].match(/<Unit>([\d.]+)<\/Unit>/);
    var sellM = block[0].match(/<ForexSelling>([\d.]+)<\/ForexSelling>/)
      || block[0].match(/<BanknoteSelling>([\d.]+)<\/BanknoteSelling>/);
    if (!sellM) return null;
    var unit = unitM ? parseFloat(unitM[1]) : 1;
    return parseFloat(sellM[1]) / unit;
  }

  var usd = tryKur('USD');
  var eur = tryKur('EUR');
  if (!usd || !eur) throw new Error('TCMB XML: USD/EUR bulunamadi');

  return {
    kaynak: 'TCMB',
    tip: 'ForexSelling',
    tarih: tarihMatch ? tarihMatch[1] : null,
    bultenNo: bultenMatch ? bultenMatch[1] : null,
    tryPerUnit: { TRY: 1, USD: usd, EUR: eur },
    guncelleme: new Date().toISOString()
  };
}

export async function getKurlar() {
  if (kurCache && Date.now() - kurCache.ts < CACHE_MS) {
    return kurCache.data;
  }
  var xml = await fetchTcmbXml();
  var data = parseTcmbXml(xml);
  kurCache = { ts: Date.now(), data: data };
  return data;
}
