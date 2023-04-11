package com.kim5257.capacitor.auth.google

import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(KakaoAuthenticationPlugin::class.java)

        super.onCreate(savedInstanceState)
    }
}