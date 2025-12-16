<template>
  <div class="layout-wrapper">
    <!-- SIDEBAR (Sama seperti sebelumnya) -->
    <div class="sidebar" :class="{ 'collapsed': !showSidebar }">
      <div class="sidebar-header">
        <span v-if="showSidebar" class="retro-font" style="font-size:0.7rem">SESSIONS</span>
        <button v-if="showSidebar" @click="showSidebar = false" class="btn-icon"><i class="fas fa-chevron-left"></i></button>
      </div>
      <button v-if="showSidebar" @click="createNewSession" class="btn-new"><i class="fas fa-plus"></i> NEW OPERATION</button>
      <div v-if="showSidebar" class="session-list">
        <div v-for="s in sessions" :key="s._id" :class="['session-item', currentSessionId === s._id ? 'active' : '']" @click="loadSession(s._id)">
          <div class="sess-title"><i class="fas fa-terminal"></i> {{ s.title }}</div>
          <button @click.stop="deleteSession(s._id)" class="del-sess"><i class="fas fa-times"></i></button>
        </div>
      </div>
    </div>

    <!-- MAIN TERMINAL -->
    <div class="term-container">
      <div class="term-header retro-font">
        <div style="display:flex; align-items:center; gap:10px;">
            <button v-if="!showSidebar" @click="showSidebar = true" class="btn-sidebar-toggle"><i class="fas fa-folder-open"></i></button>
            <span class="status-dot"></span> 
            <span class="ai-name-header">{{ currentAiName }}@DEVCORE</span>
            <span class="session-badge" v-if="currentSessionId && showSidebar">:: {{ getSessionName(currentSessionId) }}</span>
        </div>
        
        <!-- TOMBOL RESET PINDAH KESINI (TONG SAMPAH) -->
        <button @click="resetHistory" class="btn-reset-header" title="Clear History">
            <i class="fas fa-trash-alt"></i> RESET
        </button>
      </div>
      
      <div class="chat-area" ref="chatBox">
        <div v-if="messages.length === 0" class="welcome-msg">
            <div style="color:var(--primary); margin-bottom:10px;">SYSTEM: {{ currentAiName }} KERNEL READY.</div>
            waiting for input...
        </div>
        <div v-for="(msg, i) in messages" :key="i" :class="['message-row', msg.role]">
          <div class="sender retro-font">{{ msg.role === 'user' ? 'USER' : currentAiName }}</div>
          <div v-if="msg.role === 'model'" class="content-wrapper">
            <template v-for="(part, idx) in parseMessage(msg.content)" :key="idx">
              <CodeCard v-if="part.type === 'code'" :content="part.content" />
              <div v-else class="text-content" v-html="formatText(part.content)"></div>
            </template>
          </div>
          <div v-else class="text-content" v-html="formatText(msg.content)"></div>
        </div>
      </div>

      <!-- INPUT AREA BARU -->
      <div class="input-area">
        <input type="file" ref="fileInput" @change="handleFileUpload" style="display:none">
        <button @click="$refs.fileInput.click()" class="btn-tool" title="Upload File"><i class="fas fa-paperclip"></i></button>

        <span class="retro-font text-accent">></span>
        <input v-model="inputText" @keyup.enter="sendMessage(null)" placeholder="Enter command..." :disabled="loading" ref="inputField">
        
        <!-- TOMBOL KIRIM (PESAWAT) -->
        <button @click="sendMessage(null)" class="btn-send" :disabled="loading || !inputText">
            <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import CodeCard from '../components/Chat/CodeCard.vue';
import axios from 'axios';

const auth = useAuthStore();
const messages = ref([]);
const sessions = ref([]);
const currentSessionId = ref(null);
const inputText = ref('');
const loading = ref(false);
const showSidebar = ref(false);
const chatBox = ref(null);
const inputField = ref(null);
const fileInput = ref(null);
const API = 'http://146.190.98.149:5000/api';
const headers = { headers: { Authorization: `Bearer ${auth.token}` } };
const currentAiName = computed(() => auth.user?.aiName || 'DevCORE');

