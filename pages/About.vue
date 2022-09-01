<template>
  <div>
    <Header :before-go-home="hideText" />
    <AboutContainer>
      <AboutContainerContent>
        <AboutTitle>
          <Title
            text="About"
            title-class="about-title"
            :reveal="reveal.title"
            split-characters="letters"
            :font="titleFont"
            :font-color="whiteColor"
            font-size="4rem"
            :duration="0.5"
            :animation="1"
          />
        </AboutTitle>
        <AboutContent>
          <ContainerAboutSection>
            <AboutSubtitle>
              <Title
                text="role"
                title-class="role-title"
                :reveal="reveal.firstSubtitle"
                split-characters="words"
                :font="bodyFont"
                :font-color="whiteColor"
                font-size="0.8rem"
                :duration="0.5"
                :animation="1"
              />
            </AboutSubtitle>
            <AboutSpan>
              <Paragraph
                text="Creative Developer"
                title-class="role-text"
                :reveal="reveal.firstSubtitleContent"
                :font-color="whiteColor"
                font-size="1rem"
                :font="bodyFont"
                :duration="0.5"
                :animation="1"
              />
            </AboutSpan>
          </ContainerAboutSection>
          <ContainerAboutSection>
            <AboutSubtitle>
              <Title
                text="Contact"
                title-class="contact-title"
                :reveal="reveal.secondSubtitle"
                split-characters="words"
                :font="bodyFont"
                :font-color="whiteColor"
                font-size="0.8rem"
                :duration="0.5"
                :animation="1"
                :timeline-delay-on-reveal="1"
              />
            </AboutSubtitle>
            <AboutSpan>
              <a>
                <Title
                  text="mukenge.keshia@gmail.com"
                  title-class="contact-text"
                  :reveal="reveal.secondSubtitleContent"
                  :font-color="whiteColor"
                  font-size="1rem"
                  split-characters="words"
                  :font="bodyFont"
                  :duration="0.5"
                  :animation="1"
                />
              </a>
            </AboutSpan>
          </ContainerAboutSection>
          <ContainerAboutText>
            <Paragraph
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim diam posuere nisi lectus nulla faucibus. Turpis consectetur porttitor mauris sed phasellus eu fermentum elementum viverra. In risus vestibulum faucibus morbi ac, cursus felis. Tortor, magna adipiscing vel, et aliquam."
              paragraph-class="firstAboutText"
              :reveal="reveal.firstText"
              :font="bodyFont"
              :duration="1"
              delay="<5%"
            />
          </ContainerAboutText>
          <ContainerAboutText>
            <Paragraph
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim diam posuere nisi lectus nulla faucibus. Turpis consectetur porttitor mauris sed phasellus eu fermentum elementum viverra. In risus vestibulum faucibus morbi ac, cursus felis. Tortor, magna adipiscing vel, et aliquam."
              paragraph-class="secondAboutText"
              :reveal="reveal.secondText"
              :font="bodyFont"
              :duration="1"
              delay="<5%"
            />
          </ContainerAboutText>
        </AboutContent>
      </AboutContainerContent>
    </AboutContainer>
    <Footer />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import Title from '../shared/vue-lib/src/stories/components/Title/Title.vue'
import Paragraph from '../shared/vue-lib/src/stories/components/Paragraph/Paragraph.vue'

import { Header, Footer } from '../components/Essentials'
import { fonts, colors } from '../theme'
import {
  AboutContainer,
  AboutContainerContent,
  AboutContent,
  AboutTitle,
  ContainerAboutSection,
  ContainerAboutText,
  AboutSpan,
  AboutSubtitle,
} from './styledComponents'

export default {
  name: 'About',
  components: {
    AboutContainer,
    AboutContainerContent,
    Header,
    Footer,
    AboutContent,
    AboutTitle,
    ContainerAboutSection,
    ContainerAboutText,
    AboutSpan,
    AboutSubtitle,
    Title,
    Paragraph,
  },
  transition: {
    leave(el, done) {
      // gsap.to(el, {
      //   duration: 0.5,
      //   delay: 0.8,
      //   opacity: 0,
      //   ease: Power2.easeInOut,
      // })
      setTimeout(() => {
        done()
      }, 1000)
    },
  },
  data() {
    return {
      titleFont: fonts.titleFont,
      bodyFont: fonts.bodyFont,
      whiteColor: colors.white,
      reveal: {
        title: false,
        firstSubtitle: false,
        firstSubtitleContent: false,
        secondSubtitle: false,
        secondSubtitleContent: false,
        firstText: false,
        secondText: false,
      },
    }
  },
  mounted() {
    this.SET_BODY_OVERFLOW()
    this.revealText()
  },
  methods: {
    ...mapMutations(['SET_BODY_OVERFLOW']),
    revealText() {
      setTimeout(() => {
        this.reveal.title = true
      }, 1000)
      setTimeout(() => {
        this.reveal.firstSubtitle = true
      }, 1300)
      setTimeout(() => {
        this.reveal.firstSubtitleContent = true
      }, 1400)
      setTimeout(() => {
        this.reveal.secondSubtitle = true
      }, 500)
      setTimeout(() => {
        this.reveal.secondSubtitleContent = true
      }, 1500)
      setTimeout(() => {
        this.reveal.firstText = true
      }, 1500)
      setTimeout(() => {
        this.reveal.secondText = true
      }, 1700)
    },
    hideText() {
      this.reveal = {
        title: false,
        firstSubtitle: false,
        firstSubtitleContent: false,
        secondSubtitle: false,
        secondSubtitleContent: false,
        firstText: false,
        secondText: false,
      }
      // setTimeout(() => {
      //   this.reveal.firstSubtitle = false
      // }, 1300)
      // setTimeout(() => {
      //   this.reveal.firstSubtitleContent = false
      // }, 1400)
      // setTimeout(() => {
      //   this.reveal.secondSubtitle = false
      // }, 500)
      // setTimeout(() => {
      //   this.reveal.secondSubtitleContent = false
      // }, 1500)
      // setTimeout(() => {
      //   this.reveal.firstText = false
      // }, 1500)
      // setTimeout(() => {
      //   this.reveal.secondText = false
      // }, 1700)
    },
  },
}
</script>
