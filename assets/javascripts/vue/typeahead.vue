<template>
  <div class="c-form-group c-form-group--light c-form-group--smaller c-form-group--filter">
    <label class="c-form-group__label" :for="id">
      <span class="c-form-group__label-text">{{ label }}</span>
    </label>
    <multiselect
      label="label"
      open-direction="bottom"
      track-by="value"
      v-model="selectedOptions"
      :placeholder="placeholder"
      :model="model"
      :clear-on-select="true"
      :close-on-select="false"
      :hide-selected="true"
      :internal-search="false"
      :loading="isLoading"
      :multiple="allowMultiple"
      :options="options"
      :options-limit="500"
      :show-no-results="false"
      :showLabels="false"
      :searchable="true"
      :id="id"
      @search-change="searchType">
      <template slot="clear" slot-scope="props">
        <div class="multiselect__clear" v-if="selectedOptions.length"
             @mousedown.prevent.stop="clearAll(props.search)"></div>
      </template>

      <template slot="option" slot-scope="props">
        <div class="multiselect__option-label" v-html="$options.filters.highlight(props.option.label, props.search)">{{
          props.option.label }}
        </div>
        <div class="multiselect__option-sublabel">{{ props.option.subLabel }}</div>
      </template>

      <template slot="caret" slot-scope="methods">
        <div v-if="showCaret">
          <div @mousedown.prevent.stop="methods.toggle()" class="multiselect__select"></div>
        </div>
      </template>
    </multiselect>
    <input type="hidden" class="js-ClearInputs--removable-field" :name="name" v-for="(option, index) in selectedOptions"
           :key="index" :value="option.value">
  </div>
</template>

<script>

  const axios = require('axios')
  const Multiselect = require('vue-multiselect').default
  const getFormData = require('get-form-data').default
  const _ = require('lodash')
  const pickBy = require('lodash/pickBy')
  const uuid = require('uuid')
  const XHR = require('../lib/xhr')
  const { matchWords, memoize } = require('../lib/helpers')

  export default {
    components: {
      'multiselect': Multiselect,
    },
    props: {
      label: {
        type: String,
        required: true,
      },
      entity: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
        required: true
      },
      model: {
        type: String,
        required: false
      },
      value: {
        type: String,
        required: false,
      },
      formSelector: {
        type: String,
        required: false,
      },
      autoSubmit: {
        type: Boolean,
        default: true,
      },
      allowMultiple: {
        type: Boolean,
        default: true,
      }
    },
    data () {
      return {
        selectedOptions: this.value ? JSON.parse(this.value) : [],
        options: [],
        optionsData: this.model && JSON.parse(this.model),
        isLoading: false,
        id: uuid(),

      }
    },
    methods: {
      searchType: function (query) {
        !!this.model ? this.find(query) : this.asyncFind(query)
      },
      find: _.debounce(function (query) {
        this.options = this.optionsData.filter((obj) => {
          return matchWords(obj.label, query)
        })
    }, 500
  ),
  asyncFind: _.debounce(function (query) {
    if (query.length < 3) {
      this.options = []
      return
    }
    this.isLoading = true
    axios.get(`/api/options/${this.entity}?term=${query}`)
      .then((response) => {
        this.options = response.data
        this.isLoading = false
      })
      .catch(function (error) {
        console.error(error)
      })
  }, 500),
  },
  watch: {
    selectedOptions: function (newOptions) {
      if (!this.autoSubmit || this.isSubmitting) { return }
      this.isSubmitting = true

      const form = this.formSelector ? document.querySelector(this.formSelector) : this.$el.closest('form')
      if (!form) { return }

      const query = pickBy(getFormData(form))
      delete query[this.id]
      query[this.name] = newOptions.map(option => option.value)

      XHR.request(form.action, query)
        .then(() => {
          this.isSubmitting = false
        })
    }
  }
  ,
  computed: {
    showCaret: function () {
      return this.options.length > 0
    }
  }
  }
</script>
