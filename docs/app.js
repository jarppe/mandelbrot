console.log("Here we go again...")


const makePalette = (resolution) => {
  const palette = new Array(resolution)

  const bound = (f) => (i) => {
    const c = f(i)
    if (c < 0) return 0
    if (c > 1) return 255
    return Math.floor(255 * c)
  }

  const cf = (g, cp, w) => (i) => g * (1.0 - (Math.abs(i - cp) / w))

  const r = bound(cf(1.0, 0, resolution / 10.0))
  const g = bound(cf(0.8, 0, resolution / 20.0))
  const b = () => 0

  for (let i = 0; i < resolution; i++) {
    palette[i] = [r(i), g(i), b(i), 255]
  }

  return palette
}

const resolution = 2000
const palette = makePalette(resolution)

const canvas = document.getElementById("view")
const context = canvas.getContext("2d")

const scaler = (fromMin, fromMax, toMin, toMax) => {
  const r = (toMax - toMin) / (fromMax - fromMin)
  return (x) => ((x - fromMin) * r) + toMin
}


const createImage = () => {
  const width = canvas.clientWidth
  const height = canvas.clientHeight

  canvas.width = width
  canvas.height = height

  const scaleX = scaler(0, width, -2.5, +1.0)
  const scaleY = scaler(0, height, -1.0, +1.0)

  const image = context.createImageData(width, height)
  const data = image.data

  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      const x0 = scaleX(px),
            y0 = scaleY(py)
      let x   = 0,
          y   = 0,
          i   = 0,
          xsq = 0,
          ysq = 0

      do {
        xsq = x * x
        ysq = y * y
        y = 2 * x * y + y0
        x = xsq - ysq + x0
      } while ((i++ < resolution) && ((xsq + ysq) < 4.0))

      if (i < resolution) {
        const pi = ((py * width) + px) * 4,
              c  = palette[i - 1]
        data[pi + 0] = c[0]
        data[pi + 1] = c[1]
        data[pi + 2] = c[2]
        data[pi + 3] = 255
      }
      //const pi = ((py * width) + px) * 4,
      //      c  = palette[Math.floor((resolution / width) * px)]
      //data[pi + 0] = c[0]
      //data[pi + 1] = c[1]
      //data[pi + 2] = c[2]
      //data[pi + 3] = 255
    }
  }

  return image
}

const draw = () => {
  console.time("Drawing")
  context.putImageData(createImage(), 0, 0)
  console.timeEnd("Drawing")
}

//window.addEventListener("resize", draw)
draw()
