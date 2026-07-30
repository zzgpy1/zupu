export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 如果是根路径，返回 index.html（确保 SPA 路由支持）
    if (pathname === '/' || pathname === '') {
      return await serveStatic('index.html', env);
    }

    // 尝试从 assets 中获取静态文件
    const assetResponse = await env.ASSETS.fetch(request.clone());
    
    // 如果资源不存在（404），返回 index.html（支持 SPA 路由）
    if (assetResponse.status === 404) {
      return await serveStatic('index.html', env);
    }

    // 对 .js 文件强制设置正确的 MIME 类型
    const response = new Response(assetResponse.body, assetResponse);
    if (pathname.endsWith('.js')) {
      response.headers.set('Content-Type', 'application/javascript');
    } else if (pathname.endsWith('.css')) {
      response.headers.set('Content-Type', 'text/css');
    }
    // 可添加其他类型支持
    return response;
  },
};

async function serveStatic(file, env) {
  const assetRequest = new Request(`https://fake-host/${file}`);
  const assetResponse = await env.ASSETS.fetch(assetRequest);
  const response = new Response(assetResponse.body, assetResponse);
  // 如果文件是 js/css，同样设置 MIME
  if (file.endsWith('.js')) {
    response.headers.set('Content-Type', 'application/javascript');
  } else if (file.endsWith('.css')) {
    response.headers.set('Content-Type', 'text/css');
  }
  return response;
}
