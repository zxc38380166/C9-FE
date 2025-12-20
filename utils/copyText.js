import Clipboard from 'clipboard';

export default function copyText(text, onSuccess = () => {}, onError = () => {}) {
  const store = useStore();
  const message = {
    success: $t('common.copySuccess'),
    error: $t('common.copyError'),
  };

  // 優先使用現代 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(String(text))
      .then(() => {
        store.getDoms.commonAlert.use({ show: true, text: message.success, status: 'success' });
        onSuccess();
      })
      .catch(() => {
        store.getDoms.commonAlert.use({ show: true, text: message.error, status: 'error' });
        onError();
      });
  } else {
    // Fallback：使用 clipboard.js
    const button = document.createElement('button');
    button.style.position = 'fixed';
    button.style.left = '-9999px';
    document.body.appendChild(button);

    const clipboard = new Clipboard(button, {
      text: () => String(text),
    });

    clipboard.on('success', () => {
      store.getDoms.commonAlert.use({ show: true, text: message.success, status: 'success' });
      onSuccess();
      clipboard.destroy();
      button.remove();
    });

    clipboard.on('error', () => {
      store.getDoms.commonAlert.use({ show: true, text: message.error, status: 'error' });
      onError();
      clipboard.destroy();
      button.remove();
    });

    button.click();
  }
}
