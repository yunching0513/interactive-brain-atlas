import * as THREE from './vendor/three.module.min.js';
import { fsaverage5Surfaces } from './model/fsaverage5-surfaces.js';
import { chemicalSignals, emotionScenarios, functionTranslations, structureTranslations } from './brain-content.js';

const structures = {
  frontal: {
    name: '額葉', latin: 'Frontal lobe', category: '大腦皮質 · 腦葉', color: '#e99967',
    summary: '位於大腦前方，參與規劃、抑制、工作記憶、語言產出、動作控制與社會判斷。',
    functions: ['執行控制', '規劃', '工作記憶', '動作與語言'],
    note: '它不是單一的「理性中心」；不同前額葉與運動區會和感覺、記憶、獎賞網絡協同工作。'
  },
  parietal: {
    name: '頂葉', latin: 'Parietal lobe', category: '大腦皮質 · 腦葉', color: '#d7bf55',
    summary: '位於腦的上方與後方，整合觸覺、本體感覺、空間位置、數量與注意資訊。',
    functions: ['感覺整合', '空間注意', '身體定位', '數量處理'],
    note: '頂葉讓身體與外部空間形成可操作的地圖；左右半球受損可能呈現不同的注意或語言症狀。'
  },
  temporal: {
    name: '顳葉', latin: 'Temporal lobe', category: '大腦皮質 · 腦葉', color: '#57a99a',
    summary: '位於兩側、靠近耳朵，參與聽覺、語意、物體辨識、記憶，以及社會線索的理解。',
    functions: ['聽覺', '語意理解', '辨識', '記憶'],
    note: '顳葉內側包含海馬迴等記憶結構；外側皮質則參與聲音、語言與人物相關資訊處理。'
  },
  occipital: {
    name: '枕葉', latin: 'Occipital lobe', category: '大腦皮質 · 腦葉', color: '#747fc0',
    summary: '位於大腦後方，是視覺訊息進入皮質後的重要處理區域。',
    functions: ['視覺特徵', '形狀與顏色', '運動視覺', '視野映射'],
    note: '「看見」不是枕葉單獨完成；視覺資訊還會沿背側與腹側路徑連結到頂葉、顳葉與額葉。'
  },
  cerebellum: {
    name: '小腦', latin: 'Cerebellum', category: '後腦 · 運動與預測', color: '#c27f79',
    summary: '位於後下方，調整動作時序、平衡、協調與誤差學習，也參與部分認知與情緒調節。',
    functions: ['動作協調', '平衡', '時序', '預測誤差'],
    note: '小腦不是只管動作；它可能以「建立預測、比較誤差」的方式參與語言、注意與情緒任務。'
  },
  brainstem: {
    name: '腦幹', latin: 'Brainstem', category: '中腦 · 橋腦 · 延髓', color: '#bd9364',
    summary: '連接大腦、小腦與脊髓，調節呼吸、心跳、覺醒、睡眠及多種基本反射。',
    functions: ['呼吸心跳', '覺醒', '睡眠', '感覺運動通路'],
    note: '腦幹體積不大卻維持許多生命基本功能；圖中將中腦、橋腦與延髓簡化為一個連續結構。'
  },
  insula: {
    name: '島葉', latin: 'Insular cortex', category: '深藏皮質', color: '#ed9e42',
    summary: '藏在額葉、頂葉與顳葉形成的外側裂深處，整合身體內部感覺、味覺、疼痛與顯著性。',
    functions: ['內感覺', '顯著性', '味覺', '疼痛與同理'],
    note: '島葉把心跳、呼吸與不適等身體訊號帶進主觀感受，但不等於單一的「厭惡中心」。'
  },
  corpusCallosum: {
    name: '胼胝體', latin: 'Corpus callosum', category: '白質纖維束', color: '#e9ddbb',
    summary: '由大量神經纖維構成，是左右大腦半球之間最主要的訊息通道。',
    functions: ['跨半球傳遞', '感覺整合', '動作協調', '認知協同'],
    note: '它不是灰質功能中心，而是連接兩半球多個皮質區域的高速通路。'
  },
  thalamus: {
    name: '丘腦', latin: 'Thalamus', category: '間腦 · 中繼與調節', color: '#ad77bb',
    summary: '位於大腦中央，將多數感覺與運動訊息中繼到皮質，也參與注意、覺醒與皮質節律。',
    functions: ['感覺中繼', '注意', '覺醒', '皮質協調'],
    note: '丘腦不是被動轉運站；不同丘腦核會篩選、同步並調節皮質與皮質下迴路。'
  },
  hypothalamus: {
    name: '下視丘', latin: 'Hypothalamus', category: '間腦 · 恆定調節', color: '#43b4a5',
    summary: '位於丘腦下方，連結神經與內分泌系統，調節體溫、飢餓、口渴、壓力、睡眠與生殖。',
    functions: ['恆定性', '自主神經', '內分泌', '壓力與動機'],
    note: '下視丘透過腦幹與腦下垂體影響身體狀態；荷爾蒙效果具有情境性，不能當成單向行為按鈕。'
  },
  hippocampus: {
    name: '海馬迴', latin: 'Hippocampus', category: '內側顳葉 · 記憶', color: '#49b5a7',
    summary: '位於內側顳葉，對情節記憶、空間導航、情境學習與記憶整合十分重要。',
    functions: ['情節記憶', '空間導航', '情境學習', '記憶鞏固'],
    note: '海馬迴不是所有記憶的永久儲藏庫；它協助建立與重新組織記憶，再與廣泛皮質網絡互動。'
  },
  amygdala: {
    name: '杏仁核', latin: 'Amygdala', category: '內側顳葉 · 顯著性', color: '#ef5a4f',
    summary: '評估刺激的情緒與生物重要性，參與威脅學習、注意、價值判斷及社會訊息處理。',
    functions: ['顯著性', '威脅學習', '情緒記憶', '社會線索'],
    note: '杏仁核不等於「恐懼中心」；它也回應正向、新奇與不確定刺激，並與前額葉、海馬迴等形成網絡。'
  },
  basalGanglia: {
    name: '基底核', latin: 'Basal ganglia', category: '皮質下核團', color: '#5e8fae',
    summary: '包含紋狀體等核團，透過迴路選擇動作、學習習慣、評估結果與調節動機。',
    functions: ['動作選擇', '習慣學習', '獎賞學習', '動機'],
    note: '基底核不是單一塊組織；圖中用概念性體積代表多個核團與直接、間接路徑。'
  },
  anteriorInsula: {
    name: '前島葉', latin: 'Anterior insula', category: '顯著性網絡', color: '#f3a43e',
    summary: '整合身體內感覺與當下重要事件，常與前扣帶共同參與顯著性偵測和注意切換。',
    functions: ['內感覺', '顯著性', '注意切換', '情感同理'],
    note: '同理、厭惡或焦慮都不是前島葉單獨產生；任務與身體狀態會改變它所參與的網絡。'
  },
  acc: {
    name: '前扣帶皮質', latin: 'Anterior cingulate cortex', category: '顯著性與控制網絡', color: '#f0a33d',
    summary: '位於額葉內側，參與衝突、疼痛、努力、錯誤監測、動機與自主神經調節。',
    functions: ['衝突監測', '努力', '疼痛', '自主調節'],
    note: '前扣帶包含功能不同的次區域；「亮起」可能反映多種計算，不能直接等同特定感受。'
  },
  dlpfc: {
    name: '背外側前額葉', latin: 'Dorsolateral prefrontal cortex', category: '前額葉控制網絡', color: '#4e89db',
    summary: '在工作記憶、規則維持、抑制與重新評估等任務中，協助目標導向控制。',
    functions: ['工作記憶', '認知控制', '重新評估', '規則維持'],
    note: '高壓、疲勞與時間限制可能削弱控制表現，但不能只憑單一腦區活動判斷一個人的自制力。'
  },
  ventralStriatum: {
    name: '腹側紋狀體', latin: 'Ventral striatum', category: '獎賞與價值網絡', color: '#e5ca3d',
    summary: '整合預期結果、社會回饋與動機訊號，參與獎賞學習、接近行為和價值更新。',
    functions: ['獎賞預測', '價值學習', '動機', '社會回饋'],
    note: '多巴胺不等於快樂；它也參與預測誤差、學習與動機，行為仍取決於整個決策系統。'
  },
  tpj: {
    name: '顳頂交界區', latin: 'Temporoparietal junction', category: '社會認知網絡', color: '#a66bd0',
    summary: '位於顳葉與頂葉交界，參與注意轉向、他人信念推論、自我—他人區分與觀點取替。',
    functions: ['心智化', '觀點取替', '注意轉向', '自他區分'],
    note: '心智化仰賴 mPFC、TPJ、楔前葉、顳葉與記憶系統，並不是一個固定的單點模組。'
  },
  mPfc: {
    name: '內側前額葉', latin: 'Medial prefrontal cortex', category: '社會認知與價值網絡', color: '#a66bd0',
    summary: '參與自我與他人相關判斷、社會價值、心智狀態推論，以及情境化的情緒調節。',
    functions: ['自我相關', '社會推論', '價值', '情緒調節'],
    note: '內側前額葉包含多個次區域；不同任務可能涉及相反或互補的功能。'
  },
  pcc: {
    name: '後扣帶／楔前葉', latin: 'PCC / Precuneus', category: '預設與心智化網絡', color: '#8067c8',
    summary: '參與自傳記憶、情境建構、自我相關思考、想像與他人心理狀態推論。',
    functions: ['自傳記憶', '情境建構', '自我相關', '心智化'],
    note: '預設模式網絡並非「什麼都沒做」；它在內在思考、回憶和情境模擬中持續組織資訊。'
  }
};

