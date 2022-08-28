# html3d

3D rendering implementation to HTML made with three.js

# Examples

[Spinning cube](https://oguzhanumutlu.github.io/html3d/examples/cube.html)

[Spinning heart](https://oguzhanumutlu.github.io/html3d/examples/heart.html)

[Perfect sphere](https://oguzhanumutlu.github.io/html3d/examples/sphere.html)

[The rock](https://oguzhanumutlu.github.io/html3d/examples/rock.html)

# A quick example

## Implementation

```html
<script src="https://unpkg.com/html3d"></script>
```

## Create a scene

```html
<html3d>
    <!-- Your code will be here! -->
</html3d>
```

## Creating a mesh

Note: By default its a 1x1x1 box and has mesh basic material with the color white.

```html
<html3d>
    <mesh></mesh>
</html3d>
```

## Moving the camera back

Note: This will allow you to actually see the cube.

```html
<html3d z="5">
    <mesh></mesh>
</html3d>
```

## Changing the color of the material

```html
<html3d z="5">
    <mesh>
        <mesh-basic-material color="red"></mesh-basic-material>
    </mesh>
</html3d>
```

## Adding a controller

Note: This will allow you to move the camera object with your mouse.

```html
<html3d z="5">
    <mesh>
        <mesh-basic-material color="red"></mesh-basic-material>
    </mesh>
    <trackball-controls></trackball-controls>
</html3d>
```

## Maximizing the scene

```html
<html3d maximize z="5">
    
</html3d>
```

## Centering the scene

```html
<html3d center z="5">
    
</html3d>
```

## Making scene fill the window

```html
<html3d maximize center z="5">
    
</html3d>
```

## Adding a point light

Note: The origin of the world is 0-0-0.

```html
<html3d maximize center z="5">
    <point-light y="100"></point-light>
</html3d>
```

## Using mesh phong material

```html
<html3d maximize center z="5">
    <mesh>
        <mesh-phong-material color="#156289" emissive="#072534" side="double"></mesh-phong-material>
    </mesh>
    <point-light y="200"></point-light>
    <point-light x="100" y="200" z="100"></point-light>
    <point-light x="-100" y="-200" z="-100"></point-light>
    <trackball-controls></trackball-controls>
</html3d>
```

## Using mesh behaviors

Changeable variables: x(position x), y, z, rx(rotation x), ry, rz, sx(scale x), sy, sz

Actions: `**=`, `|=`, `&=`, `+=`, `-=`, `*=`, `/=`

```html
<html3d maximize center z="5">
    <mesh behavior="rx += 0.01; ry += 0.01">
        <mesh-phong-material color="#156289" emissive="#072534" side="double"></mesh-phong-material>
    </mesh>
    <point-light y="200"></point-light>
    <point-light x="100" y="200" z="100"></point-light>
    <point-light x="-100" y="-200" z="-100"></point-light>
    <trackball-controls></trackball-controls>
</html3d>
```

# TODO

## Wiki 0/3

- [ ] Plain code explanations
- [ ] Image explanations
- [ ] Video explanations

## Cameras 1/4

- [ ] Cube camera
- [X] Perspective camera
- [ ] Orthographic camera
- [ ] Stereo camera

## Geometries 18/25

- [X] Box geometry
- [X] Capsule geometry
- [X] Circle geometry
- [X] Cone geometry
- [X] Cylinder geometry
- [X] Dodecahedron geometry
- [ ] Edges geometry
- [ ] Extrude geometry
- [X] Icosahedron geometry
- [ ] Lathe geometry
- [X] Octahedron geometry
- [X] Plane geometry
- [ ] Polyhedron geometry
- [X] Ring geometry
- [X] Shape geometry
- [X] Sphere geometry
- [X] Tetrahedron geometry
- [X] Torus geometry
- [X] Torus Knot geometry
- [X] Tube geometry
- [ ] Wireframe geometry
- [X] Convex geometry
- [ ] Decal geometry
- [ ] Parametric geometry
- [X] Text geometry

## Materials 5/17

- [X] Line basic material
- [X] Line dashed material
- [X] Mesh basic material
- [X] Mesh depth material
- [ ] Mesh distance material
- [ ] Mesh lambert material
- [ ] Mesh metcap material
- [ ] Mesh normal material
- [X] Mesh phong material
- [ ] Mesh physical material
- [ ] Mesh standard material
- [ ] Mesh toon material
- [ ] Points material
- [ ] Raw shader material
- [ ] Shader material
- [ ] Shadow material
- [ ] Sprite material

## Lights 8/9

- [X] Ambient light
- [X] Ambient light probe
- [X] Directional light
- [X] Hemisphere light
- [X] Hemisphere light probe
- [ ] Light probe
- [X] Point light
- [X] Rect area light
- [X] Spotlight

## Fogs 0/2

- [ ] Fog
- [ ] FogExp2

## Controllers 6/8

- [X] Arc ball controls
- [ ] Drag controls
- [X] First person controls
- [X] Fly controls
- [X] Orbit controls
- [X] Pointer lock controls
- [X] Trackball controls
- [ ] Transform controls

## Renderers 1/5

- [X] WebGL renderer
- [ ] WebGL1 renderer
- [ ] CSS 2D renderer
- [ ] CSS 3D renderer
- [ ] SVG renderer

## Loaders 1/14

- [ ] 3DM loader
- [ ] DRACO loader
- [X] Font loader
- [ ] GLTF loader
- [ ] KTX2 loader
- [ ] LDraw loader
- [ ] MMD loader
- [ ] MTL loader
- [ ] OBJ loader
- [ ] PCD loader
- [ ] PDB loader
- [ ] PRWM loader
- [ ] SVG loader
- [ ] TGA loader

## Miscellaneous 1/1

- [X] Groups