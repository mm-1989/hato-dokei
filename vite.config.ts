import { defineConfig } from 'vite';

// 本番(build)は相対パス基準にして GitHub Pages のサブパス配信でも壊れないようにする。
// dev は '/' で通常配信。
// GitHub Pages: 公開リポジトリ hato-dokei → プロジェクトパス /hato-dokei/
// build と preview は '/hato-dokei/'、dev(serve) は '/'。
export default defineConfig(({ command, isPreview }) => ({
  base: (command === 'build' || isPreview) ? '/hato-dokei/' : '/',
  server: { host: true },
}));
