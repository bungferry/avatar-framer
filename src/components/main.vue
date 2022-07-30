<script setup>
import {ref, onMounted, reactive, defineExpose, watch, computed} from 'vue';
import Dropzone from 'dropzone';
import {fabric} from 'fabric';
import Social from './social/social.vue';
import footerComp from './footerComp/footerComp.vue';

Dropzone.autoDiscover = false;

// Change the canvas frames
// one per frame
// add your frames here
const images = Array(13).fill(null).map((_, index) => 'frame-' + (index + 1));

function getImageUrl(name) {
  if (import.meta.url) {
    return new URL(`/${name}.png`, import.meta.url).href
  }

  return `./${name}.png`;
}

const currentMask = ref(images[0]);
const canvasRef = ref();
const defaultAva = ref();
const isImageExist = ref(false);
const inputs = reactive({
  angle: 0,
  scale: 50
});

// image to be added to the canvas
var image = new fabric.Image();

function updateControls() {
  inputs.scale = image.scaleX;
  inputs.angle = image.angle;
}

function run() {
  // define the canvas
  canvasRef.value = new fabric.Canvas('canvas-id', {
    width: 500,
    height: 500
  });

  fabric.Image.fromURL(getImageUrl('default-ava'), function(myImg) {
    const img = myImg.set({ left: 0, top: 0 ,width: 500,height: 500});
    defaultAva.value = img;
    canvasRef.value.add(img);
  });

  // declare the dropzone
  var imgUpload = new Dropzone("#upload", {
    url: "UploadImages",
    uploadMultiple: false,
    autoProcessQueue: false,
    createImageThumbnails: false,
    maxFiles: 1,
    acceptedFiles: "image/*",
    addRemoveLinks: false,
    clickable: '#upload'
  });

  fabric.Object.prototype.transparentCorners = false;

  canvasRef.value.on({
    // 'object:moving': updateControls,
    'object:scaling': updateControls,
    'object:resizing': updateControls,
    'object:rotating': updateControls
  });

  canvasRef.value.setOverlayImage(getImageUrl('frames/' + images[0]), function () {
    canvasRef.value.overlayImage.scaleToWidth(canvasRef.value.getWidth())
    canvasRef.value.renderAll()
  }, {
    originX: 'left',
    originY: 'top',
    crossOrigin: 'anonymous'
  });

  var reader = new FileReader();
  reader.onload = function (event) {

    var imgObj = new Image();
    imgObj.src = event.target.result;

    fabric.util.loadImage(imgObj.src, function () {
      image = new fabric.Image(imgObj);
      image.set({
        lockMovementX: false,
        lockMovementY: false,
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: false,
        selectable: true,
        centeredRotation: true,
        centeredScaling: true,
        cornerColor: "#0d2240",
        cornerSize: 30,
        lockSkewingX: true,
        lockSkewingY: true,
        originX: "center",
        originY: "center",
        hasControls: false
      });

      image.scaleToHeight(canvasRef.value.getHeight());
      image.scaleToWidth(canvasRef.value.getWidth());
      canvasRef.value.centerObject(image);
      canvasRef.value.add(image);
      canvasRef.value.renderAll();
      canvasRef.value.setActiveObject(image);
    });
  };

  // when the image is uplaoded
  // call the reader to add it to the canvas
  // enable the download button and controls
  // remove the upload text
  imgUpload.on("addedfile", function (file) {
    imgUpload.removeAllFiles();
    canvasRef.value.remove(defaultAva.value);
    isImageExist.value = true;
    canvasRef.value.remove(image);
    reader.readAsDataURL(file);
    window.gtag('addedFile');
  });
}

function updateAngle() {
  image.set('angle', parseInt(value, 10)).setCoords();
  canvasRef.value.requestRenderAll();
}

function updateScale() {
  image.scale(parseFloat(inputs.scale) / 20).setCoords();
  canvasRef.value.requestRenderAll();
}

// handle download
// create a link and simulate a click to download the file
function downloadFile() {
  const link = canvasRef.value.toDataURL({format: 'jpeg', quality: 1, multiplier: 4});
  const linkNode = document.createElement('a');
  linkNode.href = link;
  linkNode.download = 'profile-pic.jpeg';
  document.body.appendChild(linkNode);
  linkNode.click();
  document.body.removeChild(linkNode);
  // window.gtag('downloadFile');

  gtag('event', 'click_download', {'event_category': 'button', 'event_label': 'Скачать'});
  
}

