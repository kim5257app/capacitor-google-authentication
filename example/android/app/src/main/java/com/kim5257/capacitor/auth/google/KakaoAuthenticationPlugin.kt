package com.kim5257.capacitor.auth.google

import android.util.Log
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.kakao.sdk.common.KakaoSdk
import com.kakao.sdk.common.util.Utility
import com.kakao.sdk.user.UserApiClient
import kotlinx.coroutines.async
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import okhttp3.internal.wait
import org.json.JSONObject

@CapacitorPlugin(name = "KakaoAuthentication")
class KakaoAuthenticationPlugin : Plugin() {
    companion object {
        const val TAG = "KakaoAuthentication"

        const val kakaoCustomAuth = "http://127.0.0.1:5001/capacitor-auth-firebase/asia-northeast3/kakaoCustomAuth";
    }

    @PluginMethod
    fun initialize(call: PluginCall) {
        Log.d(TAG, "KeyHash: ${Utility.getKeyHash(context)}")

        val nativeKey = call.getString("nativeKey")?:""
        KakaoSdk.init(this.context, nativeKey)
    }

    @PluginMethod
    fun signIn(call: PluginCall) {
        UserApiClient.instance.loginWithKakaoTalk(this.context) { result, error ->
            if (error != null) {
                call.reject(
                    error.message,
                    JSObject().apply {
                        this.put("result", "error")
                        this.put("message", error.message)
                    }
                )
            } else {
                this.notifyListeners("kakao.auth.verify.completed", JSObject().apply {
                    this.put("token", result?.idToken?:"")
                })

                call.resolve(JSObject().apply {
                    this.put("result", "success")
                })
            }
        }
    }

    @PluginMethod
    fun callback(call: PluginCall) {
        call.resolve()
    }
}
