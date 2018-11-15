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
      :teamdata="teamdata"
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
      :id="id">
      <template slot="clear" slot-scope="props">
        <div class="multiselect__clear" v-if="selectedOptions.length" @mousedown.prevent.stop="clearAll(props.search)"></div>
      </template>

      <template slot="option" slot-scope="props">
        <div class="multiselect__option-label" v-html="$options.filters.highlight(props.option.label, props.search)">{{ props.option.label }}</div>
        <div class="multiselect__option-sublabel">{{ props.option.subLabel }}</div>
      </template>

      <template slot="caret" slot-scope="methods">
        <div v-if="showCaret">
          <div @mousedown.prevent.stop="methods.toggle()" class="multiselect__select"></div>
        </div>
      </template>
    </multiselect>
    <input type="hidden" class="js-ClearInputs--removable-field" :name="name" v-for="(option, index) in selectedOptions" :key="index" :value="option.value">
  </div>
</template>

<script>
  const axios = require('axios')
  const Multiselect = require('vue-multiselect').default
  const getFormData = require('get-form-data').default
  const pickBy = require('lodash/pickBy')
  const debounce = require('lodash/debounce')
  const uuid = require('uuid')

  const XHR = require('../../lib/xhr')

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
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      placeholder: {
        type: String,
        required: true
      },
      teamdata: {
        type: String,
        required: true
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
        options: JSON.parse(this.teamdata),
        isLoading: false,
        id: uuid(),
        something: '1'
      }
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
console.log(query)
        XHR.request(form.action, query)
          .then(() => {
            this.isSubmitting = false
          })
      }
    },
    computed: {
      showCaret: function() {
        return this.options.length > 0
      },
      showData: function () {
        return JSON.parse(this.teamdata)
      }
    }
  }
</script>
