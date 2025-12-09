import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Skull, RotateCcw, Play, Heart, ChevronLeft, ChevronRight, BriefcaseMedical, Crosshair, ArrowRightFromLine, ShieldPlus, User, Info, Package, FastForward, Flame, Target, BookOpen, X, Settings, Shield, Zap, RefreshCw, Gift, Trees, Box, Monitor, Layers, Sparkles, Bomb, Star, Music, HelpCircle, CloudRain, Sun, Cloud, Wind, Bot, UserMinus, Eye, Repeat, Magnet, CornerUpLeft, Users, Dices, AlertTriangle, Activity, Home, Dice5, Trophy, Smile, Frown, ThumbsUp, ThumbsDown, MessageCircle, Spade, Club, Diamond, Volume2, VolumeX, EyeOff, Shuffle, Scan, CheckCircle2, AlertOctagon, Building, Train, Ghost, Fan } from 'lucide-react';

// --- Types ---

type WeaponSkin = 'classic' | 'gold' | 'rusty' | 'neon' | 'military' | 'noir' | 'plasma' | 'pearl' | 'magma' | 'candy' | 'ruby' | 'emerald' | 'sapphire' | 'ice' | 'void_walker' | 'steampunk';
type WeaponModel = 'revolver' | 'shotgun' | 'rifle' | 'sniper' | 'smg' | 'rpg' | 'raygun';

interface WeaponConfig {
  id: WeaponSkin;
  name: string;
  colors: {
    body: string;
    barrel: string;
    grip: string;
  };
}

const WEAPON_SKINS: Record<WeaponSkin, WeaponConfig> = {
  classic: { id: 'classic', name: 'Standard Issue', colors: { body: '#475569', barrel: '#64748b', grip: '#334155' } },
  gold: { id: 'gold', name: 'Golden Eagle', colors: { body: '#b45309', barrel: '#f59e0b', grip: '#78350f' } },
  rusty: { id: 'rusty', name: 'Rusty Revolver', colors: { body: '#7f1d1d', barrel: '#991b1b', grip: '#450a0a' } },
  neon: { id: 'neon', name: 'Cyber Punk', colors: { body: '#1e1b4b', barrel: '#06b6d4', grip: '#d946ef' } },
  military: { id: 'military', name: 'Spec Ops', colors: { body: '#3f6212', barrel: '#1a2e05', grip: '#14532d' } },
  noir: { id: 'noir', name: 'Vintage Noir', colors: { body: '#000000', barrel: '#404040', grip: '#171717' } },
  plasma: { id: 'plasma', name: 'Plasma-X', colors: { body: '#e2e8f0', barrel: '#3b82f6', grip: '#1e293b' } },
  pearl: { id: 'pearl', name: 'The Pearl', colors: { body: '#94a3b8', barrel: '#cbd5e1', grip: '#fef3c7' } },
  magma: { id: 'magma', name: 'Magma Core', colors: { body: '#451a03', barrel: '#f97316', grip: '#7c2d12' } },
  candy: { id: 'candy', name: 'Sweet Tooth', colors: { body: '#fce7f3', barrel: '#f472b6', grip: '#db2777' } },
  ruby: { id: 'ruby', name: 'Ruby Rose', colors: { body: '#881337', barrel: '#e11d48', grip: '#4c0519' } },
  emerald: { id: 'emerald', name: 'Emerald Viper', colors: { body: '#064e3b', barrel: '#10b981', grip: '#022c22' } },
  sapphire: { id: 'sapphire', name: 'Sapphire Sky', colors: { body: '#1e3a8a', barrel: '#3b82f6', grip: '#172554' } },
  ice: { id: 'ice', name: 'Black Ice', colors: { body: '#0f172a', barrel: '#38bdf8', grip: '#0ea5e9' } },
  void_walker: { id: 'void_walker', name: 'Void Walker', colors: { body: '#020617', barrel: '#2e1065', grip: '#4c1d95' } },
  steampunk: { id: 'steampunk', name: 'Steam Tech', colors: { body: '#78350f', barrel: '#b45309', grip: '#92400e' } },
};

const WEAPON_MODELS: Record<WeaponModel, string> = {
  revolver: 'Revolver',
  shotgun: 'Shotgun',
  rifle: 'Assault Rifle',
  sniper: 'Sniper Rifle',
  smg: 'SMG',
  rpg: 'RPG',
  raygun: 'Ray Gun'
};

type SkinType = 'classic' | 'miku' | 'jotaro' | 'gojo' | 'freddy';

interface SkinConfig {
  id: SkinType;
  name: string;
  colors: {
    primary: string;
    accent: string;
  };
  abilityName: string;
  abilityIcon: React.ReactNode;
  abilityDesc: string;
}

const SKINS: Record<SkinType, SkinConfig> = {
  classic: { 
      id: 'classic', 
      name: 'The Stickman', 
      colors: { primary: '#cbd5e1', accent: '#94a3b8' },
      abilityName: 'Confuse',
      abilityIcon: <HelpCircle className="w-5 h-5" />,
      abilityDesc: 'Just a simple taunt. (Cosmetic)'
  },
  miku: { 
      id: 'miku', 
      name: 'Miku', 
      colors: { primary: '#39c5bb', accent: '#e11d48' },
      abilityName: 'Virtual Concert',
      abilityIcon: <Music className="w-5 h-5" />,
      abilityDesc: 'Make it rain glow sticks! (Cosmetic)'
  },
  jotaro: { 
      id: 'jotaro', 
      name: 'Jojo', 
      colors: { primary: '#1e1b4b', accent: '#fbbf24' },
      abilityName: 'Star Platinum',
      abilityIcon: <Star className="w-5 h-5" />,
      abilityDesc: 'Summon your stand! (Cosmetic)'
  },
  gojo: {
      id: 'gojo', 
      name: 'Sorcerer', 
      colors: { primary: '#000000', accent: '#a855f7' },
      abilityName: 'Limitless',
      abilityIcon: <EyeOff className="w-5 h-5" />,
      abilityDesc: 'Toggle blindfold. (Cosmetic)'
  },
  freddy: {
      id: 'freddy', 
      name: 'Animatronic',
      colors: { primary: '#78350f', accent: '#000000' },
      abilityName: 'Jumpscare',
      abilityIcon: <Ghost className="w-5 h-5" />,
      abilityDesc: 'Scare the opponent! (Cosmetic)'
  }
};

type BulletSkin = 'brass' | 'silver' | 'gold' | 'neon' | 'void';

interface BulletConfig {
  id: BulletSkin;
  name: string;
  colors: {
    casing: string;
    primer: string;
    ring: string;
  };
}

const BULLET_SKINS: Record<BulletSkin, BulletConfig> = {
  brass: { id: 'brass', name: 'Standard Brass', colors: { casing: '#d97706', primer: '#fcd34d', ring: '#b45309' } },
  silver: { id: 'silver', name: 'Sterling Silver', colors: { casing: '#94a3b8', primer: '#e2e8f0', ring: '#475569' } },
  gold: { id: 'gold', name: '24K Gold', colors: { casing: '#f59e0b', primer: '#fef3c7', ring: '#d97706' } },
  neon: { id: 'neon', name: 'Cyber Plasma', colors: { casing: '#06b6d4', primer: '#cffafe', ring: '#0891b2' } },
  void: { id: 'void', name: 'Void Round', colors: { casing: '#0f172a', primer: '#ef4444', ring: '#334155' } },
};

type BackgroundType = 'room' | 'forest' | 'cyber' | 'void' | 'house' | 'casino' | 'rooftop' | 'subway' | 'fnaf';
type GameMode = 'CLASSIC' | 'CHAOS';

type ItemType = 'MEDKIT' | 'DIRECT_HIT' | 'EJECTOR' | 'FULL_AUTO' | 'HEAVY_BULLET' | 'SHIELD' | 'RELOAD' | 'LOOT_BOX' | 'HEAVY_ARMOR' | 'FIREWORK' | 'C4' | 'MISFIRE' | 'SCOPE' | 'SECOND_CHANCE' | 'ADRENALINE' | 'MAGNET' | 'RICOCHET' | 'CLUSTER' | 'GAMBLE';
type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface ItemConfig {
  id: ItemType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  rarity: Rarity;
}

const ITEMS: Record<ItemType, ItemConfig> = {
  // COMMON (Gray) - 40%
  DIRECT_HIT: {
    id: 'DIRECT_HIT',
    name: 'Directed Shot',
    description: 'Aim at opponent. Uses cylinder RNG.',
    icon: <Target className="w-5 h-5" />,
    color: 'text-slate-300',
    bg: 'bg-slate-800/80 border-slate-600 hover:bg-slate-700',
    rarity: 'common'
  },
  EJECTOR: {
    id: 'EJECTOR',
    name: 'Smoke Bomb',
    description: 'Skip your turn instantly.',
    icon: <FastForward className="w-5 h-5" />,
    color: 'text-slate-300',
    bg: 'bg-slate-800/80 border-slate-600 hover:bg-slate-700',
    rarity: 'common'
  },
  RELOAD: {
    id: 'RELOAD',
    name: 'Speed Loader',
    description: 'Reload all chambers and spin the cylinder.',
    icon: <RefreshCw className="w-5 h-5" />,
    color: 'text-slate-300',
    bg: 'bg-slate-800/80 border-slate-600 hover:bg-slate-700',
    rarity: 'common'
  },

  // UNCOMMON (Green) - 30%
  HEAVY_BULLET: {
    id: 'HEAVY_BULLET',
    name: 'Heavy Bullet',
    description: 'Next shot deals double damage (2 Lives).',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-green-400',
    bg: 'bg-green-950/50 border-green-800 hover:bg-green-900',
    rarity: 'uncommon'
  },
  FIREWORK: {
    id: 'FIREWORK',
    name: 'Fireworks',
    description: 'Launch a celebration firework! (Visual only)',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'text-green-400',
    bg: 'bg-green-950/50 border-green-800 hover:bg-green-900',
    rarity: 'uncommon'
  },
  GAMBLE: {
    id: 'GAMBLE',
    name: 'Gamble Token',
    description: 'Roll Die: 1-2 (Hurt), 3-4 (Heal), 5-6 (Epic Item).',
    icon: <Dices className="w-5 h-5" />,
    color: 'text-green-400',
    bg: 'bg-green-950/50 border-green-800 hover:bg-green-900',
    rarity: 'uncommon'
  },

  // RARE (Blue) - 15%
  MEDKIT: {
    id: 'MEDKIT',
    name: 'Medkit',
    description: 'Restore 1 Life to yourself.',
    icon: <BriefcaseMedical className="w-5 h-5" />,
    color: 'text-blue-400',
    bg: 'bg-blue-950/50 border-blue-800 hover:bg-blue-900',
    rarity: 'rare'
  },
  SHIELD: {
    id: 'SHIELD',
    name: 'Body Armor',
    description: 'Add 1 Armor Layer. Non-stackable.',
    icon: <Shield className="w-5 h-5" />,
    color: 'text-blue-400',
    bg: 'bg-blue-950/50 border-blue-800 hover:bg-blue-900',
    rarity: 'rare'
  },
  MISFIRE: {
    id: 'MISFIRE',
    name: 'Misfire Kit',
    description: 'Auto-jam next trigger pull. Cancels one shot.',
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'text-blue-400',
    bg: 'bg-blue-950/50 border-blue-800 hover:bg-blue-900',
    rarity: 'rare'
  },
  SCOPE: {
    id: 'SCOPE',
    name: 'Scope Peek',
    description: 'Reveal if current chamber is live or blank.',
    icon: <Eye className="w-5 h-5" />,
    color: 'text-blue-400',
    bg: 'bg-blue-950/50 border-blue-800 hover:bg-blue-900',
    rarity: 'rare'
  },
  SECOND_CHANCE: {
    id: 'SECOND_CHANCE',
    name: 'Second Chance',
    description: 'Survive fatal damage with 1 HP this turn.',
    icon: <Activity className="w-5 h-5" />,
    color: 'text-blue-400',
    bg: 'bg-blue-950/50 border-blue-800 hover:bg-blue-900',
    rarity: 'rare'
  },

  // EPIC (Purple) - 10%
  LOOT_BOX: {
    id: 'LOOT_BOX',
    name: 'Supply Crate',
    description: 'Get 2 random items immediately.',
    icon: <Gift className="w-5 h-5" />,
    color: 'text-purple-400',
    bg: 'bg-purple-950/50 border-purple-800 hover:bg-purple-900',
    rarity: 'epic'
  },
  C4: {
    id: 'C4',
    name: 'C4 Explosive',
    description: 'Plant bomb on enemy. Explodes in 3 turns.',
    icon: <Bomb className="w-5 h-5" />,
    color: 'text-purple-400',
    bg: 'bg-purple-950/50 border-purple-800 hover:bg-purple-900',
    rarity: 'epic'
  },
  ADRENALINE: {
    id: 'ADRENALINE',
    name: 'Adrenaline Shot',
    description: 'Take another action this turn (Shooting won\'t end turn).',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-purple-400',
    bg: 'bg-purple-950/50 border-purple-800 hover:bg-purple-900',
    rarity: 'epic'
  },
  MAGNET: {
    id: 'MAGNET',
    name: 'Magnetic Pull',
    description: 'Force opponent to pull trigger twice next turn.',
    icon: <Magnet className="w-5 h-5" />,
    color: 'text-purple-400',
    bg: 'bg-purple-950/50 border-purple-800 hover:bg-purple-900',
    rarity: 'epic'
  },

  // LEGENDARY (Yellow) - 5%
  FULL_AUTO: {
    id: 'FULL_AUTO',
    name: 'Full Auto',
    description: 'Unload cylinder on opponent. Guaranteed Hit.',
    icon: <Flame className="w-5 h-5" />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-950/50 border-yellow-700 hover:bg-yellow-900',
    rarity: 'legendary'
  },
  HEAVY_ARMOR: {
    id: 'HEAVY_ARMOR',
    name: 'Heavy Armor',
    description: 'Gain 3 Layers of Armor.',
    icon: <Layers className="w-5 h-5" />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-950/50 border-yellow-700 hover:bg-yellow-900',
    rarity: 'legendary'
  },
  RICOCHET: {
    id: 'RICOCHET',
    name: 'Ricochet',
    description: 'If you shoot yourself, damage hits opponent instead.',
    icon: <CornerUpLeft className="w-5 h-5" />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-950/50 border-yellow-700 hover:bg-yellow-900',
    rarity: 'legendary'
  },
  CLUSTER: {
    id: 'CLUSTER',
    name: 'Cluster Round',
    description: 'Next live shot hits BOTH players for 1 DMG.',
    icon: <Users className="w-5 h-5" />,
    color: 'text-yellow-400',
    bg: 'bg-yellow-950/50 border-yellow-700 hover:bg-yellow-900',
    rarity: 'legendary'
  }
};

const RARITY_COLORS: Record<Rarity, string> = {
  common: 'text-slate-400',
  uncommon: 'text-green-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400'
};

const RARITY_BG: Record<Rarity, string> = {
  common: 'bg-slate-800 border-slate-600',
  uncommon: 'bg-green-900/40 border-green-700',
  rare: 'bg-blue-900/40 border-blue-700',
  epic: 'bg-purple-900/40 border-purple-700',
  legendary: 'bg-yellow-900/40 border-yellow-600'
};

// --- Emotes ---
const EMOTES = [
  { id: 'smile', icon: <Smile className="w-6 h-6 text-yellow-400" /> },
  { id: 'frown', icon: <Frown className="w-6 h-6 text-blue-400" /> },
  { id: 'thumbsup', icon: <ThumbsUp className="w-6 h-6 text-green-400" /> },
  { id: 'thumbsdown', icon: <ThumbsDown className="w-6 h-6 text-red-400" /> },
  { id: 'cool', icon: <span className="text-xl">😎</span> },
  { id: 'angry', icon: <span className="text-xl">🤬</span> },
  { id: 'clown', icon: <span className="text-xl">🤡</span> },
  { id: 'skull', icon: <Skull className="w-6 h-6 text-slate-300" /> },
];

