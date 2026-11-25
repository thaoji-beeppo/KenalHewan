"""
Membuat rekaman suara narator (wanita, bahasa Indonesia, neural) untuk semua kalimat di data.js.
Dijalankan otomatis oleh GitHub Actions sebelum build APK.

Ganti suara lewat env VOICE, contoh:
  id-ID-GadisNeural  (wanita, default)
  id-ID-ArdiNeural   (pria)
Atur gaya lewat env RATE (default -8%) dan PITCH (default +6Hz).
"""
import asyncio, json, os, subprocess, sys

import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "app", "src", "main", "assets", "narasi")
VOICE = os.environ.get("VOICE", "id-ID-GadisNeural")
RATE = os.environ.get("RATE", "-8%")
PITCH = os.environ.get("PITCH", "+6Hz")

lines = json.loads(subprocess.check_output(["node", os.path.join(ROOT, "tools", "lines.js")]))
os.makedirs(OUT, exist_ok=True)
sem = asyncio.Semaphore(6)
failed = []


MANUAL = os.path.join(ROOT, "app", "src", "main", "assets", "narasi_manual")


async def one(key, text):
    if os.path.exists(os.path.join(MANUAL, key + ".mp3")):
        return  # sudah ada rekaman manual (mis. ElevenLabs), tidak perlu dibuat
    path = os.path.join(OUT, key + ".mp3")
    if os.path.exists(path) and os.path.getsize(path) > 1000:
        return
    async with sem:
        for attempt in range(5):
            try:
                await edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH).save(path)
                if os.path.getsize(path) > 1000:
                    return
            except Exception as e:  # noqa
                err = e
            await asyncio.sleep(2 + attempt * 3)
        failed.append(key)
        if os.path.exists(path):
            os.remove(path)


async def main():
    await asyncio.gather(*(one(l["key"], l["text"]) for l in lines))


asyncio.run(main())
print(f"Narasi: {len(lines) - len(failed)}/{len(lines)} berhasil, suara {VOICE}")
if failed:
    print("Gagal (akan pakai TTS HP):", ", ".join(failed[:30]), file=sys.stderr)