const scrollToBottom = () => nextTick(() => { if(chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight });
const formatText = (text) => text.replace(/\n/g, '<br>');

// --- SESSION & CHAT LOGIC (Sama seperti sebelumnya, disederhanakan utk view) ---
const loadSessions = async () => {
    try {
        const res = await axios.get(`${API}/chat/sessions`, headers);
        sessions.value = res.data;
        if(sessions.value.length > 0 && !currentSessionId.value) loadSession(sessions.value[0]._id);
    } catch(e) {}
};
const loadSession = (id) => {
    currentSessionId.value = id;
    const sess = sessions.value.find(s => s._id === id);
    messages.value = sess ? sess.messages : [];
    scrollToBottom();
};
const createNewSession = async () => {
    const res = await axios.post(`${API}/chat/sessions`, { title: 'New Operation' }, headers);
    sessions.value.unshift(res.data);
    loadSession(res.data._id);
};
const deleteSession = async (id) => {
    if(!confirm('Delete?')) return;
    await axios.delete(`${API}/chat/sessions/${id}`, headers);
    sessions.value = sessions.value.filter(s => s._id !== id);
    if(currentSessionId.value === id) { messages.value = []; currentSessionId.value = null; }
};
const getSessionName = (id) => { const s = sessions.value.find(s => s._id === id); return s ? s.title : 'UNKNOWN'; };

const parseMessage = (fullText) => {
  const count = (fullText.match(/```/g) || []).length;
  let safeText = fullText + (count % 2 !== 0 ? '\n```' : '');
  return safeText.split(/(```[\s\S]*?```)/g).map(part => ({
    type: (part.startsWith('```') && part.endsWith('```')) ? 'code' : 'text',
    content: part
  })).filter(p => p.content.trim());
};

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const prompt = `[FILE: ${file.name}]\nAnalyze:\n\`\`\`${file.name.split('.').pop()}\n${e.target.result}\n\`\`\``;
        inputText.value = `[Uploaded ${file.name}] analyzing...`;
        sendMessage(prompt);
        inputText.value = '';
    };
    reader.readAsText(file);
    event.target.value = ''; 
};

const sendMessage = async (overrideMsg = null) => {
  const txt = overrideMsg || inputText.value;
  if(!txt.trim() || loading.value) return;
  if(!overrideMsg) inputText.value = '';
  if(!currentSessionId.value) await createNewSession();

  messages.value.push({ role: 'user', content: overrideMsg ? `[FILE ANALYSIS]` : txt });
  scrollToBottom();
  loading.value = true;

  try {
    messages.value.push({ role: 'model', content: '' }); 
    const aiMsgIndex = messages.value.length - 1;
    const response = await fetch(`${API}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
      body: JSON.stringify({ message: txt, sessionId: currentSessionId.value })
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      messages.value[aiMsgIndex].content += decoder.decode(value, { stream: true });
      scrollToBottom();
    }
    loadSessions();
  } catch(e) { messages.value[messages.value.length-1].content += "\n[ERROR]"; } 
  finally { loading.value = false; scrollToBottom(); nextTick(() => inputField.value?.focus()); }
};

const resetHistory = async () => { messages.value = []; }; // Clear view only for now
onMounted(() => { auth.fetchProfile(); loadSessions(); setTimeout(() => inputField.value?.focus(), 500); });
</script>

<style scoped>
.layout-wrapper { display: flex; height: calc(100vh - 65px); background: #000; overflow: hidden; position: relative; }
.sidebar { width: 250px; background: #050a14; border-right: 1px solid var(--border); display: flex; flex-direction: column; z-index: 50; position: absolute; height: 100%; left: 0; top: 0; transition: transform 0.3s ease; }
.sidebar.collapsed { transform: translateX(-100%); }
.sidebar-header { padding: 10px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; color: var(--primary); height: 50px; }
.btn-icon { background: none; border: none; color: #666; cursor: pointer; }
.btn-new { background: var(--primary); border: none; color: white; padding: 10px; margin: 10px; font-size: 0.7rem; cursor: pointer; font-family: 'Press Start 2P'; }
.session-list { flex: 1; overflow-y: auto; }
.session-item { padding: 10px 15px; border-bottom: 1px solid #111; cursor: pointer; color: #888; font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center; }
.session-item.active { background: #1e293b; color: var(--accent); border-left: 3px solid var(--accent); }
.del-sess { background: none; border: none; color: var(--danger); cursor: pointer; opacity: 0; }
.session-item:hover .del-sess { opacity: 1; }

.term-container { flex: 1; display: flex; flex-direction: column; height: 100%; width: 100%; }
.term-header { background: #0f172a; color: white; padding: 10px; font-size: 0.7rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--primary); height: 50px; }
.status-dot { width: 8px; height: 8px; background: #0f0; border-radius: 50%; display: inline-block; box-shadow: 0 0 5px #0f0; }
.btn-reset-header { background: #7f1d1d; border: 1px solid #ef4444; color: white; padding: 5px 10px; font-size: 0.6rem; cursor: pointer; border-radius: 4px; }
.btn-reset-header:hover { background: #b91c1c; }
.btn-sidebar-toggle { background: transparent; border: 1px solid var(--primary); color: var(--primary); padding: 5px 10px; border-radius: 4px; cursor: pointer; }

.chat-area { flex: 1; overflow-y: auto; padding: 20px; font-family: 'Roboto', sans-serif; scroll-behavior: smooth; }
.message-row { margin-bottom: 25px; border-left: 2px solid #333; padding-left: 15px; }
.message-row.user { border-color: var(--accent); }
.message-row.model { border-color: var(--primary); }
.sender { font-size: 0.7rem; color: #666; margin-bottom: 8px; }
.content-wrapper { display: flex; flex-direction: column; gap: 10px; }
.text-content { line-height: 1.6; white-space: pre-wrap; font-size: 0.95rem; color: #e2e8f0; }

.input-area { padding: 15px; background: #050505; display: flex; align-items: center; gap: 10px; border-top: 1px solid #1e293b; }
.btn-tool { background: #1e293b; border: 1px solid #333; color: #aaa; width: 35px; height: 35px; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
.btn-send { background: var(--accent); border: none; color: white; width: 40px; height: 35px; cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
.btn-send:disabled { background: #333; color: #555; cursor: not-allowed; }
.text-accent { color: var(--accent); font-weight: bold; }
.input-area input { flex: 1; background: transparent; border: none; color: white; font-family: 'Roboto', sans-serif; font-size: 1rem; outline: none; }
</style>
