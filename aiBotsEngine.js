class TerminalAudioEngine {
    constructor() {
        this.ctx = null;
        this.isEnabled = true;
    }
    initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }
    playTone(freq, type, startTime, duration, volume = 0.15) {
        if (!this.isEnabled) return;
        this.initContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }
    playProfitChime() {
        if (!this.isEnabled) return;
        this.initContext();
        const now = this.ctx.currentTime;
        this.playTone(523.25, 'triangle', now, 0.18, 0.16);
        this.playTone(659.25, 'triangle', now + 0.09, 0.18, 0.16);
        this.playTone(783.99, 'triangle', now + 0.18, 0.22, 0.18);
        this.playTone(1046.50, 'sine', now + 0.27, 0.45, 0.22);
    }
}

const terminalAudio = new TerminalAudioEngine();

function toggleTerminalAudio() {
    terminalAudio.isEnabled = !terminalAudio.isEnabled;
    if (terminalAudio.isEnabled) terminalAudio.initContext();
    const icon = document.getElementById('audio-status-icon');
    const text = document.getElementById('audio-status-text');
    if (icon && text) {
        icon.innerText = terminalAudio.isEnabled ? '🔊' : '🔇';
        text.innerText = terminalAudio.isEnabled ? 'SFX ON' : 'MUTED';
    }
}

function triggerElhadartProfitAlert(boatLabel, profitAmount) {
    terminalAudio.playProfitChime();
    const banner = document.getElementById('profit-toast-banner');
    const details = document.getElementById('profit-toast-details');
    if (banner && details) {
        const sign = profitAmount >= 0 ? '+' : '-';
        details.innerText = `${boatLabel} Hit TP • Secured ${sign}$${Math.abs(profitAmount).toFixed(2)} (Courtesy of ELHADARTGLOBALFX)`;
        banner.classList.remove('translate-x-full', 'opacity-0');
        banner.classList.add('translate-x-0', 'opacity-100');
        clearTimeout(window.profitToastTimeout);
        window.profitToastTimeout = setTimeout(() => {
            banner.classList.remove('translate-x-0', 'opacity-100');
            banner.classList.add('translate-x-full', 'opacity-0');
        }, 4000);
    }
}

const speedBoatsDirectory = {
    1: { name: "Boat 1: OB Sniper", track: "Slow Deriv (1M-5M)", setup: "Order Block Tap", option: "Higher/Lower" },
    2: { name: "Boat 2: Rise/Fall Scalper", track: "Fast Ticks (3-5 Ticks)", setup: "Rise/Fall Momentum Surge", option: "Rise / Fall" },
    3: { name: "Boat 3: Sweep Scalper", track: "Fast MS (1-2 Ticks)", setup: "Liquidity Sweep Fade", option: "Touch / No Touch" },
    4: { name: "Boat 4: FVG Rebalance", track: "Slow Deriv (3M Hold)", setup: "Fair Value Gap Fill", option: "Higher / Lower" },
    5: { name: "Boat 5: BOS Follower", track: "Slow Deriv (15M Hold)", setup: "Break of Structure Breakout", option: "Multipliers (x100)" },
    6: { name: "Boat 6: CHOCH Hunter", track: "Slow Deriv (2M Hold)", setup: "Change of Character Reversal", option: "Rise / Fall" },
    7: { name: "Boat 7: Accumulator Array", track: "1% - 5% Growth Ticks", setup: "Low-Noise Corridor Growth", option: "Accumulators (1-5%)" },
    8: { name: "Boat 8: Parity Shifter", track: "Fast MS (2 Ticks)", setup: "Even / Odd A+ Sigma Skew", option: "Even / Odd" },
    9: { name: "Boat 9: Digit Matrixer", track: "Fast MS (1-3 Ticks)", setup: "Matches, Differs, Over/Under", option: "Over/Under & Matches" }
};

let currentActiveSpeedBoat = 9;

function syncBoatWalletHighlight(boatId) {
    for (let i = 1; i <= 9; i++) {
        const card = document.getElementById(`boat-card-${i}`);
        if (card) {
            if (i === boatId) {
                card.className = "p-2 rounded-xl border bg-emerald-950 border-fxgreen text-left shadow-[0_0_12px_rgba(0,255,136,0.4)] transition animate-pulse";
            } else {
                card.className = "p-2 rounded-xl border bg-slate-900 border-slate-800 text-left hover:border-fxgreen transition";
            }
        }

        const walletBtn = document.getElementById(`wallet-boat-${i}`);
        if (walletBtn) {
            if (i === boatId) {
                walletBtn.className = "py-1.5 px-1 rounded-lg bg-emerald-950 border-2 border-fxgreen text-fxgreen font-bold shadow-[0_0_8px_rgba(0,255,136,0.4)] transition";
            } else {
                walletBtn.className = "py-1.5 px-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:border-gold transition";
            }
        }
    }

    const boat = speedBoatsDirectory[boatId];
    const badge = document.getElementById('active-basket-boat-badge');
    if (badge) badge.innerText = boatId ? `BOAT ${boatId} ACTIVE` : `STANDBY (NULL)`;

    const walletLabel = document.getElementById('dispatcher-wallet-active-label');
    if (walletLabel) {
        walletLabel.innerText = boat ? `Selected: ${boat.name} (${boat.option})` : `Standby: Waiting for A+ Sigma`;
    }
}

function selectAndLaunchBoat(boatId) {
    currentActiveSpeedBoat = Number(boatId);
    const boat = speedBoatsDirectory[boatId];
    syncBoatWalletHighlight(currentActiveSpeedBoat);

    alert(`⚓ Boat ${boatId} Selected (${boat.name})!\nOption Type: ${boat.option}\nTrack: ${boat.track}\nSetup: ${boat.setup}\n\n👉 Tracking data automatically for site & Deriv DBot execution.\n(Courtesy of ELHADARTGLOBALFX)`);
}

function toggleDerivSetupModal(show) {
    const modal = document.getElementById('deriv-setup-modal');
    if (modal) modal.classList.toggle('hidden', !show);
}
