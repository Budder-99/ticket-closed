const DEFAULTS = {
  pieceCount: 200,
  physicsEnabled: true,
  sizeMultiplier: 1.0,
  durationMs: 2000,
  colorMode: "classic",
  originMode: "corners",
  velocitySpreadMultiplier: 1.0
};

const ids = {
  pieceCount: document.getElementById("pieceCount"),
  pieceCountValue: document.getElementById("pieceCountValue"),
  physicsEnabled: document.getElementById("physicsEnabled"),
  sizeMultiplier: document.getElementById("sizeMultiplier"),
  sizeMultiplierValue: document.getElementById("sizeMultiplierValue"),
  durationMs: document.getElementById("durationMs"),
  durationMsValue: document.getElementById("durationMsValue"),
  colorMode: document.getElementById("colorMode"),
  originMode: document.getElementById("originMode"),
  velocitySpreadMultiplier: document.getElementById("velocitySpreadMultiplier"),
  velocitySpreadValue: document.getElementById("velocitySpreadValue"),
  save: document.getElementById("save"),
  test: document.getElementById("test"),
  status: document.getElementById("status")
};

function setStatus(text) {
  ids.status.textContent = text;
}

function formatRangeValue(id, value) {
  if (id === "pieceCount") return `${value}`;
  if (id === "durationMs") return `${value} ms`;
  return `${Number(value).toFixed(1)}x`;
}

function updateRangeLabel(id) {
  const input = ids[id];
  const out = ids[`${id}Value`];
  if (out) out.textContent = `Current: ${formatRangeValue(id, input.value)}`;
}

function updateAllRangeLabels() {
  updateRangeLabel("pieceCount");
  updateRangeLabel("sizeMultiplier");
  updateRangeLabel("durationMs");
  updateRangeLabel("velocitySpreadMultiplier");
}

function loadOptions() {
  chrome.storage.sync.get(DEFAULTS, (items) => {
    ids.pieceCount.value = items.pieceCount;
    ids.physicsEnabled.checked = items.physicsEnabled;
    ids.sizeMultiplier.value = items.sizeMultiplier;
    ids.durationMs.value = items.durationMs;
    ids.colorMode.value = items.colorMode;
    ids.originMode.value = items.originMode;
    ids.velocitySpreadMultiplier.value = items.velocitySpreadMultiplier;
    updateAllRangeLabels();
  });
}

function saveOptions() {
  const data = {
    pieceCount: Number(ids.pieceCount.value) || DEFAULTS.pieceCount,
    physicsEnabled: ids.physicsEnabled.checked,
    sizeMultiplier: Number(ids.sizeMultiplier.value) || DEFAULTS.sizeMultiplier,
    durationMs: Number(ids.durationMs.value) || DEFAULTS.durationMs,
    colorMode: ids.colorMode.value,
    originMode: ids.originMode.value,
    velocitySpreadMultiplier: Number(ids.velocitySpreadMultiplier.value) || DEFAULTS.velocitySpreadMultiplier
  };

  chrome.storage.sync.set(data, () => {
    setStatus("Saved");
    window.setTimeout(() => setStatus(""), 1200);
  });
}

function testConfetti() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab?.id) return;

    chrome.tabs.sendMessage(tab.id, { type: "autotask-confetti-test" });
    setStatus("Test sent");
    window.setTimeout(() => setStatus(""), 1200);
  });
}

["pieceCount", "sizeMultiplier", "durationMs", "velocitySpreadMultiplier"].forEach((id) => {
  ids[id].addEventListener("input", () => updateRangeLabel(id));
});

ids.save.addEventListener("click", saveOptions);
ids.test.addEventListener("click", testConfetti);

loadOptions();