/* ── Node thread connections ────────────────────────────────────────────────
   All drawing is inside the SVG overlay — zero impact on card layout/size.
   Each entry: [fromCardId, 'right'|'left', toCardId, 'right'|'left']
   ────────────────────────────────────────────────────────────────────────── */
const NODE_CONNECTIONS = [
  ['card-rodin',  'right', 'card-stable', 'left'],
  ['card-color',  'right', 'card-stable', 'left'],
  ['card-stable', 'right', 'card-text',   'left'],
  ['card-stable', 'right', 'card-flux',   'left'],
  ['card-text',   'right', 'card-video',  'left'],
  ['card-flux',   'right', 'card-video',  'left'],
];

function getEdgePoint(cardId, side) {
  const card = document.getElementById(cardId);
  const svg  = document.getElementById('node-svg');
  if (!card || !svg) return null;
  const svgR  = svg.getBoundingClientRect();
  const cardR = card.getBoundingClientRect();
  return {
    x: (side === 'right' ? cardR.right : cardR.left) - svgR.left,
    y: cardR.top + cardR.height / 2 - svgR.top,
  };
}

function drawNodeConnections() {
  const svg = document.getElementById('node-svg');
  if (!svg) return;
  svg.innerHTML = ''; // clear

  const NS = 'http://www.w3.org/2000/svg';

  NODE_CONNECTIONS.forEach(([fromId, fromSide, toId, toSide]) => {
    const p1 = getEdgePoint(fromId, fromSide);
    const p2 = getEdgePoint(toId,   toSide);
    if (!p1 || !p2) return;

    // Cubic bezier — control points pull horizontally so curves are smooth
    const dx = Math.abs(p2.x - p1.x) * 0.45;
    const d  = `M ${p1.x} ${p1.y} C ${p1.x+dx} ${p1.y}, ${p2.x-dx} ${p2.y}, ${p2.x} ${p2.y}`;

    // Dashed thread line — class applies the flowing CSS animation
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#aaaaaa');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-dasharray', '5 4');
    path.setAttribute('stroke-dashoffset', '0');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('opacity', '0.85');
    path.classList.add('node-thread');
    svg.appendChild(path);

    // Connector dots at both ends
    [p1, p2].forEach(p => {
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
      dot.setAttribute('r', '4');
      dot.setAttribute('fill', '#ffffff');
      dot.setAttribute('stroke', '#999999');
      dot.setAttribute('stroke-width', '1.5');
      svg.appendChild(dot);
    });
  });
}

// Draw once layout is painted, redraw on resize
window.addEventListener('load',   drawNodeConnections);
window.addEventListener('resize', drawNodeConnections);

/* ── Hero Parallax Mouse Effect ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  const heroBg = document.getElementById('hero-bg');

  if (hero && heroBg) {
    hero.addEventListener('mousemove', (e) => {
      // Calculate mouse position relative to the center of the viewport
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      // Move background slightly in the opposite direction
      // Max displacement is 1.5% of viewport width/height
      const moveX = (x - 0.5) * 3; 
      const moveY = (y - 0.5) * 3;

      heroBg.style.transform = `translate(${-moveX}%, ${-moveY}%)`;
    });

    // Reset when mouse leaves
    hero.addEventListener('mouseleave', () => {
      heroBg.style.transform = `translate(0, 0)`;
    });
  }
});

/* ─────────────────────────────────────────────────────────────────────────── */

// const canvas = document.getElementById("canvas");
// const context = canvas.getContext("2d");


// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// const frameCount = 200; // number of images

// const currentFrame = index => 
//   `assets/ezgif-89ca856d59fc8554-png-split/ezgif-frame-${index.toString().padStart(3, '0')}.png`;

// const images = [];
// let currentImage = 0;

// // preload images
// for (let i = 1; i <= frameCount; i++) {
//   const img = new Image();
//   img.src = currentFrame(i);
//   images.push(img);
// }

// // draw first frame
// images[0].onload = () => {
//   context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
// };

// // scroll animation
// window.addEventListener("scroll", () => {
//   const scrollTop = window.scrollY;
//   const maxScroll = document.body.scrollHeight - window.innerHeight;

//   const scrollFraction = scrollTop / maxScroll;
//   const frameIndex = Math.min(
//     frameCount - 1,
//     Math.floor(scrollFraction * frameCount)
//   );

//   if (frameIndex !== currentImage) {
//     currentImage = frameIndex;
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
//   }
// });

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawFrame(currentImage);
}

window.addEventListener("resize", resizeCanvas);

const frameCount = 200;

const currentFrame = index =>
  `assets/ezgif-89ca856d59fc8554-png-split/ezgif-frame-${index.toString().padStart(3, '0')}.png`;

const images = [];
let currentImage = 0;

for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

function drawFrame(index) {
  const img = images[index];
  if (!img || !img.complete) return;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
}

images[0].onload = () => {
  resizeCanvas();
};

function updateOnScroll() {
  const section = document.querySelector(".scroll-section");
  const sectionTop = section.offsetTop;
  const sectionHeight = section.offsetHeight;
  const scrollY = window.scrollY;

  const start = sectionTop;
  const end = sectionTop + sectionHeight - window.innerHeight;

  let progress = (scrollY - start) / (end - start);
  progress = Math.max(0, Math.min(1, progress));

  const frameIndex = Math.floor(progress * (frameCount - 1));

  if (frameIndex !== currentImage) {
    currentImage = frameIndex;
    requestAnimationFrame(() => drawFrame(frameIndex));
  }
}

window.addEventListener("scroll", updateOnScroll);




// const img = document.getElementById("mainImage");
// const tools = document.querySelectorAll(".tool");

// const defaultImg = img.src;

// function changeImage(newSrc) {
//   img.style.opacity = 0;

//   setTimeout(() => {
//     img.src = newSrc;
//     img.style.opacity = 1;
//   }, 150);
// }

// tools.forEach(tool => {
//   const newImg = tool.dataset.img;

//   tool.addEventListener("mouseenter", () => {
//     changeImage(newImg);
//   });

//   tool.addEventListener("mouseleave", () => {
//     changeImage(defaultImg);
//   });
// });


const img = document.getElementById("mainImage");
const tools = document.querySelectorAll(".tool");

const defaultState = {
  src: img.src,
  width: "40%",
  height: "70%"
};

function changeImage({src, width, height}) {
  img.style.opacity = 0;

  setTimeout(() => {
    img.src = src;
    img.style.width = width;
    img.style.height = height;
    img.style.opacity = 1;
  }, 150);
}

function resetImage() {
  changeImage(defaultState);
}

  tools.forEach(tool => {
    tool.addEventListener("mouseenter", () => {
    changeImage({
      src: tool.dataset.img,
      width: tool.dataset.width,
      height: tool.dataset.height
    });
    });

    tool.addEventListener("mouseleave", () => {
    resetImage();
    });
  });
