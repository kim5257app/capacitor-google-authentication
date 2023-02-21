package com.kim5257.capacitor.plugins.authentication.google

import android.util.Log
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.firebase.FirebaseException
import com.google.firebase.auth.*
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.tasks.await
import java.util.concurrent.TimeUnit

@CapacitorPlugin(name = "GoogleAuthentication")
class GoogleAuthenticationPlugin : Plugin() {
    companion object {
        const val TAG = "GoogleAuthPlugin"
    }

    private var verificationId: String? = null
    private var resendingToken: PhoneAuthProvider.ForceResendingToken? = null

    init {
        FirebaseAuth.getInstance().addAuthStateListener {firebaseAuth ->
            if (firebaseAuth.currentUser != null) {
                firebaseAuth.currentUser!!.getIdToken(true).addOnSuccessListener { getTokenResult ->
                    notifyListeners("google.auth.state.update", JSObject().apply {
                        this.put("idToken", getTokenResult.token);
                    })
                }
            } else {
                notifyListeners("google.auth.state.update", JSObject().apply {
                    this.put("idToken", "");
                })
            }
        }
    }

    private fun getIdToken(credential: AuthCredential): String {
        var token = ""

        runBlocking {
            val firebaseUser = FirebaseAuth.getInstance()
                .signInWithCredential(credential).await().user

            token = firebaseUser?.getIdToken(false)?.await()?.token?:""
        }

        return token
    }

    @PluginMethod
    fun verifyPhoneNumber(call: PluginCall) {
        try {
            val phone: String = call.getString("phone")?:""
            val pThis = this

            if (phone.isBlank()) {
                throw java.lang.IllegalArgumentException("Invalid phone number")
            }

            val options = PhoneAuthOptions.newBuilder()
                .setPhoneNumber(phone)
                .setTimeout(120L, TimeUnit.SECONDS)
                .setActivity(activity)
                .also { options ->
                    resendingToken?.let { options.setForceResendingToken(it) }
                }
                .setCallbacks(object: PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
                    override fun onVerificationCompleted(credential: PhoneAuthCredential) {
                        Log.d(TAG, "onVerificationCompleted")

                        val idToken = getIdToken(credential)

                        notifyListeners("google.auth.phone.verify.completed", JSObject().apply {
                            this.put("idToken", idToken)
                        })
                    }

                    override fun onCodeSent(verificationId: String, resendingToken: PhoneAuthProvider.ForceResendingToken) {
                        Log.d(TAG, "onCodeSent: $verificationId, $resendingToken")

                        pThis.verificationId = verificationId
                        pThis.resendingToken = resendingToken

                        notifyListeners("google.auth.phone.code.sent", JSObject().apply {
                          this.put("verificationId", verificationId)
                          this.put("resendingToken", resendingToken)
                        })
                    }

                    override fun onVerificationFailed(exception: FirebaseException) {
                        Log.e(TAG, "onVerificationFailed: ${exception.message}")

                        notifyListeners("google.auth.phone.verify.failed", JSObject().apply {
                            this.put("message", exception.message)
                        })
                    }
                }).build()

            PhoneAuthProvider.verifyPhoneNumber(options)

            call.resolve(JSObject().apply {
                this.put("result", "success")
            })
        } catch (exception: Exception) {
            Log.e(TAG, "Unknown Error: ${exception.message}")

            call.reject(
                "Error: ${exception.message}",
                JSObject().apply {
                    this.put("result", "error")
                    this.put("message", exception.message)
                }
            )
        }
    }

    @PluginMethod
    fun confirmPhoneNumber(call: PluginCall) {
        try {
            if (verificationId.isNullOrBlank()) {
                throw java.lang.IllegalArgumentException("Invalid verification ID")
            }

            val code = call.getString("code")?:""
            val credential = PhoneAuthProvider.getCredential(verificationId!!, code)
            val idToken = getIdToken(credential)

            notifyListeners("google.auth.phone.verify.completed", JSObject().apply {
                this.put("idToken", idToken)
            })

            call.resolve(JSObject().apply {
                this.put("result", "success")
            })
        } catch (exception: Exception) {
            call.reject(
                "Invalid access",
                JSObject().apply {
                    this.put("result", "error")
                    this.put("message", "Invalid access")
                }
            )
        }
    }

    @PluginMethod
    fun getIdToken(call: PluginCall) {
        try {
            val user = FirebaseAuth.getInstance().currentUser
                ?: throw java.lang.IllegalArgumentException("Invalid verification ID")
            val forceRefresh = call.getBoolean("forceRefresh")?:false

            user.getIdToken(forceRefresh).addOnSuccessListener { getTokenResult ->
                call.resolve(JSObject().apply {
                    this.put("result", "success")
                    this.put("idToken", getTokenResult.token)
                })
            }.addOnFailureListener { excection ->
                call.reject(
                    excection.message,
                    JSObject().apply {
                        this.put("result", "error")
                        this.put("message", excection.message)
                    }
                )
            }

        } catch (exception: Exception) {
            call.reject(
                "Invalid access",
                JSObject().apply {
                    this.put("result", "error")
                    this.put("message", "Invalid access")
                }
            )
        }
    }

    @PluginMethod
    fun signOut(call: PluginCall) {
        FirebaseAuth.getInstance().signOut()
        call.resolve(JSObject().apply {
            this.put("result", "success")
        })
    }

    @PluginMethod
    fun echo(call: PluginCall) {
        val value = call.getString("value")?:""
        val ret = JSObject()
        ret.put("value", value)
        call.resolve(ret)
    }
}