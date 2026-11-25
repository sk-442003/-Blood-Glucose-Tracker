async function verify() {
  for (const port of [5173, 5174]) {
    try {
      const frontend = await fetch(`http://localhost:${port}`);
      const html = await frontend.text();
      const title = html.match(/<title>(.*?)<\/title>/i)?.[1] || '(no page title)';
      const entry = html.match(/<script[^>]+src="([^"]+)"/i)?.[1];
      console.log(`Frontend ${port}: ${frontend.status}, ${title}, entry ${entry || '(none)'}`);
      if (entry) {
        const script = await fetch(new URL(entry, `http://localhost:${port}`));
        console.log(`Frontend ${port} entry bundle: ${script.status}`);
      }
    } catch (error) {
      console.log(`Frontend ${port}: unavailable (${error.message})`);
    }
  }
  const backend = await fetch('http://localhost:5000/api/health');
  const health = await backend.json();
  console.log(`Backend: ${backend.status} (${health.status})`);
  const redirect = await fetch('http://localhost:5000/', { redirect: 'manual' });
  console.log(`Backend root: ${redirect.status} -> ${redirect.headers.get('location')}`);
}

verify().catch(error => {
  console.error(error.message);
  process.exit(1);
});
