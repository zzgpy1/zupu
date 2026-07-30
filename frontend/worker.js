// frontend/worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 处理根路径和 SPA 路由：返回 index.html
    if (path === '/' || path === '') {
      return serveStatic('index.html', env);
    }

    // 尝试获取静态文件
    let response = await env.ASSETS.fetch(request);

    // 如果资源不存在（例如 SPA 路由），同样返回 index.html
    if (response.status === 404) {
      return serveStatic('index.html', env);
    }

    // 强制修正 MIME 类型（核心修复）
    const contentType = getContentType(path);
    if (contentType) {
      response = new Response(response.body, response);
      response.headers.set('Content-Type', contentType);
    }

    return response;
  },
};

async function serveStatic(file, env) {
  const fakeRequest = new Request(`https://fake-host/${file}`);
  const response = await env.ASSETS.fetch(fakeRequest);
  const contentType = getContentType(file);
  if (contentType) {
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Content-Type', contentType);
    return newResponse;
  }
  return response;
}

function getContentType(path) {
  if (path.endsWith('.js')) return 'application/javascript';
  if (path.endsWith('.css')) return 'text/css';
  if (path.endsWith('.html')) return 'text/html';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.ico')) return 'image/x-icon';
  return null;
}
