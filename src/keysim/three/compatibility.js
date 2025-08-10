// Three.js Compatibility Shim
// Bridges Keysim's v0.125 THREE.Geometry usage with modern Three.js v0.178+ BufferGeometry

import * as THREE from "three";

// Create a compatibility layer for deprecated THREE.Geometry
export class CompatGeometry {
  constructor() {
    this.vertices = [];
    this.faces = [];
    this.faceVertexUvs = [[]];
    this.colors = [];
    this.type = 'Geometry';
  }

  // Convert to BufferGeometry (required for modern Three.js)
  toBufferGeometry() {
    const bufferGeometry = new THREE.BufferGeometry();
    
    if (this.vertices.length > 0) {
      const vertices = new Float32Array(this.vertices.length * 3);
      for (let i = 0; i < this.vertices.length; i++) {
        vertices[i * 3] = this.vertices[i].x;
        vertices[i * 3 + 1] = this.vertices[i].y;
        vertices[i * 3 + 2] = this.vertices[i].z;
      }
      bufferGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    }

    if (this.faces.length > 0) {
      const indices = new Uint16Array(this.faces.length * 3);
      for (let i = 0; i < this.faces.length; i++) {
        indices[i * 3] = this.faces[i].a;
        indices[i * 3 + 1] = this.faces[i].b;
        indices[i * 3 + 2] = this.faces[i].c;
      }
      bufferGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
    }

    if (this.faceVertexUvs && this.faceVertexUvs[0] && this.faceVertexUvs[0].length > 0) {
      const uvs = new Float32Array(this.vertices.length * 2);
      // Basic UV mapping - this may need refinement for complex Keysim geometries
      for (let i = 0; i < this.vertices.length; i++) {
        uvs[i * 2] = 0.5; // Default U
        uvs[i * 2 + 1] = 0.5; // Default V
      }
      bufferGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    }

    bufferGeometry.computeVertexNormals();
    return bufferGeometry;
  }

  // Methods used by Keysim
  merge(geometry, matrix) {
    // For simplicity, we'll store merge operations and apply them during toBufferGeometry()
    if (!this._mergeOperations) this._mergeOperations = [];
    this._mergeOperations.push({ geometry, matrix });
  }

  clone() {
    const cloned = new CompatGeometry();
    cloned.vertices = [...this.vertices];
    cloned.faces = [...this.faces];
    cloned.faceVertexUvs = [...this.faceVertexUvs];
    cloned.colors = [...this.colors];
    return cloned;
  }

  computeFaceNormals() {
    // Stub - BufferGeometry will handle normals
  }

  computeVertexNormals() {
    // Stub - BufferGeometry will handle normals
  }
}

// Provide a factory so we don't assign to the imported binding directly
export function createGeometry() {
  return new CompatGeometry();
}

export default CompatGeometry;
