<template>
  <q-page class="layout--main q-pa-md">
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <q-card
          v-for="post in posts"
          :key="post.id"
          class="card-post q-mb-md"
          flat
          bordered
        >
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ post.authorName }}</q-item-label>
              <q-item-label caption>{{ post.location }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />
          <q-img :src="post.imageUrl" />
          <q-card-section>
            <div>{{ post.caption }}</div>
            <div class="text-caption text-grey">
              {{ formatDate(post.postDate) }}
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-4 large-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="xl">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Sam Huang</q-item-label>
            <q-item-label caption>Japan</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "HomePage",
};
</script>

<script setup>
import { reactive } from "vue";
import { date } from "quasar";

const posts = reactive([
  {
    id: 1,
    authorName: "Sam Huang",
    caption: "Golden Gate Bridge",
    postDate: Date.now(),
    location: "Japan",
    imageUrl:
      "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/b438083b-e32f-4f2e-aa2b-f866a4dc85de/width=450/1693431253-411096482-2.jpeg",
  },
  {
    id: 2,
    authorName: "John Doe",
    caption: "Golden Gate Bridge",
    postDate: Date.now(),
    location: "San Francisco, United States",
    imageUrl:
      "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/630e0a47-cb0f-4f1c-a087-eb1729c05a1b/width=450/00008-72948545.jpeg",
  },
  {
    id: 3,
    authorName: "Tine Linn",
    caption: "Golden Gate Bridge",
    postDate: Date.now(),
    location: "Taiwan",
    imageUrl:
      "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/2c9f50ea-68d3-436d-bab7-14b405a6539d/width=450/00145-4019698449.jpeg",
  },
]);

const formatDate = (value) => date.formatDate(value, "MMMM D h:mmA");
</script>

<style lang="scss" scoped>
.card-post {
  .q-img {
    max-height: 600px;
    min-height: 200px;
  }
}
</style>