Object.assign(structures, chemicalSignals);

const modeIds = {
  exterior: ['frontal', 'parietal', 'temporal', 'occipital', 'cerebellum', 'brainstem'],
  deep: ['insula', 'corpusCallosum', 'thalamus', 'hypothalamus', 'hippocampus', 'amygdala', 'basalGanglia'],
  emotion: ['amygdala', 'anteriorInsula', 'acc', 'dlpfc', 'ventralStriatum', 'tpj', 'hippocampus', 'hypothalamus', 'mPfc', 'pcc'],
  chemical: Object.keys(chemicalSignals)
};

const modeDefaults = { exterior: 'frontal', deep: 'thalamus', emotion: 'amygdala', chemical: 'oxytocin' };
const viewport = document.querySelector('#brain-viewport');
const canvas = document.querySelector('#brain-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x10251f, 0.028);
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
camera.position.set(0, 0.35, 12.8);

const sceneRoot = new THREE.Group();
sceneRoot.rotation.set(-0.08, 0.92, 0);
scene.add(sceneRoot);

scene.add(new THREE.HemisphereLight(0xe7fff0, 0x173329, 2.3));
const keyLight = new THREE.DirectionalLight(0xfff1d4, 4.2);
keyLight.position.set(4, 7, 8);
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0x78c9cf, 3.2);
rimLight.position.set(-7, 2, -6);
scene.add(rimLight);
const lowLight = new THREE.PointLight(0xff7e5f, 28, 18, 2);
lowLight.position.set(2, -4, 5);
scene.add(lowLight);

