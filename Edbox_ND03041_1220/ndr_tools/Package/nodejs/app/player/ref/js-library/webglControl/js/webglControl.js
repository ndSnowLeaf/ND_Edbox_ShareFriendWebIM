'use strict'

var webglControl = Object.create(null);

(function () {
  function Line(A, B, C) {
    this.A = A
    this.B = B
    this.C = C
  }

  Line.prototype.pointToLine = function (p, line) {
    var A = line.A
    var B = line.B
    var C = line.C
    var d = Math.sqrt(A * A + B * B)
    var e = A * p.x + B * p.y + C
    return e / d
  }
  webglControl = {
    _init: function () {
      this.libVersion = '5.1.0'
      this.TOOL_KEYS = ['PlaneGeometry', 'SolidGeometry', 'BasicGraph']
      this.canBeAbsorbedGeometry = {
        FourEdges: true, //正方体
        FourEdgesChangFangXing: true, //长方体
        FourEdgesPingXingSiBianXing: true, //平行四边形
        FourEdgesLingXing: true, //菱形
        FourEdgesTiXing: true, //等腰梯形
        FourEdgesZhiJiaoTiXing: true, //直角梯形
        FivePointedStar: true, //五角星
        FiveEdges: true, //正五边形
        SixEdges: true, //正六边形
        EquilateralTriangle: true, //等边三角形
        IsoscelesTriangle: true, //等腰三角形
        IsoscelesRightAngleTriangle: true, //直角三角形
        ObtuseAngledTriangle: true, //顿角三角形
        AcuteAngledTriangle: true, //锐角三角形
        Sector2: true,
        Sector: true, //扇形
        Circle: false, //圆形
        Ellipse: false //椭圆
      }
      this.straightedgeInfo = {}
      this.geometryInfos = {}
      if (this._isWebGLSupported()) {
        this.isWebGLRenderer = true
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        })
      } else {
        this.isWebGLRenderer = false
        this.renderer = new THREE.CanvasRenderer()
      }
      this.renderer.setSize(document.body.clientWidth, document.body.clientHeight)
      this.renderer.setClearColor(0xff0000, 0)
      this.renderer.autoClear = false
      var $renderDom = document.getElementsByClassName('com_tooldiolag')[0] || document.getElementsByClassName('com_tooldialog')[0] || document.getElementsByClassName('full')[0]
      $renderDom.appendChild(this.renderer.domElement)
      $(this.renderer.domElement).css('pointer-events', 'none')
      $(this.renderer.domElement).css('position', 'absolute')
      $(this.renderer.domElement).css('top', '0px')
      $(this.renderer.domElement).css('z-index', '4000')

      $(document.body).append(this._createMsgBoxElem())
      this.msgBox = $(document.body).find('.webglControl_msg:first')

      this.viewMap = []
      this.MAX_COUNT = 50
      this.count = 0
      this.tipMsg = ''
      this.i18n = {
        'zh_HK': "所有圖形同時最多打開{0}個!",
        'zh_CN': "所有图形同时最多打开{0}个!",
        'ja_JP': "全ての画像を{0}まで同時に開ける!"
      }
      this.tipMsg = this.i18n[icCreatePlayer.lang]
      // $.getJSON(icCreatePlayer.ref_path + './../../../../ref/js-library/webglControl/locations/' + icCreatePlayer.lang + '/lang.json', function (data) {
      //   scope.tipMsg = data.limit_tip
      // })
    },
    _isWebGLSupported: function () {
      var contextOptions = {
        stencil: true
      }
      try {
        if (!window.WebGLRenderingContext) {
          return false
        }

        var canvas = document.createElement('canvas'),
          gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions)

        return !!(gl && gl.getContextAttributes().stencil)
      } catch (e) {
        return false
      }
    },
    /**
     * 获取webgl支持状态
     * @returns true: context('webgl') false:context('2d')
     */
    isWebGL: function () {
      return this.isWebGLRenderer
    },
    /**
     * 获取当前渲染器
     * @returns THREE.Renderer
     */
    getRenderer: function () {
      return this.renderer
    },
    _format: function () {
      var args = arguments
      if (!args[0] || Object.prototype.toString.call(args[0]).slice(8, -1) !== 'String') return args[0]
      return args[0].replace(/\{(\d+)\}/g, function (m, i) {
        return args[i * 1 + 1]
      })
    },
    /**
     * 获取canvas标签
     * @returns domElement(<canvas/>)
     */
    getRendererDom: function () {
      return this.renderer.domElement
    },
    /**
     * 添加视图
     * @param scene 场景对象 唯一标识
     * @param camera 相机对象
     * @param isCounted 该视图是否有数量限制，默认为false
     * @param focusFunc 删除图形时，获取到焦点会调用该回调
     * @param blurFunc 添加图形时，失去焦点会调用该回调
     * @returns {boolean} 视图是否添加成功
     */
    addView: function (scene, camera, isCounted, focusFunc, blurFunc) {
      if (isCounted && this.isToolsExcess()) {
        return false
      } else if (isCounted) {
        this.count++
      }

      if (this.viewMap.length > 0) {
        var lastScene = this.viewMap[this.viewMap.length - 1]
        lastScene.onBlur && lastScene.onBlur()
      }

      for (var i = 0; i < this.viewMap.length; i++) {
        if (scene === this.viewMap[i].scene) {
          console.log('can not add two same scenes')
          return false
        }
      }

      this.viewMap.push({
        scene: scene,
        camera: camera,
        isCounted: isCounted || false,
        onFocus: focusFunc,
        onBlur: blurFunc
      })

      return true
    },
    /**
     * 移除视图
     * @param scene 场景对象 唯一标识
     * @returns {boolean} 视图是否移除成功
     */
    removeScene: function (scene) {
      delete this.geometryInfos[scene.uuid]
      for (var i = 0; i < this.viewMap.length; i++) {
        if (scene === this.viewMap[i].scene) {
          if (this.viewMap[i].isCounted) {
            this.count--
          }
          this.viewMap.splice(i, 1)
          if (this.viewMap.length > 0) {
            var currentScene = this.viewMap[this.viewMap.length - 1]
            currentScene.onFocus && currentScene.onFocus()
          }
          this.render()
          return true
        }
      }
      return false
    },
    /**
     * 移除视图
     * @param view view对象中必须包含scene属性
     * @returns {*|boolean} 是否移除成功
     */
    removeView: function (view) {
      return this.removeScene(view.scene)
    },
    /**
     * 手动渲染视图，在该版本中，不再启用自动渲染
     */
    render: function () {
      var scope = this

      // var beAbsorbedGeometryInfo
      var lastView = _.last(this.viewMap)
      if (lastView) {
        var lastScene = lastView.scene
        this._updateScenePos(lastScene)
      }

      this.renderer.clear()
      this.viewMap.forEach(function (item) {
        scope.renderer.render(item.scene, item.camera)
        scope.renderer.clearDepth()
      })
    },
    /**
     * 视图置顶
     * @param view 必须包含scene属性
     */
    reIndex: function (view) {
      this.reIndexScene(view.scene)
    },
    /**
     * 视图置顶
     * @param scene 场景对象
     */
    reIndexScene: function (scene) {
      // this._updateLastScenePos()
      var view
      for (var i = 0; i < this.viewMap.length; i++) {
        if (scene === this.viewMap[i].scene) {
          view = this.viewMap[i]
          this.viewMap.splice(i, 1)
          break
        }
      }
      this.viewMap.push(view)
      this.render()
    },
    _createMsgBoxElem: function () {
      return '<div ' +
        'class="webglControl_msg" style="display: none;' +
        'position: fixed;' +
        'top: 0px;' +
        'width: 100%;' +
        'height: 100%;' +
        'z-index: 1000;' +
        'text-align: center;' +
        'pointer-events: none;">' +
        '<p ' +
        'class="text" style="display: inline-block;' +
        'margin-top: 15%;' +
        'padding: 30px 67px;' +
        'border-radius: 5px;' +
        'font-size: 20px;' +
        'color: white;' +
        'background: rgba(0, 0, 0, 0.66);">' +
        '</p></div>'
    },
    /**
     * 显示提示信息
     * @param msg
     */
    showMessageBox: function (msg) {
      var node = this.msgBox
      node.find('.text').html(msg)
      node.show()
      setTimeout(function () {
        node.find('.text').html('')
        node.hide()
      }, 2000)
    },
    /**
     * icPlayer调用，判断是否超出最大个数，并自动提示
     * @returns {boolean} true: 超出 false:未超出
     */
    isToolsExcess: function (toolKey) {
      if (toolKey == undefined) {
        if (this.count >= this.MAX_COUNT) {
          this.showMessageBox(this._format(this.tipMsg, this.MAX_COUNT))
          return true
        }
        return false
      }
      for (var i = 0; i < this.TOOL_KEYS.length; i++) {
        if (this.TOOL_KEYS[i] == toolKey) {
          if (this.count >= this.MAX_COUNT) {
            this.showMessageBox(this._format(this.tipMsg, this.MAX_COUNT))
            return true
          }
          return false
        }
      }
      return false
    },
    _updateScenePos: function (scene) {
      var rotation, position
      var geometryBox = _.last(scene.children)
      // geometryBox.getObjectByName('StraightedgeGroup').getObjectByName('StraightedgeBox').getObjectByName('StraightedgeBorder') // 查找直尺边框代码
      // 如果是可被吸附图形，更新位置信息
      if (!this.canBeAbsorbedGeometry[geometryBox.name]) return
      rotation = geometryBox.rotation.z
      position = geometryBox.position

      var geometry = geometryBox.children[0].geometry
      var oldVertices = geometry.vertices
      var isSector2 = false
      if (geometryBox.name === 'Sector2') {
        isSector2 = true
      }
      var newVertices = []
      oldVertices.forEach((v, index) => {
        let truePoint = this._transform(this._rotate(v, rotation), position.x, position.y)
        truePoint.uuid = scene.uuid
        truePoint.index = index
        newVertices.push(truePoint)
      })
      var uuid = scene.uuid

      this._createLineSegments(newVertices, uuid, isSector2)
      // console.log('new Vertices', newVertices)

    },
    _createLineSegments: function (vertices, uuid, isSector2) {
      var lines = []
      var length = vertices.length
      for (var i = 0; i < length; i++) {

        var j = i + 1 >= length ? 0 : i + 1
        var line = {
          pointS: vertices[i],
          pointE: vertices[j],
          x: vertices[j].x - vertices[i].x,
          y: vertices[j].y - vertices[i].y,
          uuid: uuid,
          vertexIndex: [i, j]
        }
        lines.push(line)
      }
      if (isSector2) {
        vertices = [vertices[18], vertices[19], vertices[37], vertices[0]]
        var line1 = {
          pointS: vertices[0],
          pointE: vertices[1],
          x: vertices[1].x - vertices[0].x,
          y: vertices[1].y - vertices[0].y,
          uuid: uuid,
          vertexIndex: [18, 19]
        }
        var line2 = {
          pointS: vertices[2],
          pointE: vertices[3],
          x: vertices[3].x - vertices[2].x,
          y: vertices[3].y - vertices[2].y,
          uuid: uuid,
          vertexIndex: [37, 0]
        }
        lines = [line1, line2]
      }

      this.geometryInfos[uuid] = {
        lines: lines,
        vertices: vertices
      }
      // console.log('createLineSegments', this.geometryInfos)
    },
    // 旋转吸附判定
    rotateAbsorbJudge: function (options, uuid) {
      var straightedge = options.straightedge
      var rotation = straightedge.rotation

      var straightedgeLine = straightedge.line

      var lines = this.geometryInfos[uuid].lines

      var absorbAngle = 5 / 180 * Math.PI

      var canAbsorb = false
      var deltaRotate = 0

      lines.forEach(v => {
        if (_.indexOf(v.vertexIndex, straightedge.vertexIndex) === -1) return
        var angle = this._getAngleBetweenLines(straightedgeLine, v)

        if (Math.abs(Math.abs(angle) - Math.PI) < absorbAngle || Math.abs(angle) < absorbAngle) {
          canAbsorb = true
          var sign = Math.abs(angle) > Math.PI - absorbAngle ? 1 : -1
          var sign2 = angle > 0 ? 1 : -1
          deltaRotate = Math.min(Math.abs(angle), Math.abs(Math.abs(angle) - Math.PI)) * sign * sign2
        }

      })
      return {
        rotation: rotation - deltaRotate,
        canAbsorb: canAbsorb
      }
    },
    vertexAbsorb: function (center) {
      var vertices = this._addVerticesToArray()
      var vertexAbsorb = false
      vertices.forEach(v => {
        var verticesDis = this._pointToPointDistance(center, v)
        if (verticesDis < 0.1) {
          vertexAbsorb = true
        }
        // console.log('vvvvvvvvvvv', verticesDis, straightedgeLine.center)
      })
      return vertexAbsorb
    },
    // 移动吸附判定
    absorbJudge: function (options) {
      var straightedge = options.straightedge
      var rotation = straightedge.rotation
      var position = straightedge.position

      var straightedgeLine = straightedge.line

      var lines = this._addLinesToArray()

      // console.log('absorbJudeg', straightedgeLine, lines)
      var absorbAngle = 5 / 180 * Math.PI
      var newPosition = position

      var canAbsorb = false
      var vertexAbsorb = false
      var deltaRotate = 0
      var uuid = 0
      var vertexIndex = 0

      //移动时顶点吸附判定
      var vertices = this._addVerticesToArray()
      vertices.forEach((v, index) => {
        var verticesDis = this._pointToPointDistance(straightedgeLine.center, v)
        var verticesBottomDis = this._pointToPointDistance(straightedge.pointBottom, v)
        if (verticesDis < 10 || verticesBottomDis < 10) {
          if (verticesDis < 10) {
            newPosition = _.clone(v)
          } else {
            newPosition = this._getBottomPoint(v, rotation, -100)
          }
          uuid = v.uuid
          canAbsorb = true
          if (verticesDis < 10) {
            vertexAbsorb = true
            vertexIndex = v.index
          }

        }
        // console.log('vvvvvvvvvvv', verticesDis, straightedgeLine.center)
      })
      lines.forEach((v, index) => {
        var angle = this._getAngleBetweenLines(straightedgeLine, v)

        // var dis = this._pointToPointDistance(v.pointS, v.pointE)
        // // 若是弧形边， 则返回
        // console.log('ddddddddddd', dis, index)
        // if (dis < 20) return
        if (Math.abs(Math.abs(angle) - Math.PI) < absorbAngle || Math.abs(angle) < absorbAngle) {

          var sign = Math.abs(angle) > Math.PI - absorbAngle ? 1 : -1
          var sign2 = angle > 0 ? 1 : -1
          var createLine = function (s, e) {
            var A = 0,
              B = 0,
              C = 0
            A = e.y - s.y
            B = s.x - e.x
            C = e.x * s.y - s.x * e.y
            return new Line(A, B, C)
          }

          var line = createLine(v.pointS, v.pointE)
          var distance = line.pointToLine(straightedgeLine.center, line)
          var distance2
          if (sign > 0) {
            distance2 = distance - 100
          } else {
            distance2 = distance + 100
          }

          // console.log('sign-----------', sign, distance, distance2)

          var newPos

          // 判定直尺下边吸附
          var isBottomLineAbsorb = false
          if (Math.abs(distance2) < Math.abs(distance)) {
            distance = distance2
            isBottomLineAbsorb = true
          }

          var sign3 = v.x > 0 ? -1 : 1
          var sign4 = v.y > 0 ? -1 : 1
          var sign5 = sign3 === sign4 ? -1 : 1
          newPos = {
            x: straightedge.position.x - distance * Math.abs(Math.sin(rotation)) * sign3 * sign5,
            y: straightedge.position.y - distance * Math.abs(Math.cos(rotation)) * sign3
          }

          var newDeltaRotate = Math.min(Math.abs(angle), Math.abs(Math.abs(angle) - Math.PI)) * sign * sign2
          var absorbPoint = newPos

          var posBottom = this._getBottomPoint(newPos, rotation)

          if (isBottomLineAbsorb) {
            absorbPoint = posBottom
          }
          // todo 两线段不相交的判断
          // var newRotation = rotation - newDeltaRotate
          // var newPosLeft = {
          //   x: newPos.x - 100 * Math.cos(newRotation),
          //   y: newPos.y + 100 * Math.sin(newRotation)
          // }
          // var sPointSIntersect = this._onSegment(v.pointE, v.pointS, straightedgeLine.pointS)
          // var sPointEIntersect = this._onSegment(v.pointE, v.pointS, straightedgeLine.pointE)
          // console.log('---------------------', sPointSIntersect, sPointEIntersect, straightedgeLine.pointS, straightedgeLine.pointE)
          // var newPosDisS = this._pointToPointDistance(newPos, v.pointS)
          // var newPosDisE = this._pointToPointDistance(newPos, v.pointE)

          var intersect = this._onSegment(v.pointE, v.pointS, absorbPoint)
          // console.log('-------------', newPosDisS, newPosDisE, intersect)
          // var intersect = this._lineSegmentsIntersect(straightedgeLine.pointS, straightedgeLine.pointE, v.pointS, v.pointE)
          var signDelta = intersect ? 1 : -1
          var deltaS = this._pointToPointDistance(v.pointS, absorbPoint) * signDelta
          var deltaE = this._pointToPointDistance(v.pointE, absorbPoint) * signDelta

          var condS = Math.abs(deltaS) < 10
          var condE = Math.abs(deltaE) < 10
          // console.log(deltaS, deltaE)

          if (Math.abs(distance) < 10) {
            canAbsorb = true

            newPosition = newPos
            deltaRotate = newDeltaRotate

            // 顶点吸附判断
            if (condS || condE) {
              if (!isBottomLineAbsorb) {
                vertexAbsorb = true
              }

              uuid = v.uuid

              if (condS) {
                newPosition.x += deltaS * Math.abs(Math.cos(rotation)) * sign3
                newPosition.y -= deltaS * Math.abs(Math.sin(rotation)) * sign3 * sign5
              }
              if (condE) {
                newPosition.x -= deltaE * Math.abs(Math.cos(rotation)) * sign3
                newPosition.y += deltaE * Math.abs(Math.sin(rotation)) * sign3 * sign5
              }

            }
            // console.info('angle', angle, sign, sign2, sign3, distance, rotation, index)
          }

        }

      })
      // console.log('deltaRotate', deltaRotate, rotation - deltaRotate)
      return {
        position: newPosition,
        rotation: rotation - deltaRotate,
        canAbsorb: canAbsorb,
        vertexAbsorb: vertexAbsorb,
        vertexIndex: vertexIndex,
        uuid: uuid
      }
    },
    _addLinesToArray: function () {
      var arr = []
      _.forIn(this.geometryInfos, function (value, key) {
        value.lines.forEach(v => {
          arr.push(v)
        })
      })
      return arr
    },
    _addVerticesToArray: function () {
      var arr = []
      _.forIn(this.geometryInfos, function (value, key) {
        value.vertices.forEach(v => {
          arr.push(v)
        })
      })
      return arr
    },
    geometryManager: function (info) {
      this.geometryInfos.push(info)
    },
    _getLength: function (v) {
      return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))
    },

    _getAngleBetweenLines(v0, v1) {
      var cosAngle = (v0.x * v1.x + v0.y * v1.y) / (this._getLength(v0) * this._getLength(v1))
      if (Math.abs(cosAngle) > 1) {
        cosAngle = cosAngle > 0 ? 1 : -1
      }
      let angle = Math.acos(cosAngle)
      // 判断顺逆时针
      var p = v0.x * (v1.y - v0.y) - v0.y * (v1.x - v0.x)
      if (p < 0) {
        angle = -angle
      }
      return angle
    },
    _direction: function (pi, pj, pk) {
      return (pk.x - pi.x) * (pj.y - pi.y) - (pj.x - pi.x) * (pk.y - pi.y)
    },
    _onSegment: function (pi, pj, pk) {
      var segments = 0.0001
      var cond1 = Math.min(pi.x, pj.x) - segments <= pk.x && pk.x <= Math.max(pi.x, pj.x) + segments
      var cond2 = Math.min(pi.y, pj.y) - segments <= pk.y && pk.y <= Math.max(pi.y, pj.y) + segments
      if (cond1 && cond2) {
        return true
      } else {
        return false
      }
    },
    _lineSegmentsIntersect: function (p1, p2, p3, p4) {
      var d1 = this._direction(p3, p4, p1)
      var d2 = this._direction(p3, p4, p2)
      var d3 = this._direction(p1, p2, p3)
      var d4 = this._direction(p1, p2, p4)
      var segments = 0
      var cond1 = d1 > -segments && d2 < segments
      var cond2 = d1 < segments && d2 > -segments
      var cond3 = d3 > -segments && d4 < segments
      var cond4 = d3 < segments && d4 > -segments
      if (cond1 || cond2 || cond3 || cond4) {
        return true
      } else if (d1 <= segments && this._onSegment(p3, p4, p1)) {
        return true
      } else if (d2 <= segments && this._onSegment(p3, p4, p2)) {
        return true
      } else if (d3 <= segments && this._onSegment(p1, p2, p3)) {
        return true
      } else if (d4 <= segments && this._onSegment(p1, p2, p4)) {
        return true
      }
      return false
    },
    _rotate: function (point, deg) {
      deg = deg || 0
      return {
        x: point.x * Math.cos(deg) - point.y * Math.sin(deg),
        y: point.x * Math.sin(deg) + point.y * Math.cos(deg)
      }
    },
    _transform: function (point, translateX, translateY) {
      return {
        x: point.x + translateX,
        y: point.y + translateY
      }
    },
    _pointToPointDistance: function (p1, p2) {
      const cSquare = Math.pow((p2.y - p1.y), 2) + Math.pow((p2.x - p1.x), 2)
      return Math.sqrt(cSquare)
    },
    _getBottomPoint(point, rotation, distance) {
      distance = distance || 100
      const x = point.x
      const y = point.y
      const deltaX = distance * Math.sin(rotation)
      const deltaY = distance * Math.cos(rotation)
      let newX
      let newY
      if (deltaX <= 0 && deltaY >= 0) {
        newX = x - Math.abs(deltaX)
        newY = y - Math.abs(deltaY)
      }
      if (deltaX >= 0 && deltaY >= 0) {
        newX = x + Math.abs(deltaX)
        newY = y - Math.abs(deltaY)
      }
      if (deltaX >= 0 && deltaY <= 0) {
        newX = x + Math.abs(deltaX)
        newY = y + Math.abs(deltaY)
      }
      if (deltaX <= 0 && deltaY <= 0) {
        newX = x - Math.abs(deltaX)
        newY = y + Math.abs(deltaY)
      }
      return {
        x: newX,
        y: newY
      }
    }
  }
  webglControl._init()
})()

if (window.icCreatePlayer) {
  if (!icCreatePlayer.plugin) {
    icCreatePlayer.plugin = Object.create(null)
  }
  icCreatePlayer.plugin.webglControl = webglControl
}