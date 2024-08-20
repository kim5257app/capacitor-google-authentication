import Foundation
import AuthenticationServices
import Capacitor
import FirebaseCore
import FirebaseAuth
import GoogleSignIn
import CryptoKit

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
public class GoogleAuthenticationPlugin: CAPPlugin, ASAuthorizationControllerPresentationContextProviding {
    private let implementation = GoogleAuthentication()

    private var googleClientId = ""
    private var verificationId = ""
    private var resendingToken = ""

    override init() {
        super.init()

        FirebaseApp.configure()
    }

    public override func load() {
        super.load()
    }

    @objc func initialize(_ call: CAPPluginCall) {
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
                        "code": "ERROR_WRONG_VALUE",
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

            call.resolve(["result": "success"])
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
                        "code": "ERROR_WRONG_VALUE",
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
                            "result": "success",
                            "idToken": token
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

    @objc func signInWithGoogle(_ call: CAPPluginCall) {
        guard let clientId = FirebaseApp.app()?.options.clientID else { return }

        let config = GIDConfiguration(clientID: clientId)
        GIDSignIn.sharedInstance.configuration = config

        let viewController = self.bridge?.viewController

        GIDSignIn.sharedInstance.signIn(withPresenting: viewController!) { [unowned self] result, error in
            if let error = error as? NSError {
                let code: String = (error.userInfo["FIRAuthErrorUserInfoNameKey"] as? String) ?? "ERROR_UNKNOWN"

                call.reject(error.localizedDescription, code, error, [
                    "result": "error",
                    "code": code,
                    "message": error.localizedDescription,
                ])

                return
            }

            guard let user = result?.user, let idToken = user.idToken?.tokenString else {
                let code = "ERROR_UNKNOWN"

                call.reject("Unknown error", code, error, [
                    "result": "error",
                    "code": code,
                    "message": "Unknown error",
                ])

                return
            }

            let credential = GoogleAuthProvider.credential(withIDToken: idToken, accessToken: user.accessToken.tokenString)

            Auth.auth().signIn(with: credential) { (authDataResult, error) in
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
                            call.resolve(["result": "success"])
                        }
                    })
                }
            }
        }
    }

    @objc func signInWithCustomToken(_ call: CAPPluginCall) {
        do {
            let token = ""
            let customToken = call.getString("customToken") ?? ""

            Auth.auth().signIn(withCustomToken: customToken) { (user, error) in
                if let error = error as? NSError {
                    let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

                    call.reject(error.localizedDescription, code, error, [
                        "result": "error",
                        "code": code,
                        "message": error.localizedDescription,
                    ])
                } else {
                    self.notifyListeners("google.auth.phone.verify.completed", data: [
                        "idToken": token
                    ])

                    call.resolve([
                        "result": "success",
                        "token": token,
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

    private func randomNonceString(length: Int = 32) -> String {
        precondition(length > 0)

        var randomBytes = [UInt8](repeating: 0, count: length)
        let errorCode = SecRandomCopyBytes(kSecRandomDefault, randomBytes.count, &randomBytes)
        if errorCode != errSecSuccess {
            fatalError(
                "Unable to generate nonce. SecRandomCopyBytes failed with OSStatus \(errorCode)"
            )
        }

        let charset: [Character] =
            Array("0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._")

        let nonce = randomBytes.map { byte in
            charset[Int(byte) % charset.count]
        }

        return String(nonce)
    }

    @available(iOS 13, *)
    private func sha256(_ input: String) -> String {
        let inputData = Data(input.utf8)
        let hashedData = SHA256.hash(data: inputData)
        let hashString = hashedData.compactMap {
            String(format: "%02x", $0)
        }.joined()

        return hashString
    }

    public func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        return self.webView!.window!
    }

    fileprivate var currentNonce: String?
    fileprivate var currentCall: CAPPluginCall?

    @available(iOS 13, *)
    @objc func signInWithApple(_ call: CAPPluginCall) {
        let nonce = randomNonceString()
        currentNonce = nonce
        currentCall = call
        let appleIDProvider = ASAuthorizationAppleIDProvider()
        let request = appleIDProvider.createRequest()
        request.requestedScopes = [.fullName, .email]
        request.nonce = sha256(nonce)

        let authorizationController = ASAuthorizationController(authorizationRequests: [request])
        authorizationController.delegate = self
        authorizationController.presentationContextProvider = self
        authorizationController.performRequests()
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
            user.getIDToken { (idToken, error) in
                if let error = error as? NSError {
                    let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

                    call.reject(error.localizedDescription, code, error, [
                        "result": "error",
                        "code": code,
                        "message": error.localizedDescription,
                    ])
                } else {
                    var userData: PluginCallResultData = [
                        "email": user.email ?? "",
                        "displayName": user.displayName ?? "",
                        "phoneNumber": user.phoneNumber ?? "",
                        "photoUrl": user.photoURL?.absoluteString ?? "",
                        "isEmailVerified": user.isEmailVerified,
                        "providerId": user.providerID,
                        "uid": user.uid,
                        "accessToken": idToken ?? "",
                    ]

                    var data: PluginCallResultData = [
                        "result": "success",
                        "user": userData,
                    ]

                    call.resolve(data)
                }
            }
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
                "code": "ERROR_NOT_INITIALIZED",
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
                "code": "ERROR_NOT_INITIALIZED",
                "message": "Not initialized",
            ])
        }
    }

    @objc func signOut(_ call: CAPPluginCall) {
        do {
            try Auth.auth().signOut()
            call.resolve(["result": "success"])
        } catch let error as NSError {
            let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

            call.reject(error.localizedDescription, code, error, [
                "result": "error",
                "code": code,
                "message": error.localizedDescription,
            ])
        }
    }

    @objc func linkWithPhone(_ call: CAPPluginCall) {
        print("linkWithPhone")

        do {
            let phone = call.getString("phone") ?? ""

            if (phone.isEmpty) {
                throw NSError(
                    domain: "GoogleAuthenticationPlugin",
                    code: 0,
                    userInfo: [
                        "code": "ERROR_WRONG_VALUE",
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

                        call.reject(error.localizedDescription, code, error, [
                            "result": "error",
                            "code": code,
                            "message": error.localizedDescription,
                        ])
                    } else {
                        self.verificationId = verificationId ?? ""

                        self.notifyListeners("google.auth.phone.code.sent", data: [
                            "verificationId": self.verificationId,
                            "resendingToken": "",
                        ])

                        call.resolve([
                            "result": "success",
                        ])
                    }
                }
        } catch let error as NSError {
            let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

            call.reject(error.localizedDescription, code, error, [
                "result": "error",
                "code": code,
                "message": error.localizedDescription,
            ])
        }
    }

    @objc func confirmLinkPhoneNumber(_ call: CAPPluginCall) {
        do {
            if (verificationId.isEmpty) {
                throw NSError(
                    domain: "GoogleAuthenticationPlugin",
                    code: 0,
                    userInfo: [
                        "code": "ERROR_WRONG_VALUE",
                        "message": "Invalid verification ID",
                    ]
                )
            }

            let code = call.getString("code") ?? ""
            let credential = PhoneAuthProvider.provider().credential(
                withVerificationID: self.verificationId,
                verificationCode: code
            )

            if let user = Auth.auth().currentUser {
                user.link(with: credential) { result, error in
                    if let error = error {
                        call.reject(error.localizedDescription, code, error, [
                            "result": "error",
                            "code": code,
                            "message": error.localizedDescription,
                        ])
                    } else {
                        result!.user.getIDToken { token, _  in
                            self.notifyListeners("google.auth.phone.verify.completed", data: [
                                "idToken": token ?? ""
                            ])

                            call.resolve([
                                "result": "success",
                                "idToken": token ?? ""
                            ])
                        }
                    }
                }
            } else {
                throw NSError(
                    domain: "GoogleAuthenticationPlugin",
                    code: 0,
                    userInfo: [
                        "code": "ERROR_WRONG_VALUE",
                        "message": "Invalid User",
                    ]
                )
            }

        } catch let error as NSError {
            let code = error.userInfo["FIRAuthErrorUserInfoNameKey"] as! String

            call.reject(error.localizedDescription, code, error, [
                "result": "error",
                "code": code,
                "message": error.localizedDescription,
            ])
        }
    }

    @objc func updatePhoneNumber(_ call: CAPPluginCall) {
        return self.linkWithPhone(call)
    }

    @objc func confirmUpdatePhoneNumber(_ call: CAPPluginCall) {
        do {
            if (verificationId.isEmpty) {
                throw NSError(
                    domain: "GoogleAuthenticationPlugin",
                    code: 0,
                    userInfo: [
                        "code": "ERROR_WRONG_VALUE",
                        "message": "Invalid verification ID",
                    ]
                )
            }

            let code = call.getString("code") ?? ""
            let credential = PhoneAuthProvider.provider().credential(
                withVerificationID: self.verificationId,
                verificationCode: code
            )

            if let user = Auth.auth().currentUser {
                user.updatePhoneNumber(credential) { error in
                    if let error = error {
                        call.reject(error.localizedDescription, code, error, [
                            "result": "error",
                            "code": code,
                            "message": error.localizedDescription,
                        ])
                    } else {
                        user.getIDToken { token, _  in
                            self.notifyListeners("google.auth.phone.verify.completed", data: [
                                "idToken": token ?? ""
                            ])

                            call.resolve([
                                "result": "success",
                                "idToken": token ?? ""
                            ])
                        }
                    }
                }
            } else {
                throw NSError(
                    domain: "GoogleAuthenticationPlugin",
                    code: 0,
                    userInfo: [
                        "code": "ERROR_WRONG_VALUE",
                        "message": "Invalid User",
                    ]
                )
            }

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

@available(iOS 13.0, *)
extension GoogleAuthenticationPlugin: ASAuthorizationControllerDelegate {
    public func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        if let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential {
            guard let nonce = currentNonce else {
                fatalError("Invalid state: A login callback was received, but no login request was sent.")
            }
            guard let appleIDToken = appleIDCredential.identityToken else {
                print("Unable to fetch identity token")
                return
            }
            guard let idTokenString = String(data: appleIDToken, encoding: .utf8) else {
                print("Unable to serialize token string from data: \(appleIDToken.debugDescription)")
                return
            }

            let credential = OAuthProvider.appleCredential(withIDToken: idTokenString, rawNonce: nonce, fullName: appleIDCredential.fullName)
            Auth.auth().signIn(with: credential) { (authResult, error) in
                if (error != nil) {
                    self.currentCall!.reject(error!.localizedDescription, nil, error, [
                        "result": "error",
                        "code": 0,
                        "message": error!.localizedDescription,
                    ])
                } else {
                    authResult!.user.getIDToken { token, _  in
                        self.currentCall!.resolve([
                            "result": "success",
                            "idToken": token ?? ""
                        ])
                    }
                }
            }
        }
    }
}
