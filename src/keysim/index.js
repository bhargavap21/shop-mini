import SceneManager from "./sceneManager";
import CaseManager from "./case/caseManager";
import KeyManager from "./key/keyManager";

const SCREEN_SCALE = 50;

export default (element) => {
  // Initialize immediately without webfont dependency
  try {
    console.log('🚀 Initializing KeySim with case and keys...');
    
    //MAIN THREE JS SETUP
    //-------------------------------------
    const ThreeApp = new SceneManager({
      scale: SCREEN_SCALE,
      el: element,
    });

    const KEYS = new KeyManager({
      scene: ThreeApp.scene,
    });

    const CASE = new CaseManager({
      scene: ThreeApp.scene,
    });

    console.log('✅ KeySim managers initialized:', { ThreeApp, KEYS, CASE });

    //start render loop
    ThreeApp.add(KEYS);
    ThreeApp.add(CASE); // Make sure case is added to render loop
    ThreeApp.tick();
    
    // Force a render to make sure everything appears
    setTimeout(() => {
      ThreeApp.render();
      
      // Force update key textures to show legends
      console.log('🔤 Forcing key legend update...');
      document.dispatchEvent(new CustomEvent('force_key_material_update'));
    }, 200);
    
    console.log('🎹 KeySim fully loaded with case and keys!');
    
    return { ThreeApp, KEYS, CASE }; // Return for debugging
  } catch (error) {
    console.error('Failed to initialize KeySim:', error);
    // Fallback will be handled by the React component
    throw error;
  }
};
