/**
 * 都道府県ルーレット アプリケーション
 */

// 47都道府県データ
const PREFECTURES = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
    '岐阜県', '静岡県', '愛知県', '三重県',
    '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
    '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県',
    '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

// DOM要素
const prefecturesGrid = document.getElementById('prefecturesGrid');
const selectAllBtn = document.getElementById('selectAllBtn');
const deselectAllBtn = document.getElementById('deselectAllBtn');
const selectedCountEl = document.getElementById('selectedCount');
const startButton = document.getElementById('startButton');
const rouletteDisplay = document.getElementById('rouletteDisplay');
const prefectureText = document.getElementById('prefectureText');
const resultSection = document.getElementById('resultSection');
const resultPrefecture = document.getElementById('resultPrefecture');
const confettiEl = document.getElementById('confetti');

// AudioContext（遅延初期化）
let audioContext = null;

/**
 * AudioContextを初期化（ユーザー操作後に呼び出し）
 */
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

/**
 * ドラムロール音を再生
 */
function playDrumRoll(duration) {
    const startTime = audioContext.currentTime;
    const endTime = startTime + duration / 1000;
    
    // ドラムロールの音を連続再生
    const interval = 0.05; // 音の間隔
    for (let time = startTime; time < endTime; time += interval) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(200 + Math.random() * 100, time);
        
        // 徐々に音量を上げていく
        const progress = (time - startTime) / (endTime - startTime);
        const volume = 0.05 + progress * 0.1;
        gainNode.gain.setValueAtTime(volume, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
        
        oscillator.start(time);
        oscillator.stop(time + 0.04);
    }
}

/**
 * ティック音（ルーレット回転中）
 */
function playTickSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800 + Math.random() * 200, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
}

/**
 * バン！効果音を再生
 */
function playBangSound() {
    // 低音のインパクト音
    const oscillator1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    
    oscillator1.connect(gainNode1);
    gainNode1.connect(audioContext.destination);
    
    oscillator1.type = 'sawtooth';
    oscillator1.frequency.setValueAtTime(100, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
    
    gainNode1.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
    
    oscillator1.start();
    oscillator1.stop(audioContext.currentTime + 0.4);
    
    // 高音のクラッシュ
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);
    
    oscillator2.type = 'square';
    oscillator2.frequency.setValueAtTime(300, audioContext.currentTime);
    
    gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
    
    oscillator2.start();
    oscillator2.stop(audioContext.currentTime + 0.15);
    
    // ノイズ（シンバルっぽい音）
    const bufferSize = audioContext.sampleRate * 0.2;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
    }
    
    const noise = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();
    
    noise.buffer = buffer;
    noise.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    
    noiseGain.gain.setValueAtTime(0.3, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    
    noise.start();
}

/**
 * ファンファーレ音を再生
 */
function playFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const startTime = audioContext.currentTime;
    
    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(freq, startTime + index * 0.1);
        
        gainNode.gain.setValueAtTime(0, startTime + index * 0.1);
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + index * 0.1 + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.1 + 0.4);
        
        oscillator.start(startTime + index * 0.1);
        oscillator.stop(startTime + index * 0.1 + 0.5);
    });
}

/**
 * 都道府県チェックボックスを生成
 */
function createPrefectureCheckboxes() {
    PREFECTURES.forEach((name, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `pref-${index}`;
        checkbox.className = 'prefecture-checkbox';
        checkbox.checked = true; // デフォルトで全選択
        checkbox.addEventListener('change', updateSelectedCount);
        
        const label = document.createElement('label');
        label.htmlFor = `pref-${index}`;
        label.className = 'prefecture-label';
        label.innerHTML = `
            <span class="checkbox-custom"></span>
            <span class="prefecture-name">${name}</span>
        `;
        
        prefecturesGrid.appendChild(checkbox);
        prefecturesGrid.appendChild(label);
    });
    
    updateSelectedCount();
}

/**
 * 選択されている都道府県を取得
 */
function getSelectedPrefectures() {
    const selected = [];
    PREFECTURES.forEach((name, index) => {
        const checkbox = document.getElementById(`pref-${index}`);
        if (checkbox.checked) {
            selected.push(name);
        }
    });
    return selected;
}

