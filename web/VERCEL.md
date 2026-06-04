# Vercel ile yay?n

## Proje ayar? (önemli)

Vercel’de **Root Directory** = `dökümanlar` olmal?.

Repo kökünden deploy ederseniz form `…/dökümanlar/arcode-siparis-formu.html` alt?nda kal?r ve `/api/kurlar` çal??maz.

## Ad?mlar

1. Projeyi GitHub’a push edin.
2. [vercel.com](https://vercel.com) ? **Add New Project** ? repoyu seçin.
3. **Root Directory** ? `dökümanlar` ? Deploy.
4. Aç?l?? adresi: `https://<proje>.vercel.app/` (otomatik forma yönlendirir).

## Ne çal???r

| Özellik | Vercel |
|--------|--------|
| Form (HTML/JS/CSS) | Evet |
| Logolar (PNG) | Evet |
| TCMB canl? kur `/api/kurlar` | Evet (serverless) |
| Yazd?r / PDF | Evet (taray?c?) |

PDF ar?iv dosyalar? `.vercelignore` ile yüklenmez (form için gerekmez).

## Yerel test

```bash
cd dökümanlar
npm start
```

Taray?c?: http://localhost:3789/arcode-siparis-formu.html

## Sorun giderme

- **Kur yüklenmiyor:** Sayfay? `file://` ile de?il, Vercel veya `npm start` URL’si ile aç?n.
- **404 /api/kurlar:** Root Directory `dökümanlar` de?ilse düzeltin ve yeniden deploy edin.
- **Bozuk Türkçe:** Taray?c?da Ctrl+F5 (önbellek temizle).
