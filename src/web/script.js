document.addEventListener('DOMContentLoaded', async function() {
 Telegram.WebApp.ready();
 await auth(Telegram.WebApp.initData);
});

async function auth(data) {
 const res = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data: data })
 });
 const result = await res.json();
 let html = '';
 if (result && result.hasOwnProperty('error')) {
  switch (result.error) {
   case 0:
    html = translate(await getFileContent('html/login-ok.html'), {
     '{QUERY_ID}': result.data.query_id,
     '{TIME}': new Date(result.data.auth_date * 1000).toLocaleString(),
     '{USER_ID}': result.data.user.id,
     '{USER_NAME}': result.data.user.username,
     '{FIRST_NAME}': result.data.user.first_name,
     '{LAST_NAME}': result.data.user.last_name,
     '{LANGUAGE}': result.data.user.language_code,
     '{PREMIUM}': result.data.user.is_premium ? 'Yes' : 'No',
     '{PM}': result.data.user.allows_write_to_pm ? 'Yes' : 'No',
    });
    break;
   default:
    html = translate(await getFileContent('html/login-error.html'), { '{ERROR}': result.message ? result.message : 'Unknown' });
  }
 } else {
  html = await getFileContent('html/login-unrecognized.html')
 }
 document.querySelector('#userinfo').innerHTML = html;
}

async function getFileContent(file) {
 const content = await fetch(file, { headers: { 'cache-control': 'no-cache' }});
 return content.text();
}

function translate(template, dictionary) {
 for (const key in dictionary) template = template.replaceAll(key, dictionary[key]);
 return template;
}
