<template>
  <div class="main__step main__step--4">
    <div class="main__step___message">
      <span class="main__step__count">4</span>
      <div class="main__step__text">Поделитесь в соц сетях и создайте мир над головами</div>
    </div>
    <div class="main__step__share">
      <div class="main__step__share--item">
        <ShareNetwork
            network="vk"
            :url="LINK"
            :title="SOCIAL_TITLE"
            :description="SOCIAL_DESCRIPTION"
            @click="gtagHandler('share_vk')"
        >
          <img :src="vkShare" alt="vk icon">
        </ShareNetwork>
      </div>
      <div class="main__step__share--item">
        <ShareNetwork
            network="facebook"
            :url="LINK"
            :title="SOCIAL_TITLE"
            :description="SOCIAL_DESCRIPTION"
            @click="gtagHandler('share_fb')"
        >
          <img :src="fbShare" alt="facebook icon">
        </ShareNetwork>
      </div>
      <div class="main__step__share--item">
        <ShareNetwork
            network="odnoklassniki"
            :url="LINK"
            :title="SOCIAL_TITLE"
            :description="SOCIAL_DESCRIPTION"
            @click="gtagHandler('share_od')"
        >
          <img :src="odShare" alt="odnoklassniki icon">
        </ShareNetwork>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue';

import vkShare from '../../assets/img/share/vk_share.svg';
import fbShare from '../../assets/img/share/fb_share.svg';
import odShare from '../../assets/img/share/od_share.svg';

export default defineComponent({
  name: 'Social',
  setup() {

    const LINK = window.location.href;
    const SOCIAL_DESCRIPTION = 'Ваше молчание убивает людей 🇺🇦 и 🇷🇺. Любая огласка сейчас поможет прекратить это всё. Сделайте свой вклад в мир во всем мире!';
    const SOCIAL_TITLE = 'Молчание убивает';

    function gtagHandler(...arg) {
      window.gtag(arg)
    }

    return {
      LINK,
      vkShare,
      fbShare,
      odShare,
      gtagHandler,
      SOCIAL_TITLE,
      SOCIAL_DESCRIPTION
    }
  }
});
</script>

<style lang="scss" src="./social.scss"/>
