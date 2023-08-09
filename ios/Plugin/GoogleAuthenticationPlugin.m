#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(GoogleAuthenticationPlugin, "GoogleAuthentication",
           CAP_PLUGIN_METHOD(initialize, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(verifyPhoneNumber, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(confirmPhoneNumber, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(createUserWithEmailAndPassword, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(signInWithEmailAndPassword, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getIdToken, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getCurrentUser, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateProfile, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(updateEmail, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(signOut, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
)
