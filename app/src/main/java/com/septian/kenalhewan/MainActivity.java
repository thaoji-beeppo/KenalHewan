package com.septian.kenalhewan;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.Locale;
import java.util.Set;

public class MainActivity extends Activity {

    private WebView web;
    private TextToSpeech tts;
    private boolean ttsReady = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#7fd3ff"));
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setHapticFeedbackEnabled(false);
        web.setLongClickable(false);
        web.setOnLongClickListener(v -> true);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(true);
        s.setTextZoom(100);

        web.setWebViewClient(new WebViewClient());
        web.addJavascriptInterface(new Bridge(), "Android");
        setContentView(web);
        web.loadUrl("file:///android_asset/index.html");

        tts = new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS) {
                int r = tts.setLanguage(new Locale("id", "ID"));
                if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) {
                    tts.setLanguage(new Locale("in", "ID"));
                }
                pickBestVoice();
                tts.setSpeechRate(0.9f);
                tts.setPitch(1.08f);
                ttsReady = true;
            }
        });

        hideBars();
    }

    // Pilih suara Indonesia dengan kualitas paling bagus yang ada di HP.
    // Suara offline diutamakan; suara online (lebih natural) dipakai kalau tidak ada yang offline bagus.
    private void pickBestVoice() {
        try {
            Set<Voice> voices = tts.getVoices();
            if (voices == null) return;
            Voice best = null;
            int bestScore = -1;
            for (Voice v : voices) {
                Locale l = v.getLocale();
                String lang = l.getLanguage();
                if (!"id".equals(lang) && !"in".equals(lang) && !"ind".equals(lang)) continue;
                if (v.getFeatures() != null && v.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED)) continue;
                int score = v.getQuality();               // 100..500
                if (!v.isNetworkConnectionRequired()) score += 150;
                if (score > bestScore) { bestScore = score; best = v; }
            }
            if (best != null) tts.setVoice(best);
        } catch (Exception ignored) { }
    }

    private void hideBars() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideBars();
    }

    // Tombol back tidak menutup aplikasi (biar anak nggak keluar tanpa sengaja).
    // Di dalam game, back = kembali ke beranda. Untuk keluar: tahan tombol gembok 2 detik.
    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.onBack && window.onBack()", null);
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (tts != null) tts.stop();
        web.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
        hideBars();
    }

    @Override
    protected void onDestroy() {
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        web.destroy();
        super.onDestroy();
    }

    private class Bridge {
        @JavascriptInterface
        public void speak(String text) {
            if (!ttsReady || text == null) return;
            // Tanda "|" = jeda kecil, biar ngomongnya ada napas kayak orang tua bercerita
            String[] parts = text.split("\\|");
            tts.stop();
            for (int i = 0; i < parts.length; i++) {
                String p = parts[i].trim();
                if (p.isEmpty()) continue;
                if (i > 0) tts.playSilentUtterance(350, TextToSpeech.QUEUE_ADD, "jeda" + i);
                tts.speak(p, TextToSpeech.QUEUE_ADD, null, "kh" + i);
            }
        }

        @JavascriptInterface
        public void stop() {
            if (tts != null) tts.stop();
        }

        @JavascriptInterface
        public void vibrate(int ms) {
            Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            if (Build.VERSION.SDK_INT >= 26) {
                v.vibrate(VibrationEffect.createOneShot(Math.max(10, Math.min(ms, 300)), VibrationEffect.DEFAULT_AMPLITUDE));
            }
        }

        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(MainActivity.this::finish);
        }
    }
}
