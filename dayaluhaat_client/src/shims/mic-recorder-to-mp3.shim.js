// --- THE FIX IS HERE ---
// We import from our private, virtual alias, NOT the public package name.
// This breaks the circular dependency.
import MicRecorder from '__real-mic-recorder-to-mp3__'; 
import * as Lame from "lamejs";

// Now we can safely set the global variable.
window.Lame = Lame;

// And finally, we export the real library for the rest of our app to use.
export default MicRecorder;