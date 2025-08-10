// REAL Keysim adapter that uses original managers and our compatibility shim
// Ensure the THREE.Geometry compatibility shim is applied before any manager loads
import "./three/compatibility";
import { stateAdapter } from "./stateAdapter";

export default (element, initialConfig = {}) => {
  // Seed state
  if (initialConfig.layout) stateAdapter.setLayout(initialConfig.layout);
  if (initialConfig.colorway) stateAdapter.setColorway(initialConfig.colorway);
  if (initialConfig.caseColor) stateAdapter.setCaseColor(initialConfig.caseColor);
  if (initialConfig.caseMaterial) stateAdapter.setCaseMaterial(initialConfig.caseMaterial);

  let cleanup;

  // Dynamically import managers to avoid ESM circular-init issues
  (async () => {
    try {
      const { default: SceneManager } = await import("./three/sceneManager");
      const { default: KeyManager } = await import("./three/key/keyManager");
      const { default: CaseManager } = await import("./three/case/caseManager");

      const threeApp = new SceneManager({ scale: 50, el: element });
      const keys = new KeyManager({ scene: threeApp.scene });
      const kase = new CaseManager({ scene: threeApp.scene });

      threeApp.add(keys);
      threeApp.add(kase);
      threeApp.tick();

      cleanup = () => {
        try {
          if (threeApp?.renderer?.domElement && element.contains(threeApp.renderer.domElement)) {
            element.removeChild(threeApp.renderer.domElement);
          }
        } catch {}
      };

      console.log("✅ REAL Keysim (original managers) initialized");
    } catch (e) {
      console.error("❌ Failed to init REAL Keysim:", e);
    }
  })();

  // Return cleanup function
  return () => cleanup && cleanup();
};