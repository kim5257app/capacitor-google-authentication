import Foundation
import Capacitor
import FirebaseCore
import FirebaseAuth

enum GoogleAuthError: Error {
    case Common(message: String, code: String)
}

extension GoogleAuthError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case let .Common(message, code):
            return "(\(code)) \(message)"
        }
    }
}

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(GoogleAuthenticationPlugin)
public class GoogleAuthenticationPlugin: CAPPlugin {
    private let implementation = GoogleAuthentication()

    private var googleClientId = ""
    private var verificationId = ""
    private var resendingToken = ""

    override init() {
        super.init()

        FirebaseApp.configure()

        Auth.auth().addStateDidChangeListener { (auth, user) in
            if let user = user {
                user.getIDTokenResult(forcingRefresh: true) { (result, error) in
                    if let error = error {
                        print("Error: \(error.localizedDescription)")
                        self.notifyListeners("google.auth.state.update", data: ["idToken":""])
                    } else {
                        let token = result?.token ?? ""
                        self.notifyListeners("google.auth.state.update", data: ["idToken": token]);
                    }
                }
            } else {
                self.notifyListeners("google.auth.state.update", data: ["idToken": ""]);
            }
        }
    }

    public override func load() {
        super.load()
    }

    @objc func initialize(_ call: CAPPluginCall) {
        self.googleClientId = call.getString("googleClientId") ?? ""
        call.resolve(["result": "success"])
    }

    @objc func verifyPhoneNumber(_ call: CAPPluginCall) {
        do {
            let phone = call.getString("phone") ?? ""

            if (phone.isEmpty) {
                throw NSError(
                    domain: "GoogleAuthenticationPlugin",
                    code: 0,
                    userInfo: [
                        "code": "WRONG_VALUE",
                        "message": "Invalid phone number",
                    ]
                )
            }

            PhoneAuthProvider.provider()
                .verifyPhoneNumber(phone, uiDelegate: nil) { (verificationId, error) in
                    if let error = error as? NSError {
                        let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

                        self.notifyListeners("google.auth.phone.verify.failed", data: [
                            "message": error.localizedDescription,
                            "code": code,
                        ])
                    } else {
                        self.verificationId = verificationId ?? ""

                        self.notifyListeners("google.auth.phone.code.sent", data: [
                            "verificationId": self.verificationId,
                            "resendingToken": "",
                        ])
                    }
                }
        } catch {
            let error = error as NSError
            let code = error.userInfo["code"] as! String

            call.reject(error.localizedDescription, code, error, [
                "result": "error",
                "code": code,
                "message": error.localizedDescription,
            ])
        }
    }

    @objc func confirmPhoneNumber(_ call: CAPPluginCall) {
        do {
            if (verificationId.isEmpty) {
                throw NSError(
                    domain: "GoogleAuthenticationPlugin",
                    code: 0,
                    userInfo: [
                        "code": "WRONG_VALUE",
                        "message": "Invalid verification ID",
                    ]
                )
            }

            let code = call.getString("code") ?? ""
            let credential = PhoneAuthProvider.provider().credential(
                withVerificationID: self.verificationId,
                verificationCode: code
            )

            Auth.auth().signIn(with: credential) { (signInResult, error) in
                if let error = error as? NSError {
                    let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

                    call.reject(error.localizedDescription, code, error, [
                        "result": "error",
                        "code": code,
                        "message": error.localizedDescription,
                    ])
                } else {
                    signInResult?.user.getIDTokenResult(forcingRefresh: true, completion: { (result, error) in
                        let token = result?.token ?? ""

                        self.notifyListeners("google.auth.phone.verify.completed", data: [
                            "idToken": token
                        ])

                        call.resolve([
                            "result": "success"
                        ])
                    })
                }
            }
        } catch {
            let error = error as NSError
            let code = error.userInfo["code"] as! String

            call.reject(error.localizedDescription, code, error, [
                "result": "error",
                "code": code,
                "message": error.localizedDescription,
            ])
        }
    }

    @objc func createUserWithEmailAndPassword(_ call: CAPPluginCall) {
        let email = call.getString("email") ?? ""
        let password = call.getString("password") ?? ""

        Auth.auth().createUser(withEmail: email, password: password) { (authDataResult, error) in
            if let error = error as? NSError {
                let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

                call.reject(error.localizedDescription, code, error, [
                    "result": "error",
                    "code": code,
                    "message": error.localizedDescription,
                ])
            } else {
                authDataResult?.user.getIDToken(completion: { (token, error) in
                    if let error = error as? NSError {
                        let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

                        call.reject(error.localizedDescription, code, error, [
                            "result": "error",
                            "code": code,
                            "message": error.localizedDescription,
                        ])
                    } else {
                        self.notifyListeners("google.auth.phone.verify.completed", data: [
                            "idToken": token!
                        ])
                    }
                })
            }
        }
    }