const exteriorGroup = new THREE.Group();
const shellGroup = new THREE.Group();
const deepGroup = new THREE.Group();
const emotionGroup = new THREE.Group();
const chemicalGroup = new THREE.Group();
sceneRoot.add(exteriorGroup, shellGroup, deepGroup, emotionGroup, chemicalGroup);

const interactiveObjects = [];
const structureObjects = new Map();
const explodeRoots = { exterior: [], deep: [], emotion: [], chemical: [] };

function deformedSphere(detail = 3, ridges = 0.035) {
  const segments = Math.max(32, detail * 14);
  const geometry = new THREE.SphereGeometry(1, segments, Math.round(segments * 0.68));
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i += 1) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    const wave = Math.sin(y * 13 + Math.sin(z * 7) * 1.8) * Math.cos(x * 10 - z * 4);
    const secondary = Math.sin((x + z) * 17) * 0.35;
    const factor = 1 + ridges * (wave + secondary);
    position.setXYZ(i, x * factor, y * factor, z * factor);
  }
  geometry.computeVertexNormals();
  return geometry;
}

const corticalGeometry = deformedSphere(4, 0.045);
const smallOrganicGeometry = deformedSphere(3, 0.025);
const nodeGeometry = new THREE.SphereGeometry(1, 28, 20);
const corticalSurfaces = [];

function materialFor(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: options.roughness ?? 0.63,
    metalness: options.metalness ?? 0.02,
    clearcoat: options.clearcoat ?? 0.12,
    clearcoatRoughness: 0.72,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    depthWrite: options.depthWrite ?? true,
    side: options.side ?? THREE.FrontSide,
    emissive: 0x000000,
    emissiveIntensity: 0
  });
}

function register(mesh, id, mode) {
  mesh.userData.structureId = id;
  mesh.userData.mode = mode;
  interactiveObjects.push(mesh);
  if (!structureObjects.has(id)) structureObjects.set(id, []);
  structureObjects.get(id).push(mesh);
}

function addOrganicPart(parent, id, mode, position, scale, rotation = [0, 0, 0], geometry = corticalGeometry, opacity = 1) {
  const root = new THREE.Group();
  root.position.fromArray(position);
  root.rotation.set(...rotation);
  root.userData.basePosition = root.position.clone();
  const radial = new THREE.Vector3(position[0], position[1] * 0.45, position[2] * 0.5);
  if (radial.lengthSq() < 0.05) radial.set(position[0] >= 0 ? 1 : -1, 0.2, 0.2);
  root.userData.explodeVector = radial.normalize();
  const mesh = new THREE.Mesh(geometry, materialFor(structures[id].color, { transparent: opacity < 1, opacity, depthWrite: opacity > 0.72 }));
  mesh.scale.fromArray(scale);
  root.add(mesh);
  parent.add(root);
  register(mesh, id, mode);
  explodeRoots[mode].push(root);
  return root;
}

function addPaired(parent, id, mode, positions, scale, rotations = [[0, 0, 0], [0, 0, 0]], geometry = corticalGeometry, opacity = 1) {
  return positions.map((position, index) => addOrganicPart(parent, id, mode, position, scale, rotations[index], geometry, opacity));
}

function classifyCorticalRegion(point) {
  const { y, z } = point;
  if (z > 0.62 + y * 0.05) return 'frontal';
  if (z < -1.48 + y * 0.06) return 'occipital';
  if (y < -0.34 && z < 1.18) return 'temporal';
  return 'parietal';
}

function decodeBase64(base64, Type) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Type(bytes.buffer);
}

