<template>
  <div class="container slide-in">
    <h1 class="retro-font text-center" style="margin-bottom:30px; color:var(--primary)">API DOCUMENTATION</h1>
    
    <div class="card">
        <h3 class="retro-font">INTRODUCTION</h3>
        <p>Welcome to DevCORE External API. You can interact with the AI using your Personal API Key.</p>
        <p>Base URL: <span class="code-snippet">https://devcore-backends.vercel.app/api/v1</span></p>
    </div>

    <div class="card">
        <h3 class="retro-font">AUTHENTICATION</h3>
        <p>Include your API Key in the header <code>x-api-key</code>.</p>
        <div class="alert">
            Get your API Key from the <router-link to="/profile" style="color:var(--accent); text-decoration:underline;">Profile Page</router-link>.
        </div>
    </div>

    <div class="card">
        <h3 class="retro-font">ENDPOINT: CHAT COMPLETIONS</h3>
        <div class="endpoint">POST /chat/completions</div>
        
        <h4 style="margin-top:20px;">cURL Example</h4>
        <div class="code-block">
<pre>curl -X POST https://devcore-backends.vercel.app/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_PERSONAL_KEY_HERE" \
  -d '{
    "messages": [
      { "role": "user", "content": "Hello AI!" }
    ]
  }'</pre>
        </div>

        <h4 style="margin-top:20px;">Python Example</h4>
        <div class="code-block">
<pre>import requests

url = "https://devcore-backends.vercel.app/api/v1/chat/completions"
headers = {
    "x-api-key": "YOUR_PERSONAL_KEY_HERE",
    "Content-Type": "application/json"
}
data = {
    "messages": [{"role": "user", "content": "Buatkan script python"}]
}

response = requests.post(url, json=data, headers=headers)
print(response.json())</pre>
        </div>
    </div>
  </div>
</template>

<style scoped>
p { line-height: 1.6; color: #ccc; margin-bottom: 15px; }
.code-snippet { background: #222; padding: 2px 6px; border-radius: 4px; color: var(--accent); font-family: 'Courier New'; }
.alert { background: rgba(59, 130, 246, 0.1); border-left: 4px solid var(--accent); padding: 10px; margin: 15px 0; font-size: 0.9rem; }
.endpoint { background: #111; padding: 10px; border: 1px solid #333; color: var(--success); font-family: 'Courier New'; font-weight: bold; margin-top: 10px; }
.code-block { background: #000; padding: 15px; border: 1px solid #333; overflow-x: auto; margin-top: 5px; border-radius: 4px; }
pre { color: #a5b4fc; margin: 0; font-family: 'Courier New'; font-size: 0.85rem; }
</style>
