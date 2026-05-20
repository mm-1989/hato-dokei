import './style.css';
import { buildShell, mount, startClockLoop } from './app';
import { preloadAssets } from './assets';
import { state } from './state';

buildShell();
mount('home');
startClockLoop();
// 画像(鳥・パーツ)が読み込めたら現在画面を再描画して差し替え
preloadAssets(() => mount(state.screen));

// PWA: Service Worker は本番ビルドのみ登録(dev で localhost を横取りしないため)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => { /* noop */ });
  });
}