function createCorticalHemisphere(side, hemisphere) {
  const surface = fsaverage5Surfaces[hemisphere];
  const positions = decodeBase64(surface.positions, Float32Array);
  const indices = decodeBase64(surface.indices, Uint16Array);
  const sulc = decodeBase64(surface.sulc, Float32Array);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  const position = geometry.attributes.position;
  const colors = [];
  const regions = [];
  const shades = [];
  const color = new THREE.Color();

  for (let i = 0; i < position.count; i += 1) {
    const y = position.getY(i);
    const z = position.getZ(i);
    const region = classifyCorticalRegion({ y, z });
    const shade = THREE.MathUtils.clamp(0.9 + sulc[i] * 0.095, 0.68, 1.1);
    regions.push(region);
    shades.push(shade);
    color.set(structures[region].color);
    color.multiplyScalar(shade);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.userData.regions = regions;
  geometry.userData.shades = shades;

  const material = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.77,
    metalness: 0,
    clearcoat: 0.08,
    clearcoatRoughness: 0.82,
    side: THREE.DoubleSide,
    emissive: 0x000000,
    emissiveIntensity: 0
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.mode = 'exterior';
  mesh.userData.regionPicker = true;
  interactiveObjects.push(mesh);

  const root = new THREE.Group();
  root.userData.basePosition = root.position.clone();
  root.userData.explodeVector = new THREE.Vector3(side, 0.03, 0);
  root.add(mesh);
  exteriorGroup.add(root);
  explodeRoots.exterior.push(root);
  corticalSurfaces.push(mesh);

  const shell = new THREE.Mesh(geometry, materialFor('#c4d0c7', {
    transparent: true, opacity: 0.038, depthWrite: false, side: THREE.DoubleSide, roughness: 0.25, clearcoat: 0.45
  }));
  shellGroup.add(shell);
}

// FreeSurfer fsaverage5 平均皮質表面；腦葉色彩是教育用近似分區。
createCorticalHemisphere(-1, 'left');
createCorticalHemisphere(1, 'right');
addPaired(exteriorGroup, 'cerebellum', 'exterior', [[-0.78, -1.73, -2.05], [0.78, -1.73, -2.05]], [0.95, 0.72, 1.04], [[0.12, 0.15, -0.05], [0.12, -0.15, 0.05]], deformedSphere(4, 0.075));

const brainstemRoot = new THREE.Group();
brainstemRoot.position.set(0, -1.6, -0.72);
brainstemRoot.rotation.x = -0.16;
brainstemRoot.userData.basePosition = brainstemRoot.position.clone();
brainstemRoot.userData.explodeVector = new THREE.Vector3(0, -1, 0.2);
const stemMaterial = materialFor(structures.brainstem.color);
const stem = new THREE.Mesh(new THREE.CapsuleGeometry(0.36, 1.35, 8, 20), stemMaterial);
stem.scale.set(1.05, 1, 0.9);
brainstemRoot.add(stem);
exteriorGroup.add(brainstemRoot);
register(stem, 'brainstem', 'exterior');
explodeRoots.exterior.push(brainstemRoot);

// 深部結構。
addPaired(deepGroup, 'insula', 'deep', [[-1.3, -0.15, 0.15], [1.3, -0.15, 0.15]], [0.48, 0.85, 1.18], [[0, 0.08, 0.12], [0, -0.08, -0.12]], smallOrganicGeometry);
addPaired(deepGroup, 'thalamus', 'deep', [[-0.38, 0.0, -0.25], [0.38, 0.0, -0.25]], [0.48, 0.57, 0.72], [[0, 0.12, 0], [0, -0.12, 0]], smallOrganicGeometry);
addOrganicPart(deepGroup, 'hypothalamus', 'deep', [0, -0.55, 0.0], [0.43, 0.36, 0.46], [0, 0, 0], smallOrganicGeometry);
addPaired(deepGroup, 'amygdala', 'deep', [[-0.88, -0.66, 0.68], [0.88, -0.66, 0.68]], [0.34, 0.4, 0.4], [[0, 0, 0], [0, 0, 0]], smallOrganicGeometry);
addPaired(deepGroup, 'basalGanglia', 'deep', [[-0.78, 0.3, 0.22], [0.78, 0.3, 0.22]], [0.42, 0.76, 0.72], [[0.18, 0.2, -0.18], [0.18, -0.2, 0.18]], smallOrganicGeometry);

function addTube(parent, id, mode, points, radius, colorOverride = null) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const geometry = new THREE.TubeGeometry(curve, 52, radius, 12, false);
  const mesh = new THREE.Mesh(geometry, materialFor(colorOverride || structures[id].color));
  mesh.userData.basePosition = mesh.position.clone();
  parent.add(mesh);
  register(mesh, id, mode);
  const root = mesh;
  root.userData.explodeVector = new THREE.Vector3(points[0][0] >= 0 ? 1 : -1, -0.15, 0.2).normalize();
  explodeRoots[mode].push(root);
  return mesh;
}

addTube(deepGroup, 'hippocampus', 'deep', [[-1.03, -0.48, -0.72], [-1.14, -0.66, -0.1], [-1.02, -0.72, 0.55], [-0.75, -0.66, 0.92]], 0.18);
addTube(deepGroup, 'hippocampus', 'deep', [[1.03, -0.48, -0.72], [1.14, -0.66, -0.1], [1.02, -0.72, 0.55], [0.75, -0.66, 0.92]], 0.18);
addTube(deepGroup, 'corpusCallosum', 'deep', [[-1.35, 0.45, -0.35], [-0.65, 0.9, -0.25], [0, 1.05, -0.18], [0.65, 0.9, -0.25], [1.35, 0.45, -0.35]], 0.16);

// 情緒與社會認知網絡：節點為概念性位置，連線顯示分散式協作。
function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 62);
  gradient.addColorStop(0, 'rgba(255,255,255,0.98)');
  gradient.addColorStop(0.18, 'rgba(255,255,255,0.7)');
  gradient.addColorStop(0.48, 'rgba(255,255,255,0.22)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const glowTexture = createGlowTexture();
const emotionNodes = [];
const emotionVisuals = new Map();
function addNetworkNode(id, positions, scale = 0.24) {
  positions.forEach((position) => {
    const root = addOrganicPart(emotionGroup, id, 'emotion', position, [scale, scale, scale], [0, 0, 0], nodeGeometry);
    const mesh = root.children[0];
    mesh.material.transparent = true;
    mesh.material.emissive.set(structures[id].color);
    mesh.material.emissiveIntensity = 0.14;

    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTexture,
      color: structures[id].color,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false
    }));
    const glowScale = Math.max(1.22, scale * 4.5);
    glow.scale.set(glowScale, glowScale, 1);
    glow.visible = false;
    root.add(glow);

    const visual = { root, mesh, glow, baseScale: mesh.scale.clone(), glowScale };
    if (!emotionVisuals.has(id)) emotionVisuals.set(id, []);
    emotionVisuals.get(id).push(visual);
    emotionNodes.push({ id, position: new THREE.Vector3(...position) });
  });
}

