// NPC 정보 및 위치
const npcs = [
  { id: 'npc1', name: '부모님', x: 100, y: 80 },
  { id: 'npc2', name: '친구', x: 400, y: 120 },
  { id: 'npc3', name: '선생님', x: 200, y: 300 },
  { id: 'npc4', name: '동기', x: 480, y: 260 },
];

const player = document.getElementById('player');
const message = document.getElementById('message');
const partyScreen = document.getElementById('party-screen');
const partySound = document.getElementById('party-sound');
const commitmentInput = document.getElementById('commitment');
const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');

let playerPos = { x: 50, y: 50 };
let invited = {};
let canMove = true;

function setPlayerPos(x, y) {
  playerPos.x = Math.max(0, Math.min(560, x));
  playerPos.y = Math.max(0, Math.min(360, y));
  player.style.left = playerPos.x + 'px';
  player.style.top = playerPos.y + 'px';
}

function showMessage(text, ms = 1000) {
  message.textContent = text;
  message.style.display = 'block';
  setTimeout(() => {
    message.style.display = 'none';
  }, ms);
}

function checkCollision() {
  for (const npc of npcs) {
    if (invited[npc.id]) continue;
    const npcElem = document.getElementById(npc.id);
    const dx = playerPos.x - npc.x;
    const dy = playerPos.y - npc.y;
    if (Math.sqrt(dx * dx + dy * dy) < 50) {
      return npc;
    }
  }
  return null;
}

function inviteNPC(npc) {
  invited[npc.id] = true;
  const npcElem = document.getElementById(npc.id);
  npcElem.classList.add('invited');
  if (!npcElem.querySelector('.check')) {
    const check = document.createElement('span');
    check.className = 'check';
    check.textContent = '✔';
    npcElem.appendChild(check);
  }
  showMessage(`${npc.name}에게 초대장을 전달했어요!`);
  // 모든 NPC 초대 완료 시 파티 화면 전환
  if (Object.keys(invited).length === npcs.length) {
    setTimeout(showPartyScreen, 1200);
  }
}

function showPartyScreen() {
  document.getElementById('game-container').style.display = 'none';
  partyScreen.style.display = 'flex';
  partySound.currentTime = 0;
  partySound.play();
}

// 키보드 이벤트
window.addEventListener('keydown', (e) => {
  if (!canMove) return;
  let moved = false;
  if (e.key === 'ArrowUp') {
    setPlayerPos(playerPos.x, playerPos.y - 20);
    moved = true;
  } else if (e.key === 'ArrowDown') {
    setPlayerPos(playerPos.x, playerPos.y + 20);
    moved = true;
  } else if (e.key === 'ArrowLeft') {
    setPlayerPos(playerPos.x - 20, playerPos.y);
    moved = true;
  } else if (e.key === 'ArrowRight') {
    setPlayerPos(playerPos.x + 20, playerPos.y);
    moved = true;
  } else if (e.key === 'Enter') {
    const npc = checkCollision();
    if (npc) {
      inviteNPC(npc);
    } else {
      showMessage('NPC 근처에서만 엔터키가 작동합니다!', 700);
    }
  }
  if (moved) {
    // 이동 시 메시지 숨김
    message.style.display = 'none';
  }
});

// 파티 화면: 다짐 제출
submitBtn.addEventListener('click', () => {
  const val = commitmentInput.value.trim();
  if (!val) {
    alert('나의 다짐을 입력해 주세요!');
    return;
  }
  commitmentInput.style.display = 'none';
  submitBtn.style.display = 'none';
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `<h3>당신은 롯데캐피탈의 일원이 되었습니다!</h3><p>나의 다짐: <b>${val}</b></p>`;
});

// 초기화
setPlayerPos(playerPos.x, playerPos.y);
// NPC 이름 표시
npcs.forEach(npc => {
  const npcElem = document.getElementById(npc.id);
  npcElem.textContent = npc.name;
}); 