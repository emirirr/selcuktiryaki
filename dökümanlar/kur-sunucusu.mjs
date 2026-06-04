/**
 * Yerel gelistirme: statik dosya + /api/kurlar
 * Kullanim: node kur-sunucusu.mjs
 * Acin: http://localhost:3789/arcode-siparis-formu.html
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getKurlar } from './lib/tcmb-kurlar.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3789;

var MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf'
};

function sendJson(res, code, obj) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(obj));
}

function sendFile(res, filePath) {
  var ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

var server = http.createServer(async function (req, res) {
  var url = req.url.split('?')[0];

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (url === '/api/kurlar') {
    try {
      var data = await getKurlar();
      sendJson(res, 200, data);
    } catch (e) {
      sendJson(res, 502, { error: e.message || 'TCMB alinamadi' });
    }
    return;
  }

  if (url === '/' || url === '') {
    res.writeHead(302, { Location: '/arcode-siparis-formu.html' });
    res.end();
    return;
  }

  var safePath = path.normalize(url).replace(/^(\.\.[/\\])+/, '');
  var filePath = path.join(__dirname, safePath);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  sendFile(res, filePath);
});

server.listen(PORT, function () {
  console.log('');
  console.log('  TCMB kur sunucusu calisiyor');
  console.log('  Form: http://localhost:' + PORT + '/arcode-siparis-formu.html');
  console.log('  API:  http://localhost:' + PORT + '/api/kurlar');
  console.log('');
  getKurlar().then(function (k) {
    console.log('  TCMB', k.tarih, '- 1 USD =', k.tryPerUnit.USD, 'TL - 1 EUR =', k.tryPerUnit.EUR, 'TL');
  }).catch(function (e) {
    console.warn('  Ilk kur cekimi basarisiz:', e.message);
  });
});
