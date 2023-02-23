# @kim5257/capacitor-google-authentication

Google Authentication Capacitor Plugin

## Install

```bash
npm install @kim5257/capacitor-google-authentication
npx cap sync
```

## API

<docgen-index>

* [`initialize(...)`](#initialize)
* [`verifyPhoneNumber(...)`](#verifyphonenumber)
* [`confirmPhoneNumber(...)`](#confirmphonenumber)
* [`getIdToken(...)`](#getidtoken)
* [`signOut()`](#signout)
* [`echo(...)`](#echo)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### initialize(...)

```typescript
initialize(config: FirebaseOptions) => Promise<{ result: 'success' | 'error'; }>
```

| Param        | Type                                                        |
| ------------ | ----------------------------------------------------------- |
| **`config`** | <code><a href="#firebaseoptions">FirebaseOptions</a></code> |

**Returns:** <code>Promise&lt;{ result: 'error' | 'success'; }&gt;</code>

--------------------


### verifyPhoneNumber(...)

```typescript
verifyPhoneNumber(options: { phone: string; }) => Promise<{ result: 'success' | 'error'; }>
```

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ phone: string; }</code> |

**Returns:** <code>Promise&lt;{ result: 'error' | 'success'; }&gt;</code>

--------------------


### confirmPhoneNumber(...)

```typescript
confirmPhoneNumber(options: { code: string; }) => Promise<{ result: 'success' | 'error'; }>
```

| Param         | Type                           |
| ------------- | ------------------------------ |
| **`options`** | <code>{ code: string; }</code> |

**Returns:** <code>Promise&lt;{ result: 'error' | 'success'; }&gt;</code>

--------------------


### getIdToken(...)

```typescript
getIdToken(options: { forceRefresh: boolean; }) => Promise<{ result: 'success' | 'error'; idToken: string; }>
```

| Param         | Type                                    |
| ------------- | --------------------------------------- |
| **`options`** | <code>{ forceRefresh: boolean; }</code> |

**Returns:** <code>Promise&lt;{ result: 'error' | 'success'; idToken: string; }&gt;</code>

--------------------


### signOut()

```typescript
signOut() => Promise<{ result: 'success' | 'error'; }>
```

**Returns:** <code>Promise&lt;{ result: 'error' | 'success'; }&gt;</code>

--------------------


### echo(...)

```typescript
echo(options: { value: string; }) => Promise<{ value: string; }>
```

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------


### Interfaces


#### FirebaseOptions

| Prop                    | Type                | Description                                                                                                                                                       |
| ----------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`apiKey`**            | <code>string</code> | An encrypted string used when calling certain APIs that don't need to access private user data (example value: `AIzaSyDOCAbC123dEf456GhI789jKl012-MnO`).          |
| **`authDomain`**        | <code>string</code> | Auth domain for the project ID.                                                                                                                                   |
| **`databaseURL`**       | <code>string</code> | Default Realtime Database URL.                                                                                                                                    |
| **`projectId`**         | <code>string</code> | The unique identifier for the project across all of Firebase and Google Cloud.                                                                                    |
| **`storageBucket`**     | <code>string</code> | The default Cloud Storage bucket name.                                                                                                                            |
| **`messagingSenderId`** | <code>string</code> | Unique numerical value used to identify each sender that can send Firebase Cloud Messaging messages to client apps.                                               |
| **`appId`**             | <code>string</code> | Unique identifier for the app.                                                                                                                                    |
| **`measurementId`**     | <code>string</code> | An ID automatically created when you enable Analytics in your Firebase project and register a web app. In versions 7.20.0 and higher, this parameter is optional. |

</docgen-api>
