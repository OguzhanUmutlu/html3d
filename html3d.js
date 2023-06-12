// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

const __eval = [];
// DO NOT SET THIS METHOD AS _eval PROPERTY OF THE LIBRARY, IT WON'T WORK SINCE ITS ASYNC
const _eval = code => new Promise(r => __eval.push([code, r]));
setInterval(() => {
    __eval.forEach(([code, r]) => {
        try {
            r({data: eval(code)});
        } catch (e) {
            r({error: e});
        }
    });
    __eval.length = 0;
});
const _eval2 = (code, ___args___) => eval(`${Object.keys(___args___).map(_ => `const ${_}=___args___[${JSON.stringify(_)}];`).join("")}${code}`);
(async () => {
    /*const URLS = {
        THREE: "https://raw.githubusercontent.com/mrdoob/three.js/dev/build/three.js",
        ConvexHull: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/math/ConvexHull.js",
        ConvexGeometry: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/geometries/ConvexGeometry.js",
        TextGeometry: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/geometries/TextGeometry.js",
        OrbitControls: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/controls/OrbitControls.js",
        ArcballControls: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/controls/ArcballControls.js",
        FlyControls: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/controls/FlyControls.js",
        FirstPersonControls: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/controls/FirstPersonControls.js",
        PointerLockControls: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/controls/PointerLockControls.js",
        TrackballControls: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/controls/TrackballControls.js",
        FontLoader: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/loaders/FontLoader.js"
    };*/
    const URLS = {
        THREE: "https://unpkg.com/html3d/libs/three.min.js",
        ConvexHull: "https://unpkg.com/html3d/libs/ConvexHull.min.js",
        ConvexGeometry: "https://unpkg.com/html3d/libs/ConvexGeometry.min.js",
        TextGeometry: "https://unpkg.com/html3d/libs/TextGeometry.min.js",
        OrbitControls: "https://unpkg.com/html3d/libs/OrbitControls.min.js",
        ArcballControls: "https://unpkg.com/html3d/libs/ArcballControls.min.js",
        FlyControls: "https://unpkg.com/html3d/libs/FlyControls.min.js",
        FirstPersonControls: "https://unpkg.com/html3d/libs/FirstPersonControls.min.js",
        PointerLockControls: "https://unpkg.com/html3d/libs/PointerLockControls.min.js",
        TrackballControls: "https://unpkg.com/html3d/libs/TrackballControls.min.js",
        FontLoader: "https://unpkg.com/html3d/libs/FontLoader.min.js"
    };
    /*** @type {Object | Window} */
    const exports = typeof module !== "undefined" && typeof require !== "undefined" ? (module.exports = {}) : window;
    let pr;
    const promise = new Promise(l => pr = l);
    exports.html3d = {
        version: "1.0.9",
        promise,
        findById: (id) => html3ds.find(r => r.element.id === id),
        warnings: exports.html3d?.warnings || {
            loadStart: false, loadEnd: true
        },
        width: exports.innerWidth || 500,
        height: exports.innerHeight || 400,
        _eval: _eval2
    };
    const elementAssignments = new Map();
    const loadPromise = new Promise(r => addEventListener("load", r));
    const allChildren = element => {
        const children = element.children;
        const childrens = [];
        for (let i = 0; i < children.length; i++) {
            childrens.push(children[i]);
            childrens.push(...allChildren(children[i]));
        }
        return childrens;
    };

    class HTML3D {
        /**
         * @param {HTMLElement} element
         * @param {Scene} scene
         * @param {PerspectiveCamera} camera
         * @param {WebGLRenderer} renderer
         */
        constructor(element, scene, camera, renderer) {
            this.element = element;
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;
            this.rendering = true;
            this._f = [];
            this._listeners = {};
            this.fonts = [];
            this.maximized = false;
            this._lastMaximize = null;
            this.orbitControls = [];
            this.arcballControls = [];
            this.flyControls = [];
            this.firstPersonControls = [];
            this.pointerLockControls = [];
            this.trackballControls = [];
        };

        render() {
            this.emit("render");
            this.emit("render.before");
            this.orbitControls.forEach(c => c.update());
            this.flyControls.forEach(c => c.update(c._clock.getDelta()));
            this.firstPersonControls.forEach(c => c.update(c._clock.getDelta()));
            this.trackballControls.forEach(c => c.update());
            this.renderer.render(this.scene, this.camera);
            this._f.push(Date.now() + 1000);
            this._f = this._f.filter(f => f > Date.now());
            this.emit("render.after");
        };

        get canvas() {
            return this.renderer.domElement;
        };

        get fps() {
            return this._f.length;
        };

        get objects() {
            return this.scene.children;
        };

        maximize() {
            if (!this.maximized) this._lastMaximize = [this.canvas.width, this.canvas.height];
            this.maximized = true;
            this.onResize();
        };

        unmaximize() {
            this.maximized = false;
            if (this._lastMaximize) {
                this.canvas.width = this._lastMaximize[0];
                this.canvas.height = this._lastMaximize[1];
            }
            this._lastMaximize = null;
            this.onResize();
        };

        onResize() {
            exports.html3d.width = exports.innerWidth || exports.html3d.width;
            exports.html3d.height = exports.innerHeight || exports.html3d.height;
            this.emit("resize");
            if (this.maximized) {
                this.canvas.width = exports.html3d.width;
                this.canvas.height = exports.html3d.height;
            }
            const {width, height} = this.canvas;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
            this.trackballControls.forEach(c => c.update());
        };

        findById(id) {
            return allChildren(this.element).find(e => e.id === id);
        };

        findByClass(className) {
            return Array.from(this.element.getElementsByClassName(className));
        };

        findByTag(tagName) {
            return Array.from(this.element.getElementsByTagName(tagName));
        };

        findByName(name) {
            return allChildren(this.element).find(e => e.name === name);
        };

        findByQuery(query) {
            return this.element.querySelector(query);
        };

        findObjectByElement(element) {
            return elementAssignments.get(element);
        };

        findObjectById(id) {
            return this.findObjectByElement(this.findById(id));
        };

        findObjectByClass(className) {
            return this.findObjectByElement(this.findByClass(className)[0]);
        };

        findObjectByTag(tagName) {
            return this.findObjectByElement(this.findByTag(tagName)[0]);
        };

        findObjectByName(name) {
            return this.findObjectByElement(this.findByName(name)[0]);
        };

        findObjectByQuery(query) {
            return this.findObjectByElement(this.findByQuery(query));
        };

        findObjectsByClass(className) {
            return this.findByClass(className).map(e => this.findObjectByElement(e));
        };

        findObjectsByTag(tagName) {
            return this.findByTag(tagName).map(e => this.findObjectByElement(e));
        };

        findObjectsByName(name) {
            return this.findByName(name).map(e => this.findObjectByElement(e));
        };

        /**
         * @param {"render" | "render.before" | "render.after" | string} event
         * @param {Function} callback
         */
        on(event, callback) {
            this._listeners[event] = [...(this._listeners[event] || []), [callback, true]];
        };

        /**
         *   @param {"render" | "render.before" | "render.after" | string} event
         * @param {Function} callback
         */
        once(event, callback) {
            this._listeners[event] = [...(this._listeners[event] || []), [callback, false]];
        };

        /**
         *  @param {"render" | "render.before" | "render.after" | string} event
         * @param {Function} callback
         */
        off(event, callback) {
            this._listeners[event] = this._listeners[event].filter(l => l[0] !== callback);
        };

        /**
         * @param {"render" | "render.before" | "render.after" | string} event
         * @param {*} args
         */
        async emit(event, ...args) {
            const listeners = this._listeners[event] || [];
            for (let i = 0; i < listeners.length; i++) {
                const listener = listeners[i];
                await listener[0](...args);
            }
            this._listeners[event] = listeners.filter(l => l[1]);
        };
    }

    /*** @type {HTML3D[]} */
    const html3ds = [];
    addEventListener("resize", () => html3ds.forEach(html3d => html3d.onResize()));
    const renderAll = () => {
        for (let i = 0; i < html3ds.length; i++) if (html3ds[i].rendering) html3ds[i].render();
        requestAnimationFrame(renderAll);
    };
    await loadPromise;
    const els = document.querySelectorAll("html3d");
    const loadScript = src => new Promise(l => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            l();
            script.remove();
        };
        document.body.appendChild(script);
    });
    const loadLibrary = async (fn, name, src) => {
        try {
            if (!(await fn())) { // noinspection ExceptionCaughtLocallyJS
                throw new Error;
            }
        } catch (e) {
            if (exports.html3d.warnings.loadStart) console.info("%cCouldn't find " + name + ", trying to load it...", "color:#ff0000");
            await loadScript(src);
            if (exports.html3d.warnings.loadEnd) console.info("%c" + name + " has been loaded.", "color:#00ff00");
        }
    };
    await loadLibrary(_ => THREE, "ThreeJS", URLS.THREE); // "/build/three.min.js"
    const {Scene, PerspectiveCamera, WebGLRenderer} = THREE;
    const sides = {front: THREE.FrontSide, back: THREE.BackSide, double: THREE.DoubleSide};
    const numberCheck = (a, b) => {
        if (typeof a === "number") return a;
        if (!a) return b;
        a = a.replaceAll("pi", Math.PI);
        try {
            // noinspection JSUnusedLocalSymbols
            const {
                sin, cos, tan, asin, acos, atan, atan2, sqrt, pow, abs, log, log2, log10, exp, min, max,
                floor, ceil, round, sign, PI, LN2, E, cosh, cbrt, imul, sinh, LN10, acosh, tanh, asinh, atanh,
                hypot, clz32, expm1, fround, log1p, LOG2E, LOG10E, random, SQRT1_2, SQRT2, trunc
            } = Math;
            if ([..."+-*/^()"].some(i => a.includes(i))) a = exports.html3d._eval(a, {
                sin, cos, tan, asin, acos, atan, atan2, sqrt, pow, abs, log, log2, log10, exp, min, max,
                floor, ceil, round, sign, PI, LN2, E, cosh, cbrt, imul, sinh, LN10, acosh, tanh, asinh, atanh,
                hypot, clz32, expm1, fround, log1p, LOG2E, LOG10E, random, SQRT1_2, SQRT2, trunc
            }).toString();
        } catch (e) {
        }
        return isNaN(a * 1) ? b : a * 1;
    }
    const boolCheck = (a, b) => a !== null ? a !== "false" : b;
    const stringCheck = (a, b, c) => !b || b.includes(a) ? a : c;
    const colorCheck = (a, b) => {
        const cssColors = {
            black: 0x000000, silver: 0xc0c0c0, white: 0xffffff, yellow: 0xffff00, blue: 0x0000ff, teal: 0x008080,
            aqua: 0x00ffff, aliceblue: 0xf0f8ff, antiquewhite: 0xfaebd7, aquamarine: 0x7fffd4, azure: 0xf0ffff,
            beige: 0xf5f5dc, bisque: 0xffe4c4, blanchedalmond: 0xffebcd, blueviolet: 0x8a2be2, brown: 0xa52a2a,
            burlywood: 0xdeb887, cadetblue: 0x5f9ea0, chartreuse: 0x7fff00, chocolate: 0xd2691e, coral: 0xff7f50,
            cornflowerblue: 0x6495ed, cornsilk: 0xfff8dc, crimson: 0xdc143c, cyan: 0x00ffff, darkblue: 0x00008b,
            darkcyan: 0x008b8b, darkgoldenrod: 0xb8860b, darkgray: 0xa9a9a9, darkgreen: 0x006400, darkgrey: 0xa9a9a9,
            darkkhaki: 0xbdb76b, darkmagenta: 0x8b008b, darkolivegreen: 0x556b2f, darkorange: 0xff8c00,
            darkorchid: 0x9932cc, darkred: 0x8b0000, darksalmon: 0xe9967a, darkseagreen: 0x8fbc8f,
            darkslateblue: 0x483d8b, darkslategray: 0x2f4f4f, darkslategrey: 0x2f4f4f, darkturquoise: 0x00ced1,
            darkviolet: 0x9400d3, deeppink: 0xff1493, deepskyblue: 0x00bfff, dimgray: 0x696969, dimgrey: 0x696969,
            dodgerblue: 0x1e90ff, firebrick: 0xb22222, floralwhite: 0xfffaf0, forestgreen: 0x228b22, fuchsia: 0xff00ff,
            gainsboro: 0xdcdcdc, ghostwhite: 0xf8f8ff, gold: 0xffd700, goldenrod: 0xdaa520, gray: 0x808080,
            green: 0x008000, greenyellow: 0xadff2f, grey: 0x808080, honeydew: 0xf0fff0, hotpink: 0xff69b4,
            indianred: 0xcd5c5c, indigo: 0x4b0082, ivory: 0xfffff0, khaki: 0xf0e68c, lavender: 0xe6e6fa,
            lavenderblush: 0xfff0f5, lawngreen: 0x7cfc00, lemonchiffon: 0xfffacd, lightblue: 0xadd8e6,
            lightcoral: 0xf08080, lightcyan: 0xe0ffff, lightgoldenrodyellow: 0xfafad2, lightgray: 0xd3d3d3,
            lightgreen: 0x90ee90, lightgrey: 0xd3d3d3, lightpink: 0xffb6c1, lightsalmon: 0xffa07a,
            lightseagreen: 0x20b2aa, lightskyblue: 0x87cefa, lightslategray: 0x778899, lightslategrey: 0x778899,
            lightsteelblue: 0xb0c4de, lightyellow: 0xffffe0, lime: 0x00ff00, limegreen: 0x32cd32, linen: 0xfaf0e6,
            magenta: 0xff00ff, maroon: 0x800000, mediumaquamarine: 0x66cdaa, mediumblue: 0x0000cd,
            mediumorchid: 0xba55d3, mediumpurple: 0x9370db, mediumseagreen: 0x3cb371, mediumslateblue: 0x7b68ee,
            mediumspringgreen: 0x00fa9a, mediumturquoise: 0x48d1cc, mediumvioletred: 0xc71585, midnightblue: 0x191970,
            mintcream: 0xf5fffa, mistyrose: 0xffe4e1, moccasin: 0xffe4b5, navajowhite: 0xffdead, navy: 0x000080,
            oldlace: 0xfdf5e6, olive: 0x808000, olivedrab: 0x6b8e23, orange: 0xffa500, orangered: 0xff4500,
            orchid: 0xda70d6, palegoldenrod: 0xeee8aa, palegreen: 0x98fb98, paleturquoise: 0xafeeee,
            palevioletred: 0xdb7093, papayawhip: 0xffefd5, peachpuff: 0xffdab9, peru: 0xcd853f, pink: 0xffc0cb,
            plum: 0xdda0dd, powderblue: 0xb0e0e6, purple: 0x800080, red: 0xff0000, rosybrown: 0xbc8f8f,
            royalblue: 0x4169e1, saddlebrown: 0x8b4513, salmon: 0xfa8072, sandybrown: 0xf4a460, seagreen: 0x2e8b57,
            seashell: 0xfff5ee, sienna: 0xa0522d, skyblue: 0x87ceeb, slateblue: 0x6a5acd, slategray: 0x708090,
            slategrey: 0x708090, snow: 0xfffafa, springgreen: 0x00ff7f, steelblue: 0x4682b4, tan: 0xd2b48c,
            thistle: 0xd8bfd8, tomato: 0xff6347, turquoise: 0x40e0d0, violet: 0xee82ee, wheat: 0xf5deb3,
            whitesmoke: 0xf5f5f5, yellowgreen: 0x9acd32,
        };
        if (cssColors[a]) return cssColors[a];
        let res = numberCheck(a, b);
        if (/^#[0-9a-f]{6}$/i.test(a)) res = numberCheck(a.replace("#", "0x"), b);
        if (/^#[0-9a-f]{3}$/i.test(a)) res = numberCheck("0x" + a.replace("#", "") + a.replace("#", ""), b);
        if (/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/.test(a)) res = numberCheck("0x" + a.substring(4).split("").reverse().slice(1).reverse().join("").split(",").map(i => (i.trimStart().trimEnd() * 1 || 0).toString(16)).join(""), b);
        if (isNaN(res * 1)) return b;
        return res;
    };
    const vectorCheck = (a, b) => {
        if (a.some(i => !numberCheck(i))) return b;
        a = a.map(numberCheck);
        if (a.length === 2) return new THREE.Vector2(...a);
        if (a.length === 3) return new THREE.Vector3(...a);
        if (a.length === 4) return new THREE.Vector4(...a);
        return b;
    };
    const jsonCheck = (a, b) => {
        try {
            return JSON.parse(a);
        } catch (e) {
            return b;
        }
    };
    const codeCheck = (a, b) => {
        try {
            return exports.html3d._eval(a);
        } catch (e) {
            return b;
        }
    };
    const sideCheck = (a, b) => sides[a] || b;
    const processShape = element => {
        const shape = new THREE.Shape();
        const children = Array.from(element.children);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.tagName === "PATH") {
                const path = child.getAttribute("d").toString();
                const segments = path.split(" ");
                let curSymbol = null;
                const processCurSymbol = () => {
                    if (curSymbol) {
                        switch (curSymbol) {
                            case "M":
                            case "MOVE":
                            case "MV":
                                shape.moveTo(...w);
                                break;
                            case "L":
                            case "LINE":
                            case "LN":
                                shape.lineTo(...w);
                                break;
                            case "Q":
                            case "QUADRATIC":
                            case "QD":
                            case "QC":
                                shape.quadraticCurveTo(...w);
                                break;
                            case "C":
                            case "B":
                            case "BC":
                            case "BEZIER":
                            case "BZ":
                                shape.bezierCurveTo(...w);
                                break;
                            case "Z":
                            case "CLOSE":
                            case "CL":
                                shape.closePath();
                                break;
                        }
                        w.length = 0;
                    }
                };
                const w = [];
                for (let j = 0; j < segments.length; j++) {
                    const segment = segments[j];
                    if ([..."MLQCZB", "MOVE", "MV", "LINE", "LN", "QUADRATIC", "QD", "QC", "BEZIER", "BZ", "CLOSE", "CL"].includes(segment[0])) {
                        processCurSymbol();
                        curSymbol = segment[0];
                    } else if (segment) w.push(numberCheck(segment, 0));
                }
                processCurSymbol();
            }
        }
        return shape;
    };
    const processCurve = element => {
        return new (class extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const attr = r => element ? element.getAttribute(r) : null;
                const tx = t * 3 - 1.5;
                const ty = Math.sin(2 * Math.PI * t);
                return optionalTarget.set(numberCheck(attr("tx"), tx), numberCheck(attr("ty"), ty), numberCheck(attr("tz"), 0)).multiplyScalar(numberCheck(attr("scalar"), 5));
            };
        })();
    };
    const processBehavior = (obj, behavior, h3d) => {
        if (!behavior) return;
        let actions = [];
        const variables = {
            x: "object.position.x",
            y: "object.position.y",
            z: "object.position.z",
            rx: "object.rotation.x",
            ry: "object.rotation.y",
            rz: "object.rotation.z",
            sx: "object.scale.x",
            sy: "object.scale.y",
            sz: "object.scale.z",
        };
        const lines = behavior.split(";");
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            if (!/^\s*\w+\s*((\*\*)|\||&|[+\-*/])?\s*=\s*.+$/.test(line)) {
                console.error(`[BEHAVIOR] Invalid behavior at line ${i + 1}: ${line}`); // todo: perhaps, don't use regex
            } else {
                const equal = line.indexOf("=");
                const varName = line.substring(0, equal - 1).trim();
                const action = line.substring(varName.length, equal + 1).trim();
                const varValue = line.substring(equal + 1).trim();
                if (!variables[varName]) return console.error(`[BEHAVIOR] Couldn't find the variable named ${varName} at line ${i + 1}: ${line}\nNote: Variables: ${Object.keys(variables).join()}`);
                actions.push([varName, action, varValue, i, line]);
            }
        }
        h3d.on("render.before", obj._behaviorFunc = () => {
            actions.forEach(action => {
                try {
                    // noinspection JSUnusedLocalSymbols
                    const {
                        sin, cos, tan, asin, acos, atan, atan2, sqrt, pow, abs, log, log2, log10, exp, min, max,
                        floor, ceil, round, sign, LN2, E, cosh, cbrt, imul, sinh, LN10, acosh, tanh, asinh, atanh,
                        hypot, clz32, expm1, fround, log1p, LOG2E, LOG10E, random, SQRT1_2, SQRT2, trunc, PI: pi
                    } = Math;
                    exports.html3d._eval(variables[action[0]] + action[1] + action[2], {object: obj});
                } catch (e) {
                    actions = actions.filter(a => a !== action);
                    return console.error(`[BEHAVIOR] Couldn't parse the value at line ${action[3] + 1}: ${action[2]}`);
                }
            });
        });
    };
    const processAttributes = (obj, attr, list) => {
        for (let i = 0; i < list.length; i++) {
            const at = list[i];
            if (!at[2]) at[2] = at[1].split("-").map((i, j) => j === 0 ? i : i.charAt(0).toUpperCase() + i.substring(1)).join("");
            const res = at[0](attr(at[1]), ...at.slice(3));
            if (res) obj[at[2]] = res;
        }
    };
    const applyAttributes = {
        Object3D: (obj, attr) => {
            // TODO: animations, children, customDepthMaterial, customDistanceMaterial, layers, matrix
            // TODO: matrixWorld, modelViewMatrix, normalMatrix, onAfterRender, onBeforeRender,
            obj.position.x = numberCheck(attr("x"), 0);
            obj.position.y = numberCheck(attr("y"), 0);
            obj.position.z = numberCheck(attr("z"), 0);
            obj.rotation.x = numberCheck(attr("rotation-x"), 0);
            obj.rotation.y = numberCheck(attr("rotation-y"), 0);
            obj.rotation.z = numberCheck(attr("rotation-z"), 0);
            obj.quaternion.x = numberCheck(attr("quaternion-x"), 0);
            obj.quaternion.y = numberCheck(attr("quaternion-y"), 0);
            obj.quaternion.z = numberCheck(attr("quaternion-z"), 0);
            obj.scale.x = numberCheck(attr("scale-x"), 1);
            obj.scale.y = numberCheck(attr("scale-y"), 1);
            obj.scale.z = numberCheck(attr("scale-z"), 1);
            if (vectorCheck([attr("look-at-x"), attr("look-at-y"), attr("look-at-z")])) obj.lookAt(vectorCheck([attr("look-at-x"), attr("look-at-y"), attr("look-at-z")]));
            processAttributes(obj, attr, [
                [boolCheck, "cast-shadow"],
                [boolCheck, "visible"],
                [boolCheck, "frustum-culled"],
                [boolCheck, "matrix-auto-update"],
                [boolCheck, "matrix-world-needs-update"],
                [boolCheck, "receive-shadow"],
                [numberCheck, "render-order"]
            ]);
        },
        Light: (obj, attr) => {
            applyAttributes.Object3D(obj, attr);
            processAttributes(obj, attr, [
                [colorCheck, "color"],
                [numberCheck, "intensity"]
            ]);
        },
        BufferGeometry: (obj, attr) => {
            // TODO: maybe more attributes?
            processAttributes(obj, attr, [
                [boolCheck, "morph-attributes"]
            ]);
        },
        LatheGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        BoxGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        CapsuleGeometry: (obj, attr) => {
            applyAttributes.LatheGeometry(obj, attr);
        },
        CircleGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        ConeGeometry: (obj, attr) => {
            applyAttributes.CylinderGeometry(obj, attr);
        },
        CylinderGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        PolyhedronGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        DodecahedronGeometry: (obj, attr) => {
            applyAttributes.PolyhedronGeometry(obj, attr);
        },
        IcosahedronGeometry: (obj, attr) => {
            applyAttributes.PolyhedronGeometry(obj, attr);
        },
        OctahedronGeometry: (obj, attr) => {
            applyAttributes.PolyhedronGeometry(obj, attr);
        },
        PlaneGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        RingGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        ShapeGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        SphereGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        TetrahedronGeometry: (obj, attr) => {
            applyAttributes.PolyhedronGeometry(obj, attr);
        },
        TorusGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        TorusKnotGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        TubeGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        ConvexGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        ExtrudeGeometry: (obj, attr) => {
            applyAttributes.BufferGeometry(obj, attr);
        },
        TextGeometry: (obj, attr) => {
            applyAttributes.ExtrudeGeometry(obj, attr);
        },
        Material: (obj, attr) => {
            // TODO: blending, clippingPlanes
            processAttributes(obj, attr, [
                [numberCheck, "alpha-test"],
                [numberCheck, "alpha-to-coverage"],
                [numberCheck, "blend-dst"],
                [numberCheck, "blend-dst-alpha"],
                [numberCheck, "blend-equation"],
                [numberCheck, "blend-equation-alpha"],
                [numberCheck, "blend-src"],
                [numberCheck, "blend-src-alpha"],
                [boolCheck, "clip-intersection"],
                [boolCheck, "clip-shadows"],
                [boolCheck, "color-write"],
                [jsonCheck, "defines"],
                [numberCheck, "depth-func"],
                [boolCheck, "depth-test"],
                [boolCheck, "depth-write"],
                [boolCheck, "stencil-write"],
                [numberCheck, "stencil-write-mask"],
                [numberCheck, "stencil-func"],
                [numberCheck, "stencil-ref"],
                [numberCheck, "stencil-func-mask"],
                [numberCheck, "stencil-fail"],
                [numberCheck, "stencil-z-fail"],
                [stringCheck, "name"],
                [numberCheck, "opacity"],
                [boolCheck, "polygon-offset"],
                [numberCheck, "polygon-offset-factor"],
                [numberCheck, "polygon-offset-units"],
                [stringCheck, "precision", null, ["highp", "mediump", "lowp"]],
                [boolCheck, "premultiplied-alpha"],
                [boolCheck, "dithering"],
                [sideCheck, "shadow-side"],
                [sideCheck, "side"],
                [boolCheck, "tone-mapped"],
                [boolCheck, "transparent"],
                [boolCheck, "visible"],
            ]);
        },
        MeshBasicMaterial: (obj, attr) => {
            // TODO: alphaMap, aoMap, aoMapIntensity, envMap, lightMap, map, specularMap
            applyAttributes.Material(obj, attr);
            processAttributes(obj, attr, [
                [colorCheck, "color"],
                [numberCheck, "combine"],
                [boolCheck, "fog"],
                [numberCheck, "reflectivity"],
                [numberCheck, "refraction-ratio"],
                [boolCheck, "wireframe"],
                [stringCheck, "wireframe-line-cap", "wireframeLinecap", ["round", "butt", "square"]],
                [stringCheck, "wireframe-line-join", "wireframeLinejoin", ["round", "bevel", "miter"]],
                [numberCheck, "wireframe-line-width", "wireframeLinewidth"]
            ]);
        },
        MeshPhongMaterial: (obj, attr) => {
            // TODO: alphaMap, aoMap, bumpMap, displacementMap, emissiveMap, envMap, lightMap, map, normalMap
            // TODO: specularMap
            applyAttributes.Material(obj, attr);
            if (vectorCheck([attr("normal-scale-x"), attr("normal-scale-y")])) obj.normalScale = vectorCheck([attr("normal-scale-x"), attr("normal-scale-y")]);
            processAttributes(obj, attr, [
                [numberCheck, "ao-map-intensity"],
                [numberCheck, "bump-scale"],
                [colorCheck, "color"],
                [numberCheck, "combine"],
                [numberCheck, "displacement-scale"],
                [numberCheck, "displacement-bias"],
                [colorCheck, "emissive"],
                [numberCheck, "emissive-intensity"],
                [numberCheck, "flat-shading"],
                [boolCheck, "fog"],
                [numberCheck, "light-map-intensity"],
                [numberCheck, "normal-map-type"],
                [numberCheck, "reflectivity"],
                [numberCheck, "refraction-ratio"],
                [numberCheck, "shininess"],
                [colorCheck, "specular"],
                [boolCheck, "wireframe"],
                [stringCheck, "wireframe-line-cap", "wireframeLinecap"],
                [stringCheck, "wireframe-line-join", "wireframeLinejoin"],
                [numberCheck, "wireframe-line-width", "wireframeLinewidth"]
            ]);
        },
        LineBasicMaterial: (obj, attr) => {
            applyAttributes.Material(obj, attr);
            processAttributes(obj, attr, [
                [colorCheck, "color"],
                [boolCheck, "fog"],
                [numberCheck, "line-width", "linewidth"],
                [stringCheck, "line-cap", "linecap"],
                [stringCheck, "line-join", "linejoin"]
            ]);
        },
        LineDashedMaterial: (obj, attr) => {
            applyAttributes.LineBasicMaterial(obj, attr);
            processAttributes(obj, attr, [
                [numberCheck, "dash-size"],
                [numberCheck, "gap-size"],
                [numberCheck, "scale"]
            ]);
        },
        MeshDepthMaterial: (obj, attr) => {
            // TODO: alphaMap, depthPacking, displacementMap, map
            processAttributes(obj, attr, [
                [numberCheck, "displacement-scale"],
                [numberCheck, "displacement-bias"],
                [boolCheck, "fog"],
                [boolCheck, "wireframe"],
                [numberCheck, "wireframe-line-width", "wireframeLinewidth"]
            ]);
        },
        PointLight: (obj, attr) => {
            applyAttributes.Light(obj, attr);
            processAttributes(obj, attr, [
                [numberCheck, "decay"],
                [numberCheck, "distance"],
                [numberCheck, "power"]
            ]);
        },
        AmbientLight: (obj, attr) => {
            applyAttributes.Light(obj, attr);
        },
        AmbientLightProbe: (obj, attr) => {
            applyAttributes.Light(obj, attr);
        },
        DirectionalLight: (obj, attr) => {
            applyAttributes.Light(obj, attr);
            processAttributes(obj, attr, [
                [boolCheck, "cast-shadow"]
            ]);
        },
        HemisphereLight: (obj, attr) => {
            applyAttributes.Light(obj, attr);
            processAttributes(obj, attr, [
                [colorCheck, "ground-color"]
            ]);
        },
        RectAreaLight: (obj, attr) => {
            applyAttributes.Light(obj, attr);
            processAttributes(obj, attr, [
                [numberCheck, "height"],
                [numberCheck, "width"],
                [numberCheck, "power"]
            ]);
        },
        SpotLight: (obj, attr) => {
            applyAttributes.Light(obj, attr);
            processAttributes(obj, attr, [
                [numberCheck, "angle"],
                [boolCheck, "cast-shadow"],
                [numberCheck, "decay"],
                [numberCheck, "distance"],
                [numberCheck, "penumbra"],
                [numberCheck, "power"]
            ]);
        },
        OrbitControls: (obj, attr) => {
            processAttributes(obj, attr, [
                [boolCheck, "auto-rotate"],
                [numberCheck, "auto-rotate-speed"],
                [numberCheck, "damping-factor"],
                [boolCheck, "enabled"],
                [boolCheck, "enable-damping"],
                [boolCheck, "enable-pan"],
                [boolCheck, "enable-rotate"],
                [boolCheck, "enable-zoom"],
                [numberCheck, "key-pan-speed"],
                [numberCheck, "max-azimuth-angle"],
                [numberCheck, "max-distance"],
                [numberCheck, "max-polar-angle"],
                [numberCheck, "max-zoom"],
                [numberCheck, "min-azimuth-angle"],
                [numberCheck, "min-distance"],
                [numberCheck, "min-polar-angle"],
                [numberCheck, "min-zoom"],
                [numberCheck, "pan-speed"],
                [numberCheck, "rotate-speed"],
                [boolCheck, "screen-space-panning"]
            ]);
            ["left", "right", "up", "bottom"].forEach(i => {
                if (attr("key-" + i)) obj.keys[i.toUpperCase()] = attr("key-" + i.toUpperCase());
            });
            ["left", "right", "middle"].forEach(i => {
                if (mouseActions[attr("mouse-" + i)]) obj.mouseButtons[i.toUpperCase()] = mouseActions[attr("mouse-" + i)];
            });
            ["one", "two"].forEach(i => {
                if (mouseActions[attr("touch-" + i)]) obj.touches[i.toUpperCase()] = mouseActions[attr("touch-" + i)];
            });
        },
        ArcballControls: (obj, attr) => {
            processAttributes(obj, attr, [
                [boolCheck, "adjust-near-far"],
                [boolCheck, "cursor-zoom"],
                [numberCheck, "damping-factor"],
                [boolCheck, "enabled"],
                [boolCheck, "enable-animations"],
                [boolCheck, "enable-grid"],
                [boolCheck, "enable-pan"],
                [boolCheck, "enable-rotate"],
                [boolCheck, "enable-zoom"],
                [numberCheck, "focus-animation-time"],
                [numberCheck, "max-distance"],
                [numberCheck, "max-zoom"],
                [numberCheck, "min-distance"],
                [numberCheck, "min-zoom"],
                [numberCheck, "scale-factor"],
                [numberCheck, "w-max"],
                [numberCheck, "radius-factor"]
            ]);
        },
        FlyControls: (obj, attr) => {
            processAttributes(obj, attr, [
                [boolCheck, "auto-forward"],
                [boolCheck, "drag-to-look"],
                [numberCheck, "movement-speed"],
                [numberCheck, "roll-speed"]
            ]);
        },
        FirstPersonControls: (obj, attr) => {
            processAttributes(obj, attr, [
                [boolCheck, "active-look"],
                [boolCheck, "auto-forward"],
                [boolCheck, "constrain-vertical"],
                [boolCheck, "enabled"],
                [numberCheck, "height-coef"],
                [numberCheck, "height-max"],
                [numberCheck, "height-min"],
                [numberCheck, "height-speed"],
                [boolCheck, "look-vertical"],
                [numberCheck, "look-speed"],
                [boolCheck, "mouse-drag-on"],
                [numberCheck, "movement-speed"],
                [numberCheck, "vertical-max"],
                [numberCheck, "vertical-min"]
            ]);
        },
        PointerLockControls: (obj, attr) => {
            processAttributes(obj, attr, [
                [numberCheck, "max-polar-angle"],
                [numberCheck, "min-polar-angle"],
                [numberCheck, "pointer-speed"]
            ]);
        },
        TrackballControls: (obj, attr) => {
            processAttributes(obj, attr, [
                [numberCheck, "dynamic-damping-factor"],
                [boolCheck, "enabled"],
                [numberCheck, "max-distance"],
                [numberCheck, "min-distance"],
                [boolCheck, "no-pan"],
                [boolCheck, "no-zoom"],
                [numberCheck, "pan-speed"],
                [numberCheck, "rotate-speed"],
                [boolCheck, "static-moving"],
                [numberCheck, "zoom-speed"]
            ]);
            obj.keys = [
                stringCheck(attr("key-orbit"), "KeyA"),
                stringCheck(attr("key-zoom"), "KeyS"),
                stringCheck(attr("key-pan"), "KeyD")
            ];
            ["left", "right", "middle"].forEach(i => {
                if (mouseActions[attr("mouse-" + i)]) obj.mouseButtons[i.toUpperCase()] = mouseActions[attr("mouse-" + i)];
            });
        },
        Group: (obj, attr) => {
            applyAttributes.Object3D(obj, attr);
        },
    };
    const tagNameToName = tagName => tagName.split("-").map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join("");
    const build = {
        BoxGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.BoxGeometry(numberCheck(attr("width"), 1), numberCheck(attr("height"), 1), numberCheck(attr("depth"), 1), numberCheck(attr("widthSegments"), 1), numberCheck(attr("heightSegments"), 1), numberCheck(attr("depthSegments"), 1));
            applyAttributes.BoxGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        CapsuleGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.CapsuleGeometry(numberCheck(attr("radius"), 1), numberCheck(attr("length"), 1), numberCheck(attr("cap-subdivisions"), 8), numberCheck(attr("radial-segments"), 16));
            applyAttributes.CapsuleGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        CircleGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.CircleGeometry(numberCheck(attr("radius"), 1), numberCheck(attr("segments"), 8), numberCheck(attr("theta-start"), 0), numberCheck(attr("theta-length"), 2 * Math.PI));
            applyAttributes.CircleGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        ConeGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.ConeGeometry(numberCheck(attr("radius"), 1), numberCheck(attr("height"), 1), numberCheck(attr("radial-segments"), 8), numberCheck(attr("height-segments"), 1), boolCheck(attr("open-ended"), false), numberCheck(attr("theta-start"), 0), numberCheck(attr("theta-length"), 2 * Math.PI));
            applyAttributes.ConeGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        CylinderGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.CylinderGeometry(numberCheck(attr("radius-top"), 1), numberCheck(attr("radius-bottom"), 1), numberCheck(attr("height"), 1), numberCheck(attr("radial-segments"), 8), numberCheck(attr("height-segments"), 1), boolCheck(attr("open-ended"), false), numberCheck(attr("theta-start"), 0), numberCheck(attr("theta-length"), 2 * Math.PI));
            applyAttributes.CylinderGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        DodecahedronGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.DodecahedronGeometry(numberCheck(attr("radius"), 1), numberCheck(attr("detail"), 0));
            applyAttributes.DodecahedronGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        IcosahedronGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.IcosahedronGeometry(numberCheck(attr("radius"), 1), numberCheck(attr("detail"), 0));
            applyAttributes.IcosahedronGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        LatheGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            // BROKEN
            const points = Array.from(element.children).filter(i => i.tagName === "POINT").map(i => new THREE.Vector2(numberCheck(i.getAttribute("x"), 0), numberCheck(i.getAttribute("y"), 0)));
            const geometry = new THREE.LatheGeometry(points, numberCheck(attr("segments"), 12), numberCheck(attr("phiStart"), 0), numberCheck(attr("phiLength"), 2 * Math.PI));
            applyAttributes.LatheGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        OctahedronGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.OctahedronGeometry(numberCheck(attr("radius"), 1), numberCheck(attr("detail"), 0));
            applyAttributes.OctahedronGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        PlaneGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.PlaneGeometry(numberCheck(attr("width"), 1), numberCheck(attr("height"), 1), numberCheck(attr("width-segments"), 1), numberCheck(attr("height-segments"), 1));
            applyAttributes.PlaneGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        RingGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.RingGeometry(numberCheck(attr("inner-radius"), 0.5), numberCheck(attr("outer-radius"), 1), numberCheck(attr("theta-segments"), 8), numberCheck(attr("phi-segments"), 1), numberCheck(attr("theta-start"), 0), numberCheck(attr("theta-length"), 2 * Math.PI));
            applyAttributes.RingGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        ShapeGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const shape = processShape(Array.from(element.children).filter(i => i.tagName === "SHAPE").reverse()[0]);
            if (!shape) return console.error("ShapeGeometry: No <shape> found");
            const geometry = new THREE.ShapeGeometry(shape, numberCheck(attr("curve-segments"), 12));
            applyAttributes.ShapeGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        SphereGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.SphereGeometry(numberCheck(attr("radius"), 1), numberCheck(attr("width-segments"), 32), numberCheck(attr("height-segments"), 16), numberCheck(attr("phi-start"), 0), numberCheck(attr("phi-length"), Math.PI * 2), numberCheck(attr("theta-start"), 0), numberCheck(attr("theta-length"), 2 * Math.PI));
            applyAttributes.SphereGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        TetrahedronGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.TetrahedronGeometry(numberCheck(attr("radius"), 1), numberCheck(attr("detail"), 0));
            applyAttributes.TetrahedronGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        //amougs
        TorusGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.TorusGeometry(numberCheck(attr("radius"), 1), numberCheck(attr("tube"), 0.4), numberCheck(attr("radial-segments"), 8), numberCheck(attr("tubular-segments"), 6), numberCheck(attr("arc"), Math.PI * 2));
            applyAttributes.TorusGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        TorusKnotGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const geometry = new THREE.TorusKnotGeometry(numberCheck(attr("radius"), 1), numberCheck(attr("tube"), 0.4), numberCheck(attr("tubular-segments"), 64), numberCheck(attr("radial-segments"), 8), numberCheck(attr("p"), 2), numberCheck(attr("q"), 3));
            applyAttributes.TorusKnotGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        TubeGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const curve = processCurve(Array.from(element.children).filter(i => i.tagName === "CURVE").reverse()[0]);
            if (!curve) return console.error("TubeGeometry: No <curve> found");
            const geometry = new THREE.TubeGeometry(curve, numberCheck(attr("tubular-segments"), 64), numberCheck(attr("radius"), 1), numberCheck(attr("radial-segments"), 8), boolCheck(attr("closed"), false));
            applyAttributes.TubeGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        ConvexGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            await loadLibrary(_ => THREE.ConvexHull, "ConvexHull", URLS.ConvexHull); // "/examples/js/math/ConvexHull.js"
            await loadLibrary(_ => THREE.ConvexGeometry, "ConvexGeometry", URLS.ConvexGeometry); // "/examples/js/geometries/ConvexGeometry.js"
            const points1 = Array.from(element.children).filter(i => i.tagName === "POINT").map(i => new THREE.Vector3(numberCheck(i.getAttribute("x"), 0), numberCheck(i.getAttribute("y"), 0), numberCheck(i.getAttribute("z"), 0)));
            const geometry = new THREE.ConvexGeometry(points1);
            applyAttributes.ConvexGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        TextGeometry: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            await loadLibrary(_ => !THREE.TextGeometry.toString().includes("console.error"), "TextGeometry", URLS.TextGeometry); // "/examples/js/geometries/TextGeometry.js"
            const font = h3d.fonts.find(i => [i.name, i.src].includes(stringCheck(attr("font")))) || h3d.fonts.find(i => i.familyName === stringCheck(attr("font")));
            if (!font) return console.warn("Font not found: " + stringCheck(attr("font")));
            element.style.display = "none";
            const geometry = new THREE.TextGeometry(stringCheck(element.innerText), {
                font: font.font,
                size: numberCheck(attr("size"), 100),
                height: numberCheck(attr("height"), 50),
                curveSegments: numberCheck(attr("curve-segments"), 12),
                bevelEnabled: boolCheck(attr("bevel"), false),
                bevelThickness: numberCheck(attr("bevel-thickness"), 10),
                bevelSize: numberCheck(attr("bevel-size"), 8),
                bevelOffset: numberCheck(attr("bevel-offset"), 0),
                bevelSegments: numberCheck(attr("bevel-segments"), 3)
            });
            applyAttributes.TextGeometry(geometry, attr);
            if (assign) elementAssignments.set(element, geometry);
            return geometry;
        },
        MeshBasicMaterial: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const obj = {};
            applyAttributes.MeshBasicMaterial(obj, attr);
            const material = new THREE.MeshBasicMaterial(obj);
            if (assign) elementAssignments.set(element, material);
            return material;
        },
        MeshPhongMaterial: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const obj = {};
            applyAttributes.MeshPhongMaterial(obj, attr);
            const material = new THREE.MeshPhongMaterial(obj);
            if (assign) elementAssignments.set(element, material);
            return material;
        },
        LineBasicMaterial: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const obj = {};
            applyAttributes.LineBasicMaterial(obj, attr);
            const material = new THREE.LineBasicMaterial(obj);
            if (assign) elementAssignments.set(element, material);
            return material;
        },
        LineDashedMaterial: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const obj = {};
            applyAttributes.LineDashedMaterial(obj, attr);
            const material = new THREE.LineDashedMaterial(obj);
            if (assign) elementAssignments.set(element, material);
            return material;
        },
        MeshDepthMaterial: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const obj = {};
            applyAttributes.MeshDepthMaterial(obj, attr);
            const material = new THREE.MeshDepthMaterial(obj);
            if (assign) elementAssignments.set(element, material);
            return material;
        },
        Mesh: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const findM = end => {
                const g = Array.from(element.children).filter(i => i.tagName.endsWith(end) && build[tagNameToName(i.tagName)]).reverse()[0];
                if (g) return build[tagNameToName(g.tagName)](h3d, g, s => g.getAttribute(s));
            }
            let geometry = attr("geometry") ? h3d.findObjectByQuery(attr("geometry")) : await findM("-GEOMETRY");
            if (!(geometry instanceof THREE.BufferGeometry)) geometry = new THREE.BoxGeometry();
            let material = attr("material") ? h3d.findObjectByQuery(attr("material")) : await findM("-MATERIAL");
            if (!(material instanceof THREE.Material)) material = new THREE.MeshBasicMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            processBehavior(mesh, attr("behavior"), h3d);
            applyAttributes.Object3D(mesh, attr);
            if (boolCheck(attr("register"), true)) scene.add(mesh);
            if (assign) elementAssignments.set(element, mesh);
            return mesh;
        },
        PointLight: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const light = new THREE.PointLight();
            processBehavior(light, attr("behavior"), h3d);
            applyAttributes.PointLight(light, attr);
            if (boolCheck(attr("register"), true)) scene.add(light);
            if (assign) elementAssignments.set(element, light);
            return light;
        },
        AmbientLight: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const light = new THREE.AmbientLight();
            processBehavior(light, attr("behavior"), h3d);
            applyAttributes.AmbientLight(light, attr);
            if (boolCheck(attr("register"), true)) scene.add(light);
            if (assign) elementAssignments.set(element, light);
            return light;
        },
        AmbientLightProbe: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const light = new THREE.AmbientLightProbe();
            processBehavior(light, attr("behavior"), h3d);
            applyAttributes.AmbientLightProbe(light, attr);
            if (boolCheck(attr("register"), true)) scene.add(light);
            if (assign) elementAssignments.set(element, light);
            return light;
        },
        DirectionalLight: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const light = new THREE.DirectionalLight();
            processBehavior(light, attr("behavior"), h3d);
            applyAttributes.DirectionalLight(light, attr);
            if (boolCheck(attr("register"), true)) scene.add(light);
            if (assign) elementAssignments.set(element, light);
            return light;
        },
        HemisphereLight: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const light = new THREE.HemisphereLight();
            processBehavior(light, attr("behavior"), h3d);
            applyAttributes.HemisphereLight(light, attr);
            if (boolCheck(attr("register"), true)) scene.add(light);
            if (assign) elementAssignments.set(element, light);
            return light;
        },
        RectAreaLight: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const light = new THREE.RectAreaLight();
            processBehavior(light, attr("behavior"), h3d);
            applyAttributes.RectAreaLight(light, attr);
            if (boolCheck(attr("register"), true)) scene.add(light);
            if (assign) elementAssignments.set(element, light);
            return light;
        },
        SpotLight: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const light = new THREE.SpotLight();
            processBehavior(light, attr("behavior"), h3d);
            applyAttributes.SpotLight(light, attr);
            if (boolCheck(attr("register"), true)) scene.add(light);
            if (assign) elementAssignments.set(element, light);
            return light;
        },
        OrbitControls: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            await loadLibrary(_ => THREE.OrbitControls, "OrbitControls", URLS.OrbitControls); // "/examples/js/controls/OrbitControls.js"
            const orbitControls = new THREE.OrbitControls(h3d.camera, h3d.renderer.domElement);
            applyAttributes.OrbitControls(orbitControls, attr);
            h3d.orbitControls.push(orbitControls);
            if (assign) elementAssignments.set(element, orbitControls);
            return orbitControls;
        },
        ArcballControls: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            await loadLibrary(_ => THREE.ArcballControls, "ArcballControls", URLS.ArcballControls); // "/examples/js/controls/ArcballControls.js"
            const arcballControls = new THREE.ArcballControls(h3d.camera, h3d.renderer.domElement);
            applyAttributes.ArcballControls(arcballControls, attr);
            h3d.arcballControls.push(arcballControls);
            if (assign) elementAssignments.set(element, arcballControls);
            return arcballControls;
        },
        FlyControls: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            await loadLibrary(_ => THREE.FlyControls, "FlyControls", URLS.FlyControls); // "/examples/js/controls/FlyControls.js"
            const flyControls = new THREE.FlyControls(h3d.camera, h3d.renderer.domElement);
            applyAttributes.FlyControls(flyControls, attr);
            h3d.flyControls.push(flyControls);
            if (assign) elementAssignments.set(element, flyControls);
            return flyControls;
        },
        FirstPersonControls: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            await loadLibrary(_ => THREE.FirstPersonControls, "FirstPersonControls", URLS.FirstPersonControls); // "/examples/js/controls/FirstPersonControls.js"
            const firstPersonControls = new THREE.FirstPersonControls(h3d.camera, h3d.renderer.domElement);
            applyAttributes.FirstPersonControls(firstPersonControls, attr);
            h3d.firstPersonControls.push(firstPersonControls);
            if (assign) elementAssignments.set(element, firstPersonControls);
            return firstPersonControls;
        },
        PointerLockControls: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            await loadLibrary(_ => THREE.PointerLockControls, "PointerLockControls", URLS.PointerLockControls); // "/examples/js/controls/PointerLockControls.js"
            const pointerLockControls = new THREE.PointerLockControls(h3d.camera, h3d.renderer.domElement);
            applyAttributes.PointerLockControls(pointerLockControls, attr);
            pointerLockControls.connect();
            h3d.pointerLockControls.push(pointerLockControls);
            if (assign) elementAssignments.set(element, pointerLockControls);
            return pointerLockControls;
        },
        TrackballControls: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            await loadLibrary(_ => THREE.TrackballControls, "TrackballControls", URLS.TrackballControls); // "/examples/js/controls/TrackballControls.js"
            const trackballControls = new THREE.TrackballControls(h3d.camera, h3d.renderer.domElement);
            applyAttributes.TrackballControls(trackballControls, attr);
            h3d.trackballControls.push(trackballControls);
            if (assign) elementAssignments.set(element, trackballControls);
            return trackballControls;
        },
        Font: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            if (!fontLoader) {
                await loadLibrary(_ => THREE.FontLoader.prototype.load, "FontLoader", URLS.FontLoader) // "/examples/js/loaders/FontLoader.js"
                fontLoader = new THREE.FontLoader();
            }
            const font = await new Promise(r => fontLoader.load(attr("src"), r, _ => _, _ => r(null)));
            elementAssignments.set(element, font);
            if (!font) return console.error("Failed to load font: " + attr("src"));
            h3d.fonts.push({
                src: attr("src"), name: attr("name"), familyName: font.data.familyName, font
            });
            if (assign) elementAssignments.set(element, font);
            return font;
        },
        Group: async (h3d, element, assign = true, scene = h3d.scene) => {
            const attr = s => element.getAttribute(s);
            const group = new THREE.Group();
            processBehavior(group, attr("behavior"), h3d);
            await applyAttributes.Group(group, attr);
            const elements = Array.from(element.children);
            for (let i = 0; i < elements.length; i++) {
                const element2 = elements[i];
                const tagName = tagNameToName(element2.tagName);
                if (build[tagName]) await build[tagName](h3d, element2, assign, group);
            }
            if (boolCheck(attr("register"), true)) scene.add(group);
            if (assign) elementAssignments.set(element, group);
            return group;
        }
    };
    let fontLoader;
    const mouseActions = {
        ROTATE: THREE.MOUSE.ROTATE,
        rotate: THREE.MOUSE.ROTATE,
        PAN: THREE.MOUSE.PAN,
        pan: THREE.MOUSE.PAN,
        DOLLY: THREE.MOUSE.DOLLY,
        dolly: THREE.MOUSE.DOLLY
    };
    for (let i = 0; i < els.length; i++) {
        const el = els[i];
        const canvas = document.createElement("canvas");
        const attr = r => el.getAttribute(r);
        canvas.width = attr("width") || 512;
        canvas.height = attr("height") || 512;
        el.appendChild(canvas);
        const scene = new Scene();
        const camera = new PerspectiveCamera(numberCheck(attr("fov"), 75), canvas.width / canvas.height, numberCheck(attr("near"), 0.1), numberCheck(attr("far"), 1000));
        const renderer = new WebGLRenderer({
            canvas, alpha: boolCheck(attr("alpha"), false),
            premultipliedAlpha: boolCheck(attr("premultipliedAlpha"), true),
            antialias: boolCheck(attr("antialias"), false),
            stencil: boolCheck(attr("stencil"), true),
            preserveDrawingBuffer: boolCheck(attr("preserveDrawingBuffer"), false),
            powerPreference: stringCheck(attr("powerPreference"), ["high-performance", "low-power", "default"], "default"),
            failIfMajorPerformanceCaveat: boolCheck(attr("failIfMajorPerformanceCaveat"), false),
            depth: boolCheck(attr("depth"), true),
            logarithmicDepthBuffer: boolCheck(attr("logarithmicDepthBuffer"), false),
        });
        const elements = Array.from(el.children);
        if (colorCheck(attr("background-color"))) renderer.setClearColor(colorCheck(attr("background-color")));
        if (vectorCheck([attr("look-at-x"), attr("look-at-y"), attr("look-at-z")])) camera.lookAt(vectorCheck([attr("look-at-x"), attr("look-at-y"), attr("look-at-z")]));
        const h3d = new HTML3D(el, scene, camera, renderer);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const tagName = tagNameToName(element.tagName);
            if (build[tagName]) await build[tagName](h3d, element);
        }
        camera.rotation.set(numberCheck(attr("rotation-x"), 0), numberCheck(attr("rotation-y"), 0), numberCheck(attr("rotation-z"), 0));
        camera.position.set(numberCheck(attr("x"), 0), numberCheck(attr("y"), 0), numberCheck(attr("z"), 0));
        h3d.orbitControls.forEach(i => {
            i.target.x = camera.position.x;
            i.target.y = camera.position.y;
        });
        h3d.arcballControls.forEach(i => i.update());
        html3ds.push(h3d);
        if (boolCheck(attr("maximize"))) h3d.maximize();
        if (boolCheck(attr("center"))) {
            h3d.element.style.position = "absolute";
            h3d.element.style.left = "50%";
            h3d.element.style.top = "50%";
            h3d.element.style.transform = "translate(-50%, -50%)";
        }
    }
    pr();
    renderAll();
})();