function resizeCanvas() {
  // fabric.js wraps the canvas in a ".canvas-container" div
  // manually set the container div's height to it's width
  // this will not affect the canvas size for download

  const outerCanvasContainer = document.getElementsByClassName("canvas-container")[0];
  outerCanvasContainer.style.width = "auto";
  outerCanvasContainer.style.height = `${outerCanvasContainer.clientWidth}px`;
}

function getActiveClass(item) {
  return item === currentMask.value ? 'active' : null;
}

function changeFrame(item) {
  const image = getImageUrl(`frames/`+ item);
  currentMask.value = item;
  canvasRef.value.setOverlayImage(image, function () {
    canvasRef.value.overlayImage.scaleToWidth(canvasRef.value.getWidth())
    canvasRef.value.renderAll()
  }, {
    originX: 'left',
    originY: 'top',
    crossOrigin: 'anonymous'
  });
}

const isTouchExist = ref('ontouchstart' in window || navigator.msMaxTouchPoints);

let timeoutId;
const preventCanvasClass = ref();

function trackPageScrolling() {
  clearTimeout(timeoutId);
  if (isTouchExist) {
    preventCanvasClass.value = 'prevent-canvas-move';
  }
  timeoutId = setTimeout(() => {
    preventCanvasClass.value = null;
  }, 500);
}

const preventDefaultCanvasClass = ref(null)
watch(isImageExist, isExist => {
    if (isExist) {
        preventDefaultCanvasClass.value = null
    } else {
        preventDefaultCanvasClass.value = 'prevent-default-canvas-move';
    }
}, { immediate: true });

onMounted(run);

// resize the canvas once it's loaded
onMounted(resizeCanvas);

window.addEventListener('resize', resizeCanvas);
window.addEventListener('scroll', trackPageScrolling);

defineExpose({
  images,
  inputs,
  isImageExist,
  preventCanvasClass,
  preventDefaultCanvasClass,
  updateAngle,
  updateScale,
  getImageUrl,
  changeFrame,
  downloadFile
});

</script>

<template>
  <div class="wrapper">
    <div class="main__header">
      <p class="main__hash">#МОЛЧАНИЕ<span>УБИВАЕТ</span></p>
      <h1 class="main__title">Давайте остановим войну</h1>
      <p class="main__slogan">
        <strong>Ваше молчание убивает людей 🇺🇦 и 🇷🇺.</strong> Любая огласка сейчас поможет прекратить это всё.
        Сделайте свой вклад в мир во всем мире!
      </p>
    </div>
    <div class="main__steps">
      <div class="main__step main__step--1">
        <div class="main__step___message">
          <span class="main__step__count">1</span>
          <div class="main__step__text">Загрузите ваш аватар</div>
        </div>
        <div class="main__step__input">
          <button
              id="upload"
              class="main__step__btn"
          >
            Загрузить
          </button>
        </div>
      </div>
      <div class="main__step">
        <div class="main__step___message">
          <span class="main__step__count">2</span>
          <div class="main__step__text">Выберите рамку для аватара</div>
        </div>
        <div class="main__step__builder">
          <div
            :class="[preventCanvasClass, preventDefaultCanvasClass]"
            class="main__step__builder__ava"
          >
            <canvas
                id="canvas-id"
                class="main__step__builder__ava-canvas"
            />

            <div class="main__step__builder__ava-controls">
              <div class="pt-6--rotation">
                <label for="angle-control">Rotation:</label>
                <input
                    v-model="inputs.angle"
                    type="range"
                    id="angle-control"
                    min="0"
                    max="360"
                    class="w-full"
                    :disabled="!isImageExist"
                    @input="updateAngle"
                >
              </div>
              <div>
                <label for="scale-control">Scale:</label>
                <input
                    v-model="inputs.scale"
                    type="range"
                    id="scale-control"
                    min="1"
                    max="100"
                    :disabled="!isImageExist"
                    @input="updateScale"
                >
              </div>
            </div>
          </div>
          <div class="main__mask_buttons">
            <button
                v-for="item in images"
                :style="{ 'background-image': `url(${getImageUrl('default-ava')})` }"
                :class="getActiveClass(item)"
                @click="changeFrame(item)"
            >
              <img :src="getImageUrl(`previews/`+ item)">
            </button>
          </div>
        </div>

      </div>

      <div class="main__step main__step--1">
        <div class="main__step___message">
          <span class="main__step__count">3</span>
          <div class="main__step__text">Скачайте картинку и установите на аватарку</div>
        </div>
        <div class="main__step__input">
          <button @click="downloadFile">
            Скачать
          </button>
          </div>
      </div>
    </div>
    <social />
    <footerComp />
  </div>
</template>

<style />
