/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import { type SaveItemType } from '@qc2168/mib';

/* eslint-disable react-hooks/rules-of-hooks */
function domReady(
  condition: DocumentReadyState[] = ['complete', 'interactive'],
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

class safeDOM {
  static append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children)
      .find((e) => e === child)) {
      parent.appendChild(child);
    }
  }

  static remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children)
      .find((e) => e === child)) {
      parent.removeChild(child);
    }
  }
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const styleContent = `
    .app-loading-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #282c34;
      z-index: 9;
    }
    .sk-chase {
      width: 40px;
      height: 40px;
      position: relative;
      animation: sk-chase 2.5s infinite linear both;
    }

    .sk-chase-dot {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      animation: sk-chase-dot 2.0s infinite ease-in-out both;
    }

    .sk-chase-dot:before {
      content: '';
      display: block;
      width: 25%;
      height: 25%;
      background-color: #fff;
      border-radius: 100%;
      animation: sk-chase-dot-before 2.0s infinite ease-in-out both;
    }

    .sk-chase-dot:nth-child(1) { animation-delay: -1.1s; }
    .sk-chase-dot:nth-child(2) { animation-delay: -1.0s; }
    .sk-chase-dot:nth-child(3) { animation-delay: -0.9s; }
    .sk-chase-dot:nth-child(4) { animation-delay: -0.8s; }
    .sk-chase-dot:nth-child(5) { animation-delay: -0.7s; }
    .sk-chase-dot:nth-child(6) { animation-delay: -0.6s; }
    .sk-chase-dot:nth-child(1):before { animation-delay: -1.1s; }
    .sk-chase-dot:nth-child(2):before { animation-delay: -1.0s; }
    .sk-chase-dot:nth-child(3):before { animation-delay: -0.9s; }
    .sk-chase-dot:nth-child(4):before { animation-delay: -0.8s; }
    .sk-chase-dot:nth-child(5):before { animation-delay: -0.7s; }
    .sk-chase-dot:nth-child(6):before { animation-delay: -0.6s; }

    @keyframes sk-chase {
      100% { transform: rotate(360deg); }
    }

    @keyframes sk-chase-dot {
      80%, 100% { transform: rotate(360deg); }
    }

    @keyframes sk-chase-dot-before {
      50% {
        transform: scale(0.4);
      } 100%, 0% {
        transform: scale(1.0);
      }
    }
    `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');
  oStyle.id = 'app-loading-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-loading-wrap';
  oDiv.innerHTML = `<div class="sk-chase">
                      <div class="sk-chase-dot"></div>
                      <div class="sk-chase-dot"></div>
                      <div class="sk-chase-dot"></div>
                      <div class="sk-chase-dot"></div>
                      <div class="sk-chase-dot"></div>
                      <div class="sk-chase-dot"></div>
                    </div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const {
  appendLoading,
  removeLoading,
} = useLoading();
domReady()
  .then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === 'removeLoading' && removeLoading();
};

setTimeout(removeLoading, 4999);

const {
  contextBridge,
  ipcRenderer,
} = require('electron');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('win', {
  close: () => ipcRenderer.invoke('close-win'),
  minimize: () => ipcRenderer.invoke('minimize-win'),
  maximize: () => ipcRenderer.invoke('maximize-win'),
});

contextBridge.exposeInMainWorld('core', {
  instance: () => ipcRenderer.invoke('mibInstance'),
  instanceConfig: () => ipcRenderer.invoke('instanceConfig'),
  devices: () => ipcRenderer.invoke('getDevices'),
  setDevice: (id: string) => ipcRenderer.invoke('setDevice', id),
  backup: (id: SaveItemType | SaveItemType[]) => ipcRenderer.invoke('backup', id),
  restore: (id: SaveItemType | SaveItemType[]) => ipcRenderer.invoke('restore', id),
  backupDone: (callback) => ipcRenderer.on('backupDone', callback),
  scanDone: (callback) => ipcRenderer.once('scanDone', callback),
  attachDevice: (callback) => ipcRenderer.on('attachDevice', callback),
  detachDevice: (callback) => ipcRenderer.on('detachDevice', callback),
  addNode: (data: SaveItemType) => ipcRenderer.invoke('addNode', data),
  removeNode: (id: string) => ipcRenderer.invoke('removeNode', id),
  editNode: (data: SaveItemType) => ipcRenderer.invoke('editNode', data),
  editOutputPath: (path: string) => ipcRenderer.invoke('editOutputPath', path),
  scan: (path: string) => ipcRenderer.invoke('scan', path),
  rebootADB: () => ipcRenderer.invoke('rebootADB'),
});
