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

    private fun getIdToken(user: FirebaseUser, forceRefresh: Boolean): String {
        var token = ""

        runBlocking {
            token = user.getIdToken(forceRefresh).await().token?:""
        }

        return token
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
    private fun initialize(call: PluginCall) {
        call.resolve(JSObject().apply {
            this.put("result", "success")
        })
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
    fun createUserWithEmailAndPassword(call: PluginCall) {
        try {
            val email: String = call.getString("email") ?: ""
            val password = call.getString("password") ?: ""

            FirebaseAuth.getInstance().createUserWithEmailAndPassword(email, password)
                .addOnSuccessListener { getTokenResult ->
                    val token = getIdToken(getTokenResult.user!!, false)

                    this.notifyListeners("google.auth.phone.verify.completed", JSObject().apply {
                        this.put("idToken", token)
                    })

                    call.resolve(JSObject().apply {
                        this.put("result", "success")
                        this.put("idToken", token)
                    })
                }
                .addOnFailureListener { exception ->
                    call.reject(
                        exception.message,
                        JSObject().apply {
                            this.put("result", "error")
                            this.put("message", exception.message)
                        }
                    )
                }
        } catch (exception: Exception) {
            call.reject(
                exception.message,
                JSObject().apply {
                    this.put("result", "error")
                    this.put("message", "Invalid access")
                }
            )
        }
    }

    @PluginMethod
    fun signInWithEmailAndPassword(call: PluginCall) {
        try {
            val email: String = call.getString("email") ?: ""
            val password = call.getString("password") ?: ""

            FirebaseAuth.getInstance().signInWithEmailAndPassword(email, password)
                .addOnSuccessListener { getTokenResult ->
                    val token = getIdToken(getTokenResult.user!!, false)

                    this.notifyListeners("google.auth.phone.verify.completed", JSObject().apply {
                        this.put("idToken", token)
                    })

                    call.resolve(JSObject().apply {
                        this.put("result", "success")
                        this.put("idToken", token)
                    })
                }
                .addOnFailureListener { exception ->
                    call.reject(
                        exception.message,
                        JSObject().apply {
                            this.put("result", "error")
                            this.put("message", exception.message)
                        }
                    )
                }
        } catch (exception: Exception) {
            call.reject(
                exception.message,
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
            val forceRefresh = call.getBoolean("forceRefresh")?:false

            if (user != null) {
                user.getIdToken(forceRefresh).addOnSuccessListener { getTokenResult ->
                    call.resolve(JSObject().apply {
                        this.put("result", "success")
                        this.put("idToken", getTokenResult.token)
                    })
                }.addOnFailureListener { exception ->
                    call.reject(
                        exception.message,
                        JSObject().apply {
                            this.put("result", "error")
                            this.put("message", exception.message)
                        }
                    )
                }
            } else {
                call.resolve(JSObject().apply {
                    this.put("result", "success")
                    this.put("idToken", "")
                })
            }
        } catch (exception: Exception) {
            call.reject(
                exception.message,
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