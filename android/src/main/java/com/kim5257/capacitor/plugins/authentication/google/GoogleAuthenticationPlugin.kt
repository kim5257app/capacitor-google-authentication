package com.kim5257.capacitor.plugins.authentication.google

import android.util.Log
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.IntentSenderRequest
import androidx.activity.result.contract.ActivityResultContracts
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.google.android.gms.auth.api.identity.BeginSignInRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.auth.api.identity.SignInClient
import com.google.android.gms.common.api.ApiException
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

    private lateinit var googleClientId: String

    private var verificationId: String? = null
    private var resendingToken: PhoneAuthProvider.ForceResendingToken? = null

    private lateinit var oneTabClient: SignInClient

    private lateinit var resultLauncher: ActivityResultLauncher<IntentSenderRequest>

    init {
        FirebaseAuth.getInstance().addAuthStateListener {firebaseAuth ->
            if (firebaseAuth.currentUser != null) {
                firebaseAuth.currentUser!!.getIdToken(true).addOnSuccessListener { getTokenResult ->
                    notifyListeners("google.auth.state.update", JSObject().apply {
                        this.put("idToken", getTokenResult.token)
                    })
                }
            } else {
                notifyListeners("google.auth.state.update", JSObject().apply {
                    this.put("idToken", "")
                })
            }
        }
    }

    override fun load() {
        super.load()

        oneTabClient = Identity.getSignInClient(activity)

        resultLauncher = activity.registerForActivityResult(
            ActivityResultContracts.StartIntentSenderForResult()
        ) { activityResult ->
            try {
                val credential = oneTabClient.getSignInCredentialFromIntent(activityResult.data)
                val firebaseCredential = GoogleAuthProvider.getCredential(credential.googleIdToken, null)

                runBlocking {
                    val token = FirebaseAuth.getInstance()
                        .signInWithCredential(firebaseCredential)
                        .await()
                        .user?.getIdToken(false)

                    notifyListeners("google.auth.phone.verify.completed", JSObject().apply {
                        this.put("idToken", token)
                    })
                }
            } catch (exception: ApiException) {
                Log.d("GoogleAuthPlugin", exception.message?:"")
            }
        }
    }

    private fun getIdToken(user: FirebaseUser, forceRefresh: Boolean): String {
        var token: String

        runBlocking {
            token = user.getIdToken(forceRefresh).await().token?:""
        }

        return token
    }

    private fun getIdToken(credential: AuthCredential): String {
        var token: String

        runBlocking {
            val firebaseUser = FirebaseAuth.getInstance()
                .signInWithCredential(credential).await().user

            token = firebaseUser?.getIdToken(false)?.await()?.token?:""
        }

        return token
    }

    @PluginMethod
    fun initialize(call: PluginCall) {
        this.googleClientId = call.getString("googleClientId")?:""

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
                exception.message,
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
                exception.message,
                JSObject().apply {
                    this.put("result", "error")
                    this.put("message", exception.message)
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
                    this.put("message", exception.message)
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
                    this.put("message", exception.message)
                }
            )
        }
    }

    @PluginMethod
    fun signInWithGoogle(call: PluginCall) {
        try {
            val signInRequest = BeginSignInRequest.builder()
                .setPasswordRequestOptions(
                    BeginSignInRequest.PasswordRequestOptions.builder()
                        .setSupported(true)
                        .build()
                )
                .setGoogleIdTokenRequestOptions(
                    BeginSignInRequest.GoogleIdTokenRequestOptions.builder()
                        .setSupported(true)
                        .setServerClientId(this.googleClientId)
                        .setFilterByAuthorizedAccounts(false)
                        .build()
                )
                .setAutoSelectEnabled(true)
                .build()

            oneTabClient.beginSignIn(signInRequest)
                .addOnSuccessListener { signInResult ->
                    resultLauncher.launch(
                        IntentSenderRequest
                            .Builder(signInResult.pendingIntent.intentSender)
                            .build()
                    )

                    call.resolve(JSObject().apply {
                        this.put("result", "success")
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
        } catch (exception: Exception){
            call.reject(
                exception.message,
                JSObject().apply {
                    this.put("result", "error")
                    this.put("message", exception.message)
                }
            )
        }
    }

    @PluginMethod
    fun signInWithCustomToken(call: PluginCall) {
        try {
            var token: String
            val customToken = call.getString("customToken")?:""

            runBlocking {
                val result = FirebaseAuth.getInstance().signInWithCustomToken(customToken).await()
                token = result.user?.getIdToken(false)?.await()?.token?:""
            }

            this.notifyListeners("google.auth.phone.verify.completed", JSObject().apply {
                this.put("idToken", token)
            })

            call.resolve(JSObject().apply {
                this.put("result", "success")
                this.put("idToken", token)
            })
        } catch (exception: Exception) {
            call.reject(
                exception.message,
                JSObject().apply {
                    this.put("result", "error")
                    this.put("message", exception.message)
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
                    this.put("message", exception.message)
                }
            )
        }
    }

    @PluginMethod
    fun getCurrentUser(call: PluginCall) {
        val curUser = FirebaseAuth.getInstance().currentUser

        val user = if (curUser != null) {
            JSObject().apply {
                this.put("email", curUser.email)
                this.put("displayName", curUser.displayName)
                this.put("phoneNumber", curUser.phoneNumber)
                this.put("photoUrl", curUser.photoUrl)
                this.put("isEmailVerified", curUser.isEmailVerified)
                this.put("providerId", curUser.providerId)
                this.put("uid", curUser.uid)
            }
        } else {
            null
        }

        call.resolve(JSObject().apply {
            this.put("result", "success")
            this.put("user", user)
        })
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