<template>
  <div
    class="xis-translator"
    :key="'xis-translator-' + _XIS_Language"
  >
    <span
      v-if="!hasTranslation"
      @dblclick="onTranslate"
    > {{translated}}</span>
    <span v-else> {{translated}}</span>

    <div
      class="translator-box"
      v-show="showTranslator"
    >
      <form action="">
        <a-form-item label="Word">
          <a-input
            :value="text"
            :disabled="true"
            class="word-input"
          />
        </a-form-item>
        <hr>
        <a-form-item label="Language">
          <a-select
            placeholder="Choose a language"
            :default-value="1"
            v-model="selectedLanguage"
            :disabled="isLoading"
            @change="changeLanguage"
          >
            <a-select-option
              v-for="lang in languages" :key="'language-option-' + lang.id"
              :value="lang.id"
            >
              {{lang.value}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <hr>
        <a-form-item label="Translation">
          <a-input
            :placeholder="'Translation'"
            v-model="translatedText"
            :disabled="isLoading"
          />
        </a-form-item>
        <hr>
        <div :style="{'display': 'flex', 'width': '100%'}">
          <a-button
            type="secondary"
            html-type="button"
            :disabled="isLoading"
            @click="cancelTranslation"
          >
            Cancel
          </a-button>
          <a-button
            type="primary"
            html-type="button"
            :style="{'margin-left': 'auto'}"
            :disabled="!translatedText"
            @click="saveTranslation"
            :loading="isLoading"
          >
            Send
          </a-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'XisTranslator',
  props: {
    text: {
      type: String,
      default: 'translate'
    }
  },
  data () {
    return {
      dictionary: null,
      showTranslator: false,
      languages: [],
      languageTableId: 7,
      languageTableField: 148,
      selectedLanguage: 1,
      translatedText: null,
      isLoading: false
    }
  },
  computed: {
    ...mapState(['xisStateLanguage', 'xisStateDictionary']),
    _XIS_Language () { return this.xisStateLanguage; },
    _XIS_Dictionary () { return this.xisStateDictionary; },
    hasTranslation () {
      return (this._XIS_Dictionary.findIndex(
        item => String(item.word) == String(this.text)
      ) >= 0);
    },
    translated () {
      let translated = this._XIS_Dictionary.findIndex(
        item => String(item.word) == String(this.text)
      );

      if (translated >= 0) {
        return this._XIS_Dictionary[translated].translation;
      } else {
        this.$store.commit('storeUntranslatedWord', this.text);
      }

      return this.text;
    },
  },
  methods: {
    saveTranslation () {
      this.isLoading = true;

      this.$axios.post(`system/dictionary/translate`, {
        word: this.text,
        language: this.selectedLanguage,
        translation: this.translatedText
      })
        .then((data) => {
          this.$store.commit('resetDictionary')

          this.$axios.get('system/dictionary')
            .then( ({data}) => {
              this.$store.commit('setDictionary', data);

              setTimeout(() => {
                location.reload();
                this.showTranslator = false;
                this.isLoading = false;
              }, 400);
            });
        });
    },
    cancelTranslation () {
      this.showTranslator = false;
    },
    onTranslate () {
      if (!this.languages.length) {
        this.$axios.get(`data/get-as-option/${this.languageTableId}/${this.languageTableField}`)
          .then(({data}) => {
            this.languages = data;
          });
      }
      this.showTranslator = true;
    },
    changeLanguage (value) {
      console.log('Language: ' + value);
    }
  },
  mounted () {
    this.selectedLanguage = this._XIS_Language;
  }
}
</script>

<style lang="scss">
.xis-translator {
  position: relative;
  white-space: pre;

  &>.translator-box {
    position: fixed;
    bottom: 40px;
    right: 24px;
    padding: 12px;
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 0 3px #0008;
    border-radius: 4px;
    z-index: 999;
  }
}

.word-input {
  background-color: #fff !important;
  color: #000 !important;
}
</style>