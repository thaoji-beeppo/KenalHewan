"""
Membuat rekaman narator lewat API ElevenLabs untuk semua kalimat di data.js,
disimpan ke app/src/main/assets/narasi_manual/<kunci>.mp3

Env:
  ELEVENLABS_API_KEY   (wajib)  API key ElevenLabs
  ELEVENLABS_VOICE_ID  (wajib)  Voice ID suara buatanmu (Voice Design)
  BATAS                (opsional) maksimal kalimat yang dibuat kali ini, 0 = semua
  MODEL                (opsional) default eleven_multilingual_v2

Kalimat yang sudah punya rekaman dilewati, jadi kuota tidak terpakai dua kali.
"""
import json, os, subprocess, sys, time, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "app", "src", "main", "assets", "narasi_manual")
KEY = os.environ.get("ELEVENLABS_API_KEY", "").strip()
VOICE = os.environ.get("ELEVENLABS_VOICE_ID", "").strip()
MODEL = os.environ.get("MODEL", "eleven_multilingual_v2")
try:
    BATAS = int(os.environ.get("BATAS", "0") or 0)
except ValueError:
    BATAS = 0

if not KEY or not VOICE:
    sys.exit("ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID belum diisi di GitHub Secrets.")

lines = json.loads(subprocess.check_output(["node", os.path.join(ROOT, "tools", "lines.js")]))
os.makedirs(OUT, exist_ok=True)
todo = [l for l in lines if not os.path.exists(os.path.join(OUT, l["key"] + ".mp3"))]
if BATAS > 0:
    todo = todo[:BATAS]
chars = sum(len(l["text"]) for l in todo)
print(f"Sudah ada: {len(lines) - len([l for l in lines if not os.path.exists(os.path.join(OUT, l['key'] + '.mp3'))])}/{len(lines)}")
print(f"Akan dibuat: {len(todo)} kalimat, ±{chars} huruf (perkiraan kredit)")

url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128"
settings = {"stability": 0.4, "similarity_boost": 0.75, "style": 0.3, "use_speaker_boost": True}
ok = 0
for i, l in enumerate(todo, 1):
    body = json.dumps({"text": l["text"], "model_id": MODEL, "voice_settings": settings}).encode()
    for attempt in range(5):
        req = urllib.request.Request(url, data=body, method="POST", headers={
            "xi-api-key": KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
            with open(os.path.join(OUT, l["key"] + ".mp3"), "wb") as f:
                f.write(data)
            ok += 1
            print(f"[{i}/{len(todo)}] {l['key']}: {l['text']}")
            break
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="ignore")[:300]
            if e.code == 429:              # terlalu cepat, tunggu sebentar
                time.sleep(5 + attempt * 5)
                continue
            print(f"BERHENTI di {l['key']} (HTTP {e.code}): {msg}")
            if "quota" in msg.lower():
                print("Kuota bulan ini habis. Sisanya otomatis pakai suara cadangan; lanjutkan bulan depan.")
            print(f"Berhasil dibuat: {ok}")
            sys.exit(0)                     # tetap simpan yang sudah jadi
        except Exception as e:  # noqa
            time.sleep(3 + attempt * 3)
    time.sleep(0.4)

print(f"Selesai. Berhasil dibuat: {ok}/{len(todo)}")