// --- Sound Logic ---
const SoundContext = React.createContext<{
  playSound: (type: 'click' | 'bang' | 'empty' | 'item' | 'equip' | 'firework' | 'beep' | 'magic' | 'dice' | 'scan' | 'scream', weaponModel?: WeaponModel) => void;
}>({ playSound: () => {} });

const useSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSound = useCallback((type: 'click' | 'bang' | 'empty' | 'item' | 'equip' | 'firework' | 'beep' | 'magic' | 'dice' | 'scan' | 'scream', weaponModel: WeaponModel = 'revolver') => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'click': // Sharp tick
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      case 'dice': // Rolling sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'scan': // High tech scan
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(1600, now + 0.5);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case 'scream': // Jumpscare Scream
        const screamOsc1 = ctx.createOscillator();
        const screamOsc2 = ctx.createOscillator();
        const screamGain = ctx.createGain();
        screamOsc1.connect(screamGain);
        screamOsc2.connect(screamGain);
        screamGain.connect(ctx.destination);
        
        screamOsc1.type = 'sawtooth';
        screamOsc2.type = 'square';
        
        screamOsc1.frequency.setValueAtTime(400, now);
        screamOsc1.frequency.linearRampToValueAtTime(800, now + 0.1);
        screamOsc1.frequency.exponentialRampToValueAtTime(100, now + 0.4);

        screamOsc2.frequency.setValueAtTime(500, now);
        screamOsc2.frequency.linearRampToValueAtTime(200, now + 0.4);
        
        screamGain.gain.setValueAtTime(0.8, now);
        screamGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        screamOsc1.start(now);
        screamOsc2.start(now);
        screamOsc1.stop(now + 0.4);
        screamOsc2.stop(now + 0.4);
        break;
      case 'bang': 
        // Unique sounds per weapon
        if (weaponModel === 'shotgun') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(60, now);
            osc.frequency.exponentialRampToValueAtTime(10, now + 0.8);
            gainNode.gain.setValueAtTime(0.6, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
            osc.start(now);
            osc.stop(now + 0.8);
        } else if (weaponModel === 'rifle' || weaponModel === 'smg') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
            gainNode.gain.setValueAtTime(0.4, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (weaponModel === 'sniper') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(5, now + 1.2);
            gainNode.gain.setValueAtTime(0.7, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
            osc.start(now);
            osc.stop(now + 1.2);
        } else if (weaponModel === 'rpg') {
            const noise = ctx.createBufferSource();
            const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, now);
            filter.frequency.linearRampToValueAtTime(10, now + 2);
            noise.connect(filter).connect(gainNode);
            gainNode.gain.setValueAtTime(1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2);
            noise.start(now);
            noise.stop(now + 2);
        } else if (weaponModel === 'raygun') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.5);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        }
        break;
      case 'empty': // Mechanical clunk
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'item': // Chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.1);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'equip': // Low thud
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'firework': // Whistle then pop
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.3);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(100, now + 0.3);
        osc2.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
        gain2.gain.setValueAtTime(0.2, now + 0.3);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc2.start(now + 0.3);
        osc2.stop(now + 0.5);
        break;
      case 'beep': // Electronic beep
        osc.type = 'square';
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.setValueAtTime(2000, now + 0.1);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'magic': // Magic chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.5);
        gainNode.gain.setValueAtTime(0.05, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
    }
  }, []);

  return playSound;
};

// --- Components ---

