<template>
  <div class="module-wrapper">
    <!-- CARD HEADER -->
    <div class="module-card" @click="toggleExpand">
      <div class="icon-box">
        <i class="fas fa-terminal"></i>
      </div>
      
      <div class="info-box">
        <div class="filename">{{ detectedFilename }}</div>
        <div class="file-desc">
          {{ detectedLang }} Source Code
        </div>
      </div>

      <div class="lang-badge">
        {{ detectedLang.toUpperCase() }}
      </div>
    </div>

    <!-- FOOTER -->
    <div class="module-footer" @click="toggleExpand">
      <div class="footer-left">
        <i :class="isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        {{ isExpanded ? 'Click to collapse' : 'Click to view source' }}
      </div>
      <div class="footer-right">DEVCORE :: MODULE</div>
    </div>

    <!-- CODE BODY (BISA SCROLL) -->
    <div v-show="isExpanded" class="code-view">
      <div class="code-actions">
        <span>{{ detectedLang }}</span>
        <!-- Tombol Copy dengan stop propagation agar tidak menutup card -->
        <button @click.stop="copyCode">
          <i class="fas" :class="copied ? 'fa-check' : 'fa-copy'"></i> {{ copied ? 'COPIED' : 'COPY' }}
        </button>
      </div>
      <!-- PRE AREA DENGAN SCROLL -->
      <div class="scroll-container">
        <pre><code>{{ cleanCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps(['content']);
const isExpanded = ref(true); 
const copied = ref(false);

const rawLang = computed(() => {
  const match = props.content.match(/^```(\w+)/);
  return match ? match[1] : 'txt';
});

const detectedLang = computed(() => {
  const map = { py: 'Python', js: 'JavaScript', html: 'HTML', css: 'CSS', sh: 'Shell', cpp: 'C++', c: 'C', php: 'PHP' };
  return map[rawLang.value] || rawLang.value.toUpperCase();
});

const detectedFilename = computed(() => {
  const map = { 
    py: 'script.py', js: 'main.js', html: 'index.html', css: 'style.css', 
    sh: 'install.sh', json: 'data.json', sql: 'query.sql', php: 'server.php'
  };
  return map[rawLang.value] || 'untitled.txt';
});

// Membersihkan backticks ``` agar hanya kode murni
const cleanCode = computed(() => {
  return props.content.replace(/^```\w*\n?/, '').replace(/```$/, '').trim();
});

const toggleExpand = () => isExpanded.value = !isExpanded.value;

// --- FUNGSI COPY YANG DIPERBAIKI (SUPPORT HTTP) ---
const copyCode = async () => {
  const textToCopy = cleanCode.value;

  try {
    // Cara 1: Modern API (Hanya jalan di HTTPS / Localhost)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
      triggerSuccess();
    } else {
      // Cara 2: Fallback (Jalan di HTTP biasa / IP Address)
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      
      // Sembunyikan textarea tapi pastikan tetap ada di DOM
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        triggerSuccess();
      } else {
        throw new Error('Fallback copy failed');
      }
    }
  } catch (err) {
    console.error('Copy failed:', err);
    alert('Gagal menyalin kode. Browser memblokir akses clipboard.');
  }
};

const triggerSuccess = () => {
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
};
</script>

<style scoped>
.module-wrapper { margin: 15px 0; width: 100%; max-width: 100%; font-family: 'Roboto', sans-serif; }

/* HEADER STYLE */
.module-card {
  background: linear-gradient(135deg, #0f172a 0%, #172554 100%);
  border-radius: 8px 8px 0 0;
  border: 1px solid #3b82f6;
  border-bottom: none;
  padding: 12px;
  display: flex; align-items: center; gap: 15px;
  cursor: pointer; transition: 0.3s;
}
.module-card:hover { filter: brightness(1.1); }

.icon-box {
  width: 35px; height: 35px; background: rgba(0,0,0,0.3); border-radius: 6px;
  display: flex; align-items: center; justify-content: center; color: #60a5fa;
}
.info-box { flex: 1; }
.filename { font-family: 'Press Start 2P'; font-size: 0.7rem; color: white; margin-bottom: 4px; }
.file-desc { font-size: 0.7rem; color: #94a3b8; }
.lang-badge { border: 1px solid #60a5fa; color: #60a5fa; padding: 2px 6px; font-size: 0.55rem; border-radius: 4px; }

/* FOOTER */
.module-footer {
  background: #020617; border: 1px solid #3b82f6; border-top: 1px solid rgba(59,130,246,0.3);
  padding: 6px 15px; display: flex; justify-content: space-between;
  font-size: 0.6rem; color: #64748b; cursor: pointer; font-weight: bold;
}

/* CODE VIEW AREA */
.code-view {
  background: #000; border: 1px solid #333; border-top: none; 
  border-radius: 0 0 8px 8px; overflow: hidden;
  animation: slideDown 0.3s ease-out;
}

.code-actions {
  background: #111; padding: 5px 10px; border-bottom: 1px solid #333;
  display: flex; justify-content: space-between; align-items: center;
}
.code-actions span { font-size: 0.7rem; color: #666; font-weight: bold; }
.code-actions button {
  background: #222; border: 1px solid #444; color: #ccc;
  font-size: 0.6rem; padding: 3px 8px; cursor: pointer; border-radius: 3px;
}
.code-actions button:hover { background: #333; color: white; }

/* SCROLL CONTAINER */
.scroll-container {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #3b82f6 #111;
}

pre { margin: 0; padding: 15px; color: #a5b4fc; font-family: 'Courier New', monospace; font-size: 0.85rem; line-height: 1.5; }

/* Custom Scrollbar */
.scroll-container::-webkit-scrollbar { width: 8px; height: 8px; }
.scroll-container::-webkit-scrollbar-track { background: #111; }
.scroll-container::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 4px; }

@keyframes slideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>
