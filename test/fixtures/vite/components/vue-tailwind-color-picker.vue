<template>
  <div class="border min-w-min w-min rounded-lg bg-white">
    <div class="p-4 w-60">
      <div class="w-52 h-40" :style="{ backgroundColor: canvasColor }">
        <div class="w-full h-full" style="background-image:linear-gradient(90deg,#fff,rgba(204,154,129,0));">
          <div ref="canvas" class="w-full h-full relative cursor-pointer" style="background-image:linear-gradient(0deg,#000,rgba(204,154,129,0));" @mousedown="mousedownCanvas">
            <div ref="canvasCursor" class="h-4 w-4 border border-gray-200 rounded-full bg-white absolute -left-2 -top-2 pointer-events-none" style="box-shadow:2px 2px 2px 0 rgb(0 0 0 / 20%)"></div>
          </div>
        </div>
      </div>
      <div class="w-52 flex my-2">
        <div class="w-8 h-8 rounded-lg" style="background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAJElEQVQYV2NctWrVfwYkEBYWxojMZ6SDAmT7QGx0K1EcRBsFAADeG/3M/HteAAAAAElFTkSuQmCC') repeat">
          <div :style="{ backgroundColor: color }" class="w-full h-full rounded-lg" />
        </div>
        <div>
          <div ref="line" class="w-40 h-3 ml-4 relative cursor-pointer rounded" style="background-image:linear-gradient(90deg,red 0,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red)" @mousedown="mousedownLine">
            <div ref="lineCursor" class="h-4 w-4 border border-gray-200 rounded-full bg-white absolute -left-2 pointer-events-none" style="top:-2px;box-shadow:2px 2px 2px 0 rgb(0 0 0 / 20%)"></div>
          </div>
          <div ref="opacityLine" class="w-40 h-3 ml-4 mt-2 relative cursor-pointer rounded" style="background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAJElEQVQYV2NctWrVfwYkEBYWxojMZ6SDAmT7QGx0K1EcRBsFAADeG/3M/HteAAAAAElFTkSuQmCC') repeat" @mousedown="mousedownOpacity">
            <div class="w-full h-full relative" :style="{ background: opacityLineBackground }">
              <div ref="opacityCursor" class="h-4 w-4 border border-gray-200 rounded-full bg-white absolute -left-2 pointer-events-none" style="top:-2px;box-shadow:2px 2px 2px 0 rgb(0 0 0 / 20%)"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <div v-show="inputType === 'rgba'" class="flex">
          <div>
            <p class="text-center text-gray-500 text-sm">R</p>
            <input v-model="colorLazy.r" @input="inputUpdated" @blur="blurInputR" class="shadow appearance-none border rounded text-center w-10 h-8 text-grey-darker" />
          </div>
          <div class="mx-1">
            <p class="text-center text-gray-500 text-sm">G</p>
            <input v-model="colorLazy.g" @input="inputUpdated" @blur="blurInputG" class="shadow appearance-none border rounded text-center w-10 h-8 text-grey-darker" />
          </div>
          <div class="mr-1">
            <p class="text-center text-gray-500 text-sm">B</p>
            <input v-model="colorLazy.b" @input="inputUpdated" @blur="blurInputB" class="shadow appearance-none border rounded text-center w-10 h-8 text-grey-darker" />
          </div>
          <div>
            <p class="text-center text-gray-500 text-sm">A</p>
            <input v-model="colorLazy.a" @input="inputUpdated" @blur="blurInputA" class="shadow appearance-none border rounded text-center w-10 h-8 text-grey-darker" />
          </div>
        </div>
        <div v-show="inputType === 'hexa'" class="mr-3">
          <p class="text-gray-500 text-center text-sm">HEXA</p>
          <input v-model="colorLazy.hexa" @input="hexaInputUpdated" @blur="blurInputHexa" class="shadow appearance-none border rounded text-center w-40 h-8 text-grey-darker" />
        </div>
        <div class="px-2 text-gray-500 cursor-pointer" @mousedown.prevent @click.stop.prevent="toggleInputs">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" />
          </svg>
        </div>
      </div>
      <div v-if="!hideSwatches" class="flex mt-2 flex-wrap px-1">
        <template v-for="swatch in swatchesLazy">
          <div :key="swatch" class="w-8 h-8 m-1 relative cursor-pointer rounded-full shadow-md" :style="{ backgroundColor: swatch }" @click="selectSwatch(swatch)">
            <div v-show="inputValue === swatch" class="h-full w-full rounded-full border-2 border-gray-200 p-0 relative"></div>
          </div>
        </template>
        <div class="w-8 h-8 m-1 cursor-pointer rounded-full shadow-md text-gray-600 flex items-center justify-center" :style="{ backgroundColor: color }" @click.stop="addRemoveCurrentSwatch">
          <svg v-if="!hasSelectedSwatch" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="h-5 w-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueTailwindColorPicker',
  props: {
    value: String,
    swatches: {
      type: Array,
      default: () => []
    },
    hideSwatches: Boolean
  },
  data() {
    return {
      canvasCursor: null,
      lineCursor: null,
      opacityCursor: null,
      draggingLineCursor: false,
      draggingCanvasCursor: false,
      draggingOpacityCursor: false,
      dragStartColor: null,
      lineWidth: 160,
      lineLeft: 0,
      canvasWidth: 208,
      canvasLeft: 0,
      canvasTop: 0,
      canvasHeight: 0,
      opacityWidth: 160,
      opacityLeft: 0,
      percentageOpacity: 0,
      percentageBlack: 0,
      percentageWhite: 0,
      inputType: 'rgba',
      colorLazy: {
        r: 255,
        g: 219,
        b: 0,
        a: 1,
        hexa: '#FFFE00FF'
      },
      colorData: {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
        hexa: '#000000FF'
      },
      lineColorData: {
        r: 0,
        g: 0,
        b: 0
      },
      swatchesLazy: []
    }
  },
  computed: {
    inputValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    swatchesValue: {
      get() {
        return this.swatches || []
      },
      set(val) {
        this.$emit('update:swatches', val)
      }
    },
    hasSelectedSwatch() {
      return this.swatchesLazy.includes(this.inputValue)
    },
    color() {
      return `rgba(${this.colorData.r}, ${this.colorData.g}, ${this.colorData.b}, ${this.colorData.a})`
    },
    canvasColor() {
      return `rgba(${this.lineColorData.r}, ${this.lineColorData.g}, ${this.lineColorData.b}, 1)`
    },
    opacityLineBackground() {
      var opaque = `rgba(${this.colorData.r}, ${this.colorData.g}, ${this.colorData.b}, 0)`
      var solid = `rgba(${this.colorData.r}, ${this.colorData.g}, ${this.colorData.b}, 1)`
      return `linear-gradient(to right, ${opaque}, ${solid})`
    }
  },
  methods: {
    mousedownCanvas(e) {
      if (e.which !== 1) {
        return
      }
      this.registerListeners()

      this.dragStartColor = this.color
      this.draggingCanvasCursor = true
      this.setSizePoses()
      this.canvasCursor = this.$refs.canvasCursor
      this.canvasCursor.style.transform = `translate(${e.offsetX}px, ${e.offsetY}px)`
      this.percentageBlack = e.offsetY / this.canvasHeight
      this.percentageWhite = 1 - e.offsetX / this.canvasWidth
      this.setColorData()
      e.stopPropagation()
      e.preventDefault()
    },
    mousedownLine(e) {
      if (e.which !== 1) {
        return
      }
      this.registerListeners()

      this.dragStartColor = this.color
      this.draggingLineCursor = true
      this.setSizePoses()
      this.lineCursor = this.$refs.lineCursor
      this.lineCursor.style.transform = `translate(${e.offsetX}px, 0px)`
      this.calculateLineColor(e.offsetX)
      this.setColorData()
      e.stopPropagation()
      e.preventDefault()
    },
    mousedownOpacity(e) {
      if (e.which !== 1) {
        return
      }
      this.registerListeners()

      this.dragStartColor = this.color
      this.draggingOpacityCursor = true
      this.setSizePoses()
      this.opacityCursor = this.$refs.opacityCursor
      this.opacityCursor.style.transform = `translate(${e.offsetX}px, 0px)`
      this.percentageOpacity = e.offsetX / this.opacityWidth

      this.setColorData()
      e.stopPropagation()
      e.preventDefault()
    },
    mouseup(e) {
      if (this.draggingLineCursor || this.draggingCanvasCursor || this.draggingOpacityCursor) {
        if (this.dragStartColor !== this.color) {
          this.$emit('change', this.colorData.hexa)
        }
      }
      this.draggingLineCursor = false
      this.draggingCanvasCursor = false
      this.draggingOpacityCursor = false
      this.unregisterListeners()
    },
    mousemove(e) {
      if (this.draggingLineCursor) {
        var pos = e.pageX - this.lineLeft
        pos = Math.min(this.lineWidth, Math.max(0, pos))
        this.lineCursor.style.transform = `translate(${pos}px, 0px)`
        this.calculateLineColor(pos)
      } else if (this.draggingCanvasCursor) {
        var posX = e.pageX - this.canvasLeft
        var posY = e.pageY - this.canvasTop
        posX = Math.min(this.canvasWidth, Math.max(0, posX))
        posY = Math.min(this.canvasHeight, Math.max(0, posY))
        this.canvasCursor.style.transform = `translate(${posX}px, ${posY}px)`
        this.percentageBlack = posY / this.canvasHeight
        this.percentageWhite = 1 - posX / this.canvasWidth
      } else if (this.draggingOpacityCursor) {
        var pos = e.pageX - this.opacityLeft
        pos = Math.min(this.opacityWidth, Math.max(0, pos))
        this.opacityCursor.style.transform = `translate(${pos}px, 0px)`
        this.percentageOpacity = pos / this.opacityWidth
      }
      this.setColorData()
    },
    setColorData() {
      var targetVal = 255 * (1 - this.percentageBlack)
      targetVal = Math.min(255, Math.max(0, Math.round(targetVal)))

      var remainingR = targetVal - this.lineColorData.r
      var remainingG = targetVal - this.lineColorData.g
      var remainingB = targetVal - this.lineColorData.b

      var rDiff = this.percentageWhite * remainingR
      var gDiff = this.percentageWhite * remainingG
      var bDiff = this.percentageWhite * remainingB

      var r = this.lineColorData.r + rDiff
      var g = this.lineColorData.g + gDiff
      var b = this.lineColorData.b + bDiff

      this.colorData.r = Math.min(targetVal, Math.max(0, Math.round(r)))
      this.colorData.g = Math.min(targetVal, Math.max(0, Math.round(g)))
      this.colorData.b = Math.min(targetVal, Math.max(0, Math.round(b)))
      this.colorData.a = Math.min(1, Math.max(0, Number(this.percentageOpacity.toFixed(2))))

      this.colorLazy.r = this.colorData.r
      this.colorLazy.g = this.colorData.g
      this.colorLazy.b = this.colorData.b
      this.colorLazy.a = this.colorData.a

      this.colorData.hexa =
        '#' +
        this.componentToHex(this.colorData.r) +
        this.componentToHex(this.colorData.g) +
        this.componentToHex(this.colorData.b) +
        this.componentToHex(Math.round(this.colorData.a * 255))
      this.colorLazy.hexa = this.colorData.hexa
      this.inputValue = this.colorData.hexa
    },
    calculateLineColor(linePos) {
      var perc = linePos / this.lineWidth
      var value = perc % (1 / 6)
      var colorPerc = value / (1 / 6)
      var percRed = 1
      var percGreen = 1
      var percBlue = 1

      if (perc < 1 / 6) {
        percGreen = colorPerc
        percBlue = 0
      } else if (perc < 2 / 6) {
        percRed = 1 - colorPerc
        percBlue = 0
      } else if (perc < 3 / 6) {
        percRed = 0
        percBlue = colorPerc
      } else if (perc < 4 / 6) {
        percRed = 0
        percGreen = 1 - colorPerc
      } else if (perc < 5 / 6) {
        percRed = colorPerc
        percGreen = 0
      } else {
        percGreen = 0
        percBlue = 1 - colorPerc
      }
      this.lineColorData.r = Math.min(255, Math.max(0, Math.round(percRed * 255)))
      this.lineColorData.g = Math.min(255, Math.max(0, Math.round(percGreen * 255)))
      this.lineColorData.b = Math.min(255, Math.max(0, Math.round(percBlue * 255)))
    },
    registerListeners() {
      document.addEventListener('mouseup', this.mouseup)
      document.addEventListener('mousemove', this.mousemove)
    },
    unregisterListeners() {
      document.removeEventListener('mouseup', this.mouseup)
      document.removeEventListener('mousemove', this.mousemove)
    },
    setSizePoses() {
      var boundingRect = this.$refs.line.getBoundingClientRect()
      this.lineLeft = boundingRect.left

      var canvBoundingRect = this.$refs.canvas.getBoundingClientRect()
      this.canvasLeft = canvBoundingRect.left
      this.canvasTop = canvBoundingRect.top
      this.canvasHeight = canvBoundingRect.height

      var boundingRect = this.$refs.opacityLine.getBoundingClientRect()
      this.opacityLeft = boundingRect.left
    },
    normalizeColorData() {
      var normalized = {
        r: null,
        g: null,
        b: null,
        variable: null
      }
      var { r, g, b } = this.colorData
      if (b > g && b > r) {
        normalized.b = 1
      } else if (g > r && g > b) {
        normalized.g = 1
      } else {
        normalized.r = 1
      }
      if (r < g && r < b) {
        normalized.r = 0
      } else if (g < r && g < b) {
        normalized.g = 0
      } else {
        normalized.b = 0
      }
      Array.from('rgb').forEach((col) => {
        if (normalized[col] === null) {
          normalized.variable = col
          normalized[col] = this.colorData[col] / 255
        }
      })
      return normalized
    },
    initSwatches() {
      if (this.swatches !== null && Array.isArray(this.swatches)) {
        var cleanedSwatches = this.swatches.map((s) => this.cleanHexa(s))
        cleanedSwatches.forEach((swatch) => {
          if (!this.swatchesLazy.includes(swatch)) {
            this.swatchesLazy.push(swatch)
          }
        })
      } else {
        var cleanedSwatches = [
          '#f94144',
          '#f3722c',
          '#f8961e',
          '#f9c74f',
          '#90be6d',
          '#43aa8b',
          '#577590',
          '#22223b',
          '#4a4e69',
          '#c9ada7'
        ].map((s) => this.cleanHexa(s))
        this.swatchesLazy = cleanedSwatches
      }
    },
    init() {
      if (this.value) {
        this.colorLazy = this.parseHexa(this.value)
      }
      if (!this.hideSwatches) this.initSwatches()
      this.validate()
      this.setUICursors()
    },
    inputUpdated() {
      this.validate()
      this.setUICursors()
    },
    hexaInputUpdated() {
      this.validateHexa()
      this.setUICursors()
    },
    validateHexChar(c) {
      if (c.length < 0 || c.length > 1) return '0'
      if (isNaN(c)) {
        var validChars = ['A', 'B', 'C', 'D', 'E', 'F']
        if (validChars.includes(c.toUpperCase())) {
          return c.toUpperCase()
        } else {
          return '0'
        }
      } else {
        return c
      }
    },
    cleanHexa(hexa) {
      if (!hexa || hexa.length < 3) return '#000000FF'
      var _cleaned = hexa.toUpperCase()
      if (_cleaned.startsWith('#')) _cleaned = _cleaned.substr(1)
      if (_cleaned.length < 3) return '#000000FF'
      var r, g, b, a
      r = g = b = '00'
      a = 'FF'
      if (_cleaned.length === 3) {
        var rgb = _cleaned
          .split('')
          .map((r) => `0${r}`)
          .map((r) => this.validateHexChar(r))
        r = rgb[0]
        g = rgb[1]
        b = rgb[2]
      } else if (_cleaned.length >= 6) {
        var rgb = _cleaned.split('').map((r) => this.validateHexChar(r))
        r = rgb[0] + rgb[1]
        g = rgb[2] + rgb[3]
        b = rgb[4] + rgb[5]
        if (rgb.length === 8) {
          a = rgb[6] + rgb[7]
        }
      }
      return `#${r}${g}${b}${a}`
    },
    parseHexa(hexa) {
      var hexaArr = this.cleanHexa(hexa).substr(1).split('')

      var h = hexaArr[0] + hexaArr[1]
      var e = hexaArr[2] + hexaArr[3]
      var x = hexaArr[4] + hexaArr[5]
      var ha = hexaArr[6] + hexaArr[7]
      var r = parseInt(h, 16)
      var g = parseInt(e, 16)
      var b = parseInt(x, 16)
      var a = parseInt(ha, 16) / 255

      return {
        hexa: '#' + h + e + x + ha,
        r,
        g,
        b,
        a
      }
    },
    validateHexa() {
      var parsedColor = this.parseHexa(this.colorLazy.hexa)
      this.colorData = { ...parsedColor }

      this.colorLazy.r = this.colorData.r
      this.colorLazy.g = this.colorData.g
      this.colorLazy.b = this.colorData.b
      this.colorLazy.a = this.colorData.a
    },
    componentToHex(c) {
      var hex = c.toString(16).toUpperCase()
      return hex.length == 1 ? '0' + hex : hex
    },
    validate() {
      var r = Number(this.colorLazy.r)
      var g = Number(this.colorLazy.g)
      var b = Number(this.colorLazy.b)
      var a = Number(this.colorLazy.a)
      if (isNaN(r) || r === null) r = 0
      if (isNaN(g) || g === null) g = 0
      if (isNaN(b) || b === null) b = 0
      if (isNaN(a) || a === null) a = 1
      r = Math.min(255, Math.max(0, r))
      g = Math.min(255, Math.max(0, g))
      b = Math.min(255, Math.max(0, b))
      a = Math.min(1, Math.max(0, a))
      this.colorData.r = r
      this.colorData.g = g
      this.colorData.b = b
      this.colorData.a = a
      this.colorData.hexa =
        '#' +
        this.componentToHex(r) +
        this.componentToHex(g) +
        this.componentToHex(b) +
        this.componentToHex(Math.round(a * 255))
      this.colorLazy.hexa = this.colorData.hexa
    },
    setUICursors() {
      this.setSizePoses()
      this.percentageOpacity = this.colorData.a
      var opacityX = this.percentageOpacity * this.opacityWidth
      this.$refs.opacityCursor.style.transform = `translate(${opacityX}px, 0px)`

      var normalized = this.normalizeColorData()

      var sector = 0
      var variablePerc = 0
      if (normalized.variable === 'r') {
        if (normalized.g === 1) {
          sector = 1
          variablePerc = 1 - this.colorData.r / 255
        } else if (normalized.b === 1) {
          sector = 4
          variablePerc = this.colorData.r / 255
        }
      } else if (normalized.variable === 'b') {
        if (normalized.r === 1) {
          sector = 5
          variablePerc = 1 - this.colorData.b / 255
        } else if (normalized.g === 1) {
          sector = 2
          variablePerc = this.colorData.b / 255
        }
      } else {
        if (normalized.r === 1) {
          sector = 0
          variablePerc = this.colorData.g / 255
        } else if (normalized.b === 1) {
          sector = 3
          variablePerc = 1 - this.colorData.g / 255
        }
      }
      var sectorLength = this.lineWidth / 6
      var variableSectorLeft = variablePerc * sectorLength

      var lineCursorLeft = sectorLength * sector + variableSectorLeft
      this.$refs.lineCursor.style.transform = `translate(${lineCursorLeft}px, 0px)`

      this.lineColorData.r = Math.min(255, Math.max(0, Math.round(normalized.r * 255)))
      this.lineColorData.g = Math.min(255, Math.max(0, Math.round(normalized.g * 255)))
      this.lineColorData.b = Math.min(255, Math.max(0, Math.round(normalized.b * 255)))

      Array.from('rgb').forEach((col) => {
        if (this.lineColorData[col] === 0) {
          this.percentageWhite = this.colorData[col] / 255
        } else if (this.lineColorData[col] === 255) {
          this.percentageBlack = 1 - this.colorData[col] / 255
        }
      })

      var canvCursorX = this.canvasWidth * (1 - this.percentageWhite)
      var canvCursorY = this.canvasHeight * this.percentageBlack
      this.$refs.canvasCursor.style.transform = `translate(${canvCursorX}px, ${canvCursorY}px)`
    },
    blurInputR() {
      this.colorLazy.r = this.colorData.r
    },
    blurInputG() {
      this.colorLazy.g = this.colorData.g
    },
    blurInputB() {
      this.colorLazy.b = this.colorData.b
    },
    blurInputA() {
      this.colorLazy.a = this.colorData.a
    },
    blurInputHexa() {
      this.colorLazy.hexa = this.colorData.hexa
    },
    toggleInputs() {
      if (this.inputType === 'rgba') {
        this.inputType = 'hexa'
      } else {
        this.inputType = 'rgba'
      }
    },
    selectSwatch(swatchHexa) {
      var parsedHexa = this.parseHexa(swatchHexa)
      this.colorData = { ...parsedHexa }
      this.colorLazy = { ...parsedHexa }
      this.inputValue = parsedHexa.hexa
      this.$emit('change', this.colorData.hexa)

      this.setUICursors()
    },
    deleteSwatch(swatch) {
      this.swatchesLazy = this.swatchesLazy.filter((s) => s !== swatch)
      this.$emit('update:swatches', this.swatchesLazy)
      this.$emit('deleteSwatch', swatch)
    },
    addRemoveCurrentSwatch() {
      if (this.hasSelectedSwatch) {
        this.deleteSwatch(this.inputValue)
      } else {
        this.swatchesLazy.push(this.inputValue)
        this.$emit('update:swatches', this.swatchesLazy)
        this.$emit('addSwatch', this.inputValue)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    this.unregisterListeners()
  }
}
</script>
