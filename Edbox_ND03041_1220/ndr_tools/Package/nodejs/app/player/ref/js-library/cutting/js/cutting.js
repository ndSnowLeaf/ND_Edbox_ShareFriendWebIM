(function() {
	function Point() {}
	Point.prototype.x = 0;
	Point.prototype.y = 0;

	function Line(op) {
		this.deleted = op.deleted == undefined ? false : op.deleted;
		this.directed = op.directed == undefined ? true : op.directed;
		this.startPoint = op.startPoint;
		this.endPoint = op.endPoint;
	}

	//除法函数，用来得到精确的除法结果
	//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
	//调用：accDiv(arg1,arg2)
	//返回值：arg1除以arg2的精确结果
	function accDiv(arg1, arg2) {
		var t1 = 0,
			t2 = 0,
			r1, r2;
		try {
			t1 = arg1.toString().split(".")[1].length
		} catch (e) {}
		try {
			t2 = arg2.toString().split(".")[1].length
		} catch (e) {}
		with(Math) {
			r1 = Number(arg1.toString().replace(".", ""));
			r2 = Number(arg2.toString().replace(".", ""));
			return (r1 / r2) * pow(10, t2 - t1);
		}
	}
	//给Number类型增加一个div方法，调用起来更加方便。
	Number.prototype.div = function(arg) {
		return Number(accDiv(this, arg));
	};
	//乘法函数，用来得到精确的乘法结果
	//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
	//调用：accMul(arg1,arg2)
	//返回值：arg1乘以arg2的精确结果
	function accMul(arg1, arg2) {
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch (e) {}
		try {
			m += s2.split(".")[1].length
		} catch (e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
	}
	//给Number类型增加一个mul方法，调用起来更加方便。
	Number.prototype.mul = function(arg) {
		return Number(accMul(arg, this));
	};
	//加法函数，用来得到精确的加法结果
	//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
	//调用：accAdd(arg1,arg2)
	//返回值：arg1加上arg2的精确结果
	function accAdd(arg1, arg2) {
		var r1, r2, m;
		try {
			r1 = arg1.toString().split(".")[1].length
		} catch (e) {
			r1 = 0
		}
		try {
			r2 = arg2.toString().split(".")[1].length
		} catch (e) {
			r2 = 0
		}
		m = Math.pow(10, Math.max(r1, r2));
		return (Math.round(arg1 * m) + Math.round(arg2 * m)) / m;
	}
	//给Number类型增加一个add方法，调用起来更加方便。
	Number.prototype.add = function(arg) {
		return Number(accAdd(arg, this));
	};
	//减法函数
	function accSub(arg1, arg2) {
		var r1, r2, m, n;
		try {
			r1 = arg1.toString().split(".")[1].length
		} catch (e) {
			r1 = 0
		}
		try {
			r2 = arg2.toString().split(".")[1].length
		} catch (e) {
			r2 = 0
		}
		m = Math.pow(10, Math.max(r1, r2));
		//last modify by deeka
		//动态控制精度长度
		n = (r1 >= r2) ? r1 : r2;
		return ((Math.round(arg2 * m) - Math.round(arg1 * m)) / m).toFixed(n);
	}
	///给number类增加一个sub方法，调用起来更加方便
	Number.prototype.sub = function(arg) {
		return Number(accSub(arg, this));
	};


	function checkPointInPolygon1(point, polygon) {
		var p1, p2, p3, p4;
		p1 = point;
		p2 = {
			x: -100,
			y: point.y
		};
		var count = 0;
		//对每条边都和射线作对比
		for (var i = 0, iLen = polygon.length - 1; i < iLen; i++) {
			p3 = polygon[i];
			p4 = polygon[i + 1];
			if (this.crossPoint(p1, p2, p3, p4)) {
				count++;
			}
		}
		p3 = polygon[polygon.length - 1];
		p4 = polygon[0];
		if (this.crossPoint(p1, p2, p3, p4)) {
			count++;
		} //console.log(count)

		return (count % 2 == 0) ? false : true;
	}

	/**
	 * @description 射线法判断点是否在多边形内部
	 * @param {Object} p 待判断的点，格式：{ x: X 坐标, y: Y 坐标 }
	 * @param {Array} poly 多边形顶点，数组成员的格式同 p
	 * @return {String} 点 p 和多边形 poly 的几何关系
	 */
	function rayCasting(p, poly) {
		var px = p.x,
			py = p.y,
			flag = false

		for (var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
			var sx = poly[i].x,
				sy = poly[i].y,
				tx = poly[j].x,
				ty = poly[j].y

			// 点与多边形顶点重合
			if ((sx === px && sy === py) || (tx === px && ty === py)) {
				return 'on'
			}

			// 判断线段两端点是否在射线两侧
			if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
				// 线段上与射线 Y 坐标相同的点的 X 坐标
				var x = sx + (py - sy) * (tx - sx) / (ty - sy)

				// 点在多边形的边上
				if (x === px) {
					return 'on'
				}

				// 射线穿过多边形的边界
				if (x > px) {
					flag = !flag
				}
			}
		}

		// 射线穿过多边形边界的次数为奇数时点在多边形内
		return flag ? 'in' : 'out'
	}


	//调整交叉点的排列顺序，以cutStart为起点的射线段长度从小到大排序
	function adjustCrossPoint(crossPoint, cutStart) {
		var cps = [];
		var lines = [];
		for (var i = 0, iLen = crossPoint.length; i < iLen; i++) {
			var xdiff = cutStart.x - crossPoint[i].x;
			var ydiff = cutStart.y - crossPoint[i].y;
			var distance = Math.pow(xdiff * xdiff + ydiff * ydiff, 0.5);
			var rayLine = {
				start: cutStart,
				end: crossPoint[i],
				distance: distance
			};
			lines.push(rayLine);
		}
		for (var i = 0, iLen = lines.length; i < iLen; i++) {
			var curLine = lines[i];
			for (var j = i + 1, jLen = lines.length; j < jLen; j++) {
				if (curLine.distance > lines[j].distance) {
					curLine = lines[j];
					lines.splice(i, 0, curLine);
					lines.splice(j + 1, 1);
				}
			}
		}
		for (var i = 0, iLen = lines.length; i < iLen; i++) {
			var hasCrossPoint = false;
			for (var j = 0, jLen = cps.length; j < jLen; j++) {
				if (cps[j].x == lines[i].end.x && cps[j].y == lines[i].end.y) {
					hasCrossPoint = true;
					break;
				}
			}
			if (!hasCrossPoint) {
				cps.push(lines[i].end);
			}
		}
		return cps.concat();
	}

	/**
	 * 计算多边形 在切线的位置 
	 * @param {Object} polygon 多边形
	 * @param {Object} cutLine 切线
	 * @return 返回'up'在切线的上面左面，返回'down'在切线的下面右面
	 */
	function calculatePolygonPosition(polygon, cutLine) {
		//直线方程的三个值ax+by+c=0
		var a = (cutLine[1].y).sub(cutLine[0].y);
		var b = (cutLine[0].x).sub(cutLine[1].x);
		var c = ((cutLine[1].x).mul(cutLine[0].y)).sub((cutLine[0].x).mul(cutLine[1].y));
		var pos = 'down';
		if (a == 0) {
			for (var i = 0, iLen = polygon.length; i < iLen; i++) {
				if (Number((((b).mul(polygon[i].y)).add(c)).toFixed(5)) == 0) {
					continue;
				}
				if (polygon[i].y < -(c).div(b)) {
					pos = 'up';
					break;
				}
			}
			return pos;
		}
		if (b == 0) {
			for (var i = 0, iLen = polygon.length; i < iLen; i++) {
				if (Number((((a).mul(polygon[i].x)).add(c)).toFixed(5)) == 0) {
					continue;
				}
				if (polygon[i].x < -(c).div(a)) {
					pos = 'up';
					break;
				}
			}
			console.log('位置', polygon, pos);
			return pos;
		}
		//切线斜率
		var k = -(a).div(b);
		for (var i = 0, iLen = polygon.length; i < iLen; i++) {
			if (Number(((((a).mul(polygon[i].x)).add((b).mul(polygon[i].y))).add(c)).toFixed(5)) == 0) {
				continue;
			}
			if ((a > 0 && (((a).mul(polygon[i].x)).add((b).mul(polygon[i].y))).add(c) > 0) || (a < 0 && (((a).mul(polygon[i].x)).add((b).mul(polygon[i].y))).add(c) < 0)) {
				//if ((a * polygon[i].x + b * polygon[i].y + c) * b > 0) {
				pos = 'up';
				break;
			}
		}
		if (k < 0) {
			if (pos == 'up') {
				pos = 'down';
			} else {
				pos = 'up';
			}
		}
		console.log('位置', polygon, pos);
		return pos;
	}

	/**
	 * 计算切割后多边形的偏移量，用于动画展示 
	 * @param {Object} polygons
	 * @param {Object} cutLine
	 */
	function calculateOffset(polygons, cutLine) {
		//偏移值设置10个单位
		var offset = 2;
		var result = [];
		//切线平行于x轴
		if (cutLine[0].y - cutLine[1].y == 0) {
			for (var i = 0, iLen = polygons.length; i < iLen; i++) {
				if (calculatePolygonPosition(polygons[i], cutLine) == 'up') {
					offset = -Math.abs(offset);
				} else {
					offset = Math.abs(offset);
				}
				result.push({
					polygon: polygons[i],
					animate: {
						x: 0,
						y: offset
					}
				});
			}
			return result;
		}
		//切线平行于y轴
		if (cutLine[0].x - cutLine[1].x == 0) {
			for (var i = 0, iLen = polygons.length; i < iLen; i++) {
				if (calculatePolygonPosition(polygons[i], cutLine) == 'up') {
					offset = -Math.abs(offset);
				} else {
					offset = Math.abs(offset);
				}
				result.push({
					polygon: polygons[i],
					animate: {
						x: offset,
						y: 0
					}
				});
			}
			return result;
		}
		var offsetXY = undefined;
		//切线的垂线的斜率
		var k = -((cutLine[0].x - cutLine[1].x) / (cutLine[0].y - cutLine[1].y));
		//切线的垂线的斜率角度
		var angle = Math.atan(k);
		for (var i = 0, iLen = polygons.length; i < iLen; i++) {
			if (calculatePolygonPosition(polygons[i], cutLine) == 'up') {
				if (k > 0) {
					offsetXY = {
						x: -offset * Math.abs(Math.cos(angle)),
						y: -offset * Math.abs(Math.sin(angle))
					};
				} else {
					offsetXY = {
						x: offset * Math.abs(Math.cos(angle)),
						y: -offset * Math.abs(Math.sin(angle))
					};
				}

			} else {
				if (k > 0) {
					offsetXY = {
						x: offset * Math.abs(Math.cos(angle)),
						y: offset * Math.abs(Math.sin(angle))
					};
				} else {
					offsetXY = {
						x: -offset * Math.abs(Math.cos(angle)),
						y: offset * Math.abs(Math.sin(angle))
					};
				}
			}
			result.push({
				polygon: polygons[i],
				animate: offsetXY
			});
		}
		console.log('切割后的图形', result);
		return result;
	}

	function pointInLine(sp, ep, cutLine) {
		//直线方程的三个值ax+by+c=0
		var a = (ep.y).sub(sp.y);
		var b = (sp.x).sub(ep.x);
		var c = ((ep.x).mul(sp.y)).sub((sp.x).mul(ep.y));
		for (var i = 0; i < 2; i++) {
			if (Number(((((a).mul(cutLine[i].x)).add((b).mul(cutLine[i].y))).add(c)).toFixed(5)) == 0) {
				return cutLine[i];
			}
		}

		return false;
	}

	var cutting = {};

	/**
	 * 检查点point是否在多边形polygon图形之内
	 * @param {Object} point point点
	 * @param {Object} polygon 一个多边形的点组成数组
	 */
	cutting.checkPointInPolygon = function(p, poly) {
		var px = p.x,
			py = p.y,
			flag = false;

		for (var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
			var sx = poly[i].x,
				sy = poly[i].y,
				tx = poly[j].x,
				ty = poly[j].y;

			// 点与多边形顶点重合
			if ((sx === px && sy === py) || (tx === px && ty === py)) {
				return 'on';
			}
			//点是否在边上
			//直线方程的三个值ax+by+c=0
			var a = (ty).sub(sy);
			var b = (sx).sub(tx);
			var c = ((tx).mul(sy)).sub((sx).mul(ty));
			if (((a.mul(px)).add(b.mul(py))).add(c).toFixed(5) == 0) {
				return 'on';
			}

			// 判断线段两端点是否在射线两侧
			if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
				// 线段上与射线 Y 坐标相同的点的 X 坐标
				var x = sx + (py - sy) * (tx - sx) / (ty - sy)
					//var  x = (sx).add(((py.sub(sy)).mul((tx).sub(sx))).div((ty).sub(py)));

				// 点在多边形的边上
				if (x === px) {
					return 'on';
				}

				// 射线穿过多边形的边界
				if (x > px) {
					flag = !flag;
				}
			}
		}

		// 射线穿过多边形边界的次数为奇数时点在多边形内
		return flag ? 'in' : 'out';
	};

	/**
	 * 线段ab和线段cd是否相交，不相交返回false，相交返回交点坐标。
	 * 注意：如果点在直线上时需要另外判断
	 * @param {Object} a a点
	 * @param {Object} b b点
	 * @param {Object} c c点
	 * @param {Object} d d点
	 */
	cutting.crossPoint = function(a, b, c, d) {
		// 三角形abc 面积的2倍  
		var area_abc = (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
		// 三角形abd 面积的2倍  
		var area_abd = (a.x - d.x) * (b.y - d.y) - (a.y - d.y) * (b.x - d.x);
		// 面积符号相同则两点在线段同侧,不相交  
		if (area_abc * area_abd > 0) {
			return false;
		}
		// 三角形cda 面积的2倍  
		var area_cda = (c.x - a.x) * (d.y - a.y) - (c.y - a.y) * (d.x - a.x);
		// 三角形cdb 面积的2倍  
		// 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.  
		var area_cdb = area_cda + area_abc - area_abd;
		if (area_cda * area_cdb > 0) {
			return false;
		}
		//计算交点坐标  
		var t = area_cda / (area_abd - area_abc);
		var dx = t * (b.x - a.x),
			dy = t * (b.y - a.y);
		return {
			x: a.x + dx,
			y: a.y + dy
		};
	};

	/**
	 * 检测切割线是否是合法的切割
	 * @param polygon 图形的所有点坐标，一个数组[{x:0,y:0},{x:100,y:100}]
	 * @param cutLine 切割线的起始、终点坐标数组，[{x:0,y:0},{x:100,y:100}]
	 */
	cutting.checkCross = function(polygon, cutLine) {
		//首先检测切线的两个点是否在多边形之内,如果有一个点在多边形之内，就是非法切线
		if (this.checkPointInPolygon(cutLine[0], polygon) == 'in' || this.checkPointInPolygon(cutLine[1], polygon) == 'in') {
			return false;
		}
		//检测切线和多边形有一条边有交叉点
		var count = 0;
		//对每条边都和射线作对比
		for (var i = 0, iLen = polygon.length - 1; i < iLen; i++) {
			if (this.crossPoint(polygon[i], polygon[i + 1], cutLine[0], cutLine[1])) {
				count++;
			}
		}

		return true;
	};

	/**
	 * 切割图形
	 * @param polygon 图形的所有点坐标，一个数组[{x:0,y:0},{x:100,y:100}]
	 * @param cutLine 切割线的起始、终点坐标数组，[{x:0,y:0},{x:100,y:100}]
	 */
	cutting.cutGrap = function(polygon, cutLine) {
		console.log('传入图形', polygon);
		console.log('切线', cutLine);
		var result = [];
		if (!this.checkCross(polygon, cutLine)) {
			return result;
		}
		var newPolygon = polygon.concat();
		var directedLines = [];
		//最终切割的图形的集合

		//切线线交叉点
		var crossPoints = [];
		var cp = false;
		for (var i = 0, iLen = polygon.length, j = iLen - 1; i < iLen; i++, j = i - 1) {
			//切线的两点是否在线段上
			cp = pointInLine(polygon[j], polygon[i], cutLine);
			if (cp == false) {
				cp = this.crossPoint(cutLine[0], cutLine[1], polygon[j], polygon[i]);
			}
			if (cp != false) {
				//把交点放入新的多边形里
				newPolygon.splice((j + 1) % iLen + crossPoints.length, 0, cp);
				crossPoints.push(cp);
			}
		}
		//		cp = this.crossPoint(cutLine[0], cutLine[1], polygon[polygon.length - 1], polygon[0]);
		//		if (cp != false) {
		//			newPolygon.push(cp);
		//			crossPoints.push(cp);
		//		}
		var crossPoints = adjustCrossPoint(crossPoints, cutLine[0]);
		console.log('切线与图形交点', crossPoints);
		//检测是否合法切线段
		for (var i = 0, iLen = crossPoints.length - 1; i < iLen; i++) {
			var center = {
				x: (crossPoints[i].x + crossPoints[i + 1].x) / 2,
				y: (crossPoints[i].y + crossPoints[i + 1].y) / 2
			};
			if (this.checkPointInPolygon(center, polygon) == 'in') {
				directedLines.push(new Line({
					directed: false,
					startPoint: crossPoints[i],
					endPoint: crossPoints[i + 1]
				}));
			}
		}
		for (var i = 0, iLen = newPolygon.length, j = iLen - 1; i < iLen; i++, j = i - 1) {
			directedLines.push(new Line({
				directed: true,
				startPoint: newPolygon[j],
				endPoint: newPolygon[i]
			}));
		}
		//		directedLines.push(new Line({
		//			directed: true,
		//			startPoint: newPolygon[newPolygon.length - 1],
		//			endPoint: newPolygon[0]
		//		}));
		console.log('遍历的线段', directedLines);


		//切割图形之一
		var grap = [];
		for (var i = 0, iLen = crossPoints.length; i < iLen; i++) {
			var startPoint = crossPoints[i];
			var curPoint = crossPoints[i];

			while (true) {
				var lines = [];
				grap.push({
					x: curPoint.x,
					y: curPoint.y
				});
				//遍历找到所有以curPoint起点的有向线段或无向线段
				for (var j = 0, jLen = directedLines.length; j < jLen; j++) {
					var directed = directedLines[j];
					if (!directed.deleted) {
						if (directed.directed) { //有方向的
							if (directed.startPoint.x == curPoint.x && directed.startPoint.y == curPoint.y) {
								lines.push(directed);
							}
						} else {
							if ((directed.startPoint.x == curPoint.x && directed.startPoint.y == curPoint.y) || (directed.endPoint.x == curPoint.x && directed.endPoint.y == curPoint.y)) {
								lines.push(directed);
							}
						}
					}
				}

				var curLine = undefined;
				for (var j = 0, jLen = lines.length; j < jLen; j++) {
					if (lines[j].directed) {
						curLine = lines[j];
					} else { //无方向的交叉线优先级高
						var count = 0;
						//无方向的线段如果两个点都已经在grap新图形里的，不必再加入
						for (var k = 0, kLen = grap.length; k < kLen; k++) {
							if ((grap[k].x == lines[j].startPoint.x && grap[k].y == lines[j].startPoint.y) || (grap[k].x == lines[j].endPoint.x && grap[k].y == lines[j].endPoint.y)) {
								count++;
							}
						}
						if (count == 1) {
							curLine = lines[j];
							break;
						}
					}
				}

				//线段全部遍历完
				if (!curLine) {
					break;
				}

				if (curLine.directed) {
					curLine.deleted = true;
					curPoint = curLine.endPoint;
				} else {
					if (curPoint.x == curLine.startPoint.x && curPoint.y == curLine.startPoint.y) {
						curPoint = curLine.endPoint;
					} else {
						curPoint = curLine.startPoint;
					}
				}

				//
				if (curPoint.x == startPoint.x && curPoint.y == startPoint.y) {
					if (grap.length > 2) {
						result.push(grap.concat());
					}
					grap = [];
					break;
				}
			}

		}
		//FIXME 优化过滤相邻两个点是一样的点，去掉一个，这种情况是因为如果切线经过多边形顶点时
		for (var i = 0; i < result.length; i++) {
			for (var j = 0; j < result[i].length; j++) {
				for (var k = j + 1; k < result[i].length; k++) {
					if (result[i][j].x == result[i][k].x && result[i][j].y == result[i][k].y) {
						result[i].splice(k, 1);
						j = -1;
						break;
					}
				}
			}
		}
		return calculateOffset(result, cutLine);
	};

	/**
	 * 吸附功能
	 */
	cutting.adsorption = function() {

	};

	function vertical(start, end, polygon) {
		var center = {
			x: (start.point.x + end.point.x) / 2,
			y: (start.point.y + end.point.y) / 2
		};
		//切线的中心不在多边形内，非法切线
		if (cutting.checkPointInPolygon(center, polygon) != 'in') {
			return
		}
		//两个切点一样
		if (start.point.x == end.point.x && start.point.y == end.point.y) {
			return;
		}

		//判断切线与多边形相交的线段的角度是否在85-95度之间,夹角为x
		var vector1 = {
				x: start.point.x - start.line[0].x,
				y: start.point.y - start.line[0].y
			},
			vector2 = {
				x: start.point.x - end.point.x,
				y: start.point.y - end.point.y
			};
		var cosx = (vector1.x * vector2.x + vector1.y * vector2.y) / (Math.pow(Math.pow(vector1.x, 2) + Math.pow(vector1.y, 2), 0.5) * Math.pow(Math.pow(vector2.x, 2) + Math.pow(vector2.y, 2), 0.5));
		//已经垂直或不在感应范围之内,感应区域85-95度，不需要处理
		if (cosx == 0 || (cosx < 0 && cosx < Math.cos(2 * Math.PI / 360 * 95)) || (cosx > 0 && cosx > Math.cos(2 * Math.PI / 360 * 85))) {
			return;
		} else if (cosx < 0) {
			cosx = Math.abs(cosx);
			vector1 = {
				x: start.point.x - start.line[1].x,
				y: start.point.y - start.line[1].y
			}
		}

		//有在感应区处理
		var newX, newY;
		//求切线 start到end两点的距离 
		var se = Math.pow(Math.pow(vector2.x, 2) + Math.pow(vector2.y, 2), 0.5);
		var sl = se * Math.sin(Math.acos(cosx));
		var el = se * cosx;
		//线段垂直X轴
		if (start.line[0].x == start.line[1].x) {
			start.point.y = end.point.y;
			start.hasChange = true;
			return;
		} else if (start.line[0].y == start.line[1].y) { //线段垂直Y轴
			start.point.x = end.point.x;
			start.hasChange = true;
			return;
		}

		var lineSlope = (start.line[0].y - start.line[1].y) / (start.line[0].x - start.line[1].x);
		newX = start.point.x + Math.pow((sl * sl) / (1 + lineSlope * lineSlope), 0.5);
		newY = start.point.y - lineSlope(start.point.x - newX);

		//点是否在边上
		//直线方程的三个值ax+by+c=0
		var a = (end.point.y).sub(start.point.y);
		var b = (start.point.x).sub(end.point.x);
		var c = ((end.point.x).mul(start.point.y)).sub((start.point.x).mul(end.point.y));
		if (((a.mul(newX)).add(b.mul(newY))).add(c).toFixed(5) != 0) {
			newX = start.point.x - Math.pow((sl * sl) / (1 + lineSlope * lineSlope), 0.5);
			newY = start.point.y - lineSlope(start.point.x - newX);
		}

		start.point = {
			x: newX,
			y: newY
		};
		start.hasChange = true;
	}

	/**
	 * 感应功能 
	 * @param result 格式  {"points": [{x:0,y:0},{x:0,y:0},{x:0,y:0}], "intersectionPoints": [{ "line": [{x:0,y:0},{x:0,y:0}], "point": {x:0,y:0}, "hasChange": false }], "key": polygon.key}
	 */
	cutting.reaction = function(result) {
		var intersections = result.intersectionPoints;
		var polygon = result.points;
		//垂直感应
		for (var i = 0, iLen = intersections.length - 1; i < iLen; i++) {
			var start = intersections[i];
			var end = intersections[i + 1];
			vertical(start, end, polygon);
		}
		for (var i = intersections.length - 1, iLen = 1; i > iLen; i--) {
			var start = intersections[i];
			var end = intersections[i - 1];
			vertical(start, end, polygon);
		}
	};

	if (!window.cutting) {
		window.cutting = cutting;
	}
})();