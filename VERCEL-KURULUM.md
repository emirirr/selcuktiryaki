# Vercel 404 cozumu

## Ayar (onemli)

Vercel → Project → **Settings** → **General** → **Root Directory**

| Deger | Sonuc |
|-------|--------|
| `web` | Onerilen — form `https://xxx.vercel.app/` adresinde acilir |
| Bos / `.` | Kök `vercel.json` ile calisir |
| `dökümanlar` | **404 verir** — silin, `web` yapin |

Kaydettikten sonra **Deployments** → son deploy → **Redeploy**.

## Build ayarlari

- Framework Preset: **Other**
- Build Command: bos
- Output Directory: bos
- Install Command: bos

## Test

- `https://PROJE.vercel.app/`
- `https://PROJE.vercel.app/api/kurlar` → JSON (TCMB kurlari)