const ScopeVisual = ({ result, visible }: { result: 'live' | 'blank' | null, visible: boolean }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
            {/* Scanner Overlay */}
            <div className="absolute inset-0 bg-emerald-900/10 scanline"></div>
            
            <div className="relative w-64 h-64 border-4 border-emerald-500 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in zoom-in duration-300 shadow-[0_0_50px_rgba(16,185,129,0.5)] overflow-hidden">
                 {/* Crosshair */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-50">
                    <div className="w-full h-0.5 bg-emerald-500"></div>
                    <div className="h-full w-0.5 bg-emerald-500 absolute"></div>
                    <div className="w-48 h-48 border border-emerald-500/50 rounded-full"></div>
                    <div className="w-32 h-32 border border-emerald-500/50 rounded-full"></div>
                 </div>

                 {/* Scan Line Animation */}
                 <div className="absolute top-0 w-full h-2 bg-emerald-400/50 shadow-[0_0_20px_#34d399] animate-[scan_1.5s_linear_infinite]"></div>

                 {/* Result */}
                 <div className="z-10 text-center font-mono font-black tracking-widest text-2xl drop-shadow-lg">
                    {result === null ? (
                        <div className="text-emerald-400 animate-pulse">ANALYZING...</div>
                    ) : result === 'live' ? (
                        <div className="flex flex-col items-center animate-in zoom-in slide-in-from-bottom-5">
                            <AlertOctagon className="w-16 h-16 text-red-500 mb-2 animate-bounce" />
                            <span className="text-red-500 text-3xl">LIVE ROUND</span>
                            <span className="text-red-400 text-sm mt-1">DANGER DETECTED</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center animate-in zoom-in slide-in-from-bottom-5">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-2" />
                            <span className="text-emerald-400 text-3xl">BLANK</span>
                            <span className="text-emerald-300 text-sm mt-1">SAFE TO FIRE</span>
                        </div>
                    )}
                 </div>
            </div>
            
            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

/**
 * Animated Stickman representing a player sitting on a chair.
 */
const Stickman = ({ 
  player, 
  action, // 'IDLE' | 'CLICK' | 'BANG' | 'AIM_FORWARD' | 'RAPID_FIRE'
  isDead,
  hasGun,
  weaponSkin,
  weaponModel,
  skin,
  shieldCount,
  isDoubleDamage,
  showStand,
  standActive,
  bombTimer,
  activeEmote,
  gojoBlindfoldRemoved,
  lives,
  isExploding
}: { 
  player: 1 | 2; 
  action: 'IDLE' | 'CLICK' | 'BANG' | 'AIM_FORWARD' | 'RAPID_FIRE';
  isDead: boolean;
  hasGun: boolean;
  weaponSkin: WeaponSkin;
  weaponModel: WeaponModel;
  skin: SkinType;
  shieldCount: number;
  isDoubleDamage: boolean;
  showStand: boolean;
  standActive: boolean;
  bombTimer: number | null;
  activeEmote: React.ReactNode | null;
  gojoBlindfoldRemoved: boolean;
  lives: number;
  isExploding: boolean;
}) => {
  const isFlipped = player === 2;
  const gunColors = WEAPON_SKINS[weaponSkin].colors;
  const skinColors = SKINS[skin].colors;
  
  let armRotation = 0;
  let armOrigin = '100px 80px';
  
  if (hasGun) {
      if (action === 'IDLE') armRotation = -10; 
      if (action === 'CLICK') armRotation = -20;
      if (action === 'BANG') armRotation = -45; 
      if (action === 'AIM_FORWARD' || action === 'RAPID_FIRE') armRotation = 90; 
  }

  return (
    <div className={`relative w-24 h-24 md:w-56 md:h-56 transition-all duration-500 ${isDead ? 'opacity-80 grayscale' : ''}`}>
      {/* Speech Bubble / Emote */}
      {activeEmote && !isDead && (
          <div className={`absolute -top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300`}>
              <div className={`bg-white text-slate-900 px-3 py-2 rounded-xl rounded-bl-none shadow-lg border-2 border-slate-200 flex items-center justify-center transform ${isFlipped ? 'scale-x-[-1]' : ''}`}>
                  <div className={`transform ${isFlipped ? 'scale-x-[-1]' : ''}`}>
                      {activeEmote}
                  </div>
              </div>
          </div>
      )}

      {/* Comic Explosion Effect */}
      {isExploding && (
         <div className="absolute inset-0 z-50 flex items-center justify-center animate-ping">
             <div className="relative">
                 <svg viewBox="0 0 100 100" className="w-48 h-48 text-yellow-500 fill-current drop-shadow-xl overflow-visible">
                     <path d="M 50 0 L 60 20 L 80 10 L 70 30 L 90 40 L 65 50 L 90 60 L 70 70 L 80 90 L 60 80 L 50 100 L 40 80 L 20 90 L 30 70 L 10 60 L 35 50 L 10 40 L 30 30 L 20 10 L 40 20 Z" />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-3xl font-black text-red-600 italic tracking-widest drop-shadow-lg" style={{ WebkitTextStroke: '1px black' }}>BOOM!</span>
                 </div>
             </div>
         </div>
      )}

      {shieldCount > 0 && !isDead && (
         <div className={`absolute inset-0 z-0 animate-pulse bg-cyan-500/20 rounded-full blur-xl transform scale-75 md:scale-100 transition-opacity duration-300 ${shieldCount > 1 ? 'opacity-60' : 'opacity-30'}`}></div>
      )}
      
      {/* Star Platinum Stand - IMPROVED */}
      {(standActive || showStand) && skin === 'jotaro' && !isDead && (
          <div className={`absolute top-0 bottom-0 w-32 md:w-40 h-48 md:h-64 z-[-5] pointer-events-none transition-all duration-500 animate-in fade-in zoom-in duration-500
              ${isFlipped ? '-right-16 md:-right-24' : '-left-16 md:-left-24'}`}>
             <svg viewBox="0 0 200 300" className="w-full h-full opacity-80 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <defs>
                    <linearGradient id="standSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#4c1d95" />
                    </linearGradient>
                    <linearGradient id="standHair" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#000" />
                        <stop offset="100%" stopColor="#2e1065" />
                    </linearGradient>
                    <filter id="standGlow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <g className="animate-[float_3s_ease-in-out_infinite]" transform={isFlipped ? "scale(-1, 1) translate(-200, 0)" : ""}>
                    {/* Hair */}
                    <path d="M 60 50 Q 100 0 140 50 L 145 100 Q 150 120 130 110 L 100 120 L 70 110 Q 50 120 55 100 Z" fill="url(#standHair)" />
                    
                    {/* Body */}
                    <path d="M 60 100 Q 40 120 50 180 L 150 180 Q 160 120 140 100" fill="url(#standSkin)" stroke="#7c3aed" strokeWidth="2" />
                    
                    {/* Chest Armor */}
                    <path d="M 60 180 Q 100 240 140 180" fill="none" stroke="#f59e0b" strokeWidth="3" />
                    
                    {/* Shoulder Pads */}
                    <circle cx="45" cy="110" r="15" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
                    <circle cx="155" cy="110" r="15" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />

                    {/* Arms */}
                    <path d="M 50 180 L 30 240 L 80 240" stroke="url(#standSkin)" strokeWidth="20" strokeLinecap="round" />
                    <path d="M 150 180 L 170 240 L 120 240" stroke="url(#standSkin)" strokeWidth="20" strokeLinecap="round" />
                    
                    {/* Face Markings */}
                    <path d="M 85 90 L 115 90" stroke="#f59e0b" strokeWidth="2" />
                </g>
             </svg>
          </div>
      )}
      
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] overflow-visible relative z-10"
        style={{ transform: isFlipped ? 'scaleX(-1)' : 'none' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(10, 0)"> {/* Centering Correction */}
        
        {/* Blood Puddle */}
        {!isDead && lives < 3 && (
            <ellipse 
                cx="100" 
                cy="190" 
                rx={lives === 2 ? 20 : 40} 
                ry={lives === 2 ? 5 : 10} 
                fill="#7f1d1d" 
                opacity="0.6" 
                className="animate-pulse"
            />
        )}
        {isDead && (
            <path 
                d="M 50 190 Q 20 200 40 220 Q 80 230 120 220 Q 180 210 160 190 Q 140 180 100 185 Q 70 180 50 190" 
                fill="#7f1d1d" 
                opacity="0.8" 
            />
        )}

        {/* Chair */}
        <g stroke="#94a3b8" strokeWidth="4" strokeLinecap="round">
            <line x1="70" y1="140" x2="70" y2="80" />
            <line x1="70" y1="80" x2="60" y2="75" /> 
            <line x1="70" y1="140" x2="110" y2="140" />
            <line x1="70" y1="140" x2="65" y2="190" />
            <line x1="105" y1="140" x2="105" y2="190" />
        </g>

        <g 
          className={`transition-transform duration-700 ease-in-out ${isDead ? '-rotate-[30deg] translate-x-[-20px] translate-y-[10px]' : ''}`}
          style={{ transformOrigin: '70px 140px' }}
        >
          {skin === 'jotaro' && (
             <path d="M 85 80 Q 75 140 70 180 L 115 180 Q 125 140 115 80" fill={skinColors.primary} stroke="#0f172a" strokeWidth="2" />
          )}

          {skin === 'gojo' && (
             <path d="M 85 80 Q 75 140 70 180 L 115 180 Q 125 140 115 80" fill="#0f172a" stroke="#000" strokeWidth="2" />
          )}

          {skin === 'freddy' && (
             <path d="M 85 80 Q 75 140 70 180 L 115 180 Q 125 140 115 80" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          )}

          {skin === 'miku' && (
            <g>
              <path d="M 85 55 Q 60 40 50 120 Q 65 140 75 110" fill="none" stroke={skinColors.primary} strokeWidth="16" strokeLinecap="round" />
              <path d="M 115 55 Q 140 40 150 120 Q 135 140 125 110" fill="none" stroke={skinColors.primary} strokeWidth="16" strokeLinecap="round" />
            </g>
          )}

          {skin === 'miku' ? (
             <g>
                <line x1="100" y1="130" x2="120" y2="133" stroke="#fce7f3" strokeWidth="7" strokeLinecap="round" />
                <line x1="120" y1="133" x2="135" y2="135" stroke="#fce7f3" strokeWidth="7" strokeLinecap="round" />
                <path d="M 125 135 L 135 135 L 135 185 L 125 185 Z" fill="#1e293b" />
                <line x1="135" y1="135" x2="135" y2="185" stroke="#39c5bb" strokeWidth="2" strokeDasharray="60" strokeDashoffset="0" opacity="0.5" />
             </g>
          ) : skin === 'jotaro' ? (
             <g>
                <path d="M 100 130 Q 120 135 135 135 L 135 185" stroke={skinColors.primary} strokeWidth="10" fill="none" strokeLinecap="round" />
             </g>
          ) : skin === 'gojo' ? (
             <g>
                <path d="M 100 130 Q 120 135 135 135 L 135 185" stroke="#0f172a" strokeWidth="10" fill="none" strokeLinecap="round" />
             </g>
          ) : skin === 'freddy' ? (
             <g>
                <path d="M 100 130 Q 120 135 135 135 L 135 185" stroke="#78350f" strokeWidth="10" fill="none" strokeLinecap="round" />
             </g>
          ) : (
             <>
              <line x1="100" y1="130" x2="135" y2="135" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
              <line x1="135" y1="135" x2="135" y2="185" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
             </>
          )}

          {skin === 'miku' ? (
            <g>
              <rect x="90" y="75" width="20" height="55" rx="3" fill="#cbd5e1" />
              <path d="M 90 75 L 100 85 L 110 75" fill="none" stroke={skinColors.primary} strokeWidth="2" />
              <path d="M 100 85 L 95 105 L 105 105 Z" fill={skinColors.primary} />
              <path d="M 88 128 L 112 128 L 120 145 L 80 145 Z" fill="#1e293b" />
              <path d="M 88 128 L 80 145 M 96 128 L 93 145 M 104 128 L 107 145 M 112 128 L 120 145" stroke="#334155" strokeWidth="1" />
            </g>
          ) : skin === 'jotaro' ? (
            <g>
               <rect x="88" y="70" width="24" height="65" rx="2" fill={skinColors.primary} />
               <path d="M 100 70 L 100 135" stroke="#000" strokeWidth="2" opacity="0.3" />
               <path d="M 88 70 L 85 60 L 115 60 L 112 70" fill={skinColors.primary} />
               <path d="M 92 75 Q 85 90 100 80" stroke={skinColors.accent} strokeWidth="2" fill="none" />
               <circle cx="94" cy="85" r="2" fill={skinColors.accent} />
               <circle cx="94" cy="100" r="2" fill={skinColors.accent} />
               <circle cx="94" cy="115" r="2" fill={skinColors.accent} />
            </g>
          ) : skin === 'gojo' ? (
            <g>
               <rect x="88" y="70" width="24" height="65" rx="2" fill="#0f172a" />
               <path d="M 88 70 L 85 60 L 115 60 L 112 70" fill="#0f172a" />
               <path d="M 100 70 L 100 135" stroke="#000" strokeWidth="2" opacity="0.3" />
               <rect x="88" y="70" width="24" height="50" rx="1" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.3" />
            </g>
          ) : skin === 'freddy' ? (
             <g>
                <rect x="85" y="70" width="30" height="70" rx="4" fill="#78350f" />
                <path d="M 85 70 L 115 70 L 110 130 L 90 130 Z" fill="#92400e" opacity="0.5" />
                <path d="M 90 75 L 110 75 L 100 90 Z" fill="black" /> {/* Bowtie */}
                <circle cx="100" cy="80" r="2" fill="white" opacity="0.5" />
                <circle cx="100" cy="100" r="2" fill="black" opacity="0.5" />
             </g>
          ) : (
             <line x1="100" y1="70" x2="100" y2="130" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
          )}

          {/* C4 Attachment */}
          {bombTimer !== null && (
              <g transform="translate(90, 85) scale(0.6)">
                  <rect x="0" y="0" width="20" height="30" rx="2" fill="#7f1d1d" stroke="#fca5a5" strokeWidth="2" />
                  <rect x="2" y="4" width="16" height="10" fill="#000" />
                  <text x="10" y="12" textAnchor="middle" fill="red" fontSize="8" fontWeight="bold" fontFamily="monospace">
                      00:0{bombTimer}
                  </text>
                  <path d="M 2 20 L 18 20" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 2" />
                  <circle cx="10" cy="25" r="2" fill="red" className="animate-pulse" />
              </g>
          )}

          <g className={`transition-transform origin-center ${action === 'CLICK' && hasGun ? 'animate-[shake_0.5s]' : ''} ${isDead ? 'translate-x-[-5px] translate-y-[5px] rotate-[-20deg]' : ''}`}>
             <circle cx="100" cy="50" r="22" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
             {skin === 'jotaro' && (
                <g>
                  <path d="M 75 45 Q 75 15 100 15 Q 125 15 125 45" fill={skinColors.primary} />
                  <path d="M 78 45 L 85 30 L 95 40 L 105 30 L 115 40 L 122 30 L 125 45" fill={skinColors.primary} />
                  <path d="M 78 48 L 135 52 L 122 40" fill={skinColors.primary} />
                  <rect x="95" y="30" width="10" height="6" fill={skinColors.accent} />
                </g>
             )}
             {skin === 'freddy' && (
                <g>
                    {/* Head Color */}
                    <circle cx="100" cy="50" r="24" fill="#78350f" stroke="#451a03" strokeWidth="1" />
                    {/* Snout */}
                    <ellipse cx="100" cy="58" rx="10" ry="6" fill="#a16207" />
                    <circle cx="100" cy="55" r="3" fill="black" />
                    {/* Ears */}
                    <circle cx="78" cy="35" r="8" fill="#78350f" />
                    <circle cx="122" cy="35" r="8" fill="#78350f" />
                    {/* Top Hat */}
                    <rect x="85" y="15" width="30" height="20" fill="black" />
                    <rect x="80" y="35" width="40" height="5" fill="black" />
                    {/* Eyes */}
                    <circle cx="90" cy="48" r="4" fill="white" />
                    <circle cx="90" cy="48" r="1.5" fill="blue" className="animate-pulse" />
                    <circle cx="110" cy="48" r="4" fill="white" />
                    <circle cx="110" cy="48" r="1.5" fill="blue" className="animate-pulse" />
                </g>
             )}
             {skin === 'gojo' && (
                <g>
                  {/* Spiky White Hair (Redrawn for better accuracy) */}
                   <path d="M 70 40 L 75 15 L 85 30 L 95 5 L 105 25 L 115 5 L 125 30 L 130 15 L 130 40 L 132 45 L 132 50 L 68 50 L 68 45 Z" fill="#fff" stroke="#cbd5e1" strokeWidth="1" strokeLinejoin="round" />
                  
                  {/* Blindfold or Eyes */}
                  {!gojoBlindfoldRemoved ? (
                      <g>
                         <rect x="76" y="42" width="48" height="14" fill="#000" rx="2" />
                         <path d="M 76 49 L 124 49" stroke="#333" strokeWidth="1" />
                      </g>
                  ) : (
                      <g>
                          {/* Six Eyes (Blue) */}
                         <circle cx="90" cy="50" r="3" fill="#60a5fa" className="animate-pulse" />
                         <circle cx="90" cy="50" r="1.5" fill="#dbeafe" />
                         <circle cx="110" cy="50" r="3" fill="#60a5fa" className="animate-pulse" />
                         <circle cx="110" cy="50" r="1.5" fill="#dbeafe" />
                         <path d="M 90 50 Q 100 55 110 50" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
                      </g>
                  )}
                </g>
             )}
             {skin === 'miku' && (
               <g>
                 <path d="M 78 50 C 78 20, 122 20, 122 50 C 122 55, 115 50, 110 55 C 105 50, 95 50, 90 55 C 85 50, 78 55, 78 50" fill={skinColors.primary} />
                 <rect x="76" y="42" width="12" height="12" fill="#1e1b4b" transform="rotate(-15 82 48)" />
                 <rect x="112" y="42" width="12" height="12" fill="#1e1b4b" transform="rotate(15 118 48)" />
                 <path d="M 122 55 L 115 65" stroke="#000" strokeWidth="1" />
               </g>
             )}
             {isDead ? (
               <g stroke="#ef4444" strokeWidth="3">
                 <line x1="90" y1="45" x2="100" y2="55" />
                 <line x1="100" y1="45" x2="90" y2="55" />
                 <line x1="105" y1="45" x2="115" y2="55" />
                 <line x1="115" y1="45" x2="105" y2="55" />
               </g>
             ) : (
               <g fill="#1e293b">
                 {hasGun && (action === 'IDLE' || action === 'AIM_FORWARD') && skin !== 'gojo' && skin !== 'freddy' && <circle cx="118" cy="35" r="2" className="animate-ping text-blue-400 opacity-75" fill="#60a5fa" />}
               </g>
             )}
          </g>

          {hasGun ? (
              <g 
                className={`transition-transform duration-200 ${action === 'RAPID_FIRE' ? 'animate-[shake_0.1s_infinite]' : ''}`}
                style={{ transformOrigin: armOrigin, transform: `rotate(${armRotation}deg)` }}
              >
                {skin === 'miku' ? (
                  <g>
                     <line x1="100" y1="80" x2="115" y2="80" stroke="#fce7f3" strokeWidth="6" strokeLinecap="round" />
                     <line x1="115" y1="80" x2="135" y2="80" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
                     <line x1="135" y1="80" x2="120" y2="55" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
                     <circle cx="120" cy="55" r="3" fill="#fce7f3" />
                  </g>
                ) : skin === 'jotaro' ? (
                  <g>
                    <path d="M 100 80 L 135 80 L 120 55" stroke={skinColors.primary} strokeWidth="8" fill="none" strokeLinecap="round" />
                    <circle cx="120" cy="55" r="3" fill="#fce7f3" />
                  </g>
                ) : skin === 'gojo' ? (
                  <g>
                    <path d="M 100 80 L 135 80 L 120 55" stroke="#0f172a" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <circle cx="120" cy="55" r="3" fill="#fce7f3" />
                  </g>
                ) : skin === 'freddy' ? (
                  <g>
                    <path d="M 100 80 L 135 80 L 120 55" stroke="#78350f" strokeWidth="8" fill="none" strokeLinecap="round" />
                    <circle cx="120" cy="55" r="3" fill="#fce7f3" />
                  </g>
                ) : (
                  <>
                    <line x1="100" y1="80" x2="135" y2="80" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                    <line x1="135" y1="80" x2="120" y2="55" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                  </>
                )}

                <g transform="translate(115, 45) rotate(-10)">
                   {isDoubleDamage && (
                      <circle cx="0" cy="5" r="15" className="animate-pulse" fill="rgba(255, 0, 0, 0.4)" filter="url(#glow)" />
                   )}

                   {weaponModel === 'shotgun' ? (
                      <g transform="scale(0.8) translate(-10, -5)">
                         <rect x="-5" y="0" width="40" height="8" fill={gunColors.barrel} rx="1" />
                         <rect x="0" y="8" width="15" height="5" fill={gunColors.grip} rx="1" transform="skewX(-20)"/>
                         <rect x="-10" y="2" width="20" height="8" fill={gunColors.body} rx="1" />
                         <path d="M -10 5 L -20 15 L -10 15 Z" fill="#2c2c2c" />
                         <rect x="-15" y="10" width="8" height="10" fill={gunColors.grip} rx="2" transform="rotate(10)" />
                      </g>
                   ) : weaponModel === 'rifle' ? (
                      <g transform="scale(0.7) translate(-10, -10)">
                         <rect x="0" y="0" width="45" height="6" fill={gunColors.barrel} />
                         <rect x="5" y="-5" width="25" height="6" fill={gunColors.barrel} opacity="0.8" />
                         <rect x="-10" y="0" width="20" height="10" fill={gunColors.body} />
                         <rect x="-5" y="10" width="6" height="15" fill="#111" />
                         <path d="M -10 2 L -25 5 L -25 15 L -10 10 Z" fill="#2c2c2c" />
                         <rect x="-12" y="8" width="6" height="12" fill={gunColors.grip} transform="rotate(15)"/>
                         <path d="M 0 -8 L 5 0 L 15 0 L 12 -8 Z" fill="#111" />
                      </g>
                   ) : weaponModel === 'sniper' ? (
                      <g transform="scale(0.8) translate(-15, -10)">
                         <rect x="0" y="0" width="55" height="5" fill={gunColors.barrel} />
                         <rect x="-10" y="0" width="25" height="8" fill={gunColors.body} />
                         <path d="M -10 4 L -25 10 L -10 10 Z" fill="#2c2c2c" />
                         <rect x="-8" y="8" width="8" height="10" fill={gunColors.grip} transform="rotate(10)" />
                         <rect x="5" y="-6" width="25" height="4" fill="#111" rx="1" />
                         <line x1="5" y1="-2" x2="5" y2="0" stroke="#111" strokeWidth="2" />
                         <line x1="30" y1="-2" x2="30" y2="0" stroke="#111" strokeWidth="2" />
                      </g>
                   ) : weaponModel === 'smg' ? (
                      <g transform="scale(0.7) translate(-5, -5)">
                         <rect x="0" y="0" width="30" height="8" fill={gunColors.body} rx="1" />
                         <rect x="25" y="2" width="10" height="4" fill={gunColors.barrel} />
                         <rect x="5" y="8" width="8" height="12" fill={gunColors.grip} />
                         <rect x="15" y="8" width="6" height="15" fill="#111" /> {/* Mag */}
                         <path d="M 0 0 L -5 5 L 0 8 Z" fill="#2c2c2c" />
                      </g>
                   ) : weaponModel === 'rpg' ? (
                      <g transform="scale(0.8) translate(-20, -10)">
                         <rect x="-10" y="0" width="60" height="10" fill="#3f6212" rx="2" />
                         <path d="M 50 -2 L 65 5 L 50 12 Z" fill="#7f1d1d" /> {/* Warhead */}
                         <rect x="10" y="10" width="8" height="10" fill="#111" />
                         <rect x="30" y="10" width="8" height="10" fill="#111" />
                         <rect x="-10" y="-2" width="5" height="14" fill="#111" />
                      </g>
                   ) : weaponModel === 'raygun' ? (
                      <g transform="scale(0.8) translate(-5, -5)">
                         <path d="M 0 0 Q 20 -10 40 5 L 40 10 Q 20 20 0 10 Z" fill={gunColors.body} />
                         <circle cx="35" cy="7" r="3" fill="#06b6d4" className="animate-pulse" />
                         <circle cx="25" cy="5" r="3" fill="#06b6d4" className="animate-pulse" />
                         <rect x="5" y="10" width="8" height="10" fill={gunColors.grip} transform="rotate(10)" />
                         <circle cx="40" cy="7" r="10" stroke="#06b6d4" strokeWidth="1" fill="none" opacity="0.5" />
                      </g>
                   ) : (
                      <g>
                        <rect x="0" y="0" width="16" height="10" fill={gunColors.body} rx="2" />
                        <rect x="-4" y="2" width="24" height="6" fill={gunColors.barrel} rx="1" />
                        <rect x="-2" y="8" width="8" height="12" fill={gunColors.grip} rx="2" transform="rotate(15)" />
                      </g>
                   )}
                </g>
              </g>
          ) : (
             <g>
                {skin === 'miku' ? (
                  <g>
                    <line x1="100" y1="80" x2="110" y2="90" stroke="#fce7f3" strokeWidth="6" strokeLinecap="round" />
                    <line x1="110" y1="90" x2="125" y2="100" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
                    <line x1="125" y1="100" x2="150" y2="105" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
                  </g>
                ) : skin === 'jotaro' ? (
                  <path d="M 100 80 L 125 100 L 150 105" stroke={skinColors.primary} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                ) : skin === 'gojo' ? (
                  <path d="M 100 80 L 125 100 L 150 105" stroke="#0f172a" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                ) : skin === 'freddy' ? (
                  <path d="M 100 80 L 125 100 L 150 105" stroke="#78350f" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <>
                    <line x1="100" y1="80" x2="125" y2="100" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                    <line x1="125" y1="100" x2="150" y2="105" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                  </>
                )}
             </g>
          )}

          {shieldCount > 0 && !isDead && (
              <g transform="translate(160, 100)">
                   <path d="M0,0 Q10,0 10,10 V25 Q10,35 0,40 Q-10,35 -10,25 V10 Q-10,0 0,0" fill={shieldCount > 1 ? "#06b6d4" : "none"} fillOpacity="0.4" stroke="#cffafe" strokeWidth={2 + (shieldCount * 1)} filter="url(#glow)" />
                   {shieldCount > 1 && (
                      <text x="-3" y="25" fill="#fff" fontSize="12" fontWeight="bold">{shieldCount}</text>
                   )}
              </g>
          )}

          {(action === 'BANG' || action === 'RAPID_FIRE') && hasGun && (
            <g transform={action === 'RAPID_FIRE' ? "translate(140, 50)" : "translate(100, 45)"} className="animate-pulse">
               <path d="M0,0 L-20,-10 L-10,0 L-20,10 Z" fill="#fca5a5" filter="url(#glow)" transform={action === 'RAPID_FIRE' ? 'rotate(10)' : ''} />
               <circle cx="-5" cy="0" r="15" fill="#fbbf24" opacity="0.8" filter="url(#glow)" className="animate-ping" />
            </g>
          )}

          {action === 'CLICK' && hasGun && (
            <text x="130" y="30" fill="#fbbf24" fontSize="14" fontFamily="monospace" fontWeight="bold" className="animate-bounce">
              *CLICK*
            </text>
          )}
        </g>
        </g>
      </svg>
    </div>
  );
};

const Cylinder = ({ 
  rotation, 
  fired, 
  spinning,
  firedChambers,
  bulletSkin
}: { 
  rotation: number; 
  fired: boolean;
  spinning: boolean;
  firedChambers: number[];
  bulletSkin: BulletSkin;
}) => {
  return (
    <div className="relative w-24 h-24 md:w-44 md:h-44 mx-auto mb-4 transition-transform duration-700 ease-out"
         style={{ transform: `rotate(${rotation}deg)` }}>
      <div className="absolute inset-0 rounded-full border-8 border-slate-700 bg-slate-800 shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-slate-600 rounded-full shadow-inner border border-slate-500 flex items-center justify-center z-10">
            <div className="w-3 h-3 bg-slate-400 rounded-full shadow-md"></div>
        </div>
        
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const angle = index * 60;
          const radius = 35; 
          const top = 50 - radius * Math.cos((angle * Math.PI) / 180);
          const left = 50 + radius * Math.sin((angle * Math.PI) / 180);
          const isFired = firedChambers.includes(index);
          const skin = BULLET_SKINS[bulletSkin];

          return (
            <div
              key={index}
              className="absolute w-5 h-5 md:w-8 md:h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-900 bg-black shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
               {isFired ? (
                  <div className="w-full h-full bg-black shadow-inner"></div>
               ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center relative shadow-inner"
                        style={{ backgroundColor: skin.colors.casing }}>
                      <div className="absolute inset-1 rounded-full border border-dashed opacity-50"
                            style={{ borderColor: skin.colors.ring }}></div>
                      <div className={`w-1/2 h-1/2 rounded-full shadow-md flex items-center justify-center`}
                            style={{ backgroundColor: skin.colors.primer }}>
                      </div>
                  </div>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PlayerCard = ({ 
  name, 
  isTurn, 
  status, 
  lives,
  visible,
  shieldCount,
  bombTimer,
  isAI,
  hasSecondChance,
  forcedShots
}: { 
  name: string; 
  isTurn: boolean; 
  status: 'alive' | 'dead'; 
  lives: number;
  visible: boolean;
  shieldCount: number;
  bombTimer: number | null;
  isAI?: boolean;
  hasSecondChance?: boolean;
  forcedShots?: number;
}) => {
  if (!visible) return null;

  return (
    <div className={`flex flex-col items-center transition-all duration-500 ${isTurn ? 'scale-110 opacity-100 z-20' : 'scale-90 opacity-60 z-10'}`}>
      <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center mb-2 bg-slate-800 transition-colors duration-300
        ${status === 'dead' ? 'border-red-600 bg-red-950' : isTurn ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-slate-600'}`}>
        
        {status === 'dead' ? (
           <Skull className="w-8 h-8 text-red-500 animate-[pulse_0.2s_ease-in-out_infinite]" />
        ) : isAI ? (
           <Bot className="w-8 h-8 text-cyan-400" />
        ) : (
           <div className="text-xl font-bold text-slate-300 font-mono">{name.split(' ')[1]}</div>
        )}
        
        {shieldCount > 0 && status === 'alive' && (
           <div className="absolute -right-3 -top-2 bg-cyan-900 border border-cyan-500 text-cyan-200 px-1.5 py-0.5 rounded-full shadow-lg animate-pulse flex items-center gap-0.5">
              <Shield className="w-3 h-3" />
              <span className="text-[10px] font-bold">+{shieldCount}</span>
           </div>
        )}

        {hasSecondChance && status === 'alive' && (
           <div className="absolute -right-3 top-5 bg-emerald-900 border border-emerald-500 text-emerald-200 px-1.5 py-0.5 rounded-full shadow-lg animate-pulse flex items-center gap-0.5">
              <Activity className="w-3 h-3" />
           </div>
        )}
        
        {forcedShots && forcedShots > 0 && status === 'alive' && (
           <div className="absolute -left-3 top-5 bg-purple-900 border border-purple-500 text-purple-200 px-1.5 py-0.5 rounded-full shadow-lg animate-pulse flex items-center gap-0.5">
              <Magnet className="w-3 h-3" />
              <span className="text-[10px] font-bold">x{forcedShots}</span>
           </div>
        )}

        {bombTimer !== null && status === 'alive' && (
           <div className="absolute -left-3 -top-2 bg-red-900 border border-red-500 text-red-200 px-1.5 py-0.5 rounded-full shadow-lg animate-pulse flex items-center gap-0.5">
              <Bomb className="w-3 h-3" />
              <span className="text-[10px] font-bold">{bombTimer}</span>
           </div>
        )}

        {isTurn && status === 'alive' && (
          <div className="absolute -bottom-2 px-2 py-0.5 bg-yellow-600 text-yellow-50 text-[8px] font-bold uppercase rounded-full tracking-widest border border-slate-900 shadow-lg whitespace-nowrap">
            Turn
          </div>
        )}
      </div>
      
      <h2 className={`text-sm md:text-base font-bold tracking-widest ${isTurn ? 'text-white' : 'text-slate-500'}`}>{name}</h2>

      <div className="flex gap-1 mt-1 mb-2 bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm border border-slate-800">
        {[1, 2, 3].map((i) => (
          <Heart 
            key={i} 
            className={`w-3 h-3 md:w-4 md:h-4 ${i <= lives ? 'fill-red-500 text-red-500' : 'fill-slate-800 text-slate-700'}`} 
          />
        ))}
      </div>
    </div>
  );
};

const Selector = <T extends string>({ 
  label,
  options,
  current, 
  onSelect,
  getLabel,
  getColor
}: { 
  label: string;
  options: T[];
  current: T; 
  onSelect: (val: T) => void;
  getLabel: (val: T) => string;
  getColor?: (val: T) => string;
}) => {
  const next = () => {
    const idx = options.indexOf(current);
    onSelect(options[(idx + 1) % options.length]);
  };
  
  const prev = () => {
    const idx = options.indexOf(current);
    onSelect(options[(idx - 1 + options.length) % options.length]);
  };

  return (
    <div className="flex flex-col items-center gap-1 w-full">
      <div className="text-[10px] text-slate-200 tracking-widest uppercase">{label}</div>
      <div className="flex items-center justify-between w-full bg-slate-950 p-1 rounded border border-slate-800">
        <button onClick={prev} className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white shrink-0">
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center justify-center gap-1 flex-1 min-w-0">
            {getColor && (
                <div 
                    className="w-3 h-3 rounded-sm shadow-sm shrink-0 border border-white/20" 
                    style={{ backgroundColor: getColor(current) }}
                />
            )}
            <span className="text-[10px] md:text-xs font-bold text-slate-200 truncate px-0.5">
                {getLabel(current)}
            </span>
        </div>

        <button onClick={next} className="p-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white shrink-0">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const InventoryHud = ({
  p1Items,
  p2Items,
  currentPlayer,
  gameState,
  onUseItem,
  playerSkins,
  onSpecial,
  isAI,
  onEmote
}: {
  p1Items: ItemType[];
  p2Items: ItemType[];
  currentPlayer: 1 | 2;
  gameState: string;
  onUseItem: (player: 1 | 2, item: ItemType, idx: number) => void;
  playerSkins: { 1: SkinType; 2: SkinType };
  onSpecial: () => void;
  isAI: boolean;
  onEmote: () => void;
}) => {
  const [focusedItem, setFocusedItem] = useState<ItemConfig | { name: string; description: string; color: string; icon: React.ReactNode; rarity: string } | null>(null);

  const handleInteraction = (item: ItemType | null) => {
    if (item && ITEMS[item]) {
      setFocusedItem(ITEMS[item]);
    } else {
      setFocusedItem(null);
    }
  };

  const handleSpecialInteraction = (isFocused: boolean) => {
      if (isFocused) {
          const skin = SKINS[playerSkins[currentPlayer]];
          setFocusedItem({
              name: skin.abilityName,
              description: skin.abilityDesc,
              color: 'text-pink-400',
              icon: skin.abilityIcon,
              rarity: 'Special'
          });
      } else {
          setFocusedItem(null);
      }
  };

  const renderSlot = (player: 1 | 2, item: ItemType | null, idx: number) => {
    const config = (item && ITEMS[item]) ? ITEMS[item] : null;
    const isOwnerTurn = player === currentPlayer && gameState === 'PLAYING';
    // Disable interactions for AI items (Player 2 if isAI is true)
    const canInteract = isOwnerTurn && !(isAI && player === 2);

    return (
      <button
        key={idx}
        onClick={() => {
           if (item && canInteract) {
              onUseItem(player, item, idx);
              setFocusedItem(null); 
           }
        }}
        onMouseEnter={() => handleInteraction(item)}
        onMouseLeave={() => handleInteraction(null)}
        onTouchStart={() => handleInteraction(item)}
        disabled={!item || !canInteract}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border flex items-center justify-center transition-all relative overflow-hidden shrink-0
          ${!item ? 'border-slate-800 bg-slate-900/50 opacity-50' : 
            canInteract 
              ? `${config?.bg} border-slate-600 hover:scale-105 cursor-pointer shadow-lg ${config?.rarity === 'legendary' ? 'animate-pulse ring-1 ring-yellow-500' : ''}` 
              : `${config?.bg} border-slate-800 grayscale opacity-60 cursor-not-allowed`
          }
        `}
      >
        {item ? (
          <div className={`transition-transform duration-300 ${config?.color}`}>
             {config?.icon}
          </div>
        ) : (
           <div className="text-slate-800"><Package className="w-4 h-4" /></div>
        )}
        
        <div className="absolute top-0.5 right-1 text-[8px] text-slate-600 font-mono opacity-50">{idx + 1}</div>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 md:p-4 pb-4 md:pb-6 flex items-end justify-center pointer-events-none z-[100]">
       
       {focusedItem && (
          <div className="absolute bottom-[90px] md:bottom-[100px] left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900/95 backdrop-blur-xl border border-slate-600 p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-50 pointer-events-none">
             <div className="flex items-center gap-3 mb-2 pb-2 border-b border-slate-700/50">
                <div className={`p-2 rounded-full bg-slate-800 ${focusedItem.color}`}>
                   {focusedItem.icon}
                </div>
                <div>
                   <div className={`font-black text-sm md:text-base uppercase tracking-wider ${focusedItem.color}`}>
                      {focusedItem.name}
                   </div>
                   <div className="flex gap-2 text-[10px] text-slate-500 font-mono">
                      <span className={focusedItem.rarity === 'Special' ? 'text-pink-400' : RARITY_COLORS[focusedItem.rarity as Rarity]}>{focusedItem.rarity.toUpperCase()}</span>
                      <span>ITEM</span>
                   </div>
                </div>
             </div>
             <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                {focusedItem.description}
             </p>
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-r border-b border-slate-600 rotate-45"></div>
          </div>
       )}

       <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2 md:p-3 shadow-2xl flex items-center gap-4 md:gap-8 pointer-events-auto max-w-full overflow-x-auto no-scrollbar">
          
          <div className={`flex flex-col items-center gap-1 md:gap-2 transition-opacity ${currentPlayer === 1 ? 'opacity-100' : 'opacity-40'}`}>
             <div className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Player 1</div>
             <div className="flex gap-1 md:gap-2">
                {[0, 1, 2].map(i => renderSlot(1, p1Items[i] || null, i))}
             </div>
          </div>

          <div className="h-8 md:h-10 w-px bg-slate-800 shrink-0"></div>

          {/* Special Ability & Emote Button */}
          {gameState === 'PLAYING' && !(isAI && currentPlayer === 2) && (
             <div className="flex gap-2">
                 <div className="flex flex-col items-center justify-center gap-1">
                     <div className="text-[8px] md:text-[10px] font-bold text-pink-500 uppercase tracking-widest">Special</div>
                     <button
                        onClick={onSpecial}
                        onMouseEnter={() => handleSpecialInteraction(true)}
                        onMouseLeave={() => handleSpecialInteraction(false)}
                        onTouchStart={() => handleSpecialInteraction(true)}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-pink-700 bg-pink-950/50 hover:bg-pink-900 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.3)] animate-pulse"
                     >
                         {SKINS[playerSkins[currentPlayer]].abilityIcon}
                     </button>
                 </div>
                 <div className="flex flex-col items-center justify-center gap-1">
                     <div className="text-[8px] md:text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Emote</div>
                     <button
                        onClick={onEmote}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-cyan-700 bg-cyan-950/50 hover:bg-cyan-900 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                     >
                         <MessageCircle className="w-5 h-5 text-cyan-400" />
                     </button>
                 </div>
             </div>
          )}

          <div className="h-8 md:h-10 w-px bg-slate-800 shrink-0"></div>

          <div className={`flex flex-col items-center gap-1 md:gap-2 transition-opacity ${currentPlayer === 2 ? 'opacity-100' : 'opacity-40'}`}>
             <div className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{isAI ? 'CPU' : 'Player 2'}</div>
             <div className="flex gap-1 md:gap-2">
                {[0, 1, 2].map(i => renderSlot(2, p2Items[i] || null, i))}
             </div>
          </div>

       </div>
    </div>
  );
};

const EmotePicker = ({ onSelect, onClose }: { onSelect: (id: string, icon: React.ReactNode) => void, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl grid grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                {EMOTES.map(emote => (
                    <button 
                        key={emote.id} 
                        onClick={() => onSelect(emote.id, emote.icon)}
                        className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-transform hover:scale-110 border border-slate-600"
                    >
                        {emote.icon}
                    </button>
                ))}
            </div>
        </div>
    );
};

const ItemIndexModal = ({ onClose, rarityOverrides, onUpdateRarity }: { 
    onClose: () => void; 
    rarityOverrides: Record<ItemType, Rarity>;
    onUpdateRarity: (item: ItemType, rarity: Rarity) => void;
}) => {
    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-bold text-white tracking-widest uppercase">Item Index & Rules</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400 hover:text-white" />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.values(ITEMS).map((item) => {
                        const currentRarity = rarityOverrides[item.id] || item.rarity;
                        return (
                            <div key={item.id} className={`${RARITY_BG[currentRarity]} rounded-xl p-4 border flex gap-4 transition-colors`}>
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-slate-900/50 border border-slate-700/50`}>
                                    <div className={item.color}>{item.icon}</div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h3 className={`font-bold text-sm uppercase tracking-wider ${item.color}`}>{item.name}</h3>
                                        <div className="relative group">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border border-slate-700 uppercase font-mono bg-slate-900 cursor-pointer hover:bg-slate-800 ${RARITY_COLORS[currentRarity]}`}>
                                                {currentRarity}
                                            </span>
                                            {/* Rarity Dropdown */}
                                            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col gap-1 bg-slate-950 border border-slate-700 p-1 rounded z-50 shadow-xl min-w-[80px]">
                                                {['common', 'uncommon', 'rare', 'epic', 'legendary'].map((r) => (
                                                    <button 
                                                        key={r} 
                                                        onClick={() => onUpdateRarity(item.id, r as Rarity)}
                                                        className={`text-[9px] uppercase px-2 py-1 hover:bg-slate-800 text-left rounded ${RARITY_COLORS[r as Rarity]}`}
                                                    >
                                                        {r}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed opacity-80">{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const DiceRollOverlay = ({ onComplete }: { onComplete: (val: number) => void }) => {
    const [rolling, setRolling] = useState(false);
    const [value, setValue] = useState(1);
    const playSound = useSound();

    const roll = () => {
        if (rolling) return;
        setRolling(true);
        playSound('dice');
        const interval = setInterval(() => {
            setValue(Math.floor(Math.random() * 6) + 1);
        }, 50);

        setTimeout(() => {
            clearInterval(interval);
            const final = Math.floor(Math.random() * 6) + 1;
            setValue(final);
            setRolling(false);
            setTimeout(() => onComplete(final), 1000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
             <div className="text-2xl font-black text-white uppercase tracking-widest mb-10 animate-bounce">Click to Roll</div>
             
             <div 
                onClick={roll}
                className={`w-32 h-32 bg-white rounded-2xl flex items-center justify-center cursor-pointer shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-transform duration-100 ${rolling ? 'animate-spin' : 'hover:scale-110'}`}
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
             >
                 {rolling ? (
                    <Dices className="w-16 h-16 text-slate-800 animate-pulse" />
                 ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-900 font-bold text-6xl">
                        {value === 1 && <div className="w-6 h-6 bg-black rounded-full"></div>}
                        {value === 2 && <div className="flex gap-4"><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div></div>}
                        {value === 3 && <div className="flex gap-2 rotate-45"><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div></div>}
                        {value === 4 && <div className="grid grid-cols-2 gap-4"><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div></div>}
                        {value === 5 && <div className="grid grid-cols-2 gap-4 relative"><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div></div>}
                        {value === 6 && <div className="grid grid-cols-2 gap-x-4 gap-y-2"><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div><div className="w-4 h-4 bg-black rounded-full"></div></div>}
                    </div>
                 )}
             </div>
        </div>
    );
};

const App = () => {
  const [gameState, setGameState] = useState<'SETUP' | 'SPINNING' | 'PLAYING' | 'GAME_OVER' | 'ROUND_OVER'>('SETUP');
  // Create a ref that always holds the current gameState for use in timeouts
  const gameStateRef = useRef(gameState);
  
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [lives, setLives] = useState<{ 1: number; 2: number }>({ 1: 3, 2: 3 });
  
  const [playerSkins, setPlayerSkins] = useState<{ 1: SkinType; 2: SkinType }>({ 1: 'classic', 2: 'classic' });
  const [playerWeaponSkins, setPlayerWeaponSkins] = useState<{ 1: WeaponSkin; 2: WeaponSkin }>({ 1: 'classic', 2: 'classic' });
  const [playerWeaponModels, setPlayerWeaponModels] = useState<{ 1: WeaponModel; 2: WeaponModel }>({ 1: 'revolver', 2: 'revolver' });
  
  const [bulletSkin, setBulletSkin] = useState<BulletSkin>('brass');
  const [background, setBackground] = useState<BackgroundType>('room');
  const [gameMode, setGameMode] = useState<GameMode>('CLASSIC');
  const [rarityOverrides, setRarityOverrides] = useState<Record<ItemType, Rarity>>(
     Object.fromEntries(Object.values(ITEMS).map(i => [i.id, i.rarity])) as Record<ItemType, Rarity>
  );

  const [bulletPosition, setBulletPosition] = useState<number | null>(null);
  const [currentChamber, setCurrentChamber] = useState<number>(0);
  const [firedChambers, setFiredChambers] = useState<number[]>([]);
  const [rotation, setRotation] = useState<number>(0);
  const [winner, setWinner] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [stickmanAction, setStickmanAction] = useState<'IDLE' | 'CLICK' | 'BANG' | 'AIM_FORWARD' | 'RAPID_FIRE'>('IDLE');
  
  const [items, setItems] = useState<{ 1: ItemType[]; 2: ItemType[] }>({ 1: [], 2: [] });
  const [totalTurns, setTotalTurns] = useState(0);
  const [showItemIndex, setShowItemIndex] = useState(false);
  const [isAI, setIsAI] = useState(false);
  
  // Visual FX States
  const [showFirework, setShowFirework] = useState(false);
  const [showGlowSticks, setShowGlowSticks] = useState(false);
  const [showStand, setShowStand] = useState(false);
  const [activeJumpscare, setActiveJumpscare] = useState<'freddy' | 'chica' | 'bonnie' | null>(null);
  const [monitorClicks, setMonitorClicks] = useState<{ chica: number, bonnie: number }>({ chica: 0, bonnie: 0 });
  const [sodaSpilled, setSodaSpilled] = useState(false);
  const [fanOn, setFanOn] = useState(true);

  const [standActive, setStandActive] = useState<{1: boolean, 2: boolean}>({1: false, 2: false});
  const [diceRollActive, setDiceRollActive] = useState<{ player: 1|2, active: boolean }>({ player: 1, active: false });
  const [showEmotePicker, setShowEmotePicker] = useState(false);
  const [activeEmotes, setActiveEmotes] = useState<{ 1: React.ReactNode | null; 2: React.ReactNode | null }>({ 1: null, 2: null });
  const [gojoBlindfoldRemoved, setGojoBlindfoldRemoved] = useState<{ 1: boolean; 2: boolean }>({ 1: false, 2: false });
  const [matchId, setMatchId] = useState(0); // Unique ID for each match to force re-renders
  const [scopeVisual, setScopeVisual] = useState<{ result: 'live' | 'blank' | null, visible: boolean }>({ result: null, visible: false });
  const [explosionPlayer, setExplosionPlayer] = useState<1 | 2 | null>(null);
  
  // Blood Effect State
  const [bloodOpacity, setBloodOpacity] = useState(0);

  // Sound & Music State
  const [isMuted, setIsMuted] = useState(false);
  const musicRef = useRef<{ ctx: AudioContext, masterGain: GainNode, oscs: any[] } | null>(null);

  // Gun Status Flags
  const [gunStatus, setGunStatus] = useState<{
    misfire: boolean;
    ricochet: boolean;
    cluster: boolean;
    doubleDamage: boolean;
  }>({
    misfire: false,
    ricochet: false,
    cluster: false,
    doubleDamage: false,
  });

  // Player Status Flags
  const [playerStatus, setPlayerStatus] = useState<{
    1: { secondChance: boolean; adrenaline: boolean; forcedShots: number; shield: number };
    2: { secondChance: boolean; adrenaline: boolean; forcedShots: number; shield: number };
  }>({
    1: { secondChance: false, adrenaline: false, forcedShots: 0, shield: 0 },
    2: { secondChance: false, adrenaline: false, forcedShots: 0, shield: 0 }
  });

  const [bombTimers, setBombTimers] = useState<{ 1: number | null; 2: number | null }>({ 1: null, 2: null });

  const rawPlaySound = useSound();

  const playSound = useCallback((...args: Parameters<typeof rawPlaySound>) => {
      if (!isMuted) rawPlaySound(...args);
  }, [isMuted, rawPlaySound]);

  // --- Background Music Logic (Lofi) ---
  const initLofiMusic = useCallback(() => {
    if (musicRef.current) return;
    
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();
        const masterGain = ctx.createGain();
        masterGain.gain.value = isMuted ? 0 : 0.2; 
        masterGain.connect(ctx.destination);
        
        const oscs: any[] = [];

        // 1. Vinyl Crackle (Pink Noise + Bandpass)
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
           data[i] = (Math.random() * 2 - 1) * 0.1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const crackleFilter = ctx.createBiquadFilter();
        crackleFilter.type = 'bandpass';
        crackleFilter.frequency.value = 1000;
        const crackleGain = ctx.createGain();
        crackleGain.gain.value = 0.05;
        noise.connect(crackleFilter).connect(crackleGain).connect(masterGain);
        noise.start();
        oscs.push(noise);

        // 2. Chords (Electric Piano-ish - FM Synth)
        const chordFreqs = [261.63, 311.13, 392.00, 466.16]; // Fm7
        const playChord = () => {
             chordFreqs.forEach((freq, i) => {
                 const osc = ctx.createOscillator();
                 osc.type = 'triangle';
                 osc.frequency.value = freq;
                 
                 // FM Modulator
                 const mod = ctx.createOscillator();
                 mod.type = 'sine';
                 mod.frequency.value = freq * 2;
                 const modGain = ctx.createGain();
                 modGain.gain.value = 50;
                 mod.connect(modGain).connect(osc.frequency);
                 
                 const gain = ctx.createGain();
                 gain.gain.setValueAtTime(0, ctx.currentTime);
                 gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.1);
                 gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);

                 osc.connect(gain).connect(masterGain);
                 mod.start();
                 osc.start();
                 osc.stop(ctx.currentTime + 4);
                 mod.stop(ctx.currentTime + 4);
             });
        };
        
        // Loop Chords
        const chordInterval = setInterval(playChord, 4000);

        // 3. Simple Drum Beat (Kick/Snare/Hat)
        const playDrums = () => {
            const now = ctx.currentTime;
            // Kick
            const kick = ctx.createOscillator();
            kick.frequency.setValueAtTime(150, now);
            kick.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
            const kickGain = ctx.createGain();
            kickGain.gain.setValueAtTime(0.8, now);
            kickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            kick.connect(kickGain).connect(masterGain);
            kick.start(now);
            kick.stop(now + 0.5);

            // Snare (delayed)
            const snareNoise = ctx.createBufferSource();
            snareNoise.buffer = buffer;
            const snareFilter = ctx.createBiquadFilter();
            snareFilter.type = 'lowpass';
            snareFilter.frequency.value = 1500;
            const snareGain = ctx.createGain();
            snareGain.gain.setValueAtTime(0, now + 1);
            snareGain.gain.linearRampToValueAtTime(0.4, now + 1.05);
            snareGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
            snareNoise.connect(snareFilter).connect(snareGain).connect(masterGain);
            snareNoise.start(now);
            snareNoise.stop(now + 1.5);
        };
        const drumInterval = setInterval(playDrums, 2000); // 60 BPM

        musicRef.current = { ctx, masterGain, oscs: [chordInterval, drumInterval] };
    } catch (e) {
        console.error("Audio init failed", e);
    }
  }, [isMuted]);

  useEffect(() => {
    if (musicRef.current) {
        const now = musicRef.current.ctx.currentTime;
        musicRef.current.masterGain.gain.setTargetAtTime(isMuted ? 0 : 0.2, now, 0.5);
        if (musicRef.current.ctx.state === 'suspended') musicRef.current.ctx.resume();
    }
  }, [isMuted]);

  // AI Logic Loop
  useEffect(() => {
    if (gameState === 'PLAYING' && currentPlayer === 2 && isAI && !diceRollActive.active) {
      let isActionProcessing = false;

      const aiTimer = setTimeout(() => {
         if (isActionProcessing) return;
         
         const myItems = items[2];
         if (lives[2] < 2) {
             const medIndex = myItems.indexOf('MEDKIT');
             if (medIndex !== -1) { handleUseItem(2, 'MEDKIT', medIndex); isActionProcessing = true; return; }
             const scIndex = myItems.indexOf('SECOND_CHANCE');
             if (scIndex !== -1) { handleUseItem(2, 'SECOND_CHANCE', scIndex); isActionProcessing = true; return; }
         }
         if (myItems.includes('FULL_AUTO') || myItems.includes('CLUSTER')) {
             const idx = myItems.findIndex(i => i === 'FULL_AUTO' || i === 'CLUSTER');
             handleUseItem(2, myItems[idx], idx); isActionProcessing = true; return;
         }
         if (myItems.includes('SCOPE')) {
            const idx = myItems.indexOf('SCOPE');
            handleUseItem(2, 'SCOPE', idx); isActionProcessing = true; return;
         }
         if (myItems.includes('MISFIRE') && Math.random() > 0.5) {
             const idx = myItems.indexOf('MISFIRE');
             handleUseItem(2, 'MISFIRE', idx); isActionProcessing = true; return;
         }
         pullTrigger();
      }, 1500); 

      return () => clearTimeout(aiTimer);
    }
  }, [gameState, currentPlayer, isAI, items, lives, diceRollActive]);

  const handleEmote = (id: string, icon: React.ReactNode) => {
      setShowEmotePicker(false);
      setActiveEmotes(prev => ({ ...prev, [currentPlayer]: icon }));
      playSound('click');
      setTimeout(() => {
          setActiveEmotes(prev => ({ ...prev, [currentPlayer]: null }));
      }, 3000);
  };

  const spinCylinder = () => {
    setGameState('SPINNING');
    setStickmanAction('IDLE');
    setFiredChambers([]);
    setGunStatus({ misfire: false, ricochet: false, cluster: false, doubleDamage: false });
    playSound('empty');
    setRotation(prev => prev + 1080); 
    
    setTimeout(() => {
      const newBulletPos = Math.floor(Math.random() * 6);
      setBulletPosition(newBulletPos);
      setCurrentChamber(0);
      setGameState('PLAYING');
    }, 1500);
  }

  const startGame = () => {
    playSound('click');
    initLofiMusic(); 
    setMatchId(prev => prev + 1);
    setLives({ 1: 3, 2: 3 });
    setWinner(null);
    setCurrentPlayer(1);
    setItems({ 1: [], 2: [] });
    setTotalTurns(0);
    setPlayerStatus({
      1: { secondChance: false, adrenaline: false, forcedShots: 0, shield: 0 },
      2: { secondChance: false, adrenaline: false, forcedShots: 0, shield: 0 }
    });
    setBombTimers({ 1: null, 2: null });
    setStandActive({ 1: false, 2: false });
    setGojoBlindfoldRemoved({ 1: false, 2: false });
    setBloodOpacity(0);
    setScopeVisual({ result: null, visible: false });
    setGunStatus({ misfire: false, ricochet: false, cluster: false, doubleDamage: false });
    setShake(false);
    setShowFirework(false);
    setShowGlowSticks(false);
    setActiveJumpscare(null);
    setMonitorClicks({ chica: 0, bonnie: 0 });
    setSodaSpilled(false);
    setFanOn(true);
    setStickmanAction('IDLE');
    spinCylinder();
  };

  const quitGame = () => {
      playSound('click');
      setGameState('SETUP');
  };

  const getWeightedRandomItem = (): ItemType => {
      if (gameMode === 'CHAOS') {
          const allItems = Object.keys(ITEMS) as ItemType[];
          return allItems[Math.floor(Math.random() * allItems.length)];
      }
      const pools: Record<Rarity, ItemType[]> = {
          common: [], uncommon: [], rare: [], epic: [], legendary: []
      };
      (Object.keys(ITEMS) as ItemType[]).forEach(key => {
          const r = rarityOverrides[key];
          pools[r].push(key);
      });
      const rand = Math.random() * 100;
      let selectedPool: ItemType[] = [];
      if (rand < 40) selectedPool = pools.common;
      else if (rand < 70) selectedPool = pools.uncommon;
      else if (rand < 85) selectedPool = pools.rare;
      else if (rand < 95) selectedPool = pools.epic;
      else selectedPool = pools.legendary;

      if (selectedPool.length === 0) {
          if (pools.common.length > 0) selectedPool = pools.common;
          else if (pools.uncommon.length > 0) selectedPool = pools.uncommon;
          else if (pools.rare.length > 0) selectedPool = pools.rare;
          else if (pools.epic.length > 0) selectedPool = pools.epic;
          else selectedPool = pools.legendary;
      }
      if (selectedPool.length === 0) return 'DIRECT_HIT'; 
      return selectedPool[Math.floor(Math.random() * selectedPool.length)];
  };

  const updatePlayerStatus = (playerId: 1 | 2, updates: Partial<typeof playerStatus[1]>) => {
      setPlayerStatus(prev => ({
          ...prev,
          [playerId]: { ...prev[playerId], ...updates }
      }));
  };

  const checkForItemDrops = (turns: number) => {
      if (turns > 0 && turns % 3 === 0) {
        const newInventory = { 
            1: [...items[1]], 
            2: [...items[2]] 
        };
        let dropOccurred = false;
        [1, 2].forEach((pid) => {
           // @ts-ignore
           if (newInventory[pid].length < 3) {
              const item = getWeightedRandomItem();
              // @ts-ignore
              newInventory[pid].push(item);
              dropOccurred = true;
           }
        });
        if (dropOccurred) {
            setItems(newInventory);
            playSound('item');
        }
      }
  };

  const loseLife = (playerWhoLostLife: 1 | 2, damage = 1) => {
    const armor = playerStatus[playerWhoLostLife].shield;
    let damageToTake = damage;
    let newArmor = armor;

    if (armor > 0) {
        const blocked = Math.min(armor, damage);
        damageToTake = damage - blocked;
        newArmor = armor - blocked;
        updatePlayerStatus(playerWhoLostLife, { shield: newArmor });
    }

    if (damageToTake > 0) {
        setBloodOpacity(0.6);
        setTimeout(() => setBloodOpacity(0), 500);
        
        let currentLives = lives[playerWhoLostLife];
        let newLivesCount = Math.max(0, currentLives - damageToTake);
        
        if (newLivesCount === 0 && playerStatus[playerWhoLostLife].secondChance) {
            newLivesCount = 1;
            updatePlayerStatus(playerWhoLostLife, { secondChance: false });
            playSound('magic');
        }

        setLives(prev => ({ ...prev, [playerWhoLostLife]: newLivesCount }));
        setGunStatus(prev => ({ ...prev, doubleDamage: false, cluster: false }));

        if (newLivesCount === 0) {
          setTimeout(() => {
            setGameState('GAME_OVER');
            setWinner(playerWhoLostLife === 1 ? 2 : 1);
            setShake(false);
          }, 500);
        } else {
          setGameState('ROUND_OVER');
          setTimeout(() => {
            setShake(false);
          }, 1000);
        }
    }
  };

  const endTurn = (nextPlayerOverride?: 1 | 2) => {
    if (playerStatus[currentPlayer].adrenaline) {
        updatePlayerStatus(currentPlayer, { adrenaline: false });
        return; 
    }
    if (playerStatus[currentPlayer].forcedShots > 0) {
        const shotsLeft = playerStatus[currentPlayer].forcedShots - 1;
        updatePlayerStatus(currentPlayer, { forcedShots: shotsLeft });
        if (shotsLeft > 0) return;
    }

    const nextPlayer = nextPlayerOverride || (currentPlayer === 1 ? 2 : 1);
    const bombTime = bombTimers[currentPlayer];
    if (bombTime !== null) {
        if (bombTime <= 1) {
            setBombTimers(prev => ({ ...prev, [currentPlayer]: null }));
            setExplosionPlayer(currentPlayer);
            setTimeout(() => setExplosionPlayer(null), 800);
            loseLife(currentPlayer, 1);
            if (lives[currentPlayer] <= 0) return;
        } else {
            setBombTimers(prev => ({ ...prev, [currentPlayer]: bombTime - 1 }));
        }
    }

    const nextTurnCount = totalTurns + 1;
    setTotalTurns(nextTurnCount);
    checkForItemDrops(nextTurnCount);

    setRotation(prev => prev - 60);
    setCurrentChamber(prev => (prev + 1) % 6);
    setCurrentPlayer(nextPlayer);
    setStickmanAction('IDLE');
    playSound('empty');
  };

  const handleSpecial = () => {
      const skin = playerSkins[currentPlayer];
      playSound('magic');
      
      if (skin === 'miku') {
          setShowGlowSticks(true);
          setTimeout(() => setShowGlowSticks(false), 3000);
      } else if (skin === 'jotaro') {
          setStandActive(prev => ({ ...prev, [currentPlayer]: true }));
          setShowStand(true);
          setTimeout(() => setShowStand(false), 2000); 
      } else if (skin === 'gojo') {
          setGojoBlindfoldRemoved(prev => ({ ...prev, [currentPlayer]: !prev[currentPlayer] }));
      } else if (skin === 'freddy') {
          setActiveJumpscare('freddy');
          playSound('scream');
          setTimeout(() => setActiveJumpscare(null), 1000);
      }
  };

  const resolveGamble = (roll: number, player: 1 | 2) => {
        if (roll <= 2) {
            loseLife(player, 1);
            // Resume play if player is still alive after damage
            setTimeout(() => {
                if (gameStateRef.current !== 'GAME_OVER') {
                    setGameState('PLAYING');
                }
            }, 1000);
        } else if (roll <= 4) {
            setLives(prev => ({ ...prev, [player]: Math.min(prev[player] + 1, 3) }));
        } else {
             const epics: ItemType[] = ['ADRENALINE', 'C4', 'LOOT_BOX', 'MAGNET'];
             const reward = epics[Math.floor(Math.random() * epics.length)];
             setItems(prevItems => {
                 const newInventory = {
                     1: [...prevItems[1]],
                     2: [...prevItems[2]]
                 };
                 // @ts-ignore
                 if (newInventory[player].length < 3) {
                     // @ts-ignore
                     newInventory[player].push(reward);
                 }
                 return newInventory;
             });
        }
  };

  const handleUseItem = (player: 1 | 2, item: ItemType, itemIdx: number) => {
    if (gameState !== 'PLAYING') return;
    if (item === 'SHIELD' && playerStatus[player].shield > 0) return;

    const newItems = {
        1: [...items[1]],
        2: [...items[2]]
    };
    newItems[player].splice(itemIdx, 1);
    
    playSound('equip');

    // --- ITEM LOGIC ---
    if (item === 'MEDKIT') {
        setItems(newItems);
        setLives(prev => ({ ...prev, [player]: Math.min(prev[player] + 1, 3) }));
        return;
    }
    if (item === 'SHIELD') {
        setItems(newItems);
        updatePlayerStatus(player, { shield: 1 });
        return;
    }
    if (item === 'HEAVY_ARMOR') {
        setItems(newItems);
        updatePlayerStatus(player, { shield: playerStatus[player].shield + 3 });
        return;
    }
    if (item === 'SECOND_CHANCE') {
        setItems(newItems);
        updatePlayerStatus(player, { secondChance: true });
        return;
    }
    if (item === 'ADRENALINE') {
        setItems(newItems);
        updatePlayerStatus(player, { adrenaline: true });
        return;
    }
    if (item === 'MAGNET') {
        setItems(newItems);
        const opponent = player === 1 ? 2 : 1;
        updatePlayerStatus(opponent, { forcedShots: 2 });
        return;
    }
    if (item === 'HEAVY_BULLET') {
        setItems(newItems);
        setGunStatus(prev => ({ ...prev, doubleDamage: true }));
        return;
    }
    if (item === 'CLUSTER') {
        setItems(newItems);
        setGunStatus(prev => ({ ...prev, cluster: true }));
        return;
    }
    if (item === 'RICOCHET') {
        setItems(newItems);
        setGunStatus(prev => ({ ...prev, ricochet: true }));
        return;
    }
    if (item === 'MISFIRE') {
        setItems(newItems);
        setGunStatus(prev => ({ ...prev, misfire: true }));
        return;
    }
    if (item === 'SCOPE') {
        setItems(newItems);
        const isLive = currentChamber === bulletPosition;
        playSound('scan');
        setScopeVisual({ result: null, visible: true }); 
        setTimeout(() => {
            setScopeVisual({ result: isLive ? 'live' : 'blank', visible: true });
            setTimeout(() => setScopeVisual({ result: null, visible: false }), 2500);
        }, 1500);
        return;
    }
    if (item === 'GAMBLE') {
        setItems(newItems);
        setDiceRollActive({ player, active: true });
        return;
    }
    if (item === 'FIREWORK') {
        setItems(newItems);
        setShowFirework(true);
        playSound('firework');
        setTimeout(() => setShowFirework(false), 2000);
        return;
    }
    if (item === 'EJECTOR') {
        setItems(newItems);
        endTurn(player === 1 ? 2 : 1);
        return;
    }
    if (item === 'RELOAD') {
        setItems(newItems);
        spinCylinder();
        return;
    }
    if (item === 'LOOT_BOX') {
        const prizes = [getWeightedRandomItem(), getWeightedRandomItem()];
        const pItems = newItems[player];
        if (pItems.length < 8) {
             if (pItems.length < 3) pItems.push(prizes[0]);
             if (pItems.length < 3) pItems.push(prizes[1]);
        }
        setItems(newItems);
        return;
    }
    if (item === 'C4') {
        setItems(newItems);
        const opponent = player === 1 ? 2 : 1;
        setBombTimers(prev => ({ ...prev, [opponent]: 3 }));
        playSound('beep');
        return;
    }

    if (item === 'DIRECT_HIT') {
        setItems(newItems);
        setStickmanAction('AIM_FORWARD');
        const opponent = player === 1 ? 2 : 1;
        setFiredChambers(prev => [...prev, currentChamber]);
        
        setTimeout(() => {
            const isBullet = currentChamber === bulletPosition;
            if (isBullet) {
                setStickmanAction('BANG'); 
                setShake(true);
                playSound('bang', playerWeaponModels[player]);
                const dmg = gunStatus.doubleDamage ? 2 : 1;
                loseLife(opponent, dmg);
                setTimeout(() => {
                    if (gameStateRef.current !== 'GAME_OVER') {
                         setCurrentPlayer(opponent); 
                         setTimeout(spinCylinder, 1500);
                    }
                }, 1000);

            } else {
                setStickmanAction('CLICK');
                playSound('click');
                setTimeout(() => {
                    if (gameStateRef.current !== 'GAME_OVER') {
                        endTurn();
                    }
                }, 500);
            }
        }, 600);
        return;
    }

    if (item === 'FULL_AUTO') {
        setItems(newItems);
        setStickmanAction('RAPID_FIRE');
        const opponent = player === 1 ? 2 : 1;
        playSound('bang', playerWeaponModels[player]);
        
        setTimeout(() => {
            setShake(true);
            const dmg = gunStatus.doubleDamage ? 2 : 1;
            loseLife(opponent, dmg);
             setTimeout(() => {
                 if (gameStateRef.current !== 'GAME_OVER') {
                    setCurrentPlayer(opponent);
                    setTimeout(spinCylinder, 1500);
                 }
            }, 1000);
        }, 1000);
        return;
    }
    
    setItems(newItems);
  };

  const pullTrigger = () => {
    if (gameState !== 'PLAYING') return;

    if (gunStatus.misfire) {
        setGunStatus(prev => ({ ...prev, misfire: false }));
        setStickmanAction('CLICK');
        playSound('empty'); 
        setTimeout(() => endTurn(), 800);
        return;
    }

    const isBullet = currentChamber === bulletPosition;
    setFiredChambers(prev => [...prev, currentChamber]);
    
    if (isBullet) {
      setShake(true);
      setStickmanAction('BANG');
      playSound('bang', playerWeaponModels[currentPlayer]);
      const dmg = gunStatus.doubleDamage ? 2 : 1;

      if (gunStatus.cluster) {
          loseLife(1, 1);
          if (lives[1] > 1 || lives[2] > 0) loseLife(2, 1); 
           if (lives[currentPlayer] > 0) {
              updatePlayerStatus(currentPlayer, { adrenaline: false }); 
              setTimeout(() => {
                  if (gameStateRef.current !== 'GAME_OVER') {
                      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
                      setTimeout(spinCylinder, 1500);
                  }
              }, 1000);
          }
          return;
      }

      if (gunStatus.ricochet) {
          const opponent = currentPlayer === 1 ? 2 : 1;
          setGunStatus(prev => ({ ...prev, ricochet: false }));
          loseLife(opponent, dmg);
          setTimeout(() => {
              if (gameStateRef.current !== 'GAME_OVER') {
                  setCurrentPlayer(opponent);
                  setTimeout(spinCylinder, 1500);
              }
          }, 1000);
          return;
      }
      
      updatePlayerStatus(currentPlayer, { adrenaline: false }); 
      loseLife(currentPlayer, dmg);

      const nextTurnCount = totalTurns + 1;
      setTotalTurns(nextTurnCount);
      checkForItemDrops(nextTurnCount);

      setTimeout(() => {
          if (gameStateRef.current !== 'GAME_OVER') { 
              const nextPlayer = currentPlayer === 1 ? 2 : 1;
              setCurrentPlayer(nextPlayer);
              setTimeout(spinCylinder, 1500);
          }
      }, 1000);

    } else {
      setStickmanAction('CLICK');
      playSound('click');
      updatePlayerStatus(currentPlayer, { adrenaline: false }); 
      
      setTimeout(() => {
          if (gameStateRef.current !== 'GAME_OVER') {
              endTurn();
          }
      }, 800);
    }
  };

  const getPlayerStatus = (pId: 1 | 2) => {
    if (lives[pId] === 0) return 'dead';
    return 'alive';
  };

  const getBgClass = () => {
      switch(background) {
          case 'forest': return 'bg-amber-950 bg-fixed'; 
          case 'cyber': return 'bg-slate-900 bg-fixed';
          case 'void': return 'bg-black bg-fixed';
          case 'house': return 'bg-slate-200 bg-fixed'; 
          case 'casino': return 'bg-[#1a0505] bg-fixed';
          case 'rooftop': return 'bg-[#0a0a1a] bg-fixed';
          case 'subway': return 'bg-slate-800 bg-fixed';
          case 'fnaf': return 'bg-slate-900 bg-fixed';
          case 'room': default: return 'bg-radial-gradient from-slate-900 to-black bg-fixed';
      }
  };

  const handleMonitorClick = (animatronic: 'chica' | 'bonnie') => {
      const newCount = monitorClicks[animatronic] + 1;
      if (newCount >= 3) {
          setActiveJumpscare(animatronic);
          playSound('scream');
          setMonitorClicks(prev => ({ ...prev, [animatronic]: 0 }));
          setTimeout(() => setActiveJumpscare(null), 1000);
      } else {
          setMonitorClicks(prev => ({ ...prev, [animatronic]: newCount }));
          playSound('click'); // Static sound or click
      }
  };

  return (
    <div className={`h-screen w-full bg-slate-950 overflow-hidden relative selection:bg-red-900`}>
      
      {/* --- GLOBAL FIXED ELEMENTS (HUD, OVERLAYS) --- */}
      
      <ScopeVisual result={scopeVisual.result} visible={scopeVisual.visible} />

      {/* Blood Overlay Effect */}
      <div 
         className="fixed inset-0 bg-red-600 pointer-events-none z-[60] mix-blend-overlay transition-opacity duration-500 ease-out" 
         style={{ opacity: bloodOpacity }}
      ></div>

      {activeJumpscare && (
          <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-out fade-out duration-1000">
               <div className="relative w-full h-full flex items-center justify-center">
                    {activeJumpscare === 'freddy' && (
                        <svg viewBox="0 0 200 200" className="w-[120vw] h-[120vh] animate-[shake_0.1s_infinite]">
                            {/* Scary Freddy Face */}
                            <circle cx="100" cy="100" r="80" fill="#451a03" />
                            <ellipse cx="100" cy="120" rx="40" ry="30" fill="#a16207" />
                            <path d="M 60 70 Q 100 100 140 70" fill="none" stroke="black" strokeWidth="10" />
                            <circle cx="70" cy="80" r="10" fill="white" />
                            <circle cx="70" cy="80" r="3" fill="red" />
                            <circle cx="130" cy="80" r="10" fill="white" />
                            <circle cx="130" cy="80" r="3" fill="red" />
                            <path d="M 80 120 Q 100 150 120 120" fill="black" /> {/* Mouth */}
                            <path d="M 82 120 L 85 130 L 88 120" fill="white" />
                            <path d="M 90 120 L 93 130 L 96 120" fill="white" />
                            <path d="M 108 120 L 111 130 L 114 120" fill="white" />
                        </svg>
                    )}
                    {activeJumpscare === 'chica' && (
                        <svg viewBox="0 0 200 200" className="w-[120vw] h-[120vh] animate-[shake_0.1s_infinite]">
                            {/* Scary Chica Face */}
                            <circle cx="100" cy="100" r="85" fill="#facc15" /> {/* Yellow Head */}
                            <path d="M 60 70 Q 100 100 140 70" fill="none" stroke="black" strokeWidth="10" /> {/* Eyebrows */}
                            <circle cx="70" cy="80" r="15" fill="white" /> <circle cx="70" cy="80" r="5" fill="red" /> {/* Eye L */}
                            <circle cx="130" cy="80" r="15" fill="white" /> <circle cx="130" cy="80" r="5" fill="red" /> {/* Eye R */}
                            {/* Beak */}
                            <path d="M 60 110 Q 100 90 140 110 L 100 170 Z" fill="#f97316" stroke="#c2410c" strokeWidth="5" />
                            <path d="M 70 120 Q 100 160 130 120" fill="#7c2d12" /> {/* Mouth inside */}
                            <text x="100" y="190" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white">PIZZA!</text>
                        </svg>
                    )}
                    {activeJumpscare === 'bonnie' && (
                        <svg viewBox="0 0 200 200" className="w-[120vw] h-[120vh] animate-[shake_0.1s_infinite]">
                            {/* Ears */}
                            <ellipse cx="60" cy="40" rx="15" ry="50" fill="#4c1d95" transform="rotate(-10 60 40)" />
                            <ellipse cx="140" cy="40" rx="15" ry="50" fill="#4c1d95" transform="rotate(10 140 40)" />
                            <circle cx="100" cy="100" r="80" fill="#5b21b6" /> {/* Purple Head */}
                            <ellipse cx="100" cy="120" rx="35" ry="25" fill="#8b5cf6" opacity="0.8" /> {/* Snout */}
                            <circle cx="70" cy="80" r="12" fill="white" /> <circle cx="70" cy="80" r="4" fill="red" className="animate-ping" /> {/* Eye L */}
                            <circle cx="130" cy="80" r="12" fill="white" /> <circle cx="130" cy="80" r="4" fill="red" className="animate-ping" /> {/* Eye R */}
                            <rect x="90" y="115" width="20" height="10" fill="black" rx="5" /> {/* Nose */}
                            <path d="M 85 140 Q 100 160 115 140" fill="none" stroke="black" strokeWidth="5" /> {/* Mouth */}
                            <rect x="92" y="145" width="8" height="12" fill="white" /> {/* Teeth */}
                            <rect x="100" y="145" width="8" height="12" fill="white" />
                        </svg>
                    )}
               </div>
          </div>
      )}

      {showFirework && (
         <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
             <div className="relative">
                 {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute top-0 left-0 w-2 h-32 origin-bottom animate-ping" 
                         style={{ transform: `rotate(${i * 30}deg) translateY(-50px)`, backgroundColor: ['#ef4444', '#3b82f6', '#22c55e', '#eab308'][i % 4] }}></div>
                 ))}
                 <div className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full animate-ping"></div>
             </div>
         </div>
      )}

      {showGlowSticks && (
          <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
             {[...Array(20)].map((_, i) => (
                 <div key={i} className="absolute w-2 h-12 rounded-full animate-[fall_2s_linear_infinite]"
                      style={{ 
                          left: `${Math.random() * 100}%`, 
                          top: `-${Math.random() * 20}%`,
                          backgroundColor: ['#f472b6', '#34d399', '#60a5fa'][Math.floor(Math.random() * 3)],
                          animationDelay: `${Math.random()}s`,
                          boxShadow: '0 0 10px currentColor'
                      }}></div>
             ))}
             <style>{`
                 @keyframes fall {
                     to { transform: translateY(120vh) rotate(360deg); }
                 }
             `}</style>
          </div>
      )}

      {/* Top HUD (Player Cards) - Truly Fixed */}
      <div className="fixed top-4 md:top-6 left-0 right-0 z-50 w-full flex justify-between px-4 md:px-12 pointer-events-none">
             <PlayerCard 
                name="PLAYER 1" 
                isTurn={currentPlayer === 1 && gameState === 'PLAYING'} 
                status={getPlayerStatus(1)} 
                lives={lives[1]} 
                visible={gameState !== 'SETUP'}
                shieldCount={playerStatus[1].shield}
                bombTimer={bombTimers[1]}
                hasSecondChance={playerStatus[1].secondChance}
                forcedShots={playerStatus[1].forcedShots}
             />
             
             {gameState !== 'SETUP' && (
                <button onClick={quitGame} className="pointer-events-auto mt-2 p-2 bg-slate-900/50 hover:bg-slate-800 rounded-full border border-slate-700 transition-colors">
                    <Home className="w-5 h-5 text-slate-400 hover:text-white" />
                </button>
             )}

             <PlayerCard 
                name={isAI ? "CPU" : "PLAYER 2"} 
                isTurn={currentPlayer === 2 && gameState === 'PLAYING'} 
                status={getPlayerStatus(2)} 
                lives={lives[2]} 
                visible={gameState !== 'SETUP'}
                shieldCount={playerStatus[2].shield}
                bombTimer={bombTimers[2]}
                isAI={isAI}
                hasSecondChance={playerStatus[2].secondChance}
                forcedShots={playerStatus[2].forcedShots}
             />
      </div>

      {gameState !== 'SETUP' && (
         <InventoryHud 
             p1Items={items[1]} 
             p2Items={items[2]} 
             currentPlayer={currentPlayer}
             gameState={gameState}
             onUseItem={handleUseItem}
             playerSkins={playerSkins}
             onSpecial={handleSpecial}
             isAI={isAI}
             onEmote={() => setShowEmotePicker(true)}
         />
      )}
      
      <button 
        onClick={() => {
            if (!musicRef.current) initLofiMusic();
            setIsMuted(!isMuted);
        }}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-900/80 hover:bg-slate-800 rounded-full border border-slate-700 text-slate-400 hover:text-white transition-all shadow-lg"
      >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <button 
        onClick={() => setShowItemIndex(true)}
        className="fixed top-4 right-4 z-50 p-2 bg-slate-900/80 hover:bg-slate-800 rounded-full border border-slate-700 text-slate-400 hover:text-white transition-all shadow-lg"
      >
          <BookOpen className="w-5 h-5" />
      </button>

      {/* --- SCROLLABLE GAME WORLD --- */}
      <div className={`w-full h-full overflow-y-auto overflow-x-hidden flex flex-col items-center p-4 pb-48 custom-scrollbar ${shake ? 'animate-shake' : ''} ${getBgClass()}`}>
      
      {background === 'forest' && (
         <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 flex justify-around items-end opacity-40">
            <Trees className="w-64 h-64 text-emerald-900 -mb-10" />
            <Trees className="w-96 h-96 text-emerald-950 -mb-10 scale-125" />
            <Trees className="w-64 h-64 text-emerald-900 -mb-10" />
         </div>
      )}

      {background === 'fnaf' && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#1a1a1a]">
              {/* Checkered Strip */}
              <div className="absolute top-[30%] w-full h-10 bg-repeat-x opacity-30" style={{
                  backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px'
              }}></div>
              
              {/* Kid Drawings */}
              <div className="absolute top-[10%] left-[10%] w-16 h-20 bg-white rotate-6 p-1 opacity-80 shadow-md">
                 <svg viewBox="0 0 50 60">
                     <circle cx="25" cy="20" r="10" stroke="black" fill="none" />
                     <line x1="25" y1="30" x2="25" y2="50" stroke="black" />
                     <line x1="25" y1="40" x2="10" y2="30" stroke="black" />
                     <line x1="25" y1="40" x2="40" y2="30" stroke="black" />
                     <text x="10" y="55" fontSize="8" fontFamily="monospace">ME</text>
                 </svg>
              </div>
              <div className="absolute top-[15%] right-[20%] w-16 h-20 bg-white -rotate-3 p-1 opacity-80 shadow-md">
                 <svg viewBox="0 0 50 60">
                     <circle cx="25" cy="25" r="15" fill="yellow" />
                     <path d="M 15 25 Q 25 35 35 25" stroke="black" fill="none" />
                     <text x="5" y="55" fontSize="8" fontFamily="monospace">PIZZA</text>
                 </svg>
              </div>

              {/* Monitors - LARGER HITBOX */}
              <div onClick={() => handleMonitorClick('chica')} className="absolute top-[20%] left-[10%] md:left-[20%] w-36 h-28 bg-black/50 p-4 rounded-xl flex items-center justify-center pointer-events-auto cursor-pointer group hover:scale-105 transition-transform">
                  <div className="w-28 h-24 bg-black border-4 border-slate-700 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center relative">
                    <div className="w-full h-full bg-[#111] relative overflow-hidden">
                        {/* Chica */}
                        <div className="absolute bottom-[-10px] right-2 w-16 h-20 bg-yellow-400 rounded-t-3xl flex flex-col items-center pt-4 shadow-inner">
                            <div className="absolute -top-3 w-4 h-6 bg-yellow-400 rounded-full"></div>
                            <div className="flex gap-4 mb-1">
                                <div className="w-5 h-5 bg-white rounded-full border-2 border-slate-300 flex items-center justify-center"><div className="w-2 h-2 bg-purple-900 rounded-full"></div></div>
                                <div className="w-5 h-5 bg-white rounded-full border-2 border-slate-300 flex items-center justify-center"><div className="w-2 h-2 bg-purple-900 rounded-full"></div></div>
                            </div>
                            <div className="w-8 h-4 bg-orange-500 rounded-lg border-b-4 border-orange-600"></div>
                            <div className="mt-2 w-12 h-10 bg-white rounded-lg flex items-center justify-center text-[5px] font-black text-slate-300 text-center leading-tight">LET'S<br/>EAT!!!</div>
                        </div>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                        <div className="absolute inset-0 bg-white/5 animate-pulse z-20"></div>
                        <div className="absolute top-1 left-2 text-[8px] text-green-500 font-mono z-30 opacity-80">CAM 04</div>
                    </div>
                  </div>
              </div>

              <div onClick={() => handleMonitorClick('bonnie')} className="absolute top-[20%] right-[10%] md:right-[20%] w-36 h-28 bg-black/50 p-4 rounded-xl flex items-center justify-center pointer-events-auto cursor-pointer group hover:scale-105 transition-transform">
                  <div className="w-28 h-24 bg-black border-4 border-slate-700 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.8)] overflow-hidden flex items-center justify-center relative">
                    <div className="w-full h-full bg-[#111] relative overflow-hidden">
                        {/* Bonnie */}
                        <div className="absolute bottom-[-10px] left-2 w-16 h-20 bg-indigo-700 rounded-t-3xl flex flex-col items-center pt-5 shadow-inner">
                            <div className="absolute -top-8 left-1 w-4 h-12 bg-indigo-700 rounded-full border border-indigo-900 rotate-[-10deg]"></div>
                            <div className="absolute -top-8 right-1 w-4 h-12 bg-indigo-700 rounded-full border border-indigo-900 rotate-[10deg]"></div>
                            <div className="flex gap-4 mb-2">
                                <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div></div>
                                <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div></div>
                            </div>
                            <div className="w-6 h-3 bg-indigo-400 rounded-full opacity-50 mb-1"></div>
                            <div className="w-8 h-4 bg-red-600 rounded flex items-center justify-center relative"><div className="absolute w-2 h-2 bg-red-800 rounded-full"></div></div>
                        </div>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                        <div className="absolute inset-0 bg-white/5 animate-pulse z-20" style={{ animationDuration: '0.2s' }}></div>
                        <div className="absolute top-1 right-2 text-[8px] text-green-500 font-mono z-30 opacity-80">CAM 02</div>
                    </div>
                  </div>
              </div>
          </div>
      )}

      {background === 'casino' && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 bg-[#2b0f0f]">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #450a0a 25%, transparent 25%, transparent 75%, #450a0a 75%, #450a0a), linear-gradient(45deg, #450a0a 25%, transparent 25%, transparent 75%, #450a0a 75%, #450a0a)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
            </div>
            <div className="absolute top-0 w-full h-4 bg-black flex justify-around items-center px-2 z-20">
                 {[...Array(20)].map((_, i) => (
                     <div key={i} className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-yellow-200 animate-pulse' : 'bg-yellow-600'} shadow-[0_0_5px_rgba(253,224,71,0.8)]`}></div>
                 ))}
            </div>
            <div className="absolute top-[10%] left-0 right-0 h-full flex justify-between px-4 pointer-events-none opacity-40">
                <div className="w-32 h-[80%] border-t-8 border-x-8 border-yellow-700 rounded-t-full"></div>
                <div className="w-32 h-[80%] border-t-8 border-x-8 border-yellow-700 rounded-t-full"></div>
            </div>
            {/* Dealer Stickman */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 z-0 opacity-70">
                <svg width="60" height="100" viewBox="0 0 60 100">
                    <circle cx="30" cy="30" r="15" fill="#e2e8f0" />
                    <line x1="30" y1="45" x2="30" y2="100" stroke="#e2e8f0" strokeWidth="4" />
                    <path d="M 20 50 L 30 55 L 40 50 L 30 65 Z" fill="#ef4444" /> {/* Red Bowtie */}
                    <line x1="30" y1="60" x2="10" y2="80" stroke="#e2e8f0" strokeWidth="3" />
                    <line x1="30" y1="60" x2="50" y2="80" stroke="#e2e8f0" strokeWidth="3" />
                </svg>
            </div>
        </div>
      )}

      {background === 'rooftop' && (
         <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
             <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-[#0f172a]">
                 {[...Array(15)].map((_, i) => (
                     <div key={i} className="absolute bottom-0 bg-black/60" 
                          style={{ 
                              left: `${i * 10}%`, 
                              width: `${Math.random() * 5 + 5}%`, 
                              height: `${Math.random() * 50 + 20}%`,
                              opacity: 0.8
                          }}>
                          {/* Windows */}
                          <div className="w-full h-full flex flex-wrap gap-1 p-1">
                              {[...Array(6)].map((_, j) => Math.random() > 0.7 && (
                                  <div key={j} className="w-1 h-1 bg-yellow-400/50"></div>
                              ))}
                          </div>
                     </div>
                 ))}
             </div>
             <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-slate-200 blur-xl opacity-20"></div>
         </div>
      )}

      {background === 'subway' && (
         <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
             {/* Tiles */}
             <div className="absolute inset-0 opacity-10" style={{ 
                 backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 20px)' 
             }}></div>
             <div className="absolute top-[20%] left-0 w-full h-2 bg-yellow-600/50"></div>
             <div className="absolute top-[25%] left-0 w-full h-32 flex items-center justify-center bg-black/40">
                <Train className="w-96 h-96 text-slate-700 opacity-20 animate-[pulse_5s_infinite]" />
             </div>
         </div>
      )}

      {background === 'house' && (
         <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
             <div className="absolute top-[10%] left-[10%] right-[10%] h-[30%] min-h-[200px] bg-blue-300 rounded border-8 border-slate-300 shadow-inner overflow-hidden">
                 <div className="absolute top-4 left-4 w-12 h-12 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-pulse"></div>
                 <div className="absolute bottom-[-20%] left-[-10%] w-[120%] h-[50%] bg-green-200 rounded-t-full"></div>
                 <div className="absolute top-10 right-10 opacity-60"><Cloud className="w-16 h-16 text-white" /></div>
             </div>
             <div className="absolute top-[50%] left-[10%] p-2 bg-white rounded shadow border border-slate-200 rotate-3">
                 <div className="w-16 h-20 bg-slate-100 flex items-center justify-center text-[8px] text-slate-400 font-mono">
                     HOME
                 </div>
             </div>
         </div>
      )}

      {/* Main Content Container - POINTER EVENTS NONE to allow click-through to BG */}
      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center pointer-events-none">
        <h1 className="text-3xl md:text-5xl font-black mb-6 md:mb-12 tracking-widest text-slate-100 drop-shadow-lg font-mono flex gap-2">
          STICKMAN <span className="text-red-600">ROULETTE</span>
        </h1>

        {/* --- MAIN GAME SCENE --- */}
        <div className="relative w-full h-[350px] md:h-[450px] mb-8 md:mb-12 flex items-center justify-center">
           
           <div 
             key={matchId} 
             className={`relative w-full max-w-[500px] h-full flex items-end justify-center perspective-1000 ${gameState === 'SETUP' ? 'blur-sm scale-90 opacity-50' : ''} transition-all duration-700`}
           >
                {/* Stickman Player 1 */}
                <div className={`absolute bottom-6 left-0 md:left-4 z-10 transform transition-all duration-500 origin-bottom ${currentPlayer === 1 ? 'scale-110 drop-shadow-2xl' : 'scale-90 opacity-80'}`}>
                    <Stickman 
                        player={1} 
                        action={currentPlayer === 1 ? stickmanAction : 'IDLE'} 
                        isDead={lives[1] === 0} 
                        hasGun={currentPlayer === 1 && gameState === 'PLAYING'}
                        weaponSkin={playerWeaponSkins[1]}
                        weaponModel={playerWeaponModels[1]}
                        skin={playerSkins[1]}
                        shieldCount={playerStatus[1].shield}
                        isDoubleDamage={gunStatus.doubleDamage && currentPlayer === 1}
                        showStand={showStand && currentPlayer === 1}
                        standActive={standActive[1]}
                        bombTimer={bombTimers[1]}
                        activeEmote={activeEmotes[1]}
                        gojoBlindfoldRemoved={gojoBlindfoldRemoved[1]}
                        lives={lives[1]}
                        isExploding={explosionPlayer === 1}
                    />
                </div>

                {/* Table - Interactive (Soda/Fan) POINTER EVENTS AUTO */}
                <div className="relative z-0 mb-4 md:mb-8 flex flex-col items-center pointer-events-auto">
                    {background === 'room' && (
                       <div className="absolute -top-52 left-1/2 -translate-x-1/2 flex flex-col items-center origin-top animate-[swing_3s_ease-in-out_infinite]">
                          <div className="w-1 h-32 bg-slate-800"></div>
                          <div className="w-16 h-8 bg-slate-700 rounded-t-full shadow-lg"></div>
                          <div className="w-12 h-12 bg-yellow-100/10 blur-xl rounded-full absolute top-32"></div>
                       </div>
                    )}
                    <div className="relative">
                        {background === 'casino' ? (
                             <div className="w-48 h-16 md:w-80 md:h-24 bg-emerald-900 rounded-xl relative border-[6px] border-[#3f2008] shadow-2xl flex items-center justify-center perspective-500">
                                 <div className="absolute inset-0 rounded-lg border-2 border-white/10 pointer-events-none"></div>
                                 <div className="absolute top-2 left-4 w-4 h-4 bg-red-600 rounded-full border border-dashed border-white shadow-sm"></div>
                                 <div className="absolute top-1 left-6 w-4 h-4 bg-blue-600 rounded-full border border-dashed border-white shadow-sm"></div>
                                 <div className="absolute top-3 left-6 w-4 h-4 bg-black rounded-full border border-dashed border-white shadow-sm"></div>
                                 <div className="absolute top-4 right-8 w-5 h-7 bg-white rounded shadow rotate-6 flex items-center justify-center"><Spade className="w-3 h-3 text-black" /></div>
                                 <div className="absolute top-4 right-4 w-5 h-7 bg-white rounded shadow -rotate-6 flex items-center justify-center"><Heart className="w-3 h-3 text-red-600" /></div>
                             </div>
                        ) : (
                             <div className={`w-48 h-4 md:w-80 md:h-6 ${background === 'house' ? 'bg-cyan-200/40 backdrop-blur-md border border-white/50' : 'bg-slate-700'} rounded shadow-2xl relative flex justify-center`}>
                                 {(gameState === 'SETUP' || gameState === 'SPINNING') && (
                                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-50">
                                         <div className="w-10 h-6 bg-slate-800 rounded"></div>
                                     </div>
                                 )}
                                 {/* FNAF Table Items */}
                                 {background === 'fnaf' && (
                                     <>
                                        {/* Animated Fan - Interactive */}
                                        <div 
                                          onClick={() => setFanOn(!fanOn)}
                                          className={`absolute -top-12 opacity-80 ${fanOn ? 'animate-[spin_3s_linear_infinite]' : ''} origin-bottom scale-75 cursor-pointer hover:opacity-100 transition-opacity`}
                                        >
                                            <div className="relative w-12 h-12 flex items-center justify-center">
                                                 <Fan className={`w-12 h-12 text-slate-800 ${fanOn ? 'animate-spin' : ''}`} style={{ animationDuration: '0.5s' }} />
                                                 <div className="absolute bottom-0 w-8 h-2 bg-slate-800 rounded-full translate-y-2"></div>
                                            </div>
                                        </div>
                                        {/* Soda Cup - Interactive */}
                                        <div 
                                           onClick={() => { setSodaSpilled(!sodaSpilled); playSound('equip'); }}
                                           className={`absolute -top-8 right-8 w-6 h-8 bg-red-600 border-l border-r border-red-800 flex items-center justify-center cursor-pointer transition-transform duration-500 ${sodaSpilled ? 'rotate-90 translate-y-4 translate-x-2' : 'hover:scale-105'}`} 
                                           style={{ clipPath: 'polygon(10% 100%, 0 0, 100% 0, 90% 100%)' }}
                                        >
                                             <div className="w-full h-1 bg-white/50 rotate-[-10deg] translate-y-2"></div>
                                             <div className="absolute -top-2 w-1 h-6 bg-white rotate-12 right-2"></div>
                                             {sodaSpilled && (
                                                <div className="absolute top-0 right-0 w-8 h-8 bg-red-800/50 blur-sm rounded-full -z-10 animate-pulse"></div>
                                             )}
                                        </div>
                                     </>
                                 )}
                             </div>
                        )}
                        <div className="flex justify-between w-full px-8 mt-[-2px] relative -z-10">
                            <div className={`w-2 h-16 md:h-24 ${background === 'house' ? 'bg-white/30' : 'bg-slate-800'}`}></div>
                            <div className={`w-2 h-16 md:h-24 ${background === 'house' ? 'bg-white/30' : 'bg-slate-800'}`}></div>
                        </div>
                    </div>
                </div>

                {/* Stickman Player 2 */}
                <div className={`absolute bottom-6 right-0 md:right-4 z-10 transform transition-all duration-500 origin-bottom ${currentPlayer === 2 ? 'scale-110 drop-shadow-2xl' : 'scale-90 opacity-80'}`}>
                    <Stickman 
                        player={2} 
                        action={currentPlayer === 2 ? stickmanAction : 'IDLE'} 
                        isDead={lives[2] === 0} 
                        hasGun={currentPlayer === 2 && gameState === 'PLAYING'}
                        weaponSkin={playerWeaponSkins[2]}
                        weaponModel={playerWeaponModels[2]}
                        skin={playerSkins[2]}
                        shieldCount={playerStatus[2].shield}
                        isDoubleDamage={gunStatus.doubleDamage && currentPlayer === 2}
                        showStand={showStand && currentPlayer === 2}
                        standActive={standActive[2]}
                        bombTimer={bombTimers[2]}
                        activeEmote={activeEmotes[2]}
                        gojoBlindfoldRemoved={gojoBlindfoldRemoved[2]}
                        lives={lives[2]}
                        isExploding={explosionPlayer === 2}
                    />
                </div>
           </div>
        </div>

        {/* SETUP SCREEN - Pointer Events Auto */}
        {gameState === 'SETUP' && (
          <div className="w-full max-w-2xl bg-slate-950 p-4 md:p-6 rounded-2xl shadow-2xl border border-slate-800 z-50 animate-in fade-in zoom-in duration-300 pointer-events-auto">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-center text-white tracking-widest flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" /> MATCH SETUP
            </h2>
            
            <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4">
                {/* Player 1 Setup */}
                <div className="flex flex-col items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-700">
                    <div className="text-xs font-bold text-slate-300 mb-1 flex items-center gap-2">
                        <User className="w-3 h-3" /> PLAYER 1
                    </div>
                    
                    <button 
                        onClick={() => {
                            const skins = Object.keys(SKINS) as SkinType[];
                            const weapons = Object.keys(WEAPON_SKINS) as WeaponSkin[];
                            const models = Object.keys(WEAPON_MODELS) as WeaponModel[];
                            setPlayerSkins(prev => ({ ...prev, 1: skins[Math.floor(Math.random() * skins.length)] }));
                            setPlayerWeaponSkins(prev => ({ ...prev, 1: weapons[Math.floor(Math.random() * weapons.length)] }));
                            setPlayerWeaponModels(prev => ({ ...prev, 1: models[Math.floor(Math.random() * models.length)] }));
                        }}
                        className="w-full py-1 text-[9px] font-bold rounded border uppercase tracking-wider transition-colors bg-slate-800 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center gap-1"
                    >
                        <Shuffle className="w-3 h-3" /> Randomize
                    </button>

                    <Selector 
                      label="Skin" 
                      options={Object.keys(SKINS) as SkinType[]} 
                      current={playerSkins[1]} 
                      onSelect={(val) => setPlayerSkins(prev => ({ ...prev, 1: val }))}
                      getLabel={(val) => SKINS[val].name}
                      getColor={(val) => SKINS[val].colors.primary}
                    />
                    <Selector 
                      label="Weapon" 
                      options={Object.keys(WEAPON_SKINS) as WeaponSkin[]} 
                      current={playerWeaponSkins[1]} 
                      onSelect={(val) => setPlayerWeaponSkins(prev => ({ ...prev, 1: val }))}
                      getLabel={(val) => WEAPON_SKINS[val].name}
                      getColor={(val) => WEAPON_SKINS[val].colors.body}
                    />
                    <Selector 
                      label="Model" 
                      options={Object.keys(WEAPON_MODELS) as WeaponModel[]} 
                      current={playerWeaponModels[1]} 
                      onSelect={(val) => setPlayerWeaponModels(prev => ({ ...prev, 1: val }))}
                      getLabel={(val) => WEAPON_MODELS[val]}
                    />
                </div>

                {/* Player 2 Setup */}
                <div className="flex flex-col items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-700">
                    <div className="text-xs font-bold text-slate-300 mb-1 flex items-center gap-2">
                        {isAI ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {isAI ? 'CPU' : 'PLAYER 2'}
                    </div>
                    
                    <button 
                        onClick={() => setIsAI(!isAI)}
                        className={`w-full py-1 text-[9px] font-bold rounded border uppercase tracking-wider transition-colors ${isAI ? 'bg-cyan-900 border-cyan-700 text-cyan-200' : 'bg-slate-800 border-slate-600 text-slate-300'}`}
                    >
                        {isAI ? 'Mode: vs CPU' : 'Mode: vs Player'}
                    </button>

                    <Selector 
                      label="Skin" 
                      options={Object.keys(SKINS) as SkinType[]} 
                      current={playerSkins[2]} 
                      onSelect={(val) => setPlayerSkins(prev => ({ ...prev, 2: val }))}
                      getLabel={(val) => SKINS[val].name}
                      getColor={(val) => SKINS[val].colors.primary}
                    />
                    <Selector 
                      label="Weapon" 
                      options={Object.keys(WEAPON_SKINS) as WeaponSkin[]} 
                      current={playerWeaponSkins[2]} 
                      onSelect={(val) => setPlayerWeaponSkins(prev => ({ ...prev, 2: val }))}
                      getLabel={(val) => WEAPON_SKINS[val].name}
                      getColor={(val) => WEAPON_SKINS[val].colors.body}
                    />
                    <Selector 
                      label="Model" 
                      options={Object.keys(WEAPON_MODELS) as WeaponModel[]} 
                      current={playerWeaponModels[2]} 
                      onSelect={(val) => setPlayerWeaponModels(prev => ({ ...prev, 2: val }))}
                      getLabel={(val) => WEAPON_MODELS[val]}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
                 <div className="flex flex-col items-center">
                    <Selector 
                        label="Environment" 
                        options={['room', 'forest', 'cyber', 'void', 'house', 'casino', 'rooftop', 'subway', 'fnaf'] as BackgroundType[]} 
                        current={background} 
                        onSelect={(val) => setBackground(val)}
                        getLabel={(val) => val.toUpperCase()}
                    />
                 </div>
                 <div className="flex flex-col items-center">
                    <Selector 
                        label="Ammo Type" 
                        options={Object.keys(BULLET_SKINS) as BulletSkin[]} 
                        current={bulletSkin} 
                        onSelect={(val) => setBulletSkin(val)}
                        getLabel={(val) => BULLET_SKINS[val].name}
                        getColor={(val) => BULLET_SKINS[val].colors.casing}
                    />
                 </div>
                 <div className="flex flex-col items-center">
                    <Selector 
                        label="Game Mode" 
                        options={['CLASSIC', 'CHAOS'] as GameMode[]} 
                        current={gameMode} 
                        onSelect={(val) => setGameMode(val)}
                        getLabel={(val) => val}
                        getColor={(val) => val === 'CHAOS' ? '#ef4444' : '#fff'}
                    />
                 </div>
            </div>

            <button 
              onClick={startGame}
              className="w-full bg-slate-100 text-slate-900 py-4 rounded-xl font-bold tracking-widest hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" /> START GAME
            </button>
          </div>
        )}

        {/* PLAYING STATE */}
        {gameState !== 'SETUP' && (
          <div className="flex flex-col items-center w-full max-w-sm z-20 pointer-events-auto">
             
             {/* Cylinder - SMALLER */}
             <div className="mb-6">
                <Cylinder 
                    rotation={rotation} 
                    fired={stickmanAction !== 'IDLE'} 
                    spinning={gameState === 'SPINNING'} 
                    firedChambers={firedChambers}
                    bulletSkin={bulletSkin}
                />
             </div>

             {/* Action Button - SMALLER */}
             {gameState === 'PLAYING' && (
               <div className="flex flex-col gap-4 w-full px-8">
                 <button 
                   onClick={pullTrigger}
                   disabled={isAI && currentPlayer === 2} 
                   className={`w-full bg-red-600 text-white py-3 rounded-xl font-black text-lg tracking-[0.2em] shadow-[0_0_30px_rgba(220,38,38,0.4)] border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 relative z-30
                   ${isAI && currentPlayer === 2 ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:bg-red-500 hover:scale-105'}`}
                 >
                   {isAI && currentPlayer === 2 ? (
                       <><Bot className="w-5 h-5 animate-pulse" /> CPU THINKING...</>
                   ) : (
                       <><Crosshair className="w-5 h-5" /> PULL TRIGGER</>
                   )}
                 </button>
               </div>
             )}

             {gameState === 'GAME_OVER' && (
               <div className="text-center animate-bounce mt-4">
                 <h2 className="text-4xl font-black text-red-500 mb-2 drop-shadow-lg">GAME OVER</h2>
                 <p className="text-slate-400 text-lg mb-6">Winner: <span className="text-white font-bold">Player {winner}</span></p>
                 <button onClick={() => setGameState('SETUP')} className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto">
                   <RotateCcw className="w-5 h-5" /> PLAY AGAIN
                 </button>
               </div>
             )}
          </div>
        )}
      </div>
      </div>

      {showItemIndex && (
          <ItemIndexModal 
             onClose={() => setShowItemIndex(false)} 
             rarityOverrides={rarityOverrides}
             onUpdateRarity={(item, rarity) => setRarityOverrides(prev => ({ ...prev, [item]: rarity }))}
          />
      )}

      {diceRollActive.active && (
          <DiceRollOverlay onComplete={(val) => {
              setDiceRollActive(prev => ({ ...prev, active: false }));
              resolveGamble(val, diceRollActive.player);
          }} />
      )}

      {showEmotePicker && (
          <EmotePicker 
             onSelect={handleEmote} 
             onClose={() => setShowEmotePicker(false)} 
          />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 2px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scanline {
            background: linear-gradient(
                to bottom,
                rgba(16, 185, 129, 0) 50%,
                rgba(16, 185, 129, 0.1) 50%
            );
            background-size: 100% 4px;
        }
        @keyframes swing {
           0%, 100% { transform: translateX(-50%) rotate(3deg); }
           50% { transform: translateX(-50%) rotate(-3deg); }
        }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);