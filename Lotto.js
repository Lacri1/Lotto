// Lotto.js

let totalSpent = 0;
let totalPrize = 0;
let totalAttempts = 0;
let rankCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
let isAutoGenerating = false;
let autoGenerateInterval;

// 색상 매핑
const lottoColors = ["#fbc531", "#4cd137", "#487eb0", "#e84118", "#9c88ff"];

// 로또 번호 생성
function generateLotto() {
  let numbers = [];
  while (numbers.length < 6) {
    let num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) numbers.push(num);
  }
  let bonus;
  do {
    bonus = Math.floor(Math.random() * 45) + 1;
  } while (numbers.includes(bonus));

  return { numbers: numbers.sort((a, b) => a - b), bonus };
}

// 로또 번호를 화면에 표시하는 함수 (강조 기능 제거)
function displayNumbers(containerId, numbers, bonusNumber = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ""; // 기존 공 초기화

  numbers.forEach(num => {
    let ball = document.createElement("div");
    ball.className = "lotto-number";
    ball.textContent = num;
    ball.style.backgroundColor = (num === bonusNumber) ? "#e74c3c" : lottoColors[Math.floor((num - 1) / 9)];
    container.appendChild(ball);
  });
}

// 랜덤 번호 생성 후 입력란 업데이트
function generateRandomLotto() {
  let randomNumbers = [];
  while (randomNumbers.length < 6) {
    let num = Math.floor(Math.random() * 45) + 1;
    if (!randomNumbers.includes(num)) randomNumbers.push(num);
  }
  randomNumbers.sort((a, b) => a - b);

  [...Array(6).keys()].forEach(i => {
    document.getElementById(`num${i + 1}`).value = randomNumbers[i];
  });

  displayNumbers("user-container", randomNumbers);
}

// 사용자가 입력한 번호 가져오기
function getUserNumbers() {
  return [...Array(6).keys()]
    .map(i => parseInt(document.getElementById(`num${i + 1}`).value, 10))
    .filter(num => !isNaN(num) && num >= 1 && num <= 45);
}

// 당첨 번호 및 사용자 입력 비교
function compareLotto() {
  let userNumbers = getUserNumbers();
  if (userNumbers.length !== 6) {
    alert("1~45 사이의 숫자 6개를 입력하세요.");
    return;
  }

  let { numbers: lottoNumbers, bonus } = generateLotto();
  totalAttempts++;
  totalSpent += 1000;

  let matchCount = userNumbers.filter(n => lottoNumbers.includes(n)).length;
  let hasBonus = userNumbers.includes(bonus);

  let prize = 0;
  let rank = 0;

// 제 1165회차 로또 당첨 금액
  if (matchCount === 6) {
    prize = 2192485270; rank = 1;
  } else if (matchCount === 5 && hasBonus) {
    prize = 52202031; rank = 2;
  } else if (matchCount === 5) {
    prize = 1497128; rank = 3;
  } else if (matchCount === 4) {
    prize = 50000; rank = 4;
  } else if (matchCount === 3) {
    prize = 5000; rank = 5;
  }

  totalPrize += prize;
  rankCounts[rank]++;

  // ✅ 당첨 번호 & 사용자 번호 표시
  displayNumbers("lotto-container", [...lottoNumbers, bonus], bonus);
  displayNumbers("user-container", userNumbers);

  // ✅ 결과 업데이트
  document.getElementById("total-attempts").textContent = `총 시행 횟수: ${totalAttempts}`;
  document.getElementById("total-result-container").innerHTML =
    `총 소모 금액: ${totalSpent.toLocaleString()}원<br>
     총 당첨 금액: ${totalPrize.toLocaleString()}원<br>
     맞춘 개수: ${matchCount}개<br>
     등수: ${rank === 0 ? "꽝" : `${rank}등`}`;

  // ✅ 등수별 통계 업데이트
  for (let i = 0; i <= 5; i++) {
    document.getElementById(`rank-${i}`).textContent = rankCounts[i];
  }

  return rank;
}

// 자동 실행 함수 추가
function autoGenerateLotto() {
  if (isAutoGenerating) {
    isAutoGenerating = false;
    clearInterval(autoGenerateInterval);
    alert("자동 실행이 중지되었습니다.");
    return;
  }

  isAutoGenerating = true;
  alert("자동 실행을 시작합니다. 3등 이상 당첨되면 자동 실행이 멈춥니다.");

  autoGenerateInterval = setInterval(() => {
    if (!isAutoGenerating) {
      clearInterval(autoGenerateInterval);
      return;
    }

    generateRandomLotto();
    let latestRank = compareLotto();

    if (latestRank <= 3 && latestRank > 0) {
      isAutoGenerating = false;
      clearInterval(autoGenerateInterval);
      alert(`🎉 ${latestRank}등 당첨! 자동 실행이 중지됩니다.`);
    }
  }, 10); // 10 = 0.01초, 1000 = 1000ms = 1초
}