addNetworkNode('amygdala', [[-0.85, -0.62, 0.66], [0.85, -0.62, 0.66]], 0.3);
addNetworkNode('anteriorInsula', [[-1.45, -0.02, 0.58], [1.45, -0.02, 0.58]], 0.31);
addNetworkNode('acc', [[0, 0.62, 0.58]], 0.34);
addNetworkNode('dlpfc', [[-1.58, 0.82, 1.55], [1.58, 0.82, 1.55]], 0.34);
addNetworkNode('ventralStriatum', [[-0.48, -0.28, 0.52], [0.48, -0.28, 0.52]], 0.27);
addNetworkNode('tpj', [[-1.76, 0.52, -1.24], [1.76, 0.52, -1.24]], 0.34);
addNetworkNode('hippocampus', [[-0.98, -0.66, -0.25], [0.98, -0.66, -0.25]], 0.28);
addNetworkNode('hypothalamus', [[0, -0.58, 0]], 0.26);
addNetworkNode('mPfc', [[0, 0.9, 1.5]], 0.36);
addNetworkNode('pcc', [[0, 0.82, -1.35]], 0.36);

function networkLine(points, color = 0x91c6b4, opacity = 0.25) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(36));
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  const line = new THREE.Line(geometry, material);
  emotionGroup.add(line);
}

networkLine([[-1.58, 0.82, 1.55], [-0.9, 0.8, 1.15], [0, 0.62, 0.58], [0.85, -0.62, 0.66]], 0x6fa6ee, 0.35);
networkLine([[1.58, 0.82, 1.55], [0.9, 0.8, 1.15], [0, 0.62, 0.58], [-0.85, -0.62, 0.66]], 0x6fa6ee, 0.35);
networkLine([[-1.45, -0.02, 0.58], [0, 0.62, 0.58], [1.45, -0.02, 0.58]], 0xf2aa4a, 0.4);
networkLine([[0, 0.9, 1.5], [0, 1.18, 0], [0, 0.82, -1.35]], 0xb485da, 0.38);
networkLine([[-1.76, 0.52, -1.24], [-0.8, 1.05, -1.35], [0, 0.82, -1.35], [0.8, 1.05, -1.35], [1.76, 0.52, -1.24]], 0xb485da, 0.34);
networkLine([[-0.85, -0.62, 0.66], [-0.48, -0.28, 0.52], [0, -0.58, 0], [0.48, -0.28, 0.52], [0.85, -0.62, 0.66]], 0xeacb4c, 0.38);
networkLine([[-0.98, -0.66, -0.25], [-0.85, -0.62, 0.66], [0, 0.62, 0.58], [0.85, -0.62, 0.66], [0.98, -0.66, -0.25]], 0x58c7b6, 0.3);

// 神經傳導物質與荷爾蒙來源／路徑。周邊腎上腺節點置於腦下方，提醒它不在腦內。
const chemicalVisuals = new Map();
const chemicalFlowMaterials = [];

function addSignalCurve(group, start, end, color) {
  const a = new THREE.Vector3(...start);
  const c = new THREE.Vector3(...end);
  const b = a.clone().lerp(c, 0.5);
  b.z += 0.34;
  const curve = new THREE.QuadraticBezierCurve3(a, b, c);
  const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(34));
  const material = new THREE.LineDashedMaterial({ color, transparent: true, opacity: 0.72, dashSize: 0.12, gapSize: 0.08, depthWrite: false });
  const line = new THREE.Line(geometry, material);
  line.computeLineDistances();
  group.add(line);
  chemicalFlowMaterials.push(material);
}

function addSignalVisual(id, signal) {
  const group = new THREE.Group();
  group.visible = false;
  chemicalGroup.add(group);

  const sourceMeshes = signal.nodes.map((position, index) => {
    const mesh = new THREE.Mesh(nodeGeometry, materialFor(signal.color, { roughness: 0.34, clearcoat: 0.5 }));
    mesh.position.fromArray(position);
    mesh.scale.setScalar(index === 0 ? 0.27 : 0.21);
    mesh.material.emissive.set(signal.color);
    mesh.material.emissiveIntensity = 0.5;
    group.add(mesh);
    register(mesh, id, 'chemical');

    const halo = new THREE.Mesh(nodeGeometry, new THREE.MeshBasicMaterial({ color: signal.color, transparent: true, opacity: 0.11, depthWrite: false }));
    halo.position.copy(mesh.position);
    halo.scale.setScalar(index === 0 ? 0.47 : 0.36);
    group.add(halo);
    return mesh;
  });

  for (let i = 1; i < signal.nodes.length; i += 1) addSignalCurve(group, signal.nodes[i - 1], signal.nodes[i], signal.color);
  const pathStart = signal.nodes[signal.nodes.length - 1];
  signal.targets.forEach((position) => {
    const targetGeometry = signal.peripheral ? smallOrganicGeometry : nodeGeometry;
    const target = new THREE.Mesh(targetGeometry, materialFor(signal.color, { roughness: 0.5 }));
    target.position.fromArray(position);
    target.scale.setScalar(signal.peripheral ? 0.31 : 0.14);
    target.material.emissive.set(signal.color);
    target.material.emissiveIntensity = signal.peripheral ? 0.28 : 0.18;
    group.add(target);
    register(target, id, 'chemical');
    addSignalCurve(group, pathStart, position, signal.color);
  });

  if (signal.peripheral) {
    signal.targets.forEach((position) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.018, 8, 44), new THREE.MeshBasicMaterial({ color: signal.color, transparent: true, opacity: 0.48 }));
      ring.position.fromArray(position);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    });
  }
  chemicalVisuals.set(id, { group, sourceMeshes });
}

Object.entries(chemicalSignals).forEach(([id, signal]) => addSignalVisual(id, signal));

// 空間中的微小參考點，讓模型旋轉時保有深度感。
const dustGeometry = new THREE.BufferGeometry();
const dustPositions = [];
for (let i = 0; i < 280; i += 1) {
  const radius = 7 + Math.random() * 6;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  dustPositions.push(radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
}
dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0xa7c5b8, size: 0.018, transparent: true, opacity: 0.3 }));
scene.add(dust);

