<template>
  <q-page class="layout--secondary q-pa-md">
    <div class="camera-frame q-pa-md">
      <video
        ref="videoDom"
        class="full-width"
        autoplay
        v-show="!imageCaptured"
      />
      <canvas
        ref="canvasDom"
        class="full-width"
        height="240"
        v-show="imageCaptured"
      />
    </div>
    <div class="text-center q-pa-md">
      <q-btn
        round
        color="grey-10"
        size="lg"
        icon="eva-camera"
        @click="captureImage"
        v-if="hasCameraSupport"
      />
      <q-file
        outlined
        v-model="imageUpload"
        label="Choose an image"
        accept="image/*"
        @update:model-value="captureImageFallBack"
        v-else
      >
        <template #prepend>
          <q-icon name="eva-attach-outline" />
        </template>
      </q-file>
      <div class="row justify-center q-ma-md">
        <q-input
          class="col col-sm-6"
          v-model="post.caption"
          label="Caption"
          dense
        />
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          class="col col-sm-6"
          v-model="post.location"
          label="Location"
          dense
        >
          <template #append>
            <q-btn round dense flat icon="eva-navigation-2-outline" />
          </template>
        </q-input>
      </div>
      <div class="row justify-center q-mt-lg">
        <q-btn unelevated rounded color="primary" label="Post Image" />
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "CameraPage",
};
</script>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { uid } from "quasar";

const videoDom = ref(null);
const canvasDom = ref(null);
const imageCaptured = ref(false);
const hasCameraSupport = ref(true);
const imageUpload = reactive([]);

const post = reactive({
  id: uid(),
  caption: "",
  location: "",
  photo: null,
  date: Date.now(),
});

const initCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
    })
    .then((stream) => {
      videoDom.value.srcObject = stream;
    })
    .catch((error) => {
      hasCameraSupport.value = false;
      console.log(error);
    });
};

const dataURItoBlob = (dataURI) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString });
  return blob;
};

const disableCamera = () => {
  videoDom.value.srcObject.getVideoTracks().forEach((track) => {
    track.stop();
  });
};

const captureImage = () => {
  const video = videoDom.value;
  const canvas = canvasDom.value;

  canvas.width = video.getBoundingClientRect().width;
  canvas.height = video.getBoundingClientRect().height;

  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  imageCaptured.value = true;
  post.photo = dataURItoBlob(canvas.toDataURL());

  disableCamera();
};

const captureImageFallBack = (file) => {
  post.photo = file;
  const canvas = canvasDom.value;
  const context = canvas.getContext("2d");
  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      imageCaptured.value = true;
    };

    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
};

onMounted(() => {
  initCamera();
});

onBeforeUnmount(() => {
  if (hasCameraSupport.value) disableCamera();
});
</script>

<style lang="scss" scoped>
.camera-frame {
  border: 1px solid $grey-6;
  border-radius: 10px;
}
</style>
