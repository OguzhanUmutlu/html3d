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
    try {
        await THREE;
    } catch (e) {
        console.info("Couldn't find THREE.js, trying to load it...");
        const script = document.createElement("script");
        script.src = "https://threejs.org/build/three.min.js";
        document.head.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
        console.info("THREE.js has been loaded.");
    }
    const {Scene, PerspectiveCamera, WebGLRenderer} = THREE;
    const numberCheck = (a, b) => {
        if (typeof a === "number") return a;
        if (!a) return b;
        a = a.replaceAll("pi", Math.PI);
        try {
            const {
                sin, cos, tan, asin, acos, atan, atan2, sqrt, pow, abs, log, log2, log10, exp, min, max,
                floor, ceil, round, sign
            } = Math;
            if ([..."+-*/^()"].some(i => a.includes(i))) a = eval(a).toString();
        } catch (e) {
        }
        return isNaN(a * 1) ? b : a * 1;
    }
    const boolCheck = (a, b) => a ? a === "true" : b;
    const stringCheck = (a, b = [], c) => b.includes(a) ? a : c;
    const colorCheck = (a, b) => {
        if (/^#[0-9a-f]{6}$/i.test(a)) return numberCheck(a.replace("#", "0x"), b);
        if (/^#[0-9a-f]{3}$/i.test(a)) return numberCheck("0x" + a.replace("#", "") + a.replace("#", ""), b);
        if (/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/.test(a)) return numberCheck("0x" + a.substring(4).split("").reverse().slice(1).reverse().join("").split(",").map(i => (i.trimStart().trimEnd() * 1 || 0).toString(16)).join(""), b);
        return numberCheck(a, b);
    };
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
                    } else w.push(numberCheck(segment, 0));
                }
                processCurSymbol();
            }
        }
        return shape;
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
        if (attr("look-at")) camera.lookAt(new THREE.Vector3(...attr("look-at").split(",").map(r => r * 1)));
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
                            case "BASIC-MATERIAL":
                                const basicMaterialOptions = {};
                                if (colorCheck(attr3("color"))) basicMaterialOptions.color = colorCheck(attr3("color"));
                                if (numberCheck(attr3("combine"))) basicMaterialOptions.combine = numberCheck(attr3("combine"));
                                if (attr3("fog")) basicMaterialOptions.fog = attr3("fog") === true;
                                if (numberCheck(attr3("reflectivity"))) basicMaterialOptions.reflectivity = numberCheck(attr3("reflectivity"));
                                if (numberCheck(attr3("refractionRatio"))) basicMaterialOptions.refractionRatio = numberCheck(attr3("refractionRatio"));
                                if (boolCheck(attr3("wireframe"))) basicMaterialOptions.wireframe = attr3("wireframe") === true;
                                if (stringCheck(attr3("wireframeLinecap"), ["round", "butt", "square"])) basicMaterialOptions.wireframeLinecap = attr3("wireframeLinecap");
                                if (stringCheck(attr3("wireframeLinejoin"), ["round", "bevel", "miter"])) basicMaterialOptions.wireframeLinejoin = attr3("wireframeLinejoin");
                                if (numberCheck(attr3("wireframeLinewidth"))) basicMaterialOptions.wireframeLinewidth = numberCheck(attr3("wireframeLinewidth"));
                                if (numberCheck(attr3("opacity"))) basicMaterialOptions.opacity = numberCheck(attr3("opacity"));
                                const sides = {front: THREE.FrontSide, back: THREE.BackSide, double: THREE.DoubleSide,};
                                if (sides[attr3("shadowSide")] || Object.keys(sides).includes((attr3("shadow-side") || "").toLowerCase())) basicMaterialOptions.shadowSide = sides[attr3("shadowSide")] || attr3("shadowSide");
                                if (sides[attr3("side")] || Object.keys(sides).includes((attr3("side") || "").toLowerCase())) basicMaterialOptions.side = sides[attr3("side")] || attr3("side");
                                material = new THREE.MeshBasicMaterial(basicMaterialOptions);
                                material.__html3d = element2;
                                break;
                        }
                    }
                    const cube = new THREE.Mesh(geometry, material);
                    cube.__html3d = element;
                    cube.position.x = numberCheck(attr2("x"), 0);
                    cube.position.y = numberCheck(attr2("y"), 0);
                    cube.position.z = numberCheck(attr2("z"), 0);
                    cube.rotation.x = numberCheck(attr2("rotation-x"), 0);
                    cube.rotation.y = numberCheck(attr2("rotation-y"), 0);
                    cube.rotation.z = numberCheck(attr2("rotation-z"), 0);
                    cube.scale.x = numberCheck(attr2("scale-x"), 1);
                    cube.scale.y = numberCheck(attr2("scale-y"), 1);
                    cube.scale.z = numberCheck(attr2("scale-z"), 1);
                    cube.castShadow = boolCheck(attr2("cast-shadow"), false);
                    cube.visible = boolCheck(attr2("visible"), true);
                    if (attr2("look-at")) cube.lookAt(new THREE.Vector3(...attr2("look-at").split(",").map(r => r * 1)));
                    if (boolCheck(attr2("register"), true)) scene.add(cube);
                    break;
            }
        }
        html3ds.push(new HTML3D(el, scene, camera, renderer));
    }
    pr();
    renderAll();
})();