let currentMode = 'exterior';
let selectedId = null;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let autoRotate = !reduceMotion;
let explosion = 0;
let activeScenario = 'threat';

const ui = {
  category: document.querySelector('#structure-category'),
  categoryEn: document.querySelector('#structure-category-en'),
  name: document.querySelector('#structure-name'),
  latin: document.querySelector('#structure-latin'),
  summary: document.querySelector('#structure-summary'),
  summaryEn: document.querySelector('#structure-summary-en'),
  note: document.querySelector('#structure-note'),
  noteEn: document.querySelector('#structure-note-en'),
  tags: document.querySelector('#function-tags'),
  functionHeading: document.querySelector('#function-heading'),
  functionHeadingEn: document.querySelector('#function-heading-en'),
  signalDetail: document.querySelector('#signal-detail'),
  signalSource: document.querySelector('#signal-source'),
  signalSourceEn: document.querySelector('#signal-source-en'),
  signalPath: document.querySelector('#signal-path'),
  signalTriggers: document.querySelector('#signal-triggers'),
  list: document.querySelector('#structure-list'),
  count: document.querySelector('#structure-count'),
  index: document.querySelector('#selection-index'),
  hover: document.querySelector('#hover-label'),
  rotate: document.querySelector('#rotate-toggle'),
  explode: document.querySelector('#explode-range'),
  emotionLens: document.querySelector('#emotion-lens'),
  scenarioButtons: document.querySelector('#scenario-buttons'),
  scenarioZh: document.querySelector('#scenario-summary-zh'),
  scenarioEn: document.querySelector('#scenario-summary-en'),
  scenarioSignals: document.querySelector('#scenario-signals'),
  nodeLabels: document.querySelector('#scenario-node-labels')
};

function setGroupVisibility(mode) {
  exteriorGroup.visible = mode === 'exterior';
  shellGroup.visible = mode !== 'exterior';
  deepGroup.visible = mode === 'deep';
  emotionGroup.visible = mode === 'emotion';
  chemicalGroup.visible = mode === 'chemical';
}

function updateSelectionVisuals() {
  const scenarioNodes = new Set(emotionScenarios[activeScenario].nodes);
  structureObjects.forEach((objects, id) => {
    objects.forEach((mesh) => {
      if (!mesh.material || !('emissive' in mesh.material)) return;
      const active = id === selectedId && mesh.userData.mode === currentMode;
      const inScenario = currentMode === 'emotion' && mesh.userData.mode === 'emotion' && scenarioNodes.has(id);
      mesh.material.emissive.set(active || inScenario ? structures[id].color : 0x000000);
      mesh.material.emissiveIntensity = active ? 0.55 : (inScenario ? 0.3 : (mesh.userData.mode === 'emotion' ? 0.04 : 0));
    });
  });

  emotionVisuals.forEach((visuals, id) => {
    const inScenario = currentMode === 'emotion' && scenarioNodes.has(id);
    const selected = currentMode === 'emotion' && selectedId === id;
    const focused = inScenario || selected;
    visuals.forEach(({ mesh, glow, baseScale }) => {
      mesh.material.opacity = currentMode === 'emotion' ? (focused ? 1 : 0.16) : 1;
      mesh.material.emissive.set(focused ? structures[id].color : 0x000000);
      mesh.material.emissiveIntensity = selected ? 0.9 : (inScenario ? 0.66 : 0);
      mesh.scale.copy(baseScale).multiplyScalar(selected ? 1.2 : (inScenario ? 1.1 : 0.78));
      glow.visible = focused;
      glow.material.opacity = selected ? 0.96 : (inScenario ? 0.62 : 0);
      glow.userData.baseOpacity = glow.material.opacity;
    });
  });

  chemicalVisuals.forEach(({ group }, id) => { group.visible = currentMode === 'chemical' && id === selectedId; });

  corticalSurfaces.forEach((mesh) => {
    const colorAttribute = mesh.geometry.attributes.color;
    const regions = mesh.geometry.userData.regions;
    const shades = mesh.geometry.userData.shades;
    const color = new THREE.Color();
    for (let i = 0; i < colorAttribute.count; i += 1) {
      const region = regions[i];
      color.set(structures[region].color);
      color.multiplyScalar(shades[i]);
      if (currentMode === 'exterior' && modeIds.exterior.includes(selectedId)) {
        color.multiplyScalar(region === selectedId ? 1.08 : 0.9);
      }
      colorAttribute.setXYZ(i, color.r, color.g, color.b);
    }
    colorAttribute.needsUpdate = true;
  });
}

function renderStructureList() {
  const ids = modeIds[currentMode];
  ui.list.replaceChildren();
  ids.forEach((id) => {
    const data = structures[id];
    const translated = structureTranslations[id];
    const englishName = data.nameEn || translated?.nameEn || data.latin;
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `structure-item${id === selectedId ? ' is-selected' : ''}`;
    item.dataset.structureId = id;
    item.innerHTML = `<span class="structure-swatch" style="background:${data.color}"></span><span class="structure-item-label">${data.name}<small lang="en">${englishName}</small></span>`;
    item.addEventListener('click', () => selectStructure(id));
    ui.list.appendChild(item);
  });
  ui.count.textContent = `${ids.length} ${currentMode === 'chemical' ? 'signals' : 'structures'}`;
}

