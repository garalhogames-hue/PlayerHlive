"use strict";

/**
 * Landing meme/estética
 * - Audio (play/pause) sem autoplay
 * - "Farmar aura" com coin sound via Web Audio API
 * - Ao chegar em 100%, ativa .party-mode no body
 */

const audio = document.getElementById("bgAudio");
const toggleAudioBtn = document.getElementById("toggleAudio");
const audioStatus = document.getElementById("audioStatus");
const volumeRange = document.getElementById("volume");

const farmBtn = document.getElementById("farmAura");
const resetBtn = document.getElementById("resetAura");
const auraPercentEl = document.getElementById("auraPercent");
const auraNote = document.getElementById("auraNote");
const barFill = document.getElementById("barFill");
const bar = document.querySelector(".bar");

let aura = 0;
const STEP = 10; // +10% por clique (divertido e rápido)

let audioCtx = null;

/** ---------- AUDIO (MP3) ---------- */
function setAudioUI(isPlaying) {
  toggleAudioBtn.textContent = isPlaying ? "Pausar" : "Tocar";
  toggleAudioBtn.setAttribute("aria-pressed", String(isPlaying));
  audioStatus.textContent = isPlaying ? "tocando…" : "pausado.";
}

async function toggleAudio() {
  try {
    if (audio.paused) {
      await audio.play();
      setAudioUI(true);
    } else {
      audio.pause();
      setAudioUI(false);
    }
  } catch (err) {
    // Bloqueios podem ocorrer em alguns browsers/dispositivos
    setAudioUI(false);
    audioStatus.textContent = "não foi possível tocar (toque novamente).";
    console.error(err);
  }
}

toggleAudioBtn.addEventListener("click", toggleAudio);

audio.addEventListener("ended", () => {
  setAudioUI(false);
  audioStatus.textContent = "terminou.";
});

volumeRange.addEventListener("input", (e) => {
  audio.volume = Number(e.target.value);
});

/** ---------- COIN SOUND (Web Audio API) ---------- */
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Em alguns navegadores, o contexto pode iniciar "suspended"
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playCoin() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Envelope (bem curtinho)
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  // Filtro pra deixar "bling"
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.setValueAtTime(650, now);

  // Osc 1
  const o1 = ctx.createOscillator();
  o1.type = "triangle";
  o1.frequency.setValueAtTime(980, now);
  o1.frequency.exponentialRampToValueAtTime(1700, now + 0.05);
  o1.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

  // Osc 2 (harmônico)
  const o2 = ctx.createOscillator();
  o2.type = "sine";
  o2.frequency.setValueAtTime(1560, now);
  o2.frequency.exponentialRampToValueAtTime(2200, now + 0.03);
  o2.frequency.exponentialRampToValueAtTime(1400, now + 0.12);

  // Conexões
  o1.connect(hp);
  o2.connect(hp);
  hp.connect(gain);
  gain.connect(ctx.destination);

  o1.start(now);
  o2.start(now);

  o1.stop(now + 0.13);
  o2.stop(now + 0.13);
}

/** ---------- AURA GAME ---------- */
function updateAuraUI() {
  const pct = Math.max(0, Math.min(100, aura));
  auraPercentEl.textContent = `${pct}%`;
  barFill.style.width = `${pct}%`;
  bar.setAttribute("aria-valuenow", String(pct));
}

function setPartyMode(on) {
  document.body.classList.toggle("party-mode", on);
}

function reached100() {
  setPartyMode(true);
  auraNote.textContent = "AURA 100% — modo Orochi ativado!";
  farmBtn.disabled = true;
  resetBtn.hidden = false;
}

function farmAura() {
  // Coin sound sempre que clicar
  playCoin();

  if (aura >= 100) return;

  aura += STEP;
  if (aura >= 100) {
    aura = 100;
    updateAuraUI();
    reached100();
    return;
  }

  auraNote.textContent = `+${STEP}% aura. continua.`;
  resetBtn.hidden = aura === 0;
  updateAuraUI();
}

function resetAura() {
  aura = 0;
  setPartyMode(false);

  farmBtn.disabled = false;
  resetBtn.hidden = true;

  auraNote.textContent = "clique para farmar.";
  updateAuraUI();
}

farmBtn.addEventListener("click", farmAura);
resetBtn.addEventListener("click", resetAura);

// Estado inicial
audio.volume = Number(volumeRange.value);
setAudioUI(false);
updateAuraUI();
