// noinspection JSUnusedGlobalSymbols

const __eval = [];
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
(async () => {
    const loadPromise = new Promise(r => addEventListener("load", r));
    const allChildrens = element => {
        const children = element.children;
        const childrens = [];
        for (let i = 0; i < children.length; i++) {
            childrens.push(children[i]);
            childrens.push(...allChildrens(children[i]));
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
            this.maximized = false;
            this._lastMaximize = null;
        };

        render() {
            this.emit("render");
            this.emit("render.before");
            this.renderer.render(this.scene, this.camera);
            this.emit("render.after");
            this._f.push(Date.now() + 1000);
            this._f = this._f.filter(f => f > Date.now());
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
            this.emit("resize");
            if (this.maximized) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
            const {width, height} = this.canvas;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        };

        findById(id) {
            return allChildrens(this.element).find(e => e.id === id);
        };

        findByClass(className) {
            return Array.from(this.element.getElementsByClassName(className));
        };

        findByTag(tagName) {
            return Array.from(this.element.getElementsByTagName(tagName));
        };

        findByName(name) {
            return allChildrens(this.element).find(e => e.name === name);
        };

        findByQuery(query) {
            return this.element.querySelector(query);
        };

        findObjectByElement(element) {
            return this.scene.children.find(i => i.__html3d === element);
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

    addEventListener("resize", () => html3ds.forEach(html3d => html3d.onResize()));

    const renderAll = () => {
        for (let i = 0; i < html3ds.length; i++) if (html3ds[i].rendering) html3ds[i].render();
        requestAnimationFrame(renderAll);
    };
    /*** @type {HTML3D[]} */
    const html3ds = [];
    let pr;
    const promise = new Promise(l => pr = l);
    window.html3d = {
        promise,
        findById: (id) => html3ds.find(r => r.element.id === id)
    };
    await loadPromise;
    const els = document.querySelectorAll("html3d");
    const loadScript = src => new Promise(l => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = l;
        document.head.appendChild(script);
    });
    const loadLibrary = async (fn, name, src) => {
        try {
            if (!(await fn())) { // noinspection ExceptionCaughtLocallyJS
                throw new Error();
            }
        } catch (e) {
            console.info("%cCouldn't find " + name + ", trying to load it...", "color:#ff0000");
            await loadScript(src);
            console.info("%c" + name + " has been loaded.", "color:#00ff00");
        }
    };
    await loadLibrary(_ => THREE, "ThreeJS", "https://threejs.org/build/three.min.js");
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
            if ([..."+-*/^()"].some(i => a.includes(i))) a = eval(a).toString();
        } catch (e) {
        }
        return isNaN(a * 1) ? b : a * 1;
    }
    const boolCheck = (a, b) => a !== null ? a !== "false" : b;
    const stringCheck = (a, b, c) => !b || b.includes(a) ? a : c;
    const colorCheck = (a, b) => {
        if (/^#[0-9a-f]{6}$/i.test(a)) return numberCheck(a.replace("#", "0x"), b);
        if (/^#[0-9a-f]{3}$/i.test(a)) return numberCheck("0x" + a.replace("#", "") + a.replace("#", ""), b);
        if (/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/.test(a)) return numberCheck("0x" + a.substring(4).split("").reverse().slice(1).reverse().join("").split(",").map(i => (i.trimStart().trimEnd() * 1 || 0).toString(16)).join(""), b);
        return numberCheck(a, b);
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
    const processAttributes = (obj, attr, list) => {
        for (let i = 0; i < list.length; i++) {
            const at = list[i];
            const res = at[0](attr(at[1]), ...at.slice(3));
            if (res) obj[at[2]] = res;
        }
    };
    const processObject3DAttributes = (obj, attr) => {
        obj.position.x = numberCheck(attr("x"), 0);
        obj.position.y = numberCheck(attr("y"), 0);
        obj.position.z = numberCheck(attr("z"), 0);
        obj.rotation.x = numberCheck(attr("rotation-x"), 0);
        obj.rotation.y = numberCheck(attr("rotation-y"), 0);
        obj.rotation.z = numberCheck(attr("rotation-z"), 0);
        obj.scale.x = numberCheck(attr("scale-x"), 1);
        obj.scale.y = numberCheck(attr("scale-y"), 1);
        obj.scale.z = numberCheck(attr("scale-z"), 1);
        obj.castShadow = boolCheck(attr("cast-shadow"), false);
        obj.visible = boolCheck(attr("visible"), true);
        if (vectorCheck([attr("look-at-x"), attr("look-at-y"), attr("look-at-z")])) obj.lookAt(vectorCheck([attr("look-at-x"), attr("look-at-y"), attr("look-at-z")]));
    };
    const processMaterialAttributes = (obj, attr) => {
        processAttributes(obj, attr, [
            [numberCheck, "alpha-test", "alphaTest"],
            [numberCheck, "alpha-to-coverage", "alphaToCoverage"],
            [numberCheck, "blend-dst", "blendDst"],
            [numberCheck, "blend-dst-alpha", "blendDstAlpha"],
            [numberCheck, "blend-equation", "blendEquation"],
            [numberCheck, "blend-equation-alpha", "blendEquationAlpha"],
            [numberCheck, "blend-src", "blendSrc"],
            [numberCheck, "blend-src-alpha", "blendSrcAlpha"],
            [boolCheck, "clip-intersection", "clipIntersection"],
            [boolCheck, "clip-shadows", "clipShadows"],
            [boolCheck, "color-write", "colorWrite"],
            [jsonCheck, "defines", "defines"],
            [numberCheck, "depth-func", "depthFunc"],
            [boolCheck, "depth-test", "depthTest"],
            [boolCheck, "depth-write", "depthWrite"],
            [boolCheck, "stencil-write", "stencilWrite"],
            [numberCheck, "stencil-write-mask", "stencilWriteMask"],
            [numberCheck, "stencil-func", "stencilFunc"],
            [numberCheck, "stencil-ref", "stencilRef"],
            [numberCheck, "stencil-func-mask", "stencilFuncMask"],
            [numberCheck, "stencil-fail", "stencilFail"],
            [numberCheck, "stencil-z-fail", "stencilZFail"],
            [stringCheck, "name", "name"],
            [numberCheck, "opacity", "opacity"],
            [boolCheck, "polygon-offset", "polygonOffset"],
            [numberCheck, "polygon-offset-factor", "polygonOffsetFactor"],
            [numberCheck, "polygon-offset-units", "polygonOffsetUnits"],
            [stringCheck, "precision", "precision", ["highp", "mediump", "lowp"]],
            [boolCheck, "premultiplied-alpha", "premultipliedAlpha"],
            [boolCheck, "dithering", "dithering"],
            [sideCheck, "shadow-side", "shadowSide"],
            [sideCheck, "side", "side"],
            [boolCheck, "tone-mapped", "toneMapped"],
            [boolCheck, "transparent", "transparent"],
            [boolCheck, "visible", "visible"],
        ]);
    };
    const processBufferGeometryAttributes = (obj, attr) => {
        processAttributes(obj, attr, [
            [boolCheck, "morph-attributes", "morphAttributes"]
        ]);
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
        camera.position.x = numberCheck(attr("x"), 0);
        camera.position.y = numberCheck(attr("y"), 0);
        camera.position.z = numberCheck(attr("z"), 0);
        camera.rotation.x = numberCheck(attr("rotation-x"), 0);
        camera.rotation.y = numberCheck(attr("rotation-y"), 0);
        camera.rotation.z = numberCheck(attr("rotation-z"), 0);
        if (colorCheck(attr("background-color"))) renderer.setClearColor(colorCheck(attr("background-color")));
        if (vectorCheck([attr("look-at-x"), attr("look-at-y"), attr("look-at-z")])) camera.lookAt(vectorCheck([attr("look-at-x"), attr("look-at-y"), attr("look-at-z")]));
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const attr2 = r => element.getAttribute(r);
            switch (element.tagName) {
                case "MESH":
                    let geometry = new THREE.BoxGeometry(1, 1, 1);
                    let material = new THREE.MeshBasicMaterial();
                    const ch = Array.from(element.children);
                    for (let i = 0; i < ch.length; i++) {
                        const element2 = ch[i];
                        const attr3 = r => element2.getAttribute(r);
                        switch (element2.tagName) {
                            case "BOX-GEOMETRY":
                                geometry = new THREE.BoxGeometry(numberCheck(attr3("width"), 1), numberCheck(attr3("height"), 1), numberCheck(attr3("depth"), 1), numberCheck(attr3("width-segments"), 1), numberCheck(attr3("height-segments"), 1), numberCheck(attr3("depth-segments"), 1));
                                geometry.__html3d = element2;
                                break;
                            case "CAPSULE-GEOMETRY":
                                geometry = new THREE.CapsuleGeometry(numberCheck(attr3("radius"), 1), numberCheck(attr3("length"), 1), numberCheck(attr3("cap-subdivisions"), 8), numberCheck(attr3("radial-segments"), 16));
                                geometry.__html3d = element2;
                                break;
                            case "CIRCLE-GEOMETRY":
                                geometry = new THREE.CircleGeometry(numberCheck(attr3("radius"), 1), numberCheck(attr3("segments"), 8), numberCheck(attr3("theta-start"), 0), numberCheck(attr3("theta-length"), 2 * Math.PI));
                                geometry.__html3d = element2;
                                break;
                            case "CONE-GEOMETRY":
                                geometry = new THREE.ConeGeometry(numberCheck(attr3("radius"), 1), numberCheck(attr3("height"), 1), numberCheck(attr3("radial-segments"), 8), numberCheck(attr3("height-segments"), 1), boolCheck(attr3("open-ended"), false), numberCheck(attr3("theta-start"), 0), numberCheck(attr3("theta-length"), 2 * Math.PI));
                                geometry.__html3d = element2;
                                break;
                            case "CYLINDER-GEOMETRY":
                                geometry = new THREE.CylinderGeometry(numberCheck(attr3("radiusTop"), 1), numberCheck(attr3("radiusBottom"), 1), numberCheck(attr3("height"), 1), numberCheck(attr3("radial-segments"), 8), numberCheck(attr3("height-segments"), 1), boolCheck(attr3("open-ended"), false), numberCheck(attr3("theta-start"), 0), numberCheck(attr3("theta-length"), 2 * Math.PI));
                                geometry.__html3d = element2;
                                break;
                            case "DODECAHEDRON-GEOMETRY":
                                geometry = new THREE.DodecahedronGeometry(numberCheck(attr3("radius"), 1), numberCheck(attr3("detail"), 0));
                                geometry.__html3d = element2;
                                break;
                            case "ICOSAHEDRON-GEOMETRY":
                                geometry = new THREE.IcosahedronGeometry(numberCheck(attr3("radius"), 1), numberCheck(attr3("detail"), 0));
                                geometry.__html3d = element2;
                                break;
                            case "LATHE-GEOMETRY":
                                // BROKEN
                                const points = Array.from(element2.children).filter(i => i.tagName === "POINT").map(i => new THREE.Vector2(numberCheck(i.getAttribute("x"), 0), numberCheck(i.getAttribute("y"), 0)));
                                geometry = new THREE.LatheGeometry(points, numberCheck(attr3("segments"), 12), numberCheck(attr3("phiStart"), 0), numberCheck(attr3("phiLength"), 2 * Math.PI));
                                geometry.__html3d = element2;
                                break;
                            case "OCTAHEDRON-GEOMETRY":
                                geometry = new THREE.OctahedronGeometry(numberCheck(attr3("radius"), 1), numberCheck(attr3("detail"), 0));
                                geometry.__html3d = element2;
                                break;
                            case "PLANE-GEOMETRY":
                                geometry = new THREE.PlaneGeometry(numberCheck(attr3("width"), 1), numberCheck(attr3("height"), 1), numberCheck(attr3("width-segments"), 1), numberCheck(attr3("height-segments"), 1));
                                geometry.__html3d = element2;
                                break;
                            case "RING-GEOMETRY":
                                geometry = new THREE.RingGeometry(numberCheck(attr3("inner-radius"), 0.5), numberCheck(attr3("outer-radius"), 1), numberCheck(attr3("theta-segments"), 8), numberCheck(attr3("phi-segments"), 1), numberCheck(attr3("theta-start"), 0), numberCheck(attr3("theta-length"), 2 * Math.PI));
                                geometry.__html3d = element2;
                                break;
                            case "SHAPE-GEOMETRY":
                                const shape = processShape(Array.from(element2.children).filter(i => i.tagName === "SHAPE").reverse()[0]);
                                geometry = new THREE.ShapeGeometry(shape, numberCheck(attr3("curve-segments"), 12));
                                geometry.__html3d = element2;
                                break;
                            case "SPHERE-GEOMETRY":                                 // radius... kinda sus
                                geometry = new THREE.SphereGeometry(numberCheck(attr3("radius"), 1), numberCheck(attr3("width-segments"), 32), numberCheck(attr3("height-segments"), 16), numberCheck(attr3("phi-start"), 0), numberCheck(attr3("phi-length"), Math.PI * 2), numberCheck(attr3("theta-start"), 0), numberCheck(attr3("theta-length"), 2 * Math.PI));
                                geometry.__html3d = element2;
                                break;
                            case "TETRAHEDRON-GEOMETRY":
                                geometry = new THREE.TetrahedronGeometry(numberCheck(attr3("radius"), 1), numberCheck(attr3("detail"), 0));
                                processBufferGeometryAttributes(geometry, attr3);
                                geometry.__html3d = element2;
                                break;
                            case "MESH-BASIC-MATERIAL":
                                const meshBasicMaterialOptions = {};
                                processAttributes(meshBasicMaterialOptions, attr3, [
                                    [colorCheck, "color", "color"],
                                    [numberCheck, "combine", "combine"],
                                    [boolCheck, "fog", "fog"],
                                    [numberCheck, "reflectivity", "reflectivity"],
                                    [numberCheck, "refraction-ratio", "refractionRatio"],
                                    [boolCheck, "wireframe", "wireframe"],
                                    [stringCheck, "wireframe-line-cap", "wireframeLinecap", ["round", "butt", "square"]],
                                    [stringCheck, "wireframe-line-join", "wireframeLinejoin", ["round", "bevel", "miter"]],
                                    [numberCheck, "wireframe-line-width", "wireframeLinewidth"]
                                ]);
                                processMaterialAttributes(meshBasicMaterialOptions, attr3);
                                material = new THREE.MeshBasicMaterial(meshBasicMaterialOptions);
                                material.__html3d = element2;
                                break;
                            case "MESH-PHONG-MATERIAL":
                                const meshPhongMaterialOptions = {};
                                if (vectorCheck([attr3("normal-scale-x"), attr3("normal-scale-y")])) meshPhongMaterialOptions.normalScale = vectorCheck([attr3("normal-scale-x"), attr3("normal-scale-y")]);
                                processAttributes(meshPhongMaterialOptions, attr3, [
                                    [numberCheck, "ao-map-intensity", "aoMapIntensity"],
                                    [numberCheck, "bump-scale", "bumpScale"],
                                    [colorCheck, "color", "color"],
                                    [numberCheck, "combine", "combine"],
                                    [numberCheck, "displacement-scale", "displacementScale"],
                                    [numberCheck, "displacement-bias", "displacementBias"],
                                    [colorCheck, "emissive", "emissive"],
                                    [numberCheck, "emissive-intensity", "emissiveIntensity"],
                                    [numberCheck, "flat-shading", "flatShading"],
                                    [boolCheck, "fog", "fog"],
                                    [numberCheck, "light-map-intensity", "lightMapIntensity"],
                                    [numberCheck, "normal-map-type", "normalMapType"],
                                    [numberCheck, "reflectivity", "reflectivity"],
                                    [numberCheck, "refraction-ratio", "refractionRatio"],
                                    [numberCheck, "shininess", "shininess"],
                                    [colorCheck, "specular", "specular"],
                                    [boolCheck, "wireframe", "wireframe"],
                                    [stringCheck, "wireframe-line-cap", "wireframeLinecap"],
                                    [stringCheck, "wireframe-line-join", "wireframeLinejoin"],
                                    [numberCheck, "wireframe-line-width", "wireframeLinewidth"]
                                ]);
                                processMaterialAttributes(meshPhongMaterialOptions, attr3);
                                material = new THREE.MeshPhongMaterial(meshPhongMaterialOptions);
                                material.__html3d = element2;
                                break;
                        }
                    }
                    const cube = new THREE.Mesh(geometry, material);
                    cube.__html3d = element;
                    processObject3DAttributes(cube, attr2);
                    if (boolCheck(attr2("register"), true)) scene.add(cube);
                    break;
                case "POINT-LIGHT":
                    const pointLight = new THREE.PointLight(colorCheck(attr2("color"), 0xffffff), numberCheck(attr2("intensity"), 1), numberCheck(attr2("distance"), 0), numberCheck(attr2("decay"), 1));
                    pointLight.__html3d = element;
                    processAttributes(pointLight, attr2, [
                        [numberCheck, "power", "power"],
                        [colorCheck, "color", "color"]
                    ]);
                    processObject3DAttributes(pointLight, attr2);
                    if (boolCheck(attr2("register"), true)) scene.add(pointLight);
                    break;
                case "ORBIT-CONTROLS":
                    await loadLibrary(_ => THREE.OrbitControls, "OrbitControls", "https://threejs.org/examples/js/controls/OrbitControls.js");
                    const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
                    processAttributes(orbitControls, attr2, [
                        [boolCheck, "auto-rotate", "autoRotate"],
                        [numberCheck, "auto-rotate-speed", "autoRotateSpeed"],
                        [numberCheck, "damping-factor", "dampingFactor"],
                        [boolCheck, "enabled", "enabled"],
                        [boolCheck, "enable-damping", "enableDamping"],
                        [boolCheck, "enable-pan", "enablePan"],
                        [boolCheck, "enable-rotate", "enableRotate"],
                        [boolCheck, "enable-zoom", "enableZoom"],
                        [numberCheck, "key-pan-speed", "keyPanSpeed"],
                        [numberCheck, "max-azimuth-angle", "maxAzimuthAngle"],
                        [numberCheck, "max-distance", "maxDistance"],
                        [numberCheck, "max-polar-angle", "maxPolarAngle"],
                        [numberCheck, "max-zoom", "maxZoom"],
                        [numberCheck, "min-azimuth-angle", "minAzimuthAngle"],
                        [numberCheck, "min-distance", "minDistance"],
                        [numberCheck, "min-polar-angle", "minPolarAngle"],
                        [numberCheck, "min-zoom", "minZoom"],
                        [numberCheck, "pan-speed", "panSpeed"],
                        [numberCheck, "rotate-speed", "rotateSpeed"],
                        [boolCheck, "screen-space-panning", "screenSpacePanning"],
                    ]);
                    ["left", "right", "up", "bottom"].forEach(i => {
                        if (attr2("key-" + i)) orbitControls.keys[i.toUpperCase()] = attr2("key-" + i.toUpperCase());
                    });
                    const mouseActions = {
                        ROTATE: THREE.MOUSE.ROTATE,
                        rotate: THREE.MOUSE.ROTATE,
                        PAN: THREE.MOUSE.PAN,
                        pan: THREE.MOUSE.PAN,
                        DOLLY: THREE.MOUSE.DOLLY,
                        dolly: THREE.MOUSE.DOLLY
                    };
                    ["left", "right", "middle"].forEach(i => {
                        if (mouseActions[attr2("mouse-" + i)]) orbitControls.mouseButtons[i] = mouseActions[attr2("mouse-" + i)];
                    });
                    ["one", "two"].forEach(i => {
                        if (mouseActions[attr2("touch-" + i)]) orbitControls.touches[i] = mouseActions[attr2("touch-" + i)];
                    });
                    break;
            }
        }
        const h3d = new HTML3D(el, scene, camera, renderer);
        html3ds.push(h3d);
        if (boolCheck(attr("maximize"))) h3d.maximize();
    }
    pr();
    renderAll();
})();