function selectStructure(id) {
  const data = structures[id];
  if (!data) return;
  const translated = structureTranslations[id] || {};
  const isChemical = currentMode === 'chemical';
  const englishName = data.nameEn || translated.nameEn || data.latin;
  const summaryEn = data.summaryEn || translated.summaryEn || '';
  const noteEn = data.noteEn || translated.noteEn || '';
  selectedId = id;
  const index = modeIds[currentMode].indexOf(id) + 1;
  ui.index.textContent = `${String(index).padStart(2, '0')} / ${String(modeIds[currentMode].length).padStart(2, '0')}`;
  ui.category.textContent = data.category;
  ui.categoryEn.textContent = data.categoryEn || translated.categoryEn || '';
  ui.name.textContent = data.name;
  ui.latin.textContent = `${englishName}${data.abbreviation ? ` · ${data.abbreviation}` : ''}`;
  ui.summary.textContent = data.summary;
  ui.summaryEn.textContent = summaryEn;
  ui.note.textContent = data.note;
  ui.noteEn.textContent = noteEn;
  ui.functionHeading.textContent = isChemical ? '主要作用' : '主要功能';
  ui.functionHeadingEn.textContent = isChemical ? 'Common roles' : 'Key functions';
  ui.tags.replaceChildren(...data.functions.map((label, tagIndex) => {
    const tag = document.createElement('span');
    const english = data.functionEn?.[tagIndex] || functionTranslations[label] || '';
    tag.innerHTML = `${label}${english ? `<small lang="en">${english}</small>` : ''}`;
    return tag;
  }));
  ui.signalDetail.hidden = !isChemical;
  if (isChemical) {
    ui.signalDetail.style.setProperty('--signal-color', data.color);
    ui.signalSource.textContent = data.source;
    ui.signalSourceEn.textContent = data.sourceEn;
    ui.signalPath.replaceChildren(...data.path.map((step) => {
      const span = document.createElement('span');
      span.textContent = step;
      return span;
    }));
    ui.signalTriggers.replaceChildren(...data.triggers.map((trigger, triggerIndex) => {
      const item = document.createElement('div');
      item.className = 'trigger-item';
      item.innerHTML = `<p>${trigger}</p><p lang="en">${data.triggersEn[triggerIndex]}</p>`;
      return item;
    }));
  }
  updateSelectionVisuals();
  updateScenarioLabelState();
  renderStructureList();
}

function updateScenarioLabelState() {
  ui.nodeLabels.querySelectorAll('.scenario-node-label').forEach((label) => {
    label.classList.toggle('is-primary', label.dataset.structureId === selectedId);
  });
}

function renderScenarioNodeLabels() {
  ui.nodeLabels.replaceChildren();
  if (currentMode !== 'emotion') return;
  emotionScenarios[activeScenario].nodes.forEach((id, index) => {
    if (!emotionVisuals.has(id)) return;
    const translated = structureTranslations[id] || {};
    const label = document.createElement('div');
    label.className = 'scenario-node-label';
    label.dataset.structureId = id;
    label.dataset.labelIndex = String(index);
    label.style.setProperty('--node-color', structures[id].color);
    label.innerHTML = `<strong>${structures[id].name}</strong><small lang="en">${translated.nameEn || structures[id].latin}</small>`;
    ui.nodeLabels.appendChild(label);
  });
  updateScenarioLabelState();
}

function positionScenarioNodeLabels() {
  if (currentMode !== 'emotion') return;
  const width = viewport.clientWidth;
  const height = viewport.clientHeight;
  const labelNudges = {
    amygdala: { x: -18, y: 44 },
    hypothalamus: { x: 16, y: 8 },
    anteriorInsula: { x: -8, y: -16 },
    acc: { x: 10, y: -6 },
    dlpfc: { x: 10, y: -22 }
  };
  ui.nodeLabels.querySelectorAll('.scenario-node-label').forEach((label) => {
    const visual = emotionVisuals.get(label.dataset.structureId)?.[0];
    if (!visual) return;
    const projected = new THREE.Vector3();
    visual.root.getWorldPosition(projected);
    projected.project(camera);
    const x = (projected.x * 0.5 + 0.5) * width;
    const y = (-projected.y * 0.5 + 0.5) * height;
    const visible = projected.z > -1 && projected.z < 1 && x > 18 && x < width - 18 && y > 18 && y < height - 18;
    const index = Number(label.dataset.labelIndex || 0);
    const nudge = labelNudges[label.dataset.structureId] || { x: 0, y: 0 };
    const offsetX = x < width * 0.5 ? -104 : 14;
    const offsetY = -18 + ((index % 3) - 1) * 16;
    label.style.transform = `translate3d(${Math.round(x + offsetX + nudge.x)}px, ${Math.round(y + offsetY + nudge.y)}px, 0)`;
    label.classList.toggle('is-visible', visible);
  });
}

function renderScenarioLens() {
  ui.scenarioButtons.replaceChildren();
  Object.entries(emotionScenarios).forEach(([id, scenario]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `scenario-button${id === activeScenario ? ' is-active' : ''}`;
    button.style.setProperty('--scenario-color', scenario.color);
    button.innerHTML = `${scenario.label}<small lang="en">${scenario.labelEn}</small>`;
    button.addEventListener('click', () => selectScenario(id));
    ui.scenarioButtons.appendChild(button);
  });
  const scenario = emotionScenarios[activeScenario];
  ui.scenarioZh.textContent = scenario.zh;
  ui.scenarioEn.textContent = scenario.en;
  ui.scenarioSignals.replaceChildren(...scenario.signals.map((id) => {
    const badge = document.createElement('span');
    badge.textContent = `${chemicalSignals[id].name} · ${chemicalSignals[id].nameEn}`;
    return badge;
  }));
}