/**
 * 選択数を更新
 */
function updateSelectedCount() {
    const count = getSelectedPrefectures().length;
    selectedCountEl.textContent = `${count} / 47 選択中`;
}

/**
 * 全選択
 */
function selectAll() {
    PREFECTURES.forEach((_, index) => {
        document.getElementById(`pref-${index}`).checked = true;
    });
    updateSelectedCount();
}

/**
 * 全解除
 */
function deselectAll() {
    PREFECTURES.forEach((_, index) => {
        document.getElementById(`pref-${index}`).checked = false;
    });
    updateSelectedCount();
}

/**
 * 紙吹雪を生成
 */
function createConfetti() {
    confettiEl.innerHTML = '';
    const colors = ['#f5576c', '#667eea', '#4ade80', '#fbbf24', '#a855f7', '#22d3ee'];
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = `${Math.random() * 0.5}s`;
        piece.style.animationDuration = `${2 + Math.random() * 2}s`;
        piece.style.width = `${5 + Math.random() * 10}px`;
        piece.style.height = `${5 + Math.random() * 10}px`;
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confettiEl.appendChild(piece);
    }
}

/**
 * イージング関数（減速）
 */
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

/**
 * ルーレットを開始
 */
async function startRoulette() {
    const selectedPrefectures = getSelectedPrefectures();
    
    if (selectedPrefectures.length === 0) {
        alert('少なくとも1つの都道府県を選択してください');
        return;
    }
    
    // 初期化
    initAudioContext();
    startButton.disabled = true;
    resultSection.classList.add('hidden');
    rouletteDisplay.classList.add('spinning');
    
    // 最終結果をランダムに決定
    const finalResult = selectedPrefectures[Math.floor(Math.random() * selectedPrefectures.length)];
    
    // ルーレットパラメータ
    const totalDuration = 4000; // 4秒間
    const startInterval = 50; // 開始時の切り替え間隔(ms)
    const endInterval = 500; // 終了時の切り替え間隔(ms)
    
    // ドラムロール開始
    playDrumRoll(totalDuration);
    
    // アニメーション
    const startTime = Date.now();
    let lastIndex = -1;
    
    return new Promise((resolve) => {
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / totalDuration, 1);
            
            // イージングで減速
            const easedProgress = easeOutCubic(progress);
            const currentInterval = startInterval + (endInterval - startInterval) * easedProgress;
            
            // 表示する都道府県を計算
            const cyclePosition = elapsed / startInterval;
            const currentIndex = Math.floor(cyclePosition) % selectedPrefectures.length;
            
            // インデックスが変わったら表示を更新＆ティック音
            if (currentIndex !== lastIndex) {
                // 終盤は最終結果に向かって調整
                let displayPrefecture;
                if (progress > 0.9) {
                    displayPrefecture = finalResult;
                } else {
                    displayPrefecture = selectedPrefectures[currentIndex];
                }
                
                prefectureText.textContent = displayPrefecture;
                
                // ティック音（減速に応じて頻度を下げる）
                if (progress < 0.9) {
                    playTickSound();
                }
                
                lastIndex = currentIndex;
            }
            
            if (progress < 1) {
                // 減速に応じてフレームレートを調整
                setTimeout(animate, currentInterval / 2);
            } else {
                // 終了処理
                rouletteDisplay.classList.remove('spinning');
                prefectureText.textContent = finalResult;
                
                // バン！効果音
                playBangSound();
                
                // 少し待ってから結果表示
                setTimeout(() => {
                    // ファンファーレ
                    playFanfare();
                    
                    // 結果表示
                    resultPrefecture.textContent = finalResult;
                    resultSection.classList.remove('hidden');
                    
                    // 紙吹雪
                    createConfetti();
                    
                    startButton.disabled = false;
                    resolve(finalResult);
                }, 300);
            }
        }
        
        animate();
    });
}

// イベントリスナー
selectAllBtn.addEventListener('click', selectAll);
deselectAllBtn.addEventListener('click', deselectAll);
startButton.addEventListener('click', startRoulette);

// 初期化
createPrefectureCheckboxes();
