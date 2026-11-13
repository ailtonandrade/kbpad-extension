chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

function setBadge(tabId, on) {
  chrome.action.setBadgeText({ tabId, text: on ? 'ON' : '' });
  chrome.action.setBadgeBackgroundColor({ tabId, color: '#16a34a' });
  chrome.action.setTitle({ tabId, title: on ? 'KB Pad: LIGADO' : 'KB Pad: desligado (clique para configurar)' });
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg && msg.type === 'kbpad-state' && sender.tab && sender.frameId === 0) setBadge(sender.tab.id, msg.enabled);
});

chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === 'loading') setBadge(tabId, false);
});