function selectScenario(id) {
  activeScenario = id;
  renderScenarioLens();
  if (currentMode === 'emotion') {
    selectStructure(emotionScenarios[id].nodes[0]);
    renderScenarioNodeLabels();
  }
  else updateSelectionVisuals();
}

function setMode(mode) {
  currentMode = mode;
  setGroupVisibility(mode);
  ui.emotionLens.hidden = mode !== 'emotion';
  document.querySelectorAll('.mode-button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.mode === mode);
  });
  selectStructure(modeDefaults[mode]);
  renderScenarioNodeLabels();
}

document.querySelectorAll('.mode-button').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));

function resetView() {
  camera.position.set(0, 0.35, 12.8);
  sceneRoot.rotation.set(-0.08, 0.92, 0);
}

document.querySelector('#reset-view').addEventListener('click', resetView);
ui.rotate.addEventListener('click', () => {
  autoRotate = !autoRotate;
  ui.rotate.classList.toggle('is-active', autoRotate);
  ui.rotate.setAttribute('aria-pressed', String(autoRotate));
});

function applyExplosion() {
  Object.values(explodeRoots).flat().forEach((root) => {
    const base = root.userData.basePosition || new THREE.Vector3();
    const direction = root.userData.explodeVector || new THREE.Vector3();
    root.position.copy(base).addScaledVector(direction, explosion * 1.25);
  });
}

ui.explode.addEventListener('input', () => {
  explosion = Number(ui.explode.value) / 100;
  ui.explode.style.setProperty('--range-value', `${ui.explode.value}%`);
  applyExplosion();
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerDown = false;
let pointerStart = { x: 0, y: 0 };
let previousPointer = { x: 0, y: 0 };
let dragged = false;

function setPointerFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function getIntersection(event) {
  setPointerFromEvent(event);
  raycaster.setFromCamera(pointer, camera);
  const candidates = interactiveObjects.filter((object) => object.userData.mode === currentMode);
  return raycaster.intersectObjects(candidates, false)[0] || null;
}

function structureIdFromHit(hit) {
  if (!hit) return null;
  if (hit.object.userData.regionPicker) {
    const localPoint = hit.object.worldToLocal(hit.point.clone());
    return classifyCorticalRegion(localPoint);
  }
  return hit.object.userData.structureId || null;
}

canvas.addEventListener('pointerdown', (event) => {
  pointerDown = true;
  dragged = false;
  pointerStart = { x: event.clientX, y: event.clientY };
  previousPointer = { ...pointerStart };
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointermove', (event) => {
  if (pointerDown) {
    const dx = event.clientX - previousPointer.x;
    const dy = event.clientY - previousPointer.y;
    sceneRoot.rotation.y += dx * 0.008;
    sceneRoot.rotation.x = THREE.MathUtils.clamp(sceneRoot.rotation.x + dy * 0.006, -1.05, 1.05);
    previousPointer = { x: event.clientX, y: event.clientY };
    dragged = dragged || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5;
    ui.hover.classList.remove('is-visible');
    return;
  }
  const hit = getIntersection(event);
  if (hit) {
    const structureId = structureIdFromHit(hit);
    viewport.style.cursor = 'pointer';
    ui.hover.textContent = structures[structureId].name;
    ui.hover.style.left = `${event.clientX - viewport.getBoundingClientRect().left}px`;
    ui.hover.style.top = `${event.clientY - viewport.getBoundingClientRect().top}px`;
    ui.hover.classList.add('is-visible');
  } else {
    viewport.style.cursor = 'grab';
    ui.hover.classList.remove('is-visible');
  }
});

canvas.addEventListener('pointerup', (event) => {
  if (!dragged) {
    const hit = getIntersection(event);
    if (hit) selectStructure(structureIdFromHit(hit));
  }
  pointerDown = false;
  canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener('pointercancel', () => { pointerDown = false; });
canvas.addEventListener('pointerleave', () => ui.hover.classList.remove('is-visible'));
canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  camera.position.z = THREE.MathUtils.clamp(camera.position.z + event.deltaY * 0.008, 8.2, 17.5);
}, { passive: false });

function resize() {
  const width = viewport.clientWidth;
  const height = viewport.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(viewport);
resize();
renderScenarioLens();
setMode('exterior');
ui.rotate.classList.toggle('is-active', autoRotate);
ui.rotate.setAttribute('aria-pressed', String(autoRotate));

let lastTime = performance.now();
function animate(time) {
  const delta = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;
  if (autoRotate && !pointerDown) sceneRoot.rotation.y += delta * 0.13;
  if (currentMode === 'chemical' && chemicalVisuals.has(selectedId)) {
    const pulse = 0.4 + Math.sin(time * 0.0035) * 0.18;
    chemicalVisuals.get(selectedId).sourceMeshes.forEach((mesh) => { mesh.material.emissiveIntensity = pulse; });
  }
  if (currentMode === 'emotion') {
    const scenarioNodes = new Set(emotionScenarios[activeScenario].nodes);
    emotionVisuals.forEach((visuals, id) => {
      if (!scenarioNodes.has(id) && id !== selectedId) return;
      visuals.forEach(({ glow, glowScale }, visualIndex) => {
        const wave = reduceMotion ? 1 : 0.92 + Math.sin(time * 0.004 + visualIndex * 0.85) * 0.08;
        glow.scale.set(glowScale * wave, glowScale * wave, 1);
        glow.material.opacity = glow.userData.baseOpacity * (reduceMotion ? 1 : 0.82 + Math.sin(time * 0.004 + visualIndex * 0.85) * 0.18);
      });
    });
    positionScenarioNodeLabels();
  }
  dust.rotation.y -= delta * 0.008;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
