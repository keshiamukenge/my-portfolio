<template>
  <MainContainer v-if="loading" ref="container">
    <ContainerLoader>
      <Content>
        <Numbers ref="list">
          <Number v-for="number in numbers" :key="number.id">{{
            number
          }}</Number>
        </Numbers>
        <Percent ref="percent">%</Percent>
      </Content>
    </ContainerLoader>
  </MainContainer>
</template>

<script>
import { gsap, Power2 } from 'gsap'

import {
  MainContainer,
  ContainerLoader,
  Content,
  Numbers,
  Number,
  Percent,
} from './styledComponents'

export default {
  name: 'Loader',
  components: {
    MainContainer,
    ContainerLoader,
    Content,
    Numbers,
    Number,
    Percent,
  },
  data() {
    return {
      loading: false,
      numbers: [],
    }
  },
  methods: {
    addNumbers() {
      for (let i = 0; i < 101; i++) {
        this.numbers = [...this.numbers, i]
      }
    },
    start() {
      this.loading = true
      this.updateProgress()
    },
    async updateProgress() {
      await this.addNumbers()

      gsap.to(this.$refs.list?.$el, {
        y: -7197,
        duration: 5,
        ease: Power2.easeInOut,
        onComplete: this.hideText,
      })
    },
    hideText() {
      gsap.to(this.$refs.list?.$el, {
        y: -100 + '%',
        duration: 1,
      })
      gsap.to(this.$refs.percent?.$el, {
        y: -100 + '%',
        delay: 0.05,
        duration: 1,
        onComplete: this.finish,
      })
    },
    finish() {
      gsap.to(this.$refs.container?.$el, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
          this.loading = false
        },
      })
    },
  },
}
</script>
