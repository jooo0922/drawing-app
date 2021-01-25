'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEl = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearEl = document.getElementById('clear');


let size = 30;
let isPressed = false;
let color = 'black'
let x = undefined;
let y = undefined;

canvas.addEventListener('mousedown', (e) => {
  isPressed = true;

  x = e.offsetX;
  y = e.offsetY;
});

// mousedown: mouse를 press 했을 때
// mouseup: mouse를 release 했을 때
// clicl: mouse를 press + release 했을 때 이벤트 발생.
canvas.addEventListener('mouseup', (e) => {
  isPressed = false;

  x = undefined;
  y = undefined;
  // 마우스가 released 된 상태에서는 x, y값을 drawLine()에 전달해줄 수 없음.
  // 그니까 ctx.moveTo()를 계산할 수 없지.
  // 그러니 선을 만들지 못하게 됨. -> 마우스를 뗀 상태에서는 선을 그리지 못하게 만드는 것.
});

// The mousedown event is fired at an Element when a pointing device button is pressed while the pointer is inside the element.
canvas.addEventListener('mousemove', (e) => {
  // console.log(e);
  // The offsetX read-only property of the MouseEvent interface provides 
  // the offset in the X coordinate of the mouse pointer between that event and the padding edge of the target node.
  // 한마디로 타겟 노드, 즉 canvas태그의 padding edge와 mousedown event(or mousemove)가 발생한 지점 사이의 x축 방향에서 떨어진 거리값을 의미 
  
  // 마우스를 누른 상태에서만 x2, y2값이 drawLine()에 전달되어서 ctx.lineTo()가 제대로 실행되어 선을 그릴 수 있게 됨.
  if (isPressed) {
    const x2 = e.offsetX;
    const y2 = e.offsetY;
  
    // 새로운 lineTo()가 들어가는 값에 계속 원이 찍힐 수 있게 하는거임.
    // 이걸 안하고 그냥 drawLine() 함수만 쓰면 ctx.lineWidth() 값을 줬을 때 선이 기차 레일처럼 끊어져보임
    // 그래서 mousemove를 할때마다 lineTo(x2, y2) 지점을 향해 line을 그리면서
    // 매번 새롭게 갱신되는 x2, y2 지점에 원을 찍어주는거임. 그래야 선이 부드럽게 연결되어보임.
    drawCircle(x2, y2);
    drawLine(x, y, x2, y2);

    // 이거는 왜 하냐면, moveTo()에 들어가는 값이 항상 변해야하기 때문이지.

    // moveTo()에 들어갈 x, y 값을 맨 처음에 mousedown event가 발생했을 때 받은 offsetX, offsetY 로 넣고 변화를 주지 않으면,
    // 처음에 찍은 점에서 시작하는 line들만 무한양산되는 거임. 마치 방사형처럼 그려지는 거지.

    // moveTo()에 들어갈 값이 실시간으로 갱신되어야 함? 뭐로 갱신되어야 하냐고?
    // 바로 앞전에 lineTo에 들어간 값으로 갱신되어야 하는거지. 과거의 lineTo가 새로운 moveTo가 되고,
    // mousemove event에 따라 lineTo는 매번 새로운 offsetX, offsetY값을 받게 되겠지.
    // 그럼 이 선들이 꼬리에 꼬리를 물면서 서로 연결되어서 drawing line으로 보이는거야. 

    // 쉽게 정리하면, moveTo(x, y)에 들어가는 값이 한쌍밖에 없고, 안 변해, 고정되어 있어. 그럼 방사형이 그려지는 거고,
    // moveTo()에 들어가는 값이 이전에 lineTo에 들어가는 값으로 갱신돼. 그럼 꼬리에 꼬리를 물면서 drawing line이 그려지는 거야. 아주 쉬운 원리임.
    x = x2;
    y = y2;
  }
});

function drawCircle(x, y){
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color; // fillStyle = color 도형을 채우는 색을 설정합니다.
  ctx.fill(); // Use the stroke() or the fill() method to actually draw the arc on the canvas.
}

// 찍은 점들을 연결해주는 선을 만드는 함수
function drawLine(x1, y1, x2, y2){
  ctx.beginPath();
  ctx.moveTo(x1, y1); // The moveTo() method moves the path to the specified point in the canvas, without creating a line.
  ctx.lineTo(x2, y2); // The lineTo() method adds a new point and creates a line TO that point FROM the last specified point in the canvas (this method does not draw the line).
  ctx.strokeStyle = color; 
  ctx.lineWidth = size * 2; // width가 2배가 되어서 더 촘촘하게 line이 그려지는데 원의 크기는 똑같이 찍히니까 더 부드러운 선이 그려짐
  ctx.stroke(); // Use the stroke() method to actually draw the path on the canvas.
}

increaseBtn.addEventListener('click', () => {
  size += 5;

  if (size > 50) {
    size = 50; // size를 50을 못넘게 하려는거
  }

  updateSizeOnScreen();
});

decreaseBtn.addEventListener('click', () => {
  size -= 5;

  if (size < 5) {
    size = 5; // size가 5보다 작아지지 못하게 하려는거
  }

  updateSizeOnScreen();
});

// The change event is fired for <input>, <select>, and <textarea> elements 
// when an alteration to the element's value is committed by the user.
colorEl.addEventListener('change', (e) => {
  color = e.target.value;
});

clearEl.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function updateSizeOnScreen(){
  sizeEl.innerText = size;
}

// 여기는 캔버스로 애니메이션 만든 함수. 근데 drawing app이니 쓸모없으니까 코멘트처리 함.
// function draw(){
//   /**
//    * Canvas의 Context에는 clearRect()의 메소드가 존재한다.
//    * 
//    * 이 메소드는 사각형 영역을 지우는 메소드 인데, 
//    * 4개의 파라미터를 필요로 한다. => clearRect(x, y, w, h)
//    * 
//    * 캔버스안에서 특정 영역을 지울 때 사용하는데, 
//    * x = 0, y = 0, w = canvas.width, h = canvas.height로 설정하면 캔버스의 전체영역을 지울 수 있게 된다.
//    */
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   drawCircle(x++, y);
  
//   /**
//    * window.requestAnimationFrame()은 브라우저에게 수행하기를 원하는 애니메이션을 알리고 
//    * 다음 리페인트가 진행되기 전에 해당 애니메이션을 업데이트하는 함수를 호출하게 합니다. 
//    * 이 메소드는 리페인트 이전에 실행할 콜백을 인자로 받습니다.
//    * 
//    * 다음 리페인트에서 그 다음 프레임을 애니메이트하려면 
//    * 콜백 루틴이 반드시 스스로 requestAnimationFrame()을 호출해야 합니다.
//    * 
//    * 뭔 소리냐면 requestAnimationFrame()에 들어갈 파라미터는 새로운 애니메이션 프레임을 그려서 업데이트하는 함수이고,
//    * requestAnimationFrame()를 항상 파라미터에 들어갈 콜백함수안에서 호출해줘서 
//    * 콜백 루틴을 스스로 반복할 수 있게 해줘야 함. 반복을 해야 애니메이션 프레임을 계속 그려내서 
//    * 프레임이 움직이게 만들지. 그러니까 반복을 시키려고 내부에서 콜백 루틴을 반복 호출하는거임.
//    * 
//    * 그리고 콜백의 수는 기본 1초에 60회 즉, 60fps이긴 하지만, 브라우저에서는 모니터 디스플레이 주사율과 일치시킴. 
//    */
//   requestAnimationFrame(draw);
// }

// draw();

