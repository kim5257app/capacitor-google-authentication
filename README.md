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
* [`createUserWithEmailAndPassword(...)`](#createuserwithemailandpassword)
* [`signInWithEmailAndPassword(...)`](#signinwithemailandpassword)
* [`signInWithGoogle()`](#signinwithgoogle)
* [`signInWithCustomToken(...)`](#signinwithcustomtoken)
* [`getIdToken(...)`](#getidtoken)
* [`signOut()`](#signout)
* [`echo(...)`](#echo)
* [`addListener('google.auth.phone.verify.completed', ...)`](#addlistenergoogleauthphoneverifycompleted)
* [`addListener('google.auth.phone.code.sent', ...)`](#addlistenergoogleauthphonecodesent)
* [`addListener('google.auth.phone.verify.failed', ...)`](#addlistenergoogleauthphoneverifyfailed)
* [`addListener('google.auth.state.update', ...)`](#addlistenergoogleauthstateupdate)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### initialize(...)

```typescript
initialize(config: GoogleAuthenticationOptions) => Promise<{ result: 'success' | 'error'; }>
```

| Param        | Type                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| **`config`** | <code><a href="#googleauthenticationoptions">GoogleAuthenticationOptions</a></code> |

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


### createUserWithEmailAndPassword(...)

```typescript
createUserWithEmailAndPassword(options: { email: string; password: string; }) => Promise<{ result: "success" | "error"; idToken: string; }>
```

| Param         | Type                                              |
| ------------- | ------------------------------------------------- |
| **`options`** | <code>{ email: string; password: string; }</code> |

**Returns:** <code>Promise&lt;{ result: 'error' | 'success'; idToken: string; }&gt;</code>

--------------------


### signInWithEmailAndPassword(...)

```typescript
signInWithEmailAndPassword(options: { email: string; password: string; }) => Promise<{ result: "success" | "error"; idToken: string; }>
```

| Param         | Type                                              |
| ------------- | ------------------------------------------------- |
| **`options`** | <code>{ email: string; password: string; }</code> |

**Returns:** <code>Promise&lt;{ result: 'error' | 'success'; idToken: string; }&gt;</code>

--------------------


### signInWithGoogle()

```typescript
signInWithGoogle() => Promise<{ result: "success" | "error"; idToken: string; }>
```

**Returns:** <code>Promise&lt;{ result: 'error' | 'success'; idToken: string; }&gt;</code>

--------------------


### signInWithCustomToken(...)

```typescript
signInWithCustomToken({ customToken }: { customToken: string; }) => Promise<{ result: "success" | "error"; idToken: string; }>
```

| Param     | Type                                  |
| --------- | ------------------------------------- |
| **`__0`** | <code>{ customToken: string; }</code> |

**Returns:** <code>Promise&lt;{ result: 'error' | 'success'; idToken: string; }&gt;</code>

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


### addListener('google.auth.phone.verify.completed', ...)

```typescript
addListener(eventName: 'google.auth.phone.verify.completed', listenerFunc: (resp: { idToken: string; }) => void) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                 |
| ------------------ | ---------------------------------------------------- |
| **`eventName`**    | <code>'google.auth.phone.verify.completed'</code>    |
| **`listenerFunc`** | <code>(resp: { idToken: string; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### addListener('google.auth.phone.code.sent', ...)

```typescript
addListener(eventName: 'google.auth.phone.code.sent', listenerFunc: (resp: { verificationId: string | null; resendingToken: string | null; }) => void) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **`eventName`**    | <code>'google.auth.phone.code.sent'</code>                                                          |
| **`listenerFunc`** | <code>(resp: { verificationId: string \| null; resendingToken: string \| null; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### addListener('google.auth.phone.verify.failed', ...)

```typescript
addListener(eventName: 'google.auth.phone.verify.failed', listenerFunc: (resp: { message: string; }) => void) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                 |
| ------------------ | ---------------------------------------------------- |
| **`eventName`**    | <code>'google.auth.phone.verify.failed'</code>       |
| **`listenerFunc`** | <code>(resp: { message: string; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### addListener('google.auth.state.update', ...)

```typescript
addListener(eventName: 'google.auth.state.update', listenerFunc: (resp: { idToken: string; }) => void) => Promise<PluginListenerHandle> & PluginListenerHandle
```

| Param              | Type                                                 |
| ------------------ | ---------------------------------------------------- |
| **`eventName`**    | <code>'google.auth.state.update'</code>              |
| **`listenerFunc`** | <code>(resp: { idToken: string; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### Interfaces


#### GoogleAuthenticationOptions

| Prop                 | Type                |
| -------------------- | ------------------- |
| **`googleClientId`** | <code>string</code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |

</docgen-api>
