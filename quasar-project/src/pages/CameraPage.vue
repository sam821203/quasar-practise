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
        :disable='imageCaptured'
        @click="captureImage"
      />
      <!-- v-if="hasCameraSupport -->
      <q-file
        outlined
        v-model="imageUpload"
        label="Choose an image"
        accept="image/*"
        @update:model-value="captureImageFallBack"
      >
        <template #prepend>
          <q-icon name="eva-attach-outline" />
        </template>
      </q-file>
      <div class="row justify-center q-ma-md">
        <q-input
          class="col col-sm-6"
          v-model="post.caption"
          label="Caption *"
          dense
        />
      </div>
      <div class="row justify-center q-ma-md">
        <q-input
          class="col col-sm-6"
          v-model="post.location"
          label="Location"
          :loading="locationLoading"
          dense
        >
          <template #append>
            <q-btn round dense flat icon="eva-navigation-2-outline" v-if="!locationLoading && locationSupported" @click='getLocation'/>
          </template>
        </q-input>
      </div>
      <div class="row justify-center q-mt-lg">
        <q-btn unelevated rounded color="primary" label="Post Image" :disable='!post.photo || !post.caption' @click='addPost()'/>
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
import { ref, reactive, onMounted, onBeforeUnmount, computed } from "vue";
import { uid, useQuasar } from "quasar";
import { useRouter } from "vue-router";
import axios from 'axios';

const $q = useQuasar()
const videoDom = ref(null);
const canvasDom = ref(null);
const imageCaptured = ref(false);
const hasCameraSupport = ref(true);
const imageUpload = reactive([]);
const locationLoading = ref(false);
const router = useRouter();

const post = reactive({
  id: uid(),
  caption: "",
  location: "",
  photo: null,
  date: Date.now(),
});

const locationSupported = computed(() => {
  if ('geolocation' in navigator) return true;
  return false
})

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

const locationSuccess = (result) => {
  post.location = result.data.city
  if (result.data.country) {
    post.location += `, ${result.data.country}`
  }

  locationLoading.value = false;
}

const locationError = (error) => {
  $q.dialog({
    title: 'Error',
    message: error
  })

  locationLoading.value = false;
}

const getCityAndCountry = (position) => {
  const apiUrl = `https://geocode.xyz/${position.coords.latitude},${position.coords.longitude}?json=1`
  axios.get(apiUrl)
    .then(res => {
      locationSuccess(res)
    })
    .catch(err => {
      locationError(err.message)
    })
}

const getLocation = () => {
  locationLoading.value = true
  navigator.geolocation.getCurrentPosition(position => {
    getCityAndCountry(position)
  }, err => {
    locationError(err.message)
  }, { timeout: 5000 })
}

const addPost = () => {
  $q.loading.show({
    delay: 400 // ms
  })

  const formData = new FormData()

  formData.append('id', post.id)
  formData.append('caption', post.caption)
  formData.append('location', post.location)
  formData.append('date', post.date)

  // 新增 photo 欄位，第三個欄位是圖片名稱
  formData.append('file', post.photo, post.id + '.png')

  axios.post(`${process.env.API}/createPosts`, formData)
    .then(res => {
      console.log(res)
      router.push('/')
      $q.notify({
        message: 'Post created',
        color: 'green-13',
        actions: [
          { label: 'Dismiss', color: 'white' }
        ]
      })
      $q.loading.hide()
    })
    .catch(err => {
      console.log(err)
      $q.dialog({
        title: 'Error',
        message: 'Sorry, could not create post!'
      })
      $q.loading.hide()
    })
}

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
