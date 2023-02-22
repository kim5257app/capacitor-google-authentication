# @kim5257/capacitor-google-authentication

Google Authentication Capacitor Plugin

## Install

```bash
npm install @kim5257/capacitor-google-authentication
npx cap sync
```

## API

<docgen-index>

* [`verifyPhoneNumber(...)`](#verifyphonenumber)
* [`confirmPhoneNumber(...)`](#confirmphonenumber)
* [`getIdToken(...)`](#getidtoken)
* [`signOut()`](#signout)
* [`echo(...)`](#echo)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

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

</docgen-api>
