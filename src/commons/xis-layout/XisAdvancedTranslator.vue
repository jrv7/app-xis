<template>
  <div>
    <xis-select
      name="selected-language"
      v-model="selectedLanguage"
      :options="[ { id: 1, value: _XisT('PT_BR') }, { id: 2, value: _XisT('US_EN') } ]"
      :disabled="submiting"
    />
    <hr>
    <xis-form
      layout="vertical"
      :show-actions="false"
    >
      <xis-input :name="'extra-word'" v-model="extraWord" :label="'word.WORD'" :disabled="submiting" />
      <xis-input :name="'extra-translation'" v-model="extraTranslation" :label="'word.TRANSLATION'" :disabled="submiting" />
    </xis-form>
    <hr>
    <xis-form layout="vertical"
      v-for="(word, index) in getUntranslatedWords" :key="'unstranslated-word-form-' + ((listStart * perPage) + index)"
      :show-actions="false"
    >
      <xis-input :name="'word[' + index + ']'" v-model="word.word" :label="'word.WORD'" :readonly="true" :disabled="submiting" />
      <xis-input :name="'translation[' + index + ']'" v-model="word.translation" :label="'word.TRANSLATION'" :disabled="submiting" />
    </xis-form>
    <hr>
    <div
      :style="{'display': 'flex', 'width': '100%', 'justify-content': 'space-between'}"
    >
      <a-button
        type="primary"
        :disabled="(listStart <= 0)"
        @click="showLastPage"
      >
        <xis-translator :text="'WORD.PRIOR'" />
      </a-button>
      <a-button
        type="primary"
        :disabled="(listStart >= (parseInt(untranslatedWords.length / perPage) - 1))"
        @click="showNextPage"
      >
        <xis-translator :text="'WORD.NEXT'" />
      </a-button>
    </div>
  </div>
</template>

<script>
import XisForm from '@/commons/components/html-components/XisForm';
import XisInput from '@/commons/components/html-components/XisInput';
import XisSelect from '@/commons/components/html-components/XisSelect';

export default {
  name: 'XisAdvancedTranslator',
  components: { XisForm, XisInput, XisSelect },
  data () {
    return {
      selectedLanguage: 0,
      untranslatedWords: [],
      submiting: false,
      listStart: 0,
      perPage: 5,
      extraWord: null,
      extraTranslation: null
    }
  },
  computed: {
    getUntranslatedWords () {
      return this.untranslatedWords.filter((i, index) => {
        return ((index >= (this.listStart * this.perPage)) && (index <= ((this.listStart * this.perPage) + this.perPage)));
      });
    }
  },
  methods: {
    showLastPage () {
      console.log('Andando pra tras');
      if (this.listStart > 0) {
        this.listStart--;
      } else {
        console.log('nao pode andar mais');
      }
    },
    showNextPage () {
      console.log('Andando pra frente');
      if (this.listStart < parseInt(this.untranslatedWords.length / this.perPage)) {
        this.listStart++;
      } else {
        console.log('nao pode andar mais');
      }
    },
    submitTranslations () {
      this.submiting = true;

      let setWrods = this.untranslatedWords.filter(i => {
        return (!!i.translation);
      });

      if ((this.extraWord != null) && (this.extraTranslation != null)) {
        setWrods.push({ word: this.extraWord, translation: this.extraTranslation });
      }

      this.$axios.post('/system/dictionary/bulk-translate', {
        language: this.selectedLanguage,
        words: setWrods
      })
        .then( ({data}) => {
          this.submiting = false;
          this.refreshDictionary();
        })
        .catch( () => {
          console.log('Erro na traducao em massa');
          this.submiting = false;
        })
    }
  },
  created () {
    this.selectedLanguage = parseInt(this.$store.state.language);
  },
  mounted () {
    let uWords = this.$store.getters.getUntranslatedWords;
    
    if (uWords == null) {
      this.untranslatedWords = [];
    } else {
      this.untranslatedWords = JSON.parse(uWords).map(i => {
        return {
          word: i,
          translation: null
        }
      });
    }
  }
}
</script>

<style>

</style>