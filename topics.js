const tabs = [...document.querySelectorAll('[data-topic]')];
const panels = [...document.querySelectorAll('[data-topic-panel]')];
const topicIds = tabs.map((tab) => tab.dataset.topic);
const topicTitles = {
  rumination: '精神內耗',
  love: '戀愛與依附',
  outrage: '數位公憤',
  deliberation: '公眾審議'
};

function selectTopic(topic, { updateAddress = true, moveFocus = false } = {}) {
  const selectedTopic = topicIds.includes(topic) ? topic : topicIds[0];
  tabs.forEach((tab) => {
    const active = tab.dataset.topic === selectedTopic;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && moveFocus) tab.focus();
  });
  panels.forEach((panel) => { panel.hidden = panel.dataset.topicPanel !== selectedTopic; });
  document.title = `${topicTitles[selectedTopic]}｜大腦 × 情境概念專題`;

  if (updateAddress) {
    const url = new URL(window.location.href);
    url.searchParams.set('topic', selectedTopic);
    window.history.replaceState({ topic: selectedTopic }, '', url);
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTopic(tab.dataset.topic));
  tab.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTopic(tabs[nextIndex].dataset.topic, { moveFocus: true });
  });
});

window.addEventListener('popstate', () => {
  selectTopic(new URLSearchParams(window.location.search).get('topic'), { updateAddress: false });
});

selectTopic(new URLSearchParams(window.location.search).get('topic'), { updateAddress: false });