    @objc func signInWithEmailAndPassword(_ call: CAPPluginCall) {
        let email = call.getString("email") ?? ""
        let password = call.getString("password") ?? ""

        Auth.auth().signIn(withEmail: email, password: password) { (authDataResult, error) in
            if let error = error as? NSError {
                let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

                call.reject(error.localizedDescription, code, error, [
                    "result": "error",
                    "code": code,
                    "message": error.localizedDescription,
                ])
            } else {
                authDataResult?.user.getIDToken(completion: { (token, error) in
                    if let error = error as? NSError {
                        let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

                        call.reject(error.localizedDescription, code, error, [
                            "result": "error",
                            "code": code,
                            "message": error.localizedDescription,
                        ])
                    } else {
                        self.notifyListeners("google.auth.phone.verify.completed", data: [
                            "idToken": token!
                        ])
                    }
                })
            }
        }
    }

    @objc func signWithGoogle(_ call: CAPPluginCall) {
    }

    @objc func getIdToken(_ call: CAPPluginCall) {
        let user = Auth.auth().currentUser
        let forceRefresh = call.getBool("forceRefresh") ?? false

        if (user != nil) {
            user?.getIDTokenResult(forcingRefresh: forceRefresh, completion: { (authTokenResult, error) in
                if let error = error as? NSError {
                    let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

                    call.reject(error.localizedDescription, code, error, [
                        "result": "error",
                        "code": code,
                        "message": error.localizedDescription,
                    ])
                } else {
                    let token = authTokenResult?.token ?? ""

                    call.resolve([
                        "result": "success",
                        "idToken": token
                    ])
                }
            })
        } else {
            call.resolve([
                "result": "success",
                "idToken": ""
            ])
        }
    }

    @objc func getCurrentUser(_ call: CAPPluginCall) {
        if let user = Auth.auth().currentUser {
            var data: PluginCallResultData = [
                "result": "success",
                "isEmailVerified": user.isEmailVerified,
                "providerId": user.providerID,
                "uid": user.uid,
            ]

            data["email"] = user.email
            data["displayName"] = user.displayName
            data["phoneNumber"] = user.phoneNumber
            data["photoUrl"] = user.photoURL?.absoluteString

            call.resolve(data)
        } else {
            call.resolve([
                "result": "success",
            ])
        }
    }

    @objc func updateProfile(_ call: CAPPluginCall) {
        if let user = Auth.auth().currentUser {
            let profileChangeRequest = user.createProfileChangeRequest()

            if let displayName = call.getString("displayName") {
                profileChangeRequest.displayName = displayName
            }

            if let photoUrl = call.getString("photoUrl") {
                profileChangeRequest.photoURL = URL(string: photoUrl)
            }

            profileChangeRequest.commitChanges { (error) in
                if let error = error as? NSError {
                    let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

                    call.reject(error.localizedDescription, code, error, [
                        "result": "error",
                        "code": code,
                        "message": error.localizedDescription,
                    ])
                } else {
                    call.resolve(["result": "success"])
                }
            }
        } else {
            call.reject("Not initialized", "NOT_INITIALIZED", nil, [
                "result": "error",
                "code": "NOT_INITIALIZED",
                "message": "Not initialized",
            ])
        }
    }

    @objc func updateEmail(_ call: CAPPluginCall) {
        if let user = Auth.auth().currentUser {
            let email = call.getString("email") ?? ""

            user.updateEmail(to: email) { (error) in
                if let error = error as? NSError {
                    let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

                    call.reject(error.localizedDescription, code, error, [
                        "result": "error",
                        "code": code,
                        "message": error.localizedDescription,
                    ])
                } else {
                    call.resolve(["result": "success"])
                }
            }
        } else {
            call.reject("Not initialized", "NOT_INITIALIZED", nil, [
                "result": "error",
                "code": "NOT_INITIALIZED",
                "message": "Not initialized",
            ])
        }
    }

    @objc func signOut(_ call: CAPPluginCall) {
        do {
            try Auth.auth().signOut()
        } catch let error as NSError {
            let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

            call.reject(error.localizedDescription, code, error, [
                "result": "error",
                "code": code,
                "message": error.localizedDescription,
            ])
        }
    }
    
    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": implementation.echo(value)
        ])
    }